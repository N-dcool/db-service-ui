import { TableSchema } from "@/hooks/usePlayground";
import { NextRequest } from "next/server";
import { Client } from "pg";

const TABLES_QUERY = `
      SELECT 
        t.table_name, c.column_name, c.data_type, c.is_nullable
      FROM information_schema.tables t
      JOIN information_schema.columns c
        ON t.table_name = c.table_name AND t.table_schema = c.table_schema
      WHERE 
        t.table_schema = 'public' AND t.table_type = 'BASE TABLE'
        ORDER BY t.table_name, c.ordinal_position
`;

export async function POST(req: NextRequest) {
  const { connectionString } = await req.json();

  if (!connectionString) {
    return Response.json(
      { error: "Missing connection string" },
      { status: 400 },
    );
  }

  const client = new Client({
    connectionString,
    connectionTimeoutMillis: 5000,
  });

  try {
    await client.connect();
    const res = await client.query(TABLES_QUERY);

    const tables: TableSchema = {};
    for (const row of res.rows) {
      if (!tables[row.table_name]) tables[row.table_name] = [];
      tables[row.table_name].push({
        column_name: row.column_name,
        data_type: row.data_type,
        is_nullable: row.is_nullable,
      });
    }
    return Response.json({ tables });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to fetch schema";
    return Response.json({ error: msg }, { status: 400 });
  } finally {
    await client.end();
  }
}
