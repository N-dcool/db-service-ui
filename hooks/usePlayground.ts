"use client";

import { DbRecord, getDbStatus } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

export interface QueryResult {
  rows: Record<string, unknown>[];
  fields: string[];
  rowCounts: number;
  ms: number;
}

export type TableSchema = Record<
  string,
  { column_name: string; data_type: string; is_nullable: string }[]
>;

export function usePlayground() {
  const router = useRouter();

  const fetchedRef = useRef(false);

  const [db, setDb] = useState<DbRecord | null>(null);
  const [loading, setLoading] = useState(true);

  const [sql, setSql] = useState("");
  const [result, setResult] = useState<QueryResult | null>(null);
  const [queryError, setQueryError] = useState("");
  const [running, setRunning] = useState(false);

  const [tables, setTables] = useState<TableSchema>({});
  const [tablesLoading, setTablesLoading] = useState(false);

  const fetchTables = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    setTablesLoading(true);
    try {
      const res = await fetch("/api/db/tables", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      if (res.ok) setTables(data.tables ?? {});
    } catch (err: unknown) {
      console.error("Error fetching tables:", err);
      setTables({});
    } finally {
      setTablesLoading(false);
    }
  }, []);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    getDbStatus(token)
      .then((data) => {
        if (!data) {
          router.push("/dashboard");
          return;
        }
        setDb(data);
        fetchTables();
      })
      .catch(() => {
        router.push("/dashboard");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [router, fetchTables]);

  const runQuery = async () => {
    if (!db || !sql.trim()) return;

    setRunning(true);
    setQueryError("");
    setResult(null);

    const t0 = Date.now();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setQueryError("Not authenticated");
        return;
      }
      const res = await fetch("/api/db/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          sql,
        }),
      });
      const data = await res.json();

      if (res.ok) {
        setResult({ ...data, ms: Date.now() - t0 });
      } else {
        setQueryError(data.error ?? "Query failed");
      }
    } catch (err: unknown) {
      setQueryError(err instanceof Error ? err.message : "Query failed");
    } finally {
      setRunning(false);
    }
  };

  const refreshTables = () => {
    if (db) fetchTables();
  };

  return {
    db,
    loading,
    sql,
    setSql,
    result,
    queryError,
    running,
    tables,
    tablesLoading,
    runQuery,
    refreshTables,
  };
}
