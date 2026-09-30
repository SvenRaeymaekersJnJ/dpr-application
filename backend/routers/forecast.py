from fastapi import APIRouter, Depends, Header, HTTPException
from db import get_connection
from schemas.forecast_update import ForecastData, OverrideSave
from services import forecast_service

router = APIRouter()

@router.get("/forecast", response_model=ForecastData)
def get_forecast(brand: str, sku: str | None = None, conn=Depends(get_connection)):
    data = forecast_service.get_forecast(conn, brand, sku)
    if data is None:
        raise HTTPException(404, f"No IBP data for {brand} / {sku or 'all SKUs'}")
    return data

@router.put("/forecast/overrides")
def save_overrides(
    body: OverrideSave,
    conn=Depends(get_connection),
    user: str = Header("local", alias="X-Forwarded-Email"),  # set by Databricks Apps
):
    try:
        n = forecast_service.save_overrides(conn, body.brand, body.sku, body.overrides, user)
    except ValueError as e:
        raise HTTPException(400, str(e))
    return {"status": "ok", "changes": n}