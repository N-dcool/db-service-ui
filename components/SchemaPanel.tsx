"use client";

import { TableSchema } from "@/hooks/usePlayground";
import { useState } from "react";

type Column = { column_name: string; data_type: string; is_nullable: string };

function ColumnList({ columns }: Readonly<{ columns: Column[] }>) {
  return (
    <div className="ml-4 mb-1">
      {columns.map((col) => (
        <div
          key={col.column_name}
          className="flex items-baseline gap-1.5 px-1.5 py-0.5"
        >
          <span className="font-mono text-gray-400 text-xs truncate">
            {col.column_name}
          </span>
          <span className="text-gray-600 text-[10px] shrink-0">
            {col.data_type}
          </span>
        </div>
      ))}
    </div>
  );
}

function TableRow({
  name,
  expanded,
  columns,
  onToggle,
}: Readonly<{
  name: string;
  expanded: boolean;
  columns: Column[];
  onToggle: () => void;
}>) {
  return (
    <div>
      <button
        onClick={() => onToggle()}
        className="w-full text-left flex items-center gap-1.5 px-1.5 py-1 rounded 
                     text-xs text-gray-300 hover:bg-gray-800 transition-colors"
      >
        <span className="text-gray-600 text-[10px] w-2">
          {expanded ? "▼" : "▶"}
        </span>
        <span className="font-mono truncate">{name}</span>
      </button>

      {expanded && <ColumnList columns={columns} />}
    </div>
  );
}

interface SchemaPanelProps {
  tables: TableSchema;
  loading: boolean;
  onRefresh: () => void;
}

export default function SchemaPanel({
  tables,
  loading,
  onRefresh,
}: Readonly<SchemaPanelProps>) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const toggle = (table: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(table)) next.delete(table);
      else next.add(table);
      return next;
    });
  };

  const tableNames = Object.keys(tables);

  return (
    <div className="p-3 h-full">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
          Tables
        </span>
        <button
          onClick={onRefresh}
          disabled={loading}
          title="Refresh schema"
          className="text-sm text-gray-600 hover:text-gray-300 transition-colors 
                   disabled:opacity-40"
        >
          ↻
        </button>
      </div>

      {loading && <p className="text-xs text-gray-600">Loading...</p>}

      {!loading && tableNames.length === 0 && (
        <p className="text-xs text-gray-600">No tables found</p>
      )}

      {!loading && tableNames.length > 0 && (
        <div className="space-y-0.5">
          {tableNames.map((table) => (
            <TableRow
              key={table}
              name={table}
              expanded={expanded.has(table)}
              columns={tables[table]}
              onToggle={() => toggle(table)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
