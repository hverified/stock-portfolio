import yfinance as yf
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from datetime import datetime

router = APIRouter()


# Define the data model to return market summary
class MarketSummary(BaseModel):
    index_name: str
    current_price: float
    open_price: float
    high_price: float
    low_price: float
    previous_close: float
    volume: int


def get_market_data(index_symbol: str) -> MarketSummary:
    try:
        # Fetch daily data using yfinance
        index = yf.Ticker(index_symbol)
        data = index.history(period="1d")  # Get only the latest day's data

        if data.empty:
            raise ValueError(f"No data returned for symbol: {index_symbol}")

        # Get the latest row (today's data)
        latest_data = data.iloc[-1]

        # Current price is the close price of the latest data, rounded to 2 decimal places
        current_price = round(latest_data["Close"], 2)

        # Get the previous day's data (which is the second latest record)
        previous_data = index.history(period="5d").iloc[-2]  # Fetch two days' data

        # Previous close is rounded to 2 decimal places
        previous_close = (
            round(previous_data["Close"], 2)
            if previous_data is not None
            else current_price
        )

        # Check for volume (in case it's missing)
        volume = latest_data.get("Volume", 0)

        # Return the response as a Pydantic model
        return MarketSummary(
            index_name=index_symbol,
            current_price=current_price,
            open_price=round(latest_data["Open"], 2),
            high_price=round(latest_data["High"], 2),
            low_price=round(latest_data["Low"], 2),
            previous_close=previous_close,
            volume=volume,
        )
    except ValueError as ve:
        raise HTTPException(
            status_code=500, detail=f"Error fetching market data: {str(ve)}"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")


@router.get("/market-summary")
async def get_market_summary():
    try:
        # Fetch market data for Nifty 50 and Sensex
        nifty_data = get_market_data("^NSEI")  # Nifty 50
        sensex_data = get_market_data("^BSESN")  # Sensex

        # Return data as a Pydantic model
        return {"nifty_50": nifty_data, "sensex": sensex_data}
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail="Error fetching market data")
