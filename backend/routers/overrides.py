from fastapi import APIRouter

from db import get_connection
from models.forecast_update import ForecastUpdate

router = APIRouter()

@router.post("/forecast-updates")
def create_override(
    update: ForecastUpdate
):

    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        INSERT INTO forecast_updates
        (
            sku,
            forecast_month,
            measure_type,
            override_value,
            assumption,
            modified_by
        )
        VALUES
        (
            %s,
            %s,
            %s,
            %s,
            %s,
            %s
        )
    """, (
        update.sku,
        update.forecast_month,
        update.measure_type,
        update.override_value,
        update.assumption,
        update.modified_by
    ))

    conn.commit()

    cur.close()
    conn.close()

    return {
        "status": "success"
    }


@router.get("/forecast-updates/{sku}")
def get_overrides(
    sku: str
):

    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        SELECT *
        FROM forecast_updates
        WHERE sku = %s
        ORDER BY modified_at DESC
    """, (sku,))

    columns = [desc[0] for desc in cur.description]

    data = [
        dict(zip(columns, row))
        for row in cur.fetchall()
    ]

    cur.close()
    conn.close()

    return data