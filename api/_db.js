// Shared Turso (libSQL) client + log storage helpers used by the
// logging/dashboard API routes. One connection is reused across
// invocations within the same serverless instance.
const { createClient } = require("@libsql/client");

let client;
function getClient() {
  if (!client) {
    const url = process.env.TURSO_DATABASE_URL;
    const authToken = process.env.TURSO_AUTH_TOKEN;
    if (!url) throw new Error("Missing TURSO_DATABASE_URL env var");
    client = createClient({ url, authToken });
  }
  return client;
}

let schemaReady = false;
async function ensureSchema() {
  if (schemaReady) return;
  const db = getClient();
  await db.execute(`
    CREATE TABLE IF NOT EXISTS logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL,
      event TEXT,
      name TEXT,
      path TEXT,
      ip TEXT,
      user_agent TEXT,
      referrer TEXT,
      meta TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);
  await db.execute(`CREATE INDEX IF NOT EXISTS idx_logs_type_id ON logs (type, id)`);
  schemaReady = true;
}

async function insertLog(entry) {
  await ensureSchema();
  const db = getClient();
  await db.execute({
    sql: `INSERT INTO logs (type, event, name, path, ip, user_agent, referrer, meta) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      entry.type,
      entry.event || null,
      entry.name || null,
      entry.path || null,
      entry.ip || null,
      entry.userAgent || null,
      entry.referrer || null,
      entry.meta ? JSON.stringify(entry.meta) : null,
    ],
  });
}

async function queryLogs({ type, page = 1, pageSize = 50 }) {
  await ensureSchema();
  const db = getClient();
  const offset = (page - 1) * pageSize;
  const whereClause = type ? "WHERE type = ?" : "";
  const args = type ? [type] : [];

  const rowsResult = await db.execute({
    sql: `SELECT id, type, event, name, path, ip, user_agent, referrer, meta, created_at FROM logs ${whereClause} ORDER BY id DESC LIMIT ? OFFSET ?`,
    args: [...args, pageSize, offset],
  });
  const countResult = await db.execute({
    sql: `SELECT COUNT(*) as count FROM logs ${whereClause}`,
    args,
  });

  return { rows: rowsResult.rows, total: Number(countResult.rows[0].count) };
}

async function summaryStats() {
  await ensureSchema();
  const db = getClient();
  const byType = await db.execute(`SELECT type, COUNT(*) as count FROM logs GROUP BY type`);
  const uniqueNames = await db.execute(
    `SELECT COUNT(DISTINCT name) as count FROM logs WHERE type = 'personalize_open' AND name IS NOT NULL`
  );
  return {
    byType: byType.rows,
    uniquePersonalizedNames: Number(uniqueNames.rows[0]?.count || 0),
  };
}

module.exports = { insertLog, queryLogs, summaryStats };
