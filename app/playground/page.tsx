'use client';

import { ResultsTable } from "@/components/ResultsTable";
import SchemaPanel from "@/components/SchemaPanel";
import { SqlEditor } from "@/components/SqlEditor";
import { usePlayground } from "@/hooks/usePlayground";
import Link from "next/link";

export default function Playground() {
  const {
    db,
    loading,
    tables,
    tablesLoading,
    refreshTables,
    sql,
    setSql,
    runQuery,
    result,
    queryError,
    running,
  } = usePlayground();

  if (loading) {
    return (
      <main className="flex items-center justify-center min-h-[calc(100vh-56px)]">
        <div className="flex items-center gap-3 text-gray-500 text-sm">
          <span
            className="w-4 h-4 border-2 border-gray-700 border-t-indigo-500 rounded-full 
                       animate-spin"
          />
          {""}
          Connecting...
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-col h-[calc(100vh-56px)] overflow-hidden">
      {/* Top bar */}
      <div
        className="flex items-center justify-between px-4 py-2.5 border-b border-gray-800 
                    bg-gray-950 shrink-0"
      >
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="text-sm text-gray-500 hover:text-white transition-colors"
          >
            ← Dashboard
          </Link>
          {db && (
            <span
              className="text-xs font-mono bg-gray-900 border-gray-800 
                           px-2 py-1 rounded text-gray-400"
            >
              {db.db_name}
            </span>
          )}
        </div>
        <span className="text-xs text-gray-600">SQL Playground</span>
      </div>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Schema sidebar */}
        <div
          className="w-52 shrink-0 border-r border-gray-800 overflow-y-auto 
                      bg-gray-950/50"
        >
          <SchemaPanel
            tables={tables}
            loading={tablesLoading}
            onRefresh={refreshTables}
          />
        </div>

        {/* Editor + Results */}
        <div className="flex flex-col flex-1 overflow-hidden">
          <div className="shrink-0 p-4 border-b border-gray-800">
            <SqlEditor
              sql={sql}
              onChange={setSql}
              onRun={runQuery}
              running={running}
            />
          </div>
          <div className="flex-1 overflow-auto p-4">
            <ResultsTable result={result} error={queryError} />
          </div>
        </div>
      </div>
    </main>
  );
}
