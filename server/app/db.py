from pymongo import MongoClient
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

# MongoDB configuration
MONGO_URI = os.getenv("DATABASE_URL")
DATABASE_NAME = os.getenv("DATABASE_NAME", "stock_portfolio")

# Initialize MongoDB client
client = MongoClient(MONGO_URI)
db = client[DATABASE_NAME]

# Collections for the app
db.users = db["users"]
db.bank_accounts = db["bank_accounts"]
db.portfolios = db["portfolios"]
