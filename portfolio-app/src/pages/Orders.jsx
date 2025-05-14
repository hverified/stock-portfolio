import React, { useState, useEffect } from "react";
import currencyFormat from "../utils/helperFunction";
import Header from "../components/Header";

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
            // year: "numeric",
        });
    };

    useEffect(() => {
        fetchStockData();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
            <Header />
            <div className="max-w-6xl mx-auto space-y-8 mt-8"> {/* Added mt-8 here */}
                {loading ? (
                    <div className="flex items-center justify-center min-h-[50vh]">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-emerald-500"></div>
                    </div>
                ) : (
                    <>
                        {/* Net Profit/Loss Summary Card */}
                        <div
                            className={`p-4 rounded-2xl shadow-lg bg-white transform hover:scale-105 transition-transform duration-300 animate-fade-in`}
                        >
                            <div>
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
                                <p className="text-xs text-gray-500">Net P/L</p>
                                <p className="text-lg font-bold text-gray-800">
                                    ₹{currencyFormat(netProfitLoss.toFixed(2))}
                                </p>
                                <p
                                    className={`text-sm font-medium ${netProfitLoss >= 0 ? "text-green-600" : "text-red-600"}`}
                                >
                                    {netProfitLoss >= 0 ? "+" : "-"}₹
                                    {currencyFormat(Math.abs(netProfitLoss).toFixed(2))} (
                                    {Math.abs(netProfitLoss / 1000).toFixed(2)}%)
                                </p>
                            </div>
                        </div>

                        {/* Main white card container for stock orders */}
                        <div className="p-4 rounded-2xl shadow-lg bg-white transform hover:scale-105 transition-transform duration-300 animate-fade-in">
                            <div className="space-y-4">
                                <h3 className="text-xl font-semibold text-gray-800 mb-3">Order Summary</h3>
                                <p className="text-xs text-gray-500 mb-4">
                                    Last updated at{" "}
                                    {new Date().toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </p>

                                {stockOrders.length > 0 ? (
                                    stockOrders.map((stock, index) => (
                                        <div key={stock.symbol + index}>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div
                                                    className={`p-3 rounded-xl flex shadow-lg items-center space-x-3
                                                         ${!!!stock.sell_price ? "border-yellow-400 bg-yellow-50" : stock.sell_price > stock.buy_price
                                                            ? "border-green-400 bg-green-50"
                                                            : "border-red-300 bg-red-50"
                                                        }`}
                                                >
                                                    <svg
                                                        className={`w-6 h-6 ${!!!stock.sell_price ? "text-yellow-600" :
                                                            stock.sell_price > stock.buy_price ? "text-green-600" : "text-red-600"}`}
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="2"
                                                            d={stock.sell_price > stock.buy_price
                                                                ? "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                                                                : "M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"}
                                                        ></path>
                                                    </svg>
                                                    <div>
                                                        <p className="text-xs text-gray-500">{formatDate(stock.date)}</p>
                                                        <p className="text-sm font-semibold text-gray-800">
                                                            {stock.symbol}
                                                        </p>
                                                        <p className="text-sm">{currencyFormat((stock.quantity * stock.buy_price).toFixed(2))}</p>
                                                        <p
                                                            className={`text-xs font-medium ${!!!stock.sell_price ? "text-yellow-400" : stock.sell_price > stock.buy_price ? "text-green-600" : "text-red-500"}`}
                                                        >
                                                            {stock.sell_price > stock.buy_price ? "+" : "-"}
                                                            ₹{currencyFormat(
                                                                Math.abs((stock.sell_price - stock.buy_price) * stock.quantity).toFixed(2)
                                                            )}
                                                            ({(((stock.sell_price - stock.buy_price) * 100) / stock.buy_price).toFixed(2)}%)
                                                        </p>
                                                    </div>
                                                </div>
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
                    </>
                )}
            </div>
        </div >
    );
};

export default Orders;
