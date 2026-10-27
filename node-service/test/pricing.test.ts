import { describe, expect, it } from "vitest";
import {
  applyDiscount,
  applyTax,
  buildQuote,
  computeSubtotal,
  formatCurrency,
} from "../src/pricing.js";

describe("computeSubtotal", () => {
  it("sums unit price times quantity across line items", () => {
    const subtotal = computeSubtotal([
      { unitPrice: 10, quantity: 2 },
      { unitPrice: 5, quantity: 3 },
    ]);
    expect(subtotal).toBe(35);
  });

  it("rejects an empty item list", () => {
    expect(() => computeSubtotal([])).toThrow(RangeError);
  });

  it("rejects a negative unit price", () => {
    expect(() => computeSubtotal([{ unitPrice: -1, quantity: 1 }])).toThrow(RangeError);
  });

  it("rejects a non-integer quantity", () => {
    expect(() => computeSubtotal([{ unitPrice: 1, quantity: 1.5 }])).toThrow(RangeError);
  });

  it("rejects a zero or negative quantity", () => {
    expect(() => computeSubtotal([{ unitPrice: 1, quantity: 0 }])).toThrow(RangeError);
  });
});

describe("applyDiscount", () => {
  it("computes a percentage discount", () => {
    expect(applyDiscount(100, 10)).toBe(10);
  });

  it("allows a zero discount", () => {
    expect(applyDiscount(100, 0)).toBe(0);
  });

  it("rejects a discount below 0", () => {
    expect(() => applyDiscount(100, -1)).toThrow(RangeError);
  });

  it("rejects a discount above 100", () => {
    expect(() => applyDiscount(100, 101)).toThrow(RangeError);
  });
});

describe("applyTax", () => {
  it("computes a percentage tax", () => {
    expect(applyTax(100, 8.25)).toBe(8.25);
  });

  it("rejects a negative tax rate", () => {
    expect(() => applyTax(100, -1)).toThrow(RangeError);
  });
});

describe("formatCurrency", () => {
  it("formats a number as USD", () => {
    expect(formatCurrency(1234.5)).toBe("$1,234.50");
  });

  it("formats zero", () => {
    expect(formatCurrency(0)).toBe("$0.00");
  });
});

describe("buildQuote", () => {
  it("composes subtotal, discount, and tax into a final total", () => {
    const quote = buildQuote(
      [
        { unitPrice: 50, quantity: 2 }, // 100
        { unitPrice: 25, quantity: 4 }, // 100
      ],
      10, // 10% discount -> taxable 180
      8, // 8% tax -> 14.40
    );

    expect(quote.subtotal).toBe(200);
    expect(quote.discount).toBe(20);
    expect(quote.tax).toBe(14.4);
    expect(quote.total).toBe(194.4);
    expect(quote.formattedTotal).toBe("$194.40");
  });

  it("defaults discount and tax to zero", () => {
    const quote = buildQuote([{ unitPrice: 10, quantity: 1 }]);
    expect(quote.total).toBe(10);
  });
});
