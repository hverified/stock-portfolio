import os
from dotenv import load_dotenv

load_dotenv()


class Settings:
    APP_NAME: str = os.getenv("APP_NAME", "FastAPIApp")
    DEBUG: bool = os.getenv("DEBUG", False)
    DATABASE_URL: str = os.getenv("DATABASE_URL")
    SECRET_KEY: str = os.getenv("SECRET_KEY")
    CLIENT_URL: str = os.getenv("CLIENT_URL")
    DOCS_URL: str = os.getenv("DOCS_URL")


settings = Settings()
