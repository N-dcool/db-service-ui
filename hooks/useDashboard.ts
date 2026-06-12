"use client";

import { createDb, DbRecord, deleteDb, getDbStatus } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export function useDashboard() {
  const router = useRouter();

  const [token, setToken] = useState<string | null>(null);
  const [db, setDb] = useState<DbRecord | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [maintenance, setMaintenance] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const t = localStorage.getItem("token");
    if (t === null || !t) router.push("/login");
    else setToken(t);
  }, [router]);

  // Fetch DB status on token ready
  const fetchStatus = useCallback(async (t: string) => {
    try {
      const data = await getDbStatus(t);
      setDb(data);
      setTimeLeft(data ? data.expires_in_seconds : 0);
      setMaintenance(false);
    } catch (err: unknown) {
      if (err instanceof Error && err.message === "MAINTENANCE") {
        setMaintenance(true);
      }
    } finally {
      setLoadingStatus(false);
    }
  }, []);

  useEffect(() => {
    if (token) fetchStatus(token);
  }, [token, fetchStatus]);

  // Live countdown timer
  useEffect(() => {
    if (!db) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setDb(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [db]);

  // Handlers
  const handleCreate = async () => {
    if (!token) return;
    setCreating(true);
    setError("");

    try {
      const data = await createDb(token);
      setDb(data);
      setTimeLeft(data.expires_in_seconds);
      setMaintenance(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Unknown erro";
      if (msg === "MAINTENANCE") setMaintenance(true);
      else setError(msg);
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async () => {
    if (!token || !db) return;
    if (!confirm("Delete your database? All data will be permanently lost."))
      return;
    setDeleting(true);
    setError("");

    try {
      await deleteDb(token);
      setDb(null);
      setTimeLeft(0);
      setMaintenance(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Unknown Error";
      if (msg === "MAINTENANCE") setMaintenance(true);
      else setError(msg);
    } finally {
      setDeleting(false);
    }
  };

  return {
    db,
    timeLeft,
    loadingStatus,
    creating,
    deleting,
    maintenance,
    error,
    handleCreate,
    handleDelete,
  };
}
