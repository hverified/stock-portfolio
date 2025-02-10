import logging
from datetime import datetime
from app.core.dhan_client import get_dhan_client
from app.utils.helper_function import (
    get_stock_data,
    get_current_price,
    save_executed_order,
    update_stock_status,
)


async def execute_trade(action):
    """
    Execute a stock trade (buy or sell).

    :param action: "buy" or "sell".
    """
    try:
        logging.info(f"{action.capitalize()}ing stock at: {datetime.now()}")
        file_name = "stock_screener.json"
        orders_file = "executed_orders.json"
        dhan_client = get_dhan_client()

        if action == "buy":
            today_date = datetime.now().strftime("%Y-%m-%d")
            today_stock = get_stock_data(file_name, date=today_date, status="scanned")
            if not today_stock:
                logging.warning("No stock data available for today.")
                return

            stock = today_stock[0]
            fund_details = dhan_client.get_fund_limits()

            if fund_details["status"] != "success":
                logging.error(fund_details["remarks"]['error_message'])
                return

            current_price = float(get_current_price(stock["symbol"]))
            balance = float(fund_details["data"]["availabelBalance"]) - 500
            if balance > 80000:
                balance /= 2
            quantity = int(balance / current_price)

            request_payload = {
                "tag": stock["id"],
                "security_id": str(stock["security_id"]),
                "exchange_segment": dhan_client.NSE,
                "transaction_type": dhan_client.BUY,
                "quantity": quantity,
                "order_type": dhan_client.MARKET,
                "product_type": dhan_client.CNC,
                "price": current_price,
            }

        elif action == "sell":
            stock = get_stock_data(file_name, status="bought")[-1]
            if not stock:
                logging.warning("No stocks to sell.")
                return

            request_payload = {
                "tag": stock["id"],
                "security_id": str(stock["security_id"]),
                "exchange_segment": dhan_client.NSE,
                "transaction_type": dhan_client.SELL,
                "quantity": stock["quantity"],
                "order_type": dhan_client.MARKET,
                "product_type": dhan_client.CNC,
                "price": 0,
            }
        else:
            logging.error(f"Invalid action: {action}")
            return
        response = dhan_client.place_order(**request_payload)
        if response["status"] == "success":
            executed_order = {
                "orderId": response["data"]["orderId"],
                "correlationId": stock["id"],
                "request_payload": request_payload,
                "timestamp": datetime.now().isoformat(),
                "date": datetime.now().strftime("%Y-%m-%d"),
            }

            save_executed_order(orders_file, executed_order)
            logging.info(f"Order executed and saved: {executed_order}")
            order_details = dhan_client.get_order_by_id(response["data"]["orderId"])

            update_stock_status(
                file_name,
                stock["id"],
                request_payload["quantity"],
                order_details["data"][0]["averageTradedPrice"],
                "bought" if action == "buy" else "sold",
            )
        else:
            logging.error(f"Order placement failed: {response}")

    except Exception as e:
        logging.error(f"Failed to {action} stock: {str(e)}")
