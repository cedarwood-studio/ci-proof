"""Small, honest invoice-calculation logic.

This is the sample workload the CI harness proves against: pure
functions with real edge cases, composed into one end-to-end
calculation that the integration test exercises as a whole.
"""

from __future__ import annotations

from dataclasses import dataclass
from decimal import ROUND_HALF_UP, Decimal


@dataclass(frozen=True)
class LineItem:
    """A single invoice line: unit price in dollars and a quantity."""

    unit_price: Decimal
    quantity: int


@dataclass(frozen=True)
class Invoice:
    subtotal: Decimal
    discount: Decimal
    tax: Decimal
    total: Decimal
    formatted_total: str


def compute_subtotal(items: list[LineItem]) -> Decimal:
    if not items:
        raise ValueError("at least one line item is required")

    subtotal = Decimal("0")
    for item in items:
        if item.unit_price < 0:
            raise ValueError("unit_price must be >= 0")
        if item.quantity <= 0:
            raise ValueError("quantity must be a positive integer")
        subtotal += item.unit_price * item.quantity
    return _round_cents(subtotal)


def apply_discount(subtotal: Decimal, discount_pct: Decimal) -> Decimal:
    if discount_pct < 0 or discount_pct > 100:
        raise ValueError("discount_pct must be between 0 and 100")
    return _round_cents(subtotal * (discount_pct / Decimal(100)))


def apply_tax(amount: Decimal, tax_rate_pct: Decimal) -> Decimal:
    if tax_rate_pct < 0:
        raise ValueError("tax_rate_pct must be >= 0")
    return _round_cents(amount * (tax_rate_pct / Decimal(100)))


def format_currency(amount: Decimal) -> str:
    return f"${amount:,.2f}"


def build_invoice(
    items: list[LineItem],
    discount_pct: Decimal = Decimal("0"),
    tax_rate_pct: Decimal = Decimal("0"),
) -> Invoice:
    subtotal = compute_subtotal(items)
    discount = apply_discount(subtotal, discount_pct)
    taxable_amount = subtotal - discount
    tax = apply_tax(taxable_amount, tax_rate_pct)
    total = _round_cents(taxable_amount + tax)

    return Invoice(
        subtotal=subtotal,
        discount=discount,
        tax=tax,
        total=total,
        formatted_total=format_currency(total),
    )


def _round_cents(amount: Decimal) -> Decimal:
    return amount.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)
