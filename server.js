// server.js
import express from "express";
import { scrape } from "./index.js"; // kita ubah index.js export fungsi scrape
const app = express();

app.get("/health", (_req, res) => res.json({ ok: true }));

app.get("/", async (_req, res) => {
  try {
    const data = await scrape();
    res.json(data);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "scrape_failed" });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`server up on :${port}`));
