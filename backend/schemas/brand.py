from pydantic import BaseModel

class Sku(BaseModel):
    sku: str
    description: str

class Brand(BaseModel):
    brand: str
    skus: list[Sku]