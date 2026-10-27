"""Integration-style test: exercises the full invoice pipeline end to end
(subtotal, discount, tax, formatting) together, rather than any one
function in isolation.
"""

from decimal import Decimal

from py_service.invoice import LineItem, build_invoice


def test_build_invoice_end_to_end() -> None:
    invoice = build_invoice(
        items=[
            LineItem(Decimal("50"), 2),  # 100
            LineItem(Decimal("25"), 4),  # 100
        ],
        discount_pct=Decimal("10"),  # 10% discount -> taxable 180
        tax_rate_pct=Decimal("8"),  # 8% tax -> 14.40
    )

    assert invoice.subtotal == Decimal("200.00")
    assert invoice.discount == Decimal("20.00")
    assert invoice.tax == Decimal("14.40")
    assert invoice.total == Decimal("194.40")
    assert invoice.formatted_total == "$194.40"


def test_build_invoice_defaults_discount_and_tax_to_zero() -> None:
    invoice = build_invoice(items=[LineItem(Decimal("10"), 1)])
    assert invoice.total == Decimal("10.00")
    assert invoice.formatted_total == "$10.00"
