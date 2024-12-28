from fastapi import APIRouter, HTTPException, Depends
from app.models.bank_account import BankAccount
from app.db import db
from app.utils.security import get_current_user
from datetime import datetime

router = APIRouter()


@router.post("/deposit")
async def deposit(amount: float, current_user: dict = Depends(get_current_user)):
    if amount <= 0:
        raise HTTPException(status_code=400, detail="Amount must be positive")

    contact_number = current_user.get("contact_number")

    # Find the user's bank account
    account = db.bank_accounts.find_one({"user_id": contact_number})
    if not account:
        raise HTTPException(status_code=404, detail="Bank account not found")

    # Update account balance
    new_balance = account["account_balance"] + amount
    db.bank_accounts.update_one(
        {"user_id": contact_number}, {"$set": {"account_balance": new_balance}}
    )

    # Add a transaction record
    transaction = {
        "type": "deposit",
        "amount": amount,
        "date": datetime.utcnow(),
        "description": "Deposit to account",
    }
    db.bank_accounts.update_one(
        {"user_id": contact_number}, {"$push": {"transactions": transaction}}
    )

    return {"message": "Deposit successful", "new_balance": new_balance}


@router.get("/statement")
async def get_statement(current_user: dict = Depends(get_current_user)):
    contact_number = current_user.get("contact_number")

    # Find the user's bank account
    account = db.bank_accounts.find_one({"user_id": contact_number})
    if not account:
        raise HTTPException(status_code=404, detail="Bank account not found")

    # Return the transactions
    return {
        "account_number": account["account_number"],
        "account_balance": account["account_balance"],
        "transactions": account["transactions"],
    }
