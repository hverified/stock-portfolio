import React, { useState } from "react";
import axios from "axios";
import nseEqData from "./nse_eq.json"; // Import your JSON file

const StockSearchCard = () => {
    const [ticker, setTicker] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [marketCapData, setMarketCapData] = useState(null);
    const [error, setError] = useState(null);

    // Handle input change with suggestion filtering
    const handleInputChange = (e) => {
        const input = e.target.value;
        setTicker(input);

        // Filter suggestions based on the input
        if (input) {
            const filteredSuggestions = nseEqData.filter((stock) =>
                stock?.SEM_TRADING_SYMBOL?.toLowerCase().startsWith(input.toLowerCase())
                // || stock?.SEM_CUSTOM_SYMBOL?.toLowerCase().startsWith(input.toLowerCase())
            );
            setSuggestions(filteredSuggestions.slice(0, 10)); // Limit to 10 suggestions
        } else {
            setSuggestions([]);
        }
    };

    // Handle selection from suggestions
    const handleSuggestionClick = (suggestion) => {
        setTicker(suggestion.SEM_TRADING_SYMBOL);
        setSuggestions([]); // Clear suggestions after selection
    };

    // Fetch market cap data
    const handleSearch = async () => {
        try {
            setError(null); // Clear previous errors
            const response = await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/market/market-cap?index_symbol=${ticker}`,
            );

            setMarketCapData(response.data);
        } catch (err) {
            console.error("Error fetching market cap data:", err);
            setError("Failed to fetch market cap data. Please try again.");
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold text-secondary">Stock Search</h3>

            <div className="mt-4 space-y-4 relative">
                {/* Input field */}
                <input
                    type="text"
                    placeholder="Enter Ticker Symbol"
                    value={ticker}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded-lg border border-gray-300 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                />

                {/* Suggestions dropdown */}
                {suggestions.length > 0 && (
                    <ul className="absolute z-10 bg-white border border-gray-300 rounded-lg shadow-lg w-full mt-1 max-h-40 overflow-y-auto">
                        {suggestions.map((stock) => (
                            <li
                                key={stock.SEM_SMST_SECURITY_ID}
                                className="px-4 py-2 cursor-pointer hover:bg-blue-500 hover:text-white"
                                onClick={() => handleSuggestionClick(stock)}
                            >
                                {stock.SEM_TRADING_SYMBOL} - {stock.SEM_CUSTOM_SYMBOL}
                            </li>
                        ))}
                    </ul>
                )}

                {/* Search Button */}
                <button
                    onClick={handleSearch}
                    className="w-full py-3 bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-teal-600 transition duration-300 ease-in-out"
                >
                    Search
                </button>
            </div>

            {error && (
                <p className="text-red-500 text-sm mt-4">
                    {error}
                </p>
            )}

            {marketCapData && (
                <div className="mt-6 overflow-x-auto">
                    <table className="min-w-full table-auto border-collapse">
                        <thead>
                            <tr>
                                <th className="px-4 py-2 border-b text-left">{marketCapData.ticker}</th>
                                <th className="px-4 py-2 border-b text-left"></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="px-4 py-2 border-b font-semibold text-sm">Stock Name</td>
                                <td className="px-4 py-2 border-b text-sm">{marketCapData.stock_name}</td>
                            </tr>
                            <tr>
                                <td className="px-4 py-2 border-b font-semibold text-sm">Market Cap</td>
                                <td className="px-4 py-2 border-b text-sm">₹{marketCapData.market_cap_crores.toLocaleString()} Cr</td>
                            </tr>
                            <tr>
                                <td className="px-4 py-2 border-b font-semibold text-sm">Category</td>
                                <td className="px-4 py-2 border-b text-sm">{marketCapData.category}</td>
                            </tr>
                            <tr>
                                <td className="px-4 py-2 border-b font-semibold text-sm">Current Price</td>
                                <td className={`px-4 py-2 border-b text-sm ${marketCapData.percent_change >= 0
                                    ? "text-green-500"
                                    : "text-red-500"
                                    }`}>₹{marketCapData.current_price.toLocaleString()} ({marketCapData.percent_change.toFixed(2)}%)</td>
                            </tr>
                            <tr>
                                <td className="px-4 py-2 border-b font-semibold text-sm">Previous Close</td>
                                <td className="px-4 py-2 border-b text-sm">₹{marketCapData.previous_close}</td>
                            </tr>
                            <tr>
                                <td className="px-4 py-2 border-b font-semibold text-sm">52 Week Range</td>
                                <td className="px-4 py-2 border-b text-sm">{marketCapData["52_week_range"]}</td>
                            </tr>
                            <tr>
                                <td className="px-4 py-2 border-b font-semibold text-sm">Volume</td>
                                <td className="px-4 py-2 border-b text-sm">{marketCapData.volume.toLocaleString()}</td>
                            </tr>
                            <tr>
                                <td className="px-4 py-2 border-b font-semibold text-sm">PE Ratio</td>
                                <td className="px-4 py-2 border-b text-sm">{marketCapData.pe_ratio}</td>
                            </tr>
                            <tr>
                                <td className="px-4 py-2 border-b font-semibold text-sm">Sector</td>
                                <td className="px-4 py-2 border-b text-sm">{marketCapData.sector}</td>
                            </tr>
                            <tr>
                                <td className="px-4 py-2 border-b font-semibold text-sm">Industry</td>
                                <td className="px-4 py-2 border-b text-sm">{marketCapData.industry}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default StockSearchCard;
