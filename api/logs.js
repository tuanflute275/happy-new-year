// Protected endpoint: returns paginated logs + summary counts for the
// dashboard. Requires a valid signed session cookie (see _auth.js).
const { verifySession } = require("./_auth");
const { queryLogs, summaryStats } = require("./_db");

module.exports = async (req, res) => {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }
  const session = verifySession(req.headers.cookie);
  if (!session) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    const type = typeof req.query.type === "string" && req.query.type ? req.query.type : undefined;
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const pageSize = Math.min(200, Math.max(1, parseInt(req.query.pageSize, 10) || 50));

    const [logs, summary] = await Promise.all([queryLogs({ type, page, pageSize }), summaryStats()]);
    res.status(200).json({ ...logs, summary, page, pageSize });
  } catch (err) {
    console.error("logs error", err);
    res.status(500).json({ error: "Internal error" });
  }
};
