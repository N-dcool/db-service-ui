interface EmptyDbProps {
  creating: boolean;
  maintenance: boolean;
  onCreate: () => void;
}

export function EmptyDb({
  creating,
  maintenance,
  onCreate,
}: Readonly<EmptyDbProps>) {
  return (
    <div className="bg-gray-900/60 border-gray-800 border-dashed rounded-xl p-14 text-center">
      <div className="text-5xl mb-5">🐘</div>
      <h2 className="font-semibold text-lg mb-2">No active database</h2>
      <p className="text-gray-400 text-sm mb-8 max-w-xs mx-auto leading-relaxed">
        Create a free isolated PostgreSQL database. Available for 24 hours, then
        automatically deleted.
      </p>

      <button
        onClick={onCreate}
        disabled={creating || maintenance}
        className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed 
                   text-white px-6 py-2.5 rounded-lg font-medium text-sm transition-colors"
      >
        {creating ? (
          <span className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />{" "}
            Provisioning...
          </span>
        ) : (
          "Create database"
        )}
      </button>

      <p className="text-xs text-gray-700 mt-6">
        One database per account · Renew anytime by deleting and recreating
      </p>
    </div>
  );
}
