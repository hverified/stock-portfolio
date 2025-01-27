import os
import json
import uuid
import logging
from datetime import datetime

from app.routes.scrape_table import scrape_table_to_json


async def fetch_stock_data():
    """
    Fetch stock data from a given URL and update the JSON file with the stock
    having the highest percentage change for the current date.
    """
    try:
        # Configuration
        url = "https://chartink.com/screener/rsi-greater-than-60-5109"
        table_id = "DataTables_Table_0"
        file_name = "stock_screener.json"
        scrip_master_file = "api_scrip_master.json"
        logging.info(f"Fetching stock data at: {datetime.now()}")

        # Fetch data
        table_data = scrape_table_to_json(url, table_id)

        # Handle empty table_data
        if not table_data or (
            len(table_data) == 1
            and table_data[0].get("Sr.") == "No stocks filtered in the Scan"
        ):
            logging.warning("No valid stock data available to process.")
            return

        logging.info(f"Stock data fetched at: {datetime.now()}")

        # Extract stock with the highest % change
        raw_max_stock = max(table_data, key=lambda x: float(x["% Chg"].strip("%")))
        current_date = datetime.now().strftime("%Y-%m-%d")
        # Load scrip master data
        scrip_master_data = load_json(scrip_master_file)

        # Find security ID for the stock
        security_id = find_security_id(scrip_master_data, raw_max_stock.get("Symbol"))

        updated_stock = {
            "id": str(uuid.uuid4())[0:8],
            "stock_name": raw_max_stock.get("Stock Name"),
            "symbol": raw_max_stock.get("Symbol"),
            "change": float(raw_max_stock.get("% Chg").strip("%")),
            "price": raw_max_stock.get("Price"),
            "volume": raw_max_stock.get("Volume"),
            "security_id": security_id,
            "quantity": 0,
            "status": "scanned",
            "date": current_date,
        }

        # Load existing data
        updated_data = load_json(file_name)

        # Update data
        updated_data = update_json_data(updated_data, updated_stock, current_date)

        # Save updated data
        save_json(file_name, updated_data)

        logging.info(f"Data updated in {file_name} successfully!")

    except Exception as e:
        logging.error(f"Failed to fetch or process stock data: {str(e)}")


def find_security_id(scrip_master_data, symbol):
    """
    Find the SEM_SMST_SECURITY_ID for a given symbol in the scrip master data.
    """
    for entry in scrip_master_data:
        if entry.get("SEM_TRADING_SYMBOL") == symbol:
            return entry.get("SEM_SMST_SECURITY_ID")
    logging.warning(f"Security ID not found for symbol: {symbol}")
    return None


def load_json(file_name):
    """Load JSON data from a file."""
    if os.path.exists(file_name):
        with open(file_name, "r") as file:
            try:
                return json.load(file)
            except json.JSONDecodeError:
                logging.warning(
                    f"File {file_name} is empty or corrupted. Resetting file."
                )
    return []


def update_json_data(existing_data, new_stock, current_date):
    """
    Update the existing JSON data with the new stock for the current date.
    If an entry already exists for the date, replace it.
    """
    for entry in existing_data:
        if entry["date"] == current_date:
            entry.update(new_stock)
            return existing_data
    existing_data.append(new_stock)
    return existing_data


def save_json(file_name, data):
    """Save data to a JSON file."""
    with open(file_name, "w") as file:
        json.dump(data, file, indent=4)
