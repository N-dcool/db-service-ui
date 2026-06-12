import { DbRecord } from "@/lib/api";
import { formatDate, formatTime } from "@/util/format";
import { ConnectionString } from "./ConnectionString";

interface DbCardProps {
  db: DbRecord;
  timeLeft: number;
  deleting: boolean;
  onDelete: () => void;
}

export function DbCard({ db, timeLeft, deleting, onDelete }: Readonly<DbCardProps>) {
  return (
    <div className="space-y-4">
      <div className="bg-gray-900 border-gray-800 rounded-xl p-6">
        {/* Status row */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-sm font-medium text-emerald-400">Active</span>
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
            <p className="font-mono text-white truncate">{db.db_name}</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs mb-1">Username</p>
            <p className="font-mono text-white">dbuser</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs mb-1">Host</p>
            <p className="font-mono text-white truncate">{db.host}</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs mb-1">Port</p>
            <p className="font-mono text-white">{db.port}</p>
          </div>
          <div className="col-span-2">
            <p className="text-gray-500 text-xs mb-1">Created</p>
            <p className="text-gray-300 text-xs">{formatDate(db.created_at)}</p>
          </div>
        </div>
        {/* Connection string */}
        <ConnectionString value={db.connection_string} />
      </div>

      {/* Specs strip */}
      <div className="flex items-center gap-4 px-1 text-xs text-gray-600">
        <span>PostgreSQL 15</span>
        <span>·</span>
        <span>128 MB RAM</span>
        <span>·</span>
        <span>No internet access</span>
        <span>·</span>
        <span>Max 10 connections</span>
      </div>

      {/* Delete button */}
      <button
        onClick={onDelete}
        disabled={deleting}
        className="w-full border-red-900/60 hover:bg-red-950/40 hover:border-red-700 
             disabled:opacity-50 disabled:cursor-not-allowed text-red-400 py-2.5 rounded-lg 
             text-sm font-medium transition-colors"
      >
        {deleting ? "Deleting..." : "Delete database"}
      </button>
    </div>
  );
}
