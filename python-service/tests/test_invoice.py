from decimal import Decimal

import pytest

from py_service.invoice import (
    LineItem,
    apply_discount,
    apply_tax,
    compute_subtotal,
    format_currency,
)


def test_compute_subtotal_sums_unit_price_times_quantity() -> None:
    subtotal = compute_subtotal(
        [
            LineItem(Decimal("10"), 2),
            LineItem(Decimal("5"), 3),
        ]
    )
    assert subtotal == Decimal("35.00")


def test_compute_subtotal_rejects_empty_items() -> None:
    with pytest.raises(ValueError, match="at least one line item"):
        compute_subtotal([])


def test_compute_subtotal_rejects_negative_unit_price() -> None:
    with pytest.raises(ValueError, match="unit_price"):
        compute_subtotal([LineItem(Decimal("-1"), 1)])


def test_compute_subtotal_rejects_non_positive_quantity() -> None:
    with pytest.raises(ValueError, match="quantity"):
        compute_subtotal([LineItem(Decimal("1"), 0)])


def test_apply_discount_computes_percentage() -> None:
    assert apply_discount(Decimal("100"), Decimal("10")) == Decimal("10.00")


def test_apply_discount_allows_zero() -> None:
    assert apply_discount(Decimal("100"), Decimal("0")) == Decimal("0.00")


@pytest.mark.parametrize("bad_pct", [Decimal("-1"), Decimal("101")])
def test_apply_discount_rejects_out_of_range(bad_pct: Decimal) -> None:
    with pytest.raises(ValueError, match="discount_pct"):
        apply_discount(Decimal("100"), bad_pct)


def test_apply_tax_computes_percentage() -> None:
    assert apply_tax(Decimal("100"), Decimal("8.25")) == Decimal("8.25")


def test_apply_tax_rejects_negative_rate() -> None:
    with pytest.raises(ValueError, match="tax_rate_pct"):
        apply_tax(Decimal("100"), Decimal("-1"))


def test_format_currency_adds_thousands_separator() -> None:
    assert format_currency(Decimal("1234.50")) == "$1,234.50"


def test_format_currency_zero() -> None:
    assert format_currency(Decimal("0")) == "$0.00"
