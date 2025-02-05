from fastapi import APIRouter
from fastapi.responses import JSONResponse
import json
from datetime import datetime

router = APIRouter()

# Define the path to your JSON file
json_file_path = "stock_screener.json"

# Read the JSON file when the app starts
def read_stock_screener_data():
    with open(json_file_path, "r") as file:
        data = json.load(file)
    return data

@router.get("/stocks")
async def get_stock_screener_data():
    stock_data = read_stock_screener_data()

    # Sort the stock data by the "date" field in descending order
    sorted_stock_data = sorted(stock_data, key=lambda x: datetime.strptime(x['date'], '%Y-%m-%d'), reverse=True)

    return JSONResponse(content=sorted_stock_data)
