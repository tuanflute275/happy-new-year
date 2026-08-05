// Public endpoint: stores/serves a small personalized avatar image so it can
// travel with a shared ?to=Tên&avatar=id link across devices (same trust
// model as /api/log — no auth, but uploads are capped in size/type and
// served back with a long-lived cache header since content at a given id
// never changes).
const crypto = require("crypto");
const { insertAvatar, getAvatar } = require("./_db");

const ALLOWED_MIME = new Set(["image/webp", "image/jpeg", "image/png"]);
const MAX_BASE64_LEN = 140000; // ~105KB decoded — plenty for a compressed small avatar thumbnail
const ID_RE = /^[a-f0-9]{12}$/;

module.exports = async (req, res) => {
  if (req.method === "POST") {
    try {
      const body = req.body || {};
      const dataUrl = String(body.data || "");
      const match = /^data:(image\/(?:webp|jpeg|png));base64,(.+)$/.exec(dataUrl);
      if (!match || !ALLOWED_MIME.has(match[1])) {
        res.status(400).json({ error: "Invalid image data" });
        return;
      }
      const [, mime, base64] = match;
      if (base64.length > MAX_BASE64_LEN) {
        res.status(413).json({ error: "Image too large" });
        return;
      }
      const id = crypto.randomBytes(6).toString("hex");
      await insertAvatar({ id, mime, data: base64 });
      res.status(200).json({ id });
    } catch (err) {
      console.error("avatar upload error", err);
      res.status(500).json({ error: "Internal error" });
    }
    return;
  }

  if (req.method === "GET") {
    try {
      const id = String(req.query.id || "");
      if (!ID_RE.test(id)) {
        res.status(400).json({ error: "Invalid id" });
        return;
      }
      const row = await getAvatar(id);
      if (!row) {
        res.status(404).json({ error: "Not found" });
        return;
      }
      res.setHeader("Content-Type", row.mime);
      res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
      res.status(200).send(Buffer.from(row.data, "base64"));
    } catch (err) {
      console.error("avatar fetch error", err);
      res.status(500).json({ error: "Internal error" });
    }
    return;
  }

  res.status(405).json({ error: "Method not allowed" });
};
