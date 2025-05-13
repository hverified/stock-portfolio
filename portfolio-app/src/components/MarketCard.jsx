import React, { useState, useEffect } from "react";
import axios from "axios";
import currencyFormat from "../utils/helperFunction";

const MarketCard = () => {
    const [marketData, setMarketData] = useState(() => {
        const savedData = localStorage.getItem("marketData");
        return savedData
            ? JSON.parse(savedData)
            : {
                nifty50: { price: 0, change: 0, percentChange: 0 },
                sensex: { price: 0, change: 0, percentChange: 0 },
                lastUpdatedAt: localStorage.getItem("lastUpdatedAt"),
            };
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMarketData = async () => {
            try {
                setLoading(true);
                const response = await axios.get(
                    `${import.meta.env.VITE_API_BASE_URL}/market/market-summary`
                );
                const { nifty_50, sensex } = response.data;

                const updatedData = {
                    nifty50: {
                        price: nifty_50.current_price,
                        change: nifty_50.current_price - nifty_50.previous_close,
                        percentChange:
                            ((nifty_50.current_price - nifty_50.previous_close) /
                                nifty_50.previous_close) *
                            100,
                    },
                    sensex: {
                        price: sensex.current_price,
                        change: sensex.current_price - sensex.previous_close,
                        percentChange:
                            ((sensex.current_price - sensex.previous_close) /
                                sensex.previous_close) *
                            100,
                    },
                    lastUpdatedAt: new Date(),
                };

                setMarketData(updatedData);
                localStorage.setItem("marketData", JSON.stringify(updatedData));
            } catch (error) {
                console.error("Error fetching market data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMarketData();
    }, []);

    return (
        <div
            className="p-4 rounded-2xl shadow-lg bg-white transform hover:scale-105 transition-transform duration-300 animate-fade-in"
        >
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Market Overview</h3>
            {loading ? (
                <div className="flex items-center justify-center h-24">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-emerald-500"></div>
                </div>
            ) : (
                <>
                    <p className="text-xs text-gray-500 mb-4">
                        Last updated at{" "}
                        {new Date(marketData.lastUpdatedAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                        })}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Nifty50 */}
                        <div
                            className={`p-3 rounded-xl ${marketData.nifty50.change >= 0
                                ? "border-green-400 bg-green-50"
                                : "border-red-400 bg-red-50"
                                } flex items-center space-x-3`}
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
                                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                                ></path>
                            </svg>
                            <div>
                                <p className="text-xs text-gray-500">Nifty50</p>
                                <p className="text-lg font-bold text-gray-800">
                                    ₹{currencyFormat(marketData.nifty50.price.toFixed(2))}
                                </p>
                                <p
                                    className={`text-sm font-medium ${marketData.nifty50.change >= 0 ? "text-green-600" : "text-red-600"
                                        }`}
                                >
                                    {marketData.nifty50.change >= 0 ? "+" : "-"}₹
                                    {currencyFormat(Math.abs(marketData.nifty50.change).toFixed(2))} (
                                    {Math.abs(marketData.nifty50.percentChange).toFixed(2)}%)
                                </p>
                            </div>
                        </div>
                        {/* Sensex */}
                        <div
                            className={`p-3 rounded-xl ${marketData.sensex.change >= 0
                                ? "border-green-400 bg-green-50"
                                : "border-red-400 bg-red-50"
                                } flex items-center space-x-3`}
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
                                <p className="text-xs text-gray-500">Sensex</p>
                                <p className="text-lg font-bold text-gray-800">
                                    ₹{currencyFormat(marketData.sensex.price.toFixed(2))}
                                </p>
                                <p
                                    className={`text-sm font-medium ${marketData.sensex.change >= 0 ? "text-green-600" : "text-red-600"
                                        }`}
                                >
                                    {marketData.sensex.change >= 0 ? "+" : "-"}₹
                                    {currencyFormat(Math.abs(marketData.sensex.change).toFixed(2))} (
                                    {Math.abs(marketData.sensex.percentChange).toFixed(2)}%)
                                </p>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default MarketCard;