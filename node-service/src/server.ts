import express, { type Express, type Request, type Response } from "express";
import { buildQuote, type LineItem } from "./pricing.js";

export function createServer(): Express {
  const app = express();
  app.use(express.json());

  app.get("/health", (_req: Request, res: Response) => {
    res.status(200).json({ status: "ok" });
  });

  app.post("/quote", (req: Request, res: Response) => {
    const body = req.body as {
      items?: LineItem[];
      discountPct?: number;
      taxRatePct?: number;
    };

    if (!Array.isArray(body.items) || body.items.length === 0) {
      res.status(400).json({ error: "items must be a non-empty array" });
      return;
    }

    try {
      const quote = buildQuote(body.items, body.discountPct ?? 0, body.taxRatePct ?? 0);
      res.status(200).json(quote);
    } catch (err) {
      const message = err instanceof Error ? err.message : "invalid request";
      res.status(400).json({ error: message });
    }
  });

  return app;
}
