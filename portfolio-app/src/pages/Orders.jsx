import React, { useState, useEffect } from "react";
import currencyFormat from "../utils/helperFunction";
import Header from "../components/Header";
import BaseCard from "../components/BaseCard";

const Orders = () => {
    const [stockOrders, setStockOrders] = useState([]);
    const [netProfitLoss, setNetProfitLoss] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"; // Fallback URL

    const fetchStockData = async () => {
        console.log("fetchStockData called with baseUrl:", baseUrl);
        try {
            setLoading(true);
            setError(null);
            const url = `${baseUrl}/screener/stocks`;
            console.log("Fetching from URL:", url);
            const response = await fetch(url);
            console.log("Fetch response status:", response.status);

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            console.log("Fetched data:", data);

            if (Array.isArray(data)) {
                const updatedData = data.map(stock => ({
                    ...stock,
                    oneWeekLaterDate: new Date(new Date(stock.date).getTime() + 7 * 24 * 60 * 60 * 1000)
                }));
                setStockOrders(updatedData);
                calculateNetProfitLoss(updatedData);
            } else {
                setStockOrders([]);
                setNetProfitLoss(0);
                setError("Received invalid data format from server");
            }
        } catch (error) {
            console.error("Error fetching stock data:", error);
            setStockOrders([]);
            setNetProfitLoss(0);
            setError(error.message || "Failed to fetch stock data");
        } finally {
            setLoading(false);
            console.log("fetchStockData completed, loading:", false);
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
        });
    };

    useEffect(() => {
        console.log("useEffect triggered for fetchStockData");
        fetchStockData();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 sm:pb-24">
            <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
                <Header />
                {loading ? (
                    <div className="flex items-center justify-center min-h-[50vh]">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-emerald-500"></div>
                    </div>
                ) : error ? (
                    <BaseCard className="w-full" padding="p-4 sm:p-6">
                        <div className="text-center py-6">
                            <p className="text-red-500 text-sm sm:text-base">{error}</p>
                            <button
                                onClick={fetchStockData}
                                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                            >
                                Retry
                            </button>
                        </div>
                    </BaseCard>
                ) : (
                    <>
                        {/* Net Profit/Loss Summary Card */}
                        <BaseCard className="w-full" padding="p-4 sm:p-6">
                            <div className="flex items-center space-x-4">
                                <svg
                                    className={`w-6 h-6 sm:w-7 sm:h-7 ${netProfitLoss >= 0 ? "text-green-600" : "text-red-600"} flex-shrink-0`}
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
                                    <p className="text-xs sm:text-sm text-gray-500">Net P/L</p>
                                    <p className="text-lg sm:text-xl font-bold text-gray-800">
                                        ₹{currencyFormat(netProfitLoss.toFixed(2))}
                                    </p>
                                    <p
                                        className={`text-sm sm:text-base font-medium ${netProfitLoss >= 0 ? "text-green-600" : "text-red-600"}`}
                                    >
                                        {netProfitLoss >= 0 ? "+" : "-"}₹
                                        {currencyFormat(Math.abs(netProfitLoss).toFixed(2))} (
                                        {Math.abs(netProfitLoss / 1000).toFixed(2)}%)
                                    </p>
                                </div>
                            </div>
                        </BaseCard>

                        {/* Order Summary Card */}
                        <BaseCard className="w-full" padding="p-6 sm:p-8">
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">
                                        Order Summary
                                    </h3>
                                    <p className="text-xs sm:text-sm text-gray-500 mb-6">
                                        Last updated at{" "}
                                        {new Date().toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </p>
                                </div>
                                {stockOrders.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {stockOrders.map((stock, index) => (
                                            <div
                                                key={stock.symbol + index}
                                                className={`p-3 sm:p-4 rounded-lg shadow-lg ${!stock.sell_price
                                                    ? "bg-yellow-50/80"
                                                    : stock.sell_price > stock.buy_price
                                                        ? "bg-green-50/80"
                                                        : "bg-red-50/80"
                                                    } flex items-center space-x-2 hover:bg-opacity-100 hover:shadow-md transition-all duration-200 animate-fade-in-up`}
                                            >
                                                <div className="flex-1 grid grid-cols-2 gap-2">
                                                    <div className="space-y-1">
                                                        <p className="text-xs sm:text-sm text-gray-500">
                                                            {formatDate(stock.date)}
                                                        </p>
                                                        <p className="text-sm sm:text-base font-semibold text-gray-800 truncate">
                                                            {stock.symbol}
                                                        </p>
                                                        <p className="text-xs sm:text-sm text-gray-600">
                                                            Qty: {stock.quantity}
                                                        </p>
                                                        <div className="pt-2 border-t border-gray-200">
                                                            <p className="text-xs sm:text-sm text-gray-700 font-medium">
                                                                {formatDate(stock.oneWeekLaterDate)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-1 text-right">
                                                        <p className="text-xs sm:text-sm text-gray-600">
                                                            Buy: ₹{currencyFormat(stock.buy_price.toFixed(2))}
                                                        </p>
                                                        <p className="text-xs sm:text-sm text-gray-600">
                                                            Sell: ₹
                                                            {stock.sell_price
                                                                ? currencyFormat(stock.sell_price.toFixed(2))
                                                                : "N/A"}
                                                        </p>
                                                        <p
                                                            className={`text-xs sm:text-sm font-medium ${!stock.sell_price
                                                                ? "text-yellow-600"
                                                                : stock.sell_price > stock.buy_price
                                                                    ? "text-green-600"
                                                                    : "text-red-600"
                                                                }`}
                                                        >
                                                            {stock.sell_price
                                                                ? `${stock.sell_price > stock.buy_price ? "+" : "-"}₹${currencyFormat(
                                                                    Math.abs(
                                                                        (stock.sell_price - stock.buy_price) * stock.quantity
                                                                    ).toFixed(2)
                                                                )} (${Math.abs(
                                                                    ((stock.sell_price - stock.buy_price) * 100) /
                                                                    stock.buy_price
                                                                ).toFixed(2)}%)`
                                                                : "Pending"}
                                                        </p>
                                                        <div className="pt-2 border-t border-gray-200">
                                                            <p className="text-xs sm:text-sm text-gray-600">
                                                                Sell (1W): ₹
                                                                {stock.sell_price_at_1wk
                                                                    ? currencyFormat(stock.sell_price_at_1wk.toFixed(2))
                                                                    : "N/A"}
                                                            </p>
                                                            <p
                                                                className={`text-xs sm:text-sm font-medium ${!stock.sell_price_at_1wk
                                                                    ? "text-yellow-600"
                                                                    : stock.sell_price_at_1wk > stock.buy_price
                                                                        ? "text-green-600"
                                                                        : "text-red-600"
                                                                    }`}
                                                            >
                                                                {stock.sell_price_at_1wk
                                                                    ? `${stock.sell_price_at_1wk > stock.buy_price ? "+" : "-"}₹${currencyFormat(
                                                                        Math.abs(
                                                                            (stock.sell_price_at_1wk - stock.buy_price) * stock.quantity
                                                                        ).toFixed(2)
                                                                    )} (${Math.abs(
                                                                        ((stock.sell_price_at_1wk - stock.buy_price) * 100) /
                                                                        stock.buy_price
                                                                    ).toFixed(2)}%)`
                                                                    : "Pending"}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-6">
                                        <p className="text-gray-500 text-sm sm:text-base">
                                            No stock orders available.
                                        </p>
                                        <p className="text-gray-400 text-xs sm:text-sm mt-1">
                                            Your trading data will appear here.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </BaseCard>
                    </>
                )}
            </div>
        </div>
    );
};

export default Orders;