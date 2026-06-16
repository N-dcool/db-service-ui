"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import {createDb, DbRecord, deleteDb, expiresInSeconds, getDbStatus} from "@/lib/api";

function getTimeLeft(db: DbRecord): number {
    return expiresInSeconds(db);
}

export function useDashboard() {
  const router = useRouter();

  const fetchedRef = useRef(false);

  const [token, setToken] = useState<string | null>(null);
  const [db, setDb] = useState<DbRecord | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [maintenance, setMaintenance] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    
    const t = localStorage.getItem("token");
    if (t === null || !t) router.push("/login");
    else setToken(t);
  }, [router]);

  // Fetch DB status on token ready
  const fetchStatus = useCallback(async (t: string) => {
    try {
      const data = await getDbStatus(t);
      setDb(data);
      setTimeLeft(data ? getTimeLeft(data) : 0);
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
  const pollUntilRunning = useCallback(async (t: string)=> {
    const maxAttempts = 30;
    for(let i=0; i<maxAttempts; i++) {
      await new Promise((r) => setTimeout(r, 2000));
      try {
        const data = await getDbStatus(t);
        if(data) {
          setDb(data);
          setTimeLeft(getTimeLeft(data));
          if(data.status === 'RUNNING') return;
        }
      } catch { break; }
    }
  }, []);

  const handleCreate = async () => {
    if (!token) return;
    setCreating(true);
    setError("");

    try {
      const data = await createDb(token);
      setDb(data);
      setTimeLeft(getTimeLeft(data));
      setMaintenance(false);
      if(data.status !== 'RUNNING') {
        await pollUntilRunning(token);
      }
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
