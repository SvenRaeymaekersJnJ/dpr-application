def fetch_brand_skus(conn):
    with conn.cursor() as cur:
        cur.execute("""
        SELECT DISTINCT brand, sku, sku_description
        FROM plan.dpr_gold_ibp
        ORDER BY brand, sku
        """)
        return cur.fetchall()