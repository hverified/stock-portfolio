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

    useEffect(() => {
        fetchStockData();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 pb-20">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 tracking-tight">Stock Orders</h2>

            {loading ? (
                <div className="flex items-center justify-center min-h-[50vh]">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-emerald-500"></div>
                </div>
            ) : (
                <div className="space-y-8 max-w-6xl mx-auto">
                    {/* Net Profit/Loss Summary Card */}
                    <div
                        className={`p-4 rounded-2xl shadow-lg bg-white transform hover:scale-105 transition-transform duration-300 flex items-center space-x-4 ${netProfitLoss >= 0 ? "border-green-400" : "border-red-400"
                            }`}
                    >
                        <svg
                            className="w-6 h-6 text-gray-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                            ></path>
                        </svg>
                        <div>
                            <p className="text-xs text-gray-500 font-medium">Net Profit/Loss</p>
                            <p
                                className={`text-2xl font-bold mt-1 ${netProfitLoss >= 0 ? "text-green-600" : "text-red-600"
                                    }`}
                            >
                                ₹ {currencyFormat(netProfitLoss.toFixed(2))}
                            </p>
                        </div>
                    </div>

                    {/* Stock Order Cards */}
                    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 animate-fade-in">
                        {stockOrders.length > 0 ? (
                            stockOrders.map((stock, index) => (
                                <div
                                    key={index}
                                    className={`p-4 rounded-2xl shadow-lg transform hover:scale-105 transition-transform duration-300 border-l-4 ${stock.status === "bought"
                                        ? "bg-gradient-to-br from-green-50 to-white border-green-400"
                                        : "bg-gradient-to-br from-gray-50 to-white border-gray-300"
                                        }`}
                                >
                                    <div className="flex justify-between items-center mb-3">
                                        <div className="flex items-center space-x-2">
                                            <span
                                                className={`w-2 h-2 rounded-full ${stock.status === "bought" ? "bg-green-500" : "bg-gray-500"
                                                    }`}
                                            ></span>
                                            <h3 className="text-lg font-bold text-gray-800">{stock.symbol}</h3>
                                        </div>
                                        <span
                                            className={`text-xs font-semibold px-2 py-1 rounded-full flex items-center space-x-1 ${stock.status === "bought"
                                                ? "bg-green-100 text-green-700"
                                                : "bg-gray-100 text-gray-700"
                                                }`}
                                        >
                                            {stock.status === "bought" ? (
                                                <svg
                                                    className="w-4 h-4"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                    ></path>
                                                </svg>
                                            ) : (
                                                <svg
                                                    className="w-4 h-4"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                                                    ></path>
                                                </svg>
                                            )}
                                            <span>{stock.status.charAt(0).toUpperCase() + stock.status.slice(1)}</span>
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-500 mb-3">{stock.date}</p>
                                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                                        <div className="flex items-center space-x-1">
                                            <svg
                                                className="w-4 h-4 text-gray-400"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M20 7l-10 6-10-6m10 13V3m-8 10h16"
                                                ></path>
                                            </svg>
                                            <p>
                                                <span className="font-medium">Quantity:</span> {stock.quantity}
                                            </p>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            <svg
                                                className="w-4 h-4 text-gray-400"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                ></path>
                                            </svg>
                                            <p>
                                                <span className="font-medium">Buy:</span> ₹
                                                {currencyFormat(stock.buy_price.toFixed(2))}
                                            </p>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            <svg
                                                className="w-4 h-4 text-gray-400"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                                                ></path>
                                            </svg>
                                            <p>
                                                <span className="font-medium">Invested:</span> ₹
                                                {currencyFormat((stock.buy_price * stock.quantity).toFixed(2))}
                                            </p>
                                        </div>
                                        {stock.sell_price > 0 && (
                                            <div className="flex items-center space-x-1">
                                                <svg
                                                    className="w-4 h-4 text-gray-400"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                                                    ></path>
                                                </svg>
                                                <p>
                                                    <span className="font-medium">Sell:</span> ₹
                                                    {currencyFormat(stock.sell_price.toFixed(2))}
                                                </p>
                                            </div>
                                        )}
                                        {stock.sell_price > 0 && (
                                            <div className="col-span-2 flex items-center justify-end space-x-1">
                                                <svg
                                                    className={`w-4 h-4 ${(stock.sell_price - stock.buy_price) * stock.quantity > 0
                                                        ? "text-green-600"
                                                        : "text-red-600"
                                                        }`}
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d={
                                                            (stock.sell_price - stock.buy_price) * stock.quantity > 0
                                                                ? "M5 10l7-7m0 0l7 7m-7-7v18"
                                                                : "M19 14l-7 7m0 0l-7-7m7 7V3"
                                                        }
                                                    ></path>
                                                </svg>
                                                <p
                                                    className={`font-medium ${(stock.sell_price - stock.buy_price) * stock.quantity > 0
                                                        ? "text-green-600"
                                                        : "text-red-600"
                                                        }`}
                                                >
                                                    P/L: ₹
                                                    {currencyFormat(
                                                        Math.abs(
                                                            (stock.sell_price - stock.buy_price) * stock.quantity
                                                        ).toFixed(2)
                                                    )}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-3 text-center py-10">
                                <p className="text-gray-500 text-lg">No stock orders available.</p>
                                <p className="text-gray-400 text-sm">
                                    Your trading data will appear here once available.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Orders;