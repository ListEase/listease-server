import express from "express";
import cors from "cors";

const app = express();

// middleware
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://listease-frontend.onrender.com", // <-- your frontend URL
  ],
}));
app.use(express.json());

// health check
app.get("/api/health", (_req, res) => res.json({ ok: true }));

// REQUIRED ROUTE (the one your frontend calls)
app.post("/api/ideas/generate", (req, res) => {
  const { niche = "", audience = "", season = "", count = 5 } = req.body || {};
  const n = Math.max(1, Math.min(Number(count) || 5, 10));

  const tagify = (s) =>
    s.toLowerCase().replace(/[^a-z0-9 ]/g, "").split(" ").filter(Boolean).slice(0, 3);

  const base = (label) => [label, niche, audience, season].filter(Boolean).join(" • ");

  const seeds = [
    "Personalized",
    "Minimalist",
    "Boho",
    "Vintage-inspired",
    "Modern",
    "Rustic",
    "Seasonal",
    "Bundle",
    "Printable",
    "Gift Set",
  ];

  const ideas = Array.from({ length: n }).map((_, i) => {
    const style = seeds[i % seeds.length];
    const title = `${style} ${niche || "Handmade"} for ${audience || "Gifts"}`;
    const description =
      `• ${base(style)}\n• Made-to-order, customizable\n• Great for ${audience || "anyone"}\n• Perfect for ${season || "year-round"}`;
    const tags = [
      ...new Set([
        ...tagify(style),
        ...tagify(niche),
        ...tagify(audience),
        ...tagify(season),
        "handmade",
        "custom",
        "gift",
        "etsy",
        "unique",
      ]),
    ].slice(0, 13);
    return { title, description, tags };
  });

  res.json({ ideas });
});

