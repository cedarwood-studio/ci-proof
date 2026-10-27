import { describe, expect, it } from "vitest";
import request from "supertest";
import { createServer } from "../src/server.js";

// Integration test: exercises the real HTTP layer and the pricing
// module together, against a running Express app (no mocks).
describe("server integration", () => {
  const app = createServer();

  it("GET /health reports ok", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: "ok" });
  });

  it("POST /quote computes a full quote end to end", async () => {
    const res = await request(app)
      .post("/quote")
      .send({
        items: [
          { unitPrice: 20, quantity: 3 },
          { unitPrice: 15, quantity: 2 },
        ],
        discountPct: 5,
        taxRatePct: 10,
      });

    expect(res.status).toBe(200);
    expect(res.body.subtotal).toBe(90);
    expect(res.body.formattedTotal).toMatch(/^\$\d+\.\d{2}$/);
  });

  it("POST /quote rejects a missing items array", async () => {
    const res = await request(app).post("/quote").send({});
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/items/);
  });

  it("POST /quote rejects an invalid line item", async () => {
    const res = await request(app)
      .post("/quote")
      .send({ items: [{ unitPrice: -5, quantity: 1 }] });

    expect(res.status).toBe(400);
  });
});
