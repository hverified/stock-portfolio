import React, { useState, useEffect } from "react";
import currencyFormat from "../utils/helperFunction";

const Orders = () => {
    const [stockOrders, setStockOrders] = useState([]);
    const [netProfitLoss, setNetProfitLoss] = useState(0);
    const [loading, setLoading] = useState(true);
    const baseUrl = import.meta.env.VITE_API_BASE_URL;

    const fetchStockData = async () => {
        try {
            setLoading(true);
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
        } finally {
            setLoading(false);
        }
    };

    const calculateNetProfitLoss = (data) => {
        const totalProfitLoss = data.reduce((acc, stock) => {
            if (stock.sell_price > 0) {
                const profitLoss = (stock.sell_price - stock.buy_price) * stock.quantity;
                return acc + profitLoss;
            }
            return acc;
        }, 0);
        setNetProfitLoss(totalProfitLoss);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };

    useEffect(() => {
        fetchStockData();
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 p-3">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Stocks Dashboard</h2>

            {loading ? (
                <div className="flex items-center justify-center min-h-[50vh]">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-emerald-500"></div>
                </div>
            ) : (
                <div className="space-y-3 max-w-md mx-auto">
                    {/* Net Profit/Loss Summary Card */}
                    <div
                        className={`p-3 rounded-2xl shadow-lg ${netProfitLoss >= 0
                            ? "border-green-400 bg-gradient-to-r from-emerald-50 to-emerald-100"
                            : "border-red-400 bg-gradient-to-r from-red-50 to-red-100"
                            } flex items-center space-x-3 bg-white`}
                    >
                        <svg
                            className={`w-6 h-6 ${netProfitLoss >= 0 ? "text-green-600" : "text-red-600"}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d={netProfitLoss >= 0
                                    ? "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                                    : "M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"}
                            ></path>
                        </svg>
                        <div>
                            <p className="text-sm text-gray-500">Net P/L</p>
                            <p
                                className={`text-lg font-bold ${netProfitLoss >= 0 ? "text-green-600" : "text-red-600"}`}
                            >
                                ₹{currencyFormat(netProfitLoss.toFixed(2))}
                            </p>
                        </div>
                    </div>

                    {/* Main white card container for stock orders */}
                    <div className="bg-white rounded-xl shadow-md p-4">
                        <div className="space-y-2">
                            <h3 className="text-xl font-semibold text-gray-800 mb-3">Orders</h3>

                            {stockOrders.length > 0 ? (
                                stockOrders.map((stock, index) => (
                                    <div
                                        key={stock.symbol + index}
                                        className={`p-3 rounded-xl shadow-sm flex items-center justify-between border-l-4 ${stock.status === "bought"
                                            ? "border-green-400 bg-gradient-to-r from-green-50 to-green-100"
                                            : stock.status === "sold"
                                                ? "border-gray-300 bg-gradient-to-r from-gray-50 to-gray-100"
                                                : "border-yellow-400 bg-gradient-to-r from-yellow-50 to-yellow-100"
                                            }`}
                                    >
                                        <div className="flex items-center space-x-3">
                                            <div
                                                className={`w-2 h-2 rounded-full ${stock.status === "bought"
                                                    ? "bg-green-500"
                                                    : stock.status === "sold"
                                                        ? "bg-gray-500"
                                                        : "bg-yellow-500"
                                                    }`}
                                            />
                                            <div>
                                                <h3 className="text-sm font-semibold text-gray-800">{stock.symbol}</h3>
                                                <p className="text-xs text-gray-500">
                                                    Qty: {stock.quantity} | Buy: ₹{currencyFormat(stock.buy_price.toFixed(2))}
                                                </p>
                                                <p className="text-xs text-gray-400">{formatDate(stock.date)}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span
                                                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${stock.status === "bought"
                                                    ? "bg-green-100 text-green-800"
                                                    : stock.status === "sold"
                                                        ? "bg-gray-100 text-gray-800"
                                                        : "bg-yellow-100 text-yellow-800"
                                                    }`}
                                            >
                                                {stock.status.charAt(0).toUpperCase() + stock.status.slice(1)}
                                            </span>
                                            {stock.sell_price > 0 && (
                                                <p
                                                    className={`text-sm font-medium mt-1 ${stock.sell_price > stock.buy_price
                                                        ? "text-green-600"
                                                        : "text-red-600"
                                                        }`}
                                                >
                                                    ₹{currencyFormat(
                                                        Math.abs((stock.sell_price - stock.buy_price) * stock.quantity).toFixed(2)
                                                    )}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-4">
                                    <p className="text-gray-500 text-sm">No stock orders available.</p>
                                    <p className="text-gray-400 text-xs">Your trading data will appear here.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Orders;