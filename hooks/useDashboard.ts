"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import {createDb, deleteDb, expiresInSeconds, getDbStatus} from "@/lib/api";
import { DbRecord } from "@/lib/types";
import { getToken } from "@/lib/tokens";

function getTimeLeft(db: DbRecord): number {
    return expiresInSeconds(db);
}

export function useDashboard() {
  const router = useRouter();

  const fetchedRef = useRef(false);

  const [ready, setReady] = useState(false);
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
    
    const t = getToken();
    if (t === null || !t) {
      router.push("/login");
    }
    else {
      setReady(true);
    }
  }, [router]);

  // Fetch DB status on token ready
  const fetchStatus = useCallback(async () => {
    try {
      const data = await getDbStatus();
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
    if (ready) fetchStatus();
  }, [ready, fetchStatus]);

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
  const pollUntilRunning = useCallback(async ()=> {
    const maxAttempts = 30;
    for(let i=0; i<maxAttempts; i++) {
      await new Promise((r) => setTimeout(r, 2000));
      try {
        const data = await getDbStatus();
        if(data) {
          setDb(data);
          setTimeLeft(getTimeLeft(data));
          if(data.status === 'RUNNING') return;
        }
      } catch { break; }
    }
  }, []);

  const handleCreate = async () => {
    if (!ready) return;
    setCreating(true);
    setError("");

    try {
      const data = await createDb();
      setDb(data);
      setTimeLeft(getTimeLeft(data));
      setMaintenance(false);
      if(data.status !== 'RUNNING') {
        await pollUntilRunning();
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
    if (!ready || !db) return;
    if (!confirm("Delete your database? All data will be permanently lost."))
      return;
    setDeleting(true);
    setError("");

    try {
      await deleteDb();
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
