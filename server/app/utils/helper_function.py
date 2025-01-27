import os
import json
import logging
import yfinance as yf


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


def get_stock_data(file_name, date=None, status=None):
    """
    Fetch stock details from the given JSON file filtered by date and status.

    :param file_name: The JSON file containing stock entries.
    :param date: Filter by date (optional).
    :param status: Filter by status (optional).
    :return: Filtered stock data.
    """
    stock_data = load_json(file_name)
    if not stock_data:
        return []

    filtered_data = stock_data
    if date:
        filtered_data = [stock for stock in filtered_data if stock.get("date") == date]
    if status:
        filtered_data = [
            stock for stock in filtered_data if stock.get("status") == status
        ]

    return filtered_data


def update_stock_status(file_name, stock_id, quantity, new_status):
    """
    Update the status and quantity of a stock entry in the JSON file by its ID.

    :param file_name: The JSON file containing stock entries.
    :param stock_id: The ID of the stock to update.
    :param quantity: Updated quantity.
    :param new_status: The new status to set.
    """
    try:
        stock_data = load_json(file_name)
        if not stock_data:
            logging.warning(f"No data found in {file_name}.")
            return

        updated = False
        for stock in stock_data:
            if stock.get("id") == stock_id:
                stock["status"] = new_status
                stock["quantity"] = quantity
                updated = True
                break

        if updated:
            with open(file_name, "w") as file:
                json.dump(stock_data, file, indent=4)
            logging.info(f"Updated stock with ID {stock_id} to status '{new_status}'.")
        else:
            logging.warning(f"Stock with ID {stock_id} not found in {file_name}.")
    except Exception as e:
        logging.error(f"Failed to update stock status: {str(e)}")


def get_current_price(stock_symbol):
    """Fetch the current price of a stock from Yahoo Finance."""
    try:
        ticker = yf.Ticker(stock_symbol + ".NS")
        price_data = ticker.history(period="1d", interval="1m")

        if not price_data.empty:
            return price_data["Close"].iloc[-1]
        else:
            raise ValueError(f"No price data available for {stock_symbol}.")
    except Exception as e:
        logging.error(f"Error fetching price for {stock_symbol}: {str(e)}")
        raise


def save_executed_order(file_name, order_data):
    """Append executed order to a JSON file."""
    try:
        existing_data = load_json(file_name) or []
        existing_data.append(order_data)
        with open(file_name, "w") as file:
            json.dump(existing_data, file, indent=4)
    except Exception as e:
        logging.error(f"Failed to save order data: {str(e)}")
