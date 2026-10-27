/**
 * Small, honest business logic for a quote calculator.
 *
 * This is the sample workload the CI harness proves against: pure
 * functions with real edge cases, composed into one end-to-end
 * calculation that the integration test exercises as a whole.
 */

export interface LineItem {
  /** Unit price in dollars, must be >= 0. */
  unitPrice: number;
  /** Quantity, must be a positive integer. */
  quantity: number;
}

export interface Quote {
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  formattedTotal: string;
}

export function computeSubtotal(items: readonly LineItem[]): number {
  if (items.length === 0) {
    throw new RangeError("at least one line item is required");
  }

  return items.reduce((sum, item) => {
    if (item.unitPrice < 0) {
      throw new RangeError("unitPrice must be >= 0");
    }
    if (item.quantity <= 0 || !Number.isInteger(item.quantity)) {
      throw new RangeError("quantity must be a positive integer");
    }
    return sum + item.unitPrice * item.quantity;
  }, 0);
}

export function applyDiscount(subtotal: number, discountPct: number): number {
  if (discountPct < 0 || discountPct > 100) {
    throw new RangeError("discountPct must be between 0 and 100");
  }
  const discount = subtotal * (discountPct / 100);
  return roundToCents(discount);
}

export function applyTax(amount: number, taxRatePct: number): number {
  if (taxRatePct < 0) {
    throw new RangeError("taxRatePct must be >= 0");
  }
  return roundToCents(amount * (taxRatePct / 100));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export function buildQuote(items: readonly LineItem[], discountPct = 0, taxRatePct = 0): Quote {
  const subtotal = roundToCents(computeSubtotal(items));
  const discount = applyDiscount(subtotal, discountPct);
  const taxableAmount = subtotal - discount;
  const tax = applyTax(taxableAmount, taxRatePct);
  const total = roundToCents(taxableAmount + tax);

  return {
    subtotal,
    discount,
    tax,
    total,
    formattedTotal: formatCurrency(total),
  };
}

function roundToCents(amount: number): number {
  return Math.round(amount * 100) / 100;
}
