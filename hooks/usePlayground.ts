"use client";

import {DbRecord, executeQuery, getDbStatus, getTables, QueryResult} from "@/lib/api";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

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
      const data = await getTables(token);
      setTables(data ?? {})
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

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return;
      }
      const data = await executeQuery(token, sql);
      setResult(data);
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
