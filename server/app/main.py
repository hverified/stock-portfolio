from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import auth, bank, portfolio, market, scrape_table, scanner
from app.core.config import settings

app = FastAPI(
    title=settings.APP_NAME,
    description="Manage your stock portfolio",
    version="1.0.0",
    contact={
        "name": "Mohd Khalid Siddiqui",
        "email": "khalidsiddiqui9550@gmail.com",
    },
    license_info={
        "name": "Apache 2.0",
        "url": "https://www.apache.org/licenses/LICENSE-2.0.html",
    },
    docs_url=settings.DOCS_URL,
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CLIENT_URL.split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Register the routes
app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(bank.router, prefix="/bank", tags=["Bank Account"])
app.include_router(portfolio.router, prefix="/portfolio", tags=["Portfolio Management"])
app.include_router(market.router, prefix="/market", tags=["Market"])
app.include_router(scrape_table.router, prefix="/scrape", tags=["Scrape Table"])
app.include_router(scanner.router, prefix="/scanner", tags=["Chartlink Scanner"])


@app.get("/")
async def root():
    return {"message": "Welcome to the Stock Portfolio App"}
