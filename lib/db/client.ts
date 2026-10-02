import { drizzle } from "drizzle-orm/sqlite-proxy";
import * as schema from "./schema";

interface D1HttpQueryResult {
  results: unknown[];
  success: boolean;
  meta: { last_row_id: number; changes: number };
}

interface D1HttpResponse {
  result: D1HttpQueryResult[];
  success: boolean;
  errors: Array<{ code: number; message: string }>;
}

async function executeD1Query(
  sql: string,
  params: unknown[]
): Promise<{ rows: unknown[][] }> {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const databaseId = process.env.CLOUDFLARE_D1_DATABASE_ID;
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;

  if (!accountId || !databaseId || !apiToken) {
    console.error("[D1 HTTP API] Missing Cloudflare D1 environment variables");
    throw new Error("Database configuration error");
  }

  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${databaseId}/query`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sql, params }),
    }
  );

  const json = (await response.json()) as D1HttpResponse;

  if (!json.success) {
    console.error("[D1 HTTP API error]", json.errors);
    throw new Error("Database query failed");
  }

  const rows = json.result[0]?.results ?? [];
  return {
    rows: (rows as Array<Record<string, unknown>>).map((row) => Object.values(row)),
  };
}

export function getDb() {
  return drizzle(
    async (sql, params, method) => {
      try {
        const { rows } = await executeD1Query(sql, params);
        if (method === "get") {
          return { rows: rows[0] ?? [] };
        }
        return { rows };
      } catch (error) {
        console.error("[getDb proxy execute]", error);
        throw new Error("Database operation failed");
      }
    },
    { schema }
  );
}
