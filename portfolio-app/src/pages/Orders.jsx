import React, { useState, useEffect } from "react";
import currencyFormat from "../utils/helperFunction";

const Orders = () => {
    const [stockOrders, setStockOrders] = useState([]);
    const [netProfitLoss, setNetProfitLoss] = useState(0);
    const baseUrl = `${import.meta.env.VITE_API_BASE_URL}`;

    const fetchStockData = async () => {
        try {
            const response = await fetch(`${baseUrl}/screener/stocks`);
            const data = await response.json();
            if (Array.isArray(data)) {
                setStockOrders(data);
                calculateNetProfitLoss(data);
            } else {
                setStockOrders([]);
                setNetProfitLoss(0);
            }
        } catch (error) {
            console.error("Error fetching stock data:", error);
            setStockOrders([]);
            setNetProfitLoss(0);
        }
    };

    const calculateNetProfitLoss = (data) => {
        const totalProfitLoss = data.reduce((acc, stock) => {
            if (stock.sell_price > 0) {
                const profitLoss =
                    (stock.sell_price - stock.buy_price) * stock.quantity;
                return acc + profitLoss;
            }
            return acc;
        }, 0);
        setNetProfitLoss(totalProfitLoss);
    };

    useEffect(() => {
        fetchStockData();
    }, []);

    return (
        <div className="p-6 bg-gradient-to-b from-blue-50 to-gray-100 min-h-screen pb-20">
            <h2 className="text-xl font-semibold text-gray-700 mb-6">Stock Orders</h2>

            {/* Net Profit/Loss Summary Card */}
            <div className="mb-6">
                <div className="p-4 rounded-lg shadow-md bg-white border-l-4 border-blue-500 flex justify-between items-center">
                    <h3 className="text-lg text-gray-700">Net Profit/Loss:</h3>
                    <p
                        className={`text-lg font-semibold ${netProfitLoss >= 0 ? "text-green-600" : "text-red-600"}`}
                    >
                        ₹ {currencyFormat(netProfitLoss.toFixed(2))}
                    </p>
                </div>
            </div>

            {/* Stock Cards */}
            <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {stockOrders.length > 0 ? (
                    stockOrders.map((stock, index) => (
                        <div
                            key={index}
                            className={`p-3 rounded-xl shadow-md transition-transform transform hover:scale-105 bg-white border-l-4 ${stock.status === "bought"
                                ? "border-yellow-500"
                                : stock.status === "sold"
                                    ? "border-gray-300"
                                    : "border-yellow-500"
                                }`}
                        >
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="text-sm font-bold text-gray-800">{stock.symbol}</h3>
                                <span
                                    className={`text-xs font-semibold px-2 py-1 rounded-full ${stock.status === "bought"
                                        ? "bg-green-100 text-green-700"
                                        : stock.status === "sold"
                                            ? "bg-gray-100 text-gray-700"
                                            : "bg-yellow-100 text-yellow-700"
                                        }`}
                                >
                                    {stock.status.charAt(0).toUpperCase() + stock.status.slice(1)}
                                </span>
                            </div>
                            <p className="text-xs text-gray-500 mb-2">{stock.date}</p>
                            <div className="text-xs text-gray-600 grid grid-cols-2 gap-2">
                                <p>
                                    <span className="font-medium">Quantity:</span> {stock.quantity}
                                </p>
                                <p>
                                    <span className="font-medium">Buy:</span> ₹{currencyFormat(stock.buy_price.toFixed(2))}
                                </p>
                                <p>
                                    <span className="font-medium">Invested:</span> ₹
                                    {currencyFormat((stock.buy_price * stock.quantity).toFixed(2))}
                                </p>
                                {stock.sell_price > 0 && (
                                    <p>
                                        <span className="font-medium">Sell:</span> ₹{currencyFormat(stock.sell_price.toFixed(2))}
                                    </p>
                                )}
                                {stock.sell_price > 0 && (
                                    <p className="col-span-2 font-medium text-right">
                                        P/L:{" "}
                                        <span
                                            className={`${(stock.sell_price - stock.buy_price) * stock.quantity > 0
                                                ? "text-green-600"
                                                : "text-red-600"
                                                } font-bold`}
                                        >
                                            ₹{currencyFormat(Math.abs(
                                                (stock.sell_price - stock.buy_price) * stock.quantity
                                            ).toFixed(2))}
                                        </span>
                                    </p>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-500">No stock orders available.</p>
                )}
            </div>
        </div>
    );
};

export default Orders;
