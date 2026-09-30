from pydantic import BaseModel
from typing import Optional


class ForecastUpdate(BaseModel):
    sku: str
    forecast_month: str
    measure_type: str
    override_value: float
    assumption: Optional[str] = None
    modified_by: str