from pydantic import BaseModel
from typing import Literal
class ForecastRow(BaseModel):
    id: str
    label: str
    values: dict[str, float]

class ForecastData(BaseModel):
    periods: list[str]
    unit_price: float
    rows: list[ForecastRow]
    overrides: dict[str, float]

class OverrideSave(BaseModel):
    brand: str
    sku: str | None = None
    measure: Literal["VOLUME", "VALUE"] = "VOLUME" # <-- add
    overrides: dict[str, float]