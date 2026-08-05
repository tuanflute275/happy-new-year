// Public endpoint: records a visit / personalized-link-open / feature
// interaction event. No auth — anyone loading the site can log an event,
// same as any client-side analytics beacon.
const { insertLog } = require("./_db");

const ALLOWED_TYPES = new Set(["visit", "personalize_open", "interaction"]);

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }
  try {
    const body = req.body || {};
    const type = String(body.type || "").slice(0, 40);
    if (!ALLOWED_TYPES.has(type)) {
      res.status(400).json({ error: "Invalid type" });
      return;
    }
    const ip = (req.headers["x-forwarded-for"] || "").split(",")[0].trim() || req.socket?.remoteAddress || "";

    await insertLog({
      type,
      event: body.event ? String(body.event).slice(0, 80) : null,
      name: body.name ? String(body.name).slice(0, 60) : null,
      path: body.path ? String(body.path).slice(0, 200) : null,
      ip,
      userAgent: (req.headers["user-agent"] || "").slice(0, 300),
      referrer: body.referrer ? String(body.referrer).slice(0, 300) : null,
      meta: body.meta && typeof body.meta === "object" ? body.meta : undefined,
    });
    res.status(204).end();
  } catch (err) {
    console.error("log error", err);
    res.status(500).json({ error: "Internal error" });
  }
};
