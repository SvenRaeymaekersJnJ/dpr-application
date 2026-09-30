from fastapi import APIRouter, Depends
from db import get_connection
from schemas.brand import Brand
from services import brand_service

router = APIRouter()

@router.get("/brands", response_model=list[Brand])
def list_brands(conn=Depends(get_connection)):
    return brand_service.get_brands(conn)