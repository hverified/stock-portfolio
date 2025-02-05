from fastapi import APIRouter
from app.core.dhan_client import get_dhan_client
from fastapi.responses import JSONResponse

router = APIRouter()


@router.get("/get_fund_limits")
async def get_fund_limits():
    dhan = get_dhan_client()
    return JSONResponse(dhan.get_fund_limits())

@router.get("/get_positions")
async def get_positions():
    dhan = get_dhan_client()
    return JSONResponse(dhan.get_positions())
