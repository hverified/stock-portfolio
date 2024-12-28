from pydantic import BaseModel


class PortfolioItem(BaseModel):
    symbol: str
    quantity: int
    purchase_price: float
