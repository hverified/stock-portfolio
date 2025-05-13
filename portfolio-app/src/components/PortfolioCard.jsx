import React, { useState, useEffect } from "react";
import currencyFormat from "../utils/helperFunction";

const PortfolioCard = () => {
    const [portfolioData, setPortfolioData] = useState(null);
    const [loading, setLoading] = useState(true);
    const baseUrl = import.meta.env.VITE_API_BASE_URL;

    useEffect(() => {
        const fetchPortfolioData = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${baseUrl}/portfolio/get_fund_limits`);
                const result = await response.json();
                if (result.status === "success") {
                    setPortfolioData(result.data);
                } else {
                    console.error("API Error:", result.remarks);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPortfolioData();
    }, []);

    const portfolioMetrics = [
        {
            label: "Total",
            value:
                portfolioData?.availableBalance && portfolioData?.utilizedAmount
                    ? portfolioData.availableBalance + portfolioData.utilizedAmount
                    : portfolioData?.availableBalance,
            icon: (
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
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                </svg>
            ),
        },
        {
            label: "SOD Limit",
            value: portfolioData?.sodLimit,
            icon: (
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
            ),
        },
        {
            label: "Invested Amount",
            value: portfolioData?.utilizedAmount,
            icon: (
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
            ),
        },
        {
            label: "Balance",
            value: portfolioData?.withdrawableBalance,
            icon: (
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
                        d="M3 10h18M7 15h1m4  readHeader.jsx
4e6b8d3a-2c1f-4a9b-9e7d-8f3a5c1b6e2d
4e6b8d3a-2c1f-4a9b-9e7d-8f3a5c1b6e2d
0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    ></path>
                </svg>
            ),
        },
    ];

    return (
        <div className="p-4 rounded-2xl shadow-lg bg-white transform hover:scale-105 transition-transform duration-300 animate-fade-in">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">My Portfolio</h3>
            {loading ? (
                <div className="flex items-center justify-center h-24">
                    <div className="animate-spin rounded-full h-8 w-8 border-emerald-500"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {portfolioMetrics.map(({ label, value, icon }, index) => (
                        <div
                            key={index}
                            className="p-3 rounded-xl bg-gradient-to-br from-gray-50 to-white border-gray-300 flex items-center space-x-3"
                        >
                            {icon}
                            <div>
                                <p className="text-xs text-gray-500">{label}</p>
                                {value !== undefined ? (
                                    <p className="text-lg font-bold text-gray-800">
                                        ₹{currencyFormat(value.toFixed(2))}
                                    </p>
                                ) : (
                                    <div className="bg-gray-200 animate-pulse h-5 w-24 rounded-lg"></div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PortfolioCard;