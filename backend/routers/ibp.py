from fastapi import APIRouter
from db import get_connection

router = APIRouter()


@router.get("/ibp/brand/{brand}")
def get_ibp_brand_summary(brand: str):

    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        SELECT
            sku,
            sku_description,
            SUM(volume) AS volume,
            SUM(value) AS value
        FROM dpr_gold_ibp
        WHERE brand = %s
        GROUP BY
            sku,
            sku_description
        ORDER BY sku
    """, (brand,))

    columns = [desc[0] for desc in cur.description]

    data = [
        dict(zip(columns, row))
        for row in cur.fetchall()
    ]

    cur.close()
    conn.close()

    return data

@router.get("/ibp/sku/{brand}/{sku}")
def get_ibp_sku_detail(
    brand: str,
    sku: str
):

    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        SELECT
            date,
            volume,
            value,
            unit_price
        FROM dpr_gold_ibp
        WHERE brand = %s
        AND sku = %s
        ORDER BY date
    """, (brand, sku))

    columns = [desc[0] for desc in cur.description]

    data = [
        dict(zip(columns, row))
        for row in cur.fetchall()
    ]

    cur.close()
    conn.close()

    return data