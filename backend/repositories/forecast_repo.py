TABLES = {"ibp": "plan.dpr_gold_ibp", "financial": "plan.dpr_gold_financial"}

def fetch_series(conn, source: str, brand: str, sku: str | None):
    with conn.cursor() as cur:
        cur.execute(f"""
            SELECT to_char(date, 'YYYY-MM') AS period, SUM(volume) AS volume, SUM(value) AS value
            FROM {TABLES[source]}
            WHERE brand = %s AND (%s::text IS NULL OR sku = %s)
            GROUP BY 1 ORDER BY 1
        """, (brand, sku, sku))
        return cur.fetchall()

    
COLS = {"VOLUME": "volume", "VALUE": "value"}

def fetch_overrides(conn, brand: str, sku: str | None, measure: str):
    """Effective proposed volume or value per period, only for periods with at least one active override.
    Works for a single SKU and for the brand total (sum of override-or-IBP across SKUs)."""
    col = COLS[measure]   # fixed mapping, so it's safe in the f-string
    with conn.cursor() as cur:
        cur.execute(f"""
            WITH latest AS (
                SELECT DISTINCT ON (sku, forecast_month) sku, forecast_month, override_value
                FROM plan.forecast_updates
                WHERE upper(measure_type) = %s
                ORDER BY sku, forecast_month, modified_at DESC, id DESC
            )
            SELECT to_char(i.date, 'YYYY-MM') AS period,
                   SUM(COALESCE(l.override_value, i.{col})) AS volume
            FROM plan.dpr_gold_ibp i
            LEFT JOIN latest l ON l.sku = i.sku AND l.forecast_month = i.date
            WHERE i.brand = %s AND (%s::text IS NULL OR i.sku = %s)
            GROUP BY 1
            HAVING COUNT(l.override_value) > 0
        """, (measure, brand, sku, sku))
        return cur.fetchall()

def insert_updates(conn, sku: str, measure: str, changes: dict[str, float | None], user: str):
    with conn.cursor() as cur:
        cur.executemany("""
            INSERT INTO plan.forecast_updates (sku, forecast_month, measure_type, override_value, modified_by)
            VALUES (%s, %s::date, %s, %s, %s)
        """, [(sku, f"{p}-01", measure, v, user) for p, v in changes.items()])