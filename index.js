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
app.post("/api/generate", (req, res) => {
  const { prompt } = req.body || {};
  // For now just echo back so we can prove it works
  return res.json({
    ok: true,
    received: prompt ?? null,
    time: new Date().toISOString(),
  });
});

// start
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
