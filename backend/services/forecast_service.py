from repositories import forecast_repo

def _by_period(rows):
    return {r["period"]: float(r["volume"]) for r in rows}

def get_forecast(conn, brand: str, sku: str | None):
    ibp = forecast_repo.fetch_series(conn, "ibp", brand, sku)
    if not ibp:
        return None
    fin = forecast_repo.fetch_series(conn, "financial", brand, sku)
    total_vol = sum(r["volume"] for r in ibp)
    total_val = sum(r["value"] for r in ibp)

    return {
        "periods": sorted({r["period"] for r in ibp + fin}),
        "unit_price": float(total_val / total_vol) if total_vol else 0,
        "rows": [
            {"id": "current_ibp", "label": "Current IBP", "values": _by_period(ibp)},
            {"id": "financial", "label": "Financial plan", "values": _by_period(fin)},
        ],
        "overrides": _by_period(forecast_repo.fetch_overrides(conn, brand, sku)),
    }

def save_overrides(conn, brand: str, sku: str | None, new: dict[str, float], user: str):
    if not sku:
        raise ValueError("Select a SKU to edit; the brand total is read-only")
    if any(v < 0 for v in new.values()):
        raise ValueError("Volumes cannot be negative")

    current = _by_period(forecast_repo.fetch_overrides(conn, brand, sku))
    changes: dict[str, float | None] = {p: v for p, v in new.items() if current.get(p) != v}
    changes |= {p: None for p in current if p not in new}   # removed -> clear
    if changes:
        forecast_repo.insert_updates(conn, sku, changes, user)
    return len(changes)