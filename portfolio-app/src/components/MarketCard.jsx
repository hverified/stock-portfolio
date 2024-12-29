import React, { useState, useEffect } from "react";
import axios from "axios";

const MarketCard = () => {
    const [marketData, setMarketData] = useState(() => {
        // Fetch previous data from localStorage if available
        console.log(`${import.meta.env.VITE_API_BASE_URL}/market/market-summary`);
        const savedData = localStorage.getItem("marketData");
        return savedData
            ? JSON.parse(savedData)
            : {
                nifty50: {
                    price: 0,
                    change: 0,
                    percentChange: 0,
                },
                sensex: {
                    price: 0,
                    change: 0,
                    percentChange: 0,
                },
            };
    });

    useEffect(() => {
        const fetchMarketData = async () => {
            try {
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
                };

                // Update state and save to localStorage
                setMarketData(updatedData);
                localStorage.setItem("marketData", JSON.stringify(updatedData));
            } catch (error) {
                console.error("Error fetching market data:", error);
            }
        };

        fetchMarketData();
    }, []); // Runs only on initial render

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-secondary">Market Overview</h3>

            <div className="flex justify-between items-center gap-2 mt-4">
                {/* Nifty50 Data */}
                <div className="mr-4">
                    <p className="text-sm text-gray-500">Nifty50</p>
                    <p className="text-md font-semibold">
                        {`₹${marketData.nifty50.price.toLocaleString()}`}
                    </p>
                    <p
                        className={`text-sm font-medium ${marketData.nifty50.change >= 0
                            ? "text-green-500"
                            : "text-red-500"
                            }`}
                    >
                        {marketData.nifty50.change >= 0
                            ? `+₹${marketData.nifty50.change.toFixed(2)}`
                            : `-₹${Math.abs(marketData.nifty50.change).toFixed(2)}`}
                        {" "}
                        ({marketData.nifty50.percentChange.toFixed(2)}%)
                    </p>
                </div>

                {/* Sensex Data */}
                <div>
                    <p className="text-sm text-gray-500">Sensex</p>
                    <p className="text-md font-semibold">
                        {`₹${marketData.sensex.price.toLocaleString()}`}
                    </p>
                    <p
                        className={`text-sm font-medium ${marketData.sensex.change >= 0
                            ? "text-green-500"
                            : "text-red-500"
                            }`}
                    >
                        {marketData.sensex.change >= 0
                            ? `+₹${marketData.sensex.change.toFixed(2)}`
                            : `-₹${Math.abs(marketData.sensex.change).toFixed(2)}`}
                        {" "}
                        ({marketData.sensex.percentChange.toFixed(2)}%)
                    </p>
                </div>
            </div>
        </div>
    );
};

export default MarketCard;
