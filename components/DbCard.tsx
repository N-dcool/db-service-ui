import { formatDate, formatTime } from "@/util/format";
import { ConnectionString } from "./ConnectionString";
import Link from "next/link";
import {DbRecord} from "@/lib/types";

interface DbCardProps {
  db: DbRecord;
  timeLeft: number;
  deleting: boolean;
  onDelete: () => void;
}

const STATUS_MAP: Record<string, { color: string; bg: string; label: string }> = {
  RUNNING:          { color: 'text-emerald-400', bg: 'bg-emerald-500', label: 'Running'},
  PROVISIONING :    { color: 'text-emerald-400', bg: 'bg-emerald-500', label: 'Provisioning... 🐳'},
  STOPPING:         { color: 'text-emerald-400', bg: 'bg-emerald-500', label: 'Restarting... 🐳'},
  DELETING :        { color: 'text-emerald-400', bg: 'bg-emerald-500', label: 'Deleting... 🐳'},
  PROVISION_FAILED: { color: 'text-emerald-400', bg: 'bg-emerald-500', label: 'Failed'},
  START_FAILED:     { color: 'text-emerald-400', bg: 'bg-emerald-500', label: 'Start failed'},
}

export function DbCard({
  db,
  timeLeft,
  deleting,
  onDelete,
}: Readonly<DbCardProps>) {
  const status = STATUS_MAP[db.status] ?? {color: 'text-gray-400', bg: 'bg-gray-500', label: db.status};
  const isRunning = db.status === 'RUNNING';

  return (
    <div className="space-y-4">
      <div className="bg-gray-900 border-gray-800 rounded-xl p-6">
        {/* Status row */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${status.bg} ${isRunning ? 'animate-pulse' : ''}`} />
            <span className={`text-sm font-medium ${status.color}`}>{status.label}</span>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500 mb-0.5">Expires in</p>
            <p
              className={`font-mono font-bold text-xl tabular-nums ${
                timeLeft < 3600 ? "text-red-400" : "text-white"
              }`}
            >
              {formatTime(timeLeft)}
            </p>
          </div>
        </div>

        {/* DB metadata grid */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-4 mb-6 text-sm">
          <div>
            <p className="text-gray-500 text-xs mb-1">Database</p>
            <p className="font-mono text-white truncate">{db.dbName}</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs mb-1">Username</p>
            <p className="font-mono text-white">{db.dbUser}</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs mb-1">Host</p>
            <p className="font-mono text-white truncate">localhost</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs mb-1">Port</p>
            <p className="font-mono text-white">{db.hostPort}</p>
          </div>
          <div className="col-span-2">
            <p className="text-gray-500 text-xs mb-1">Created</p>
            <p className="text-gray-300 text-xs">{formatDate(db.createdAt)}</p>
          </div>
        </div>
        {/* Connection string */}
        {isRunning && db.directUri ? (
          <ConnectionString value={db.directUri} />
          ) : (
                <div className="bg-gray-950 border border-gray-700/60 rounded-lg p-4">
                  <p className="text-sm text-gray-500">Connection string will appear once the database is running.</p>
                </div>
        )}

        {/* Playground link */}
        {isRunning && (
            <div className="mt-4 pt-4 border-t border-gray-800">
              <Link
                  href="/playground"
                  className="w-full flex items-center justify-center gap-2 bg-gray-800
               hover:bg-gray-700 text-gray-300 hover:text-white py-2 rounded-lg text-sm
               font-medium transition-colors"
              >
                Open SQL Playground →
              </Link>
            </div>
        )}

      </div>

      {/* Specs strip */}
      <div className="flex items-center gap-4 px-1 text-xs text-gray-600">
        <span>{db.engine} {db.engineVersion}</span>
        <span>·</span>
        <span>{db.memoryLimitMb}</span>
        <span>·</span>
        <span>No internet access</span>
        <span>·</span>
        <span>{db.ttlHours}h TTL</span>
      </div>

      {/* Delete button */}
      <button
        onClick={onDelete}
        disabled={deleting}
        className="w-full border border-red-900/60 hover:bg-red-950/40 hover:border-red-700
             disabled:opacity-50 disabled:cursor-not-allowed text-red-400 py-2.5 rounded-lg 
             text-sm font-medium transition-colors"
      >
        {deleting ? "Deleting..." : "Delete database"}
      </button>
    </div>
  );
}
