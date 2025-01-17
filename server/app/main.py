from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import auth, bank, portfolio, market, scrape_table, scanner
from app.core.config import settings
from fastapi_utilities import repeat_at, repeat_every
import os
from dotenv import load_dotenv
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from datetime import datetime
import pytz

load_dotenv()

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


DATA_FILE = "percent_data.txt"  # File to store the previous percentage data


@scanner.router.on_event("startup")
@repeat_at(cron=os.getenv("CRON_JOB_TIME"))
async def get_upper_circuit():
    try:
        url = "https://chartink.com/screener/btst-ema-rsi-volume-2"
        table_id = "DataTables_Table_0"
        table_data = scrape_table.scrape_table_to_json(url, table_id)

        # Check and handle each stock's % Chg
        for stock in table_data:
            try:
                percent_change = float(stock["% Chg"].strip("%"))
                if should_send_email(stock["Symbol"], percent_change):
                    send_email(stock)
                    update_percent_data(stock["Symbol"], percent_change)
            except ValueError as e:
                print(f"Failed to process % Chg for {stock['Stock Name']}: {e}")

        return {"data": table_data}
    except Exception as e:
        print(f"Failed to scrape table data: {str(e)}")


def should_send_email(symbol, percent_change):
    """Check if the email should be sent based on the percent change."""
    previous_data = load_percent_data()
    previous_percent = previous_data.get(symbol, None)

    if previous_percent is None or percent_change >= previous_percent + 1:
        return True
    return True


def update_percent_data(symbol, percent_change):
    """Update the percent data for the symbol in the file."""
    previous_data = load_percent_data()
    previous_data[symbol] = percent_change

    # Save the updated data back to the file
    with open(DATA_FILE, "w") as f:
        for sym, perc in previous_data.items():
            f.write(f"{sym}:{perc}\n")


def load_percent_data():
    """Load the percent data from the file."""
    if not os.path.exists(DATA_FILE):
        return {}

    data = {}
    with open(DATA_FILE, "r") as f:
        for line in f:
            if ":" in line:
                symbol, percent = line.strip().split(":")
                data[symbol] = float(percent)
    return data


def send_email(stock):
    """Send email notification if % Chg condition is met."""
    sender_email = os.getenv("SENDER_EMAIL")
    receiver_email = os.getenv("RECEIVER_EMAIL")
    password = os.getenv("EMAIL_PASSWORD")

    # Get the current time in UTC
    utc_now = datetime.now(pytz.utc)

    # Format the datetime in the desired format
    formatted_time = utc_now.astimezone(pytz.timezone("Asia/Kolkata")).strftime(
        "%d-%b %I:%M%p"
    )
    # Email content
    subject = f"🚨 Stock Alert at {formatted_time}: {stock['Symbol']} 🚨"
    body = f"""
    <!DOCTYPE html>
    <html>
        <head>
            <style>
                body {{
                    font-family: Arial, sans-serif;
                    background-color: #f9f9f9;
                    margin: 20px;
                    color: #333;
                }}
                .container {{
                    background-color: #fff;
                    padding: 20px;
                    border: 1px solid #ddd;
                    border-radius: 5px;
                }}
                h2 {{
                    color: #0056b3;
                    margin-top: 0;
                }}
                table {{
                    width: 100%;
                    border-collapse: collapse;
                    margin: 20px 0;
                }}
                th, td {{
                    border: 1px solid #ddd;
                    padding: 10px;
                    text-align: left;
                }}
                th {{
                    background-color: #f4f4f4;
                    color: #333;
                }}
                .footer {{
                    margin-top: 20px;
                    font-size: 0.9em;
                    color: #555;
                }}
            </style>
        </head>
        <body>
            <div class="container">
                <h2>Stock Alert</h2>
                <p>The following stock has triggered your alert:</p>
                <table>
                    <tr>
                        <th>Stock Name</th>
                        <td>{stock['Stock Name']}</td>
                    </tr>
                    <tr>
                        <th>Symbol</th>
                        <td>{stock['Symbol']}</td>
                    </tr>
                    <tr>
                        <th>Price</th>
                        <td>{stock['Price']}</td>
                    </tr>
                    <tr>
                        <th>% Change</th>
                        <td>{stock['% Chg']}</td>
                    </tr>
                    <tr>
                        <th>Volume</th>
                        <td>{stock['Volume']}</td>
                    </tr>
                </table>
                <div class="footer">
                    <p>This is an automated notification. Please verify the details before making any trading decisions.</p>
                </div>
            </div>
        </body>
    </html>
    """

    # Create the email
    msg = MIMEMultipart()
    msg["From"] = sender_email
    msg["To"] = receiver_email
    msg["Subject"] = subject
    msg.attach(MIMEText(body, "html"))  # Attach HTML content

    # Send the email
    try:
        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.starttls()
            server.login(sender_email, password)
            server.sendmail(sender_email, receiver_email.split(","), msg.as_string())
            print(f"Email sent for stock: {stock['Stock Name']}")
    except Exception as e:
        print(f"Failed to send email: {e}")


@app.get("/")
async def root():
    return {"message": "Welcome to the Stock Portfolio App"}
