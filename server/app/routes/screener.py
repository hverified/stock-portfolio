from fastapi import APIRouter
from fastapi.responses import JSONResponse
import json
from datetime import datetime
import os

router = APIRouter()

json_file_path = "stock_screener.json"

def read_stock_screener_data():
    if not os.path.exists(json_file_path):
        return []

    with open(json_file_path, "r") as file:
        try:
            if os.stat(json_file_path).st_size == 0:
                return []
            data = json.load(file)
        except json.JSONDecodeError:
            return []
    return data

@router.get("/stocks")
async def get_stock_screener_data():
    stock_data = read_stock_screener_data()

    sorted_stock_data = sorted(
        stock_data, 
        key=lambda x: datetime.strptime(x['date'], '%Y-%m-%d'), 
        reverse=True
    ) if stock_data else []

    return JSONResponse(content=sorted_stock_data)
