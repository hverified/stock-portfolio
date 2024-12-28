from fastapi import APIRouter, HTTPException, Depends
from app.models.user import User
from app.utils.security import hash_password, verify_password, create_access_token
from app.db import db
import uuid

router = APIRouter()


@router.post("/register")
async def register(user: User):
    # Check if the user already exists
    if db.users.find_one({"contact_number": user.contact_number}):
        raise HTTPException(status_code=400, detail="User already exists")

    # Hash the user's password
    hashed_password = hash_password(user.password)

    # Create user data
    user_data = user.dict()
    user_data["hashed_password"] = hashed_password
    del user_data["password"]  # Do not store plain-text password

    # Insert user into database
    db.users.insert_one(user_data)

    # Automatically create a bank account for the user
    account_data = {
        "user_id": user.contact_number,  # Use contact_number to link the account
        "account_number": str(uuid.uuid4()),  # Generate a unique account number
        "account_balance": 0.0,  # Initial balance
        "currency": "INR",  # Default currency
        "account_type": "Savings",  # Default account type
        "transactions": [],  # Empty transaction ledger
    }
    db.bank_accounts.insert_one(account_data)

    return {"message": "User registered successfully and bank account created"}


@router.post("/login")
async def login(contact_number: str, password: str):
    stored_user = db.users.find_one({"contact_number": contact_number})
    if not stored_user:
        raise HTTPException(status_code=404, detail="User not found")

    if not verify_password(password, stored_user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({"sub": stored_user["contact_number"]})
    return {"access_token": token, "token_type": "bearer"}


@router.post("/forgot-password")
async def forgot_password(contact_number: str, new_password: str):
    # Check if the user exists
    user = db.users.find_one({"contact_number": contact_number})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Hash the new password
    hashed_password = hash_password(new_password)

    # Update the password in the database
    db.users.update_one(
        {"contact_number": contact_number},
        {"$set": {"hashed_password": hashed_password}},
    )
    return {"message": "Password updated successfully"}
