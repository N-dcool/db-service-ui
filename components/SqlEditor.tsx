"use client";

import {useCallback} from "react";
import ReactCodeMirror, {keymap} from "@uiw/react-codemirror";
import {PostgreSQL, sql} from "@codemirror/lang-sql";
import {oneDark} from "@codemirror/theme-one-dark";

interface SqlEditorProps {
  sql: string;
  onChange: (newSql: string) => void;
  onRun: () => void;
  running: boolean;
}

export function SqlEditor({
  sql: value,
  onChange,
  onRun,
  running,
}: Readonly<SqlEditorProps>) {
  const runKeymap = useCallback(
      () =>
          keymap.of([
            {
              key: 'Ctrl-Enter',
              mac: 'Cmd-Enter',
              run: () => {
                onRun();
                return true;
              }
            }
          ]),
      [onRun]
  );

  return (
    <div className="space-y-3">
      <div className="rounded-lg overflow-hidden border border-gray-700 focus-within:border-indigo-500 transition-colors">
        <ReactCodeMirror
          value={value}
          onChange={onChange}
          height="160px"
          theme={oneDark}
          extensions={[sql({dialect: PostgreSQL}), runKeymap()]}
          placeholder="SELECT * FROM your_table LIMIT 100;"
          basicSetup={{
            lineNumbers: true,
            foldGutter: false,
            highlightActiveLine: true,
            bracketMatching: true,
            autocompletion: true
          }}
        />
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={onRun}
          disabled={running || !value.trim()}
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
        <span className="text-xs text-gray-600">Cmd+Enter to run</span>
      </div>
    </div>
  );
}
