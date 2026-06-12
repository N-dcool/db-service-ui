'use client';

import { DbCard } from "@/components/DbCard";
import { EmptyDb } from "@/components/EmptyDb";
import { MaintenanceBanner } from "@/components/MaintenanceBar";
import { useDashboard } from "@/hooks/useDashboard";

export default function DashboardPage() {
    const {db, timeLeft, loadingStatus, creating, deleting, maintenance, error, handleCreate, handleDelete } = useDashboard();

    if (loadingStatus) {
  return (
    <main className="flex items-center justify-center min-h-[calc(100vh-56px)]">
      <div className="flex items-center gap-3 text-gray-500 text-sm">
        <span className="w-4 h-4 border-2 border-gray-700 border-t-indigo-500 rounded-full animate-spin" />{" "}
        Loading...
      </div>
    </main>
  );
}

return (
  <main className="max-w-2xl mx-auto px-4 py-12">
    <div className="mb-8">
      <h1 className="text-2xl font-bold mb-1">Dashboard</h1>
      <p className="text-gray-400 text-sm">Manage your PostgreSQL database</p>
    </div>

    {maintenance && <div className="mb-6"><MaintenanceBanner /></div>}
    {error && (
      <div className="mb-6 text-sm text-red-400 bg-red-950/40 border-red-800/60 rounded-lg px-4 py-3">
        {error}
      </div>
    )}

    {db ? (
      <DbCard db={db} timeLeft={timeLeft} deleting={deleting} onDelete={handleDelete} />
    ) : (
      <EmptyDb creating={creating} maintenance={maintenance} onCreate={handleCreate} />
    )}
  </main>
);
}