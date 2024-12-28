from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime


class Transaction(BaseModel):
    type: str  # e.g., "deposit", "withdrawal", etc.
    amount: float
    date: datetime
    description: Optional[str] = None


class BankAccount(BaseModel):
    account_number: str = Field(..., description="Unique account number for the user")
    account_balance: float = Field(..., description="Current balance in the account")
    currency: str = Field(..., description="Currency type (e.g., 'INR')")
    account_type: str = Field(..., description="Type of the account (e.g., 'Savings')")
    transactions: List[Transaction] = Field(
        default_factory=list,
        description="List of transactions for the account",
    )
