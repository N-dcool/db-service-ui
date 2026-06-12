interface SqlEditorProps {
  sql: string;
  onChange: (newSql: string) => void;
  onRun: () => void;
  running: boolean;
}

export function SqlEditor({
  sql,
  onChange,
  onRun,
  running,
}: Readonly<SqlEditorProps>) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      onRun();
    }
  };

  return (
    <div className="space-y-3">
      <textarea
        value={sql}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="SELECT * FROM your_table LIMIT 100;"
        spellCheck={false}
        rows={5}
        className="w-full bg-gray-900 border-gray-700 rounded-lg px-3 py-2.5 text-sm 
                 font-mono text-white placeholder-gray-600 focus:outline-none 
                 focus:border-indigo-500 transition-colors resize-y"
      />
      <div className="flex items-center gap-3">
        <button
          onClick={onRun}
          disabled={running || !sql.trim()}
          className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 
                   disabled:cursor-not-allowed text-white px-4 py-1.5 rounded-md text-sm 
                   font-medium transition-colors flex items-center gap-2"
        >
          {running ? (
            <>
              <span
                className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full 
                             animate-spin"
              />{" "}
              Running...
            </>
          ) : (
            "Run Query"
          )}
        </button>
        <span className="text-xs text-gray-600">Ctrl+Enter to run</span>
      </div>
    </div>
  );
}
