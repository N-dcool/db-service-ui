// import {Client, FieldDef} from 'pg';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
    const { connectionString, sql} = await req.json();

    console.log("Received query:", { connectionString, sql });

    return Response.json({ message: "Feature is not implemented yet" });

    // if(!connectionString || !sql?.trim()) {
    //     return Response.json({ error: "Missing connection string or SQL" }, { status: 400 });
    // }

    // const client = new Client({ connectionString, connectionTimeoutMillis:  5000 });

    // try {
    //     await client.connect();
    //     const result = await client.query(sql);
    //     return Response.json({
    //         rows: result.rows,
    //         fields: result.fields.map((f: FieldDef) => f.name),
    //         rowCounts: result.rowCount ?? 0
    //      });
    // } catch (err: unknown) {
    //     const msg = err instanceof Error ? err.message : "Query failed";
    //     return Response.json({ error: msg }, { status: 400 });
    // } finally {
    //     await client.end();
    // }
}