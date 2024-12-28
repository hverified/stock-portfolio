from fastapi import APIRouter, HTTPException, Depends
from app.models.portfolio import PortfolioItem
from app.services.stock_service import fetch_stock_price
from app.db import db
from app.utils.security import get_current_user

router = APIRouter()


@router.post("/buy")
async def buy_stock(symbol: str, quantity: int, user: dict = Depends(get_current_user)):
    stock_price = fetch_stock_price(symbol)
    total_cost = stock_price * quantity

    account = db.bank_accounts.find_one({"user_id": user["_id"]})
    if not account or account["account_balance"] < total_cost:
        raise HTTPException(status_code=400, detail="Insufficient funds")

    db.bank_accounts.update_one(
        {"_id": account["_id"]}, {"$inc": {"account_balance": -total_cost}}
    )
    db.portfolios.update_one(
        {"user_id": user["_id"], "symbol": symbol},
        {"$inc": {"quantity": quantity}, "$set": {"purchase_price": stock_price}},
        upsert=True,
    )
    return {"message": f"Bought {quantity} shares of {symbol}"}
