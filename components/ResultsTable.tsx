import { QueryResult } from "@/hooks/usePlayground";

interface ResultsTableProps {
  result: QueryResult | null;
  error: string;
}

export function ResultsTable({ result, error }: Readonly<ResultsTableProps>) {
  if (error) {
    return (
      <div
        className="text-sm text-red-400 bg-red-950/40 border-red-800/60 rounded-lg 
                px-4 py-3 font-mono whitespace-pre-wrap"
      >
        {error}
      </div>
    );
  }

  if(!result) {
    return (
        <div className="flex items-center justify-center h-32 text-gray-600 text-sm">
            Run a query to see results
        </div>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-xs text-gray-500">
        {result.rows.length} row{result.rows.length === 1 ? "" : "s"} ·{" "}
        {result.ms}ms
      </p>
      <div className="overflow-auto rounded-lg border-gray-800">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-900 border-b border-gray-800">
            <tr>
              {result.fields.map((field) => (
                <th
                  key={field}
                  className="px-3 py-2 font-medium text-gray-400 text-xs whitespace-nowrap"
                >
                  {field}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {result.rows.map((row, i) => (
              <tr
                key={i}
                className="border-b border-gray-800/50 hover:bg-gray-900/40 transition-colors"
              >
                {result.fields.map((field) => (
                  <td
                    key={field}
                    className="px-3 py-2 font-mono text-xs text-gray-300 
                             whitespace-nowrap max-w-xs truncate"
                  >
                    {row[field] === null ? (
                      <span className="text-gray-600 italic">null</span>
                    ) : (
                      String(row[field])
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
