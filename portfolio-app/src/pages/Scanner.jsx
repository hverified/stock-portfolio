import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../components/Header";

const Scanner = () => {
    const [scanners, setScanners] = useState(["BTST Scanner"]);
    const [selectedScanner, setSelectedScanner] = useState(null);
    const [scannedStocks, setScannedStocks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [expandedRow, setExpandedRow] = useState(null);
    const [stockDetails, setStockDetails] = useState({});
    const [lastUpdatedAt, setLastUpdatedAt] = useState("");
    const [amtPerTrade, setAmtPerTrade] = useState(10000);

    useEffect(() => {
        const savedLastUpdatedAt = localStorage.getItem("lastUpdatedAt");
        if (savedLastUpdatedAt) {
            setLastUpdatedAt(savedLastUpdatedAt);
        }
    }, []);

    const fetchScannedStocks = async () => {
        setLoading(true);
        try {
            const requestBody = {
                url: `${import.meta.env.VITE_API_SCRAPE_TABLE_URL}`,
                table_id: "DataTables_Table_0",
            };

            const response = await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/scrape/table`,
                requestBody
            );

            setScannedStocks(response.data.data);

            // Save the last updated time on success
            const updatedTime = new Date().toLocaleString();
            setLastUpdatedAt(updatedTime);
            localStorage.setItem("lastUpdatedAt", updatedTime);
        } catch (error) {
            console.error("Error fetching scanned stocks:", error);

            // Use the last updated time from localStorage on failure
            const savedLastUpdatedAt = localStorage.getItem("lastUpdatedAt");
            if (savedLastUpdatedAt) {
                setLastUpdatedAt(savedLastUpdatedAt);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleCardClick = (scanner) => {
        setSelectedScanner(scanner);
        fetchScannedStocks();
    };

    const handleInputChange = (e) => {
        const input = e.target.value;
        setAmtPerTrade(input);
    };

    const closeModal = () => {
        setSelectedScanner(null);
        setScannedStocks([]);
    };

    const handleRowClick = async (symbol) => {
        if (expandedRow === symbol) {
            setExpandedRow(null);
            return;
        }

        if (stockDetails[symbol]) {
            setExpandedRow(symbol);
            return;
        }

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/market/stock-detail?index_symbol=${symbol}`
            );
            setStockDetails((prevDetails) => ({
                ...prevDetails,
                [symbol]: response.data,
            }));
            setExpandedRow(symbol);
        } catch (error) {
            console.error("Error fetching stock details:", error);
        }
    };

    return (
        <div className="p-4 space-y-6 pb-20">
            <Header />
            <div className="flex items-center space-x-2">
                <label htmlFor="amountPerTrade">
                    Amt/Trade: ₹
                </label>
                <input
                    id="amountPerTrade"
                    type="text"
                    placeholder="Enter amount per trade"
                    value={amtPerTrade}
                    onChange={handleInputChange}
                    className="p-3 rounded-lg border border-gray-300 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {scanners.map((scanner, index) => (
                    <div
                        key={index}
                        onClick={() => handleCardClick(scanner)}
                        className="bg-white p-4 rounded-lg shadow-md cursor-pointer hover:shadow-lg"
                    >
                        <h3 className="text-lg font-semibold text-gray-700">{scanner}</h3>
                        <p className="text-sm text-gray-500">Click to view scanned stocks</p>
                    </div>
                ))}
            </div>

            {selectedScanner && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white w-11/12 max-w-4xl rounded-lg p-4 shadow-lg h-4/5 flex flex-col">
                        {/* Header */}
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-semibold">{selectedScanner}</h3>
                            <div className="flex gap-2">
                                <button
                                    onClick={fetchScannedStocks}
                                    className="text-blue-500 hover:text-blue-600 border border-gray-300 rounded-md p-2"
                                    title="Refresh"
                                >
                                    <i className="fas fa-sync-alt fa-lg"></i>
                                </button>
                                <button
                                    onClick={closeModal}
                                    className="text-gray-500 hover:text-gray-700 border border-gray-300 rounded-md p-2"
                                    title="Close"
                                >
                                    <i className="fas fa-times fa-lg"></i>
                                </button>
                            </div>
                        </div>

                        {/* Last Updated At */}
                        <div className="text-sm text-gray-500 mb-4">
                            Last Updated At: {lastUpdatedAt || "Not Available"}
                        </div>

                        {/* Content */}
                        {loading ? (
                            <div className="flex justify-center items-center flex-grow">
                                <div className="loader border-t-4 border-blue-500 rounded-full w-12 h-12 animate-spin"></div>
                            </div>
                        ) : (
                            <div className="flex-grow overflow-y-auto border rounded-lg">
                                <table className="w-full text-left border-collapse">
                                    <thead className="sticky top-0 bg-gray-100">
                                        <tr>
                                            <th className="border-b text-sm py-2 px-4">Ticker</th>
                                            <th className="border-b text-sm py-2 px-4">Price</th>
                                            <th className="border-b text-sm py-2 px-4">Change</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {scannedStocks.map((stock, index) => (
                                            <React.Fragment key={index}>
                                                <tr
                                                    onClick={() => handleRowClick(stock.Symbol)}
                                                    className="cursor-pointer hover:bg-gray-100"
                                                >
                                                    <td className="border-b py-2 text-xs px-4">{stock?.Symbol}</td>
                                                    <td className="border-b py-2 text-xs px-4">₹{stock?.Price}</td>
                                                    <td className={`border-b py-2 text-xs px-4 
                                                        ${stock?.["% Chg"].includes("-") ? "text-red-500" :
                                                            parseFloat(stock?.["% Chg"].replace("%", "")) >= 7 || parseFloat(stock?.["% Chg"].replace("%", "")) <= 1 ?
                                                                "text-yellow-600" : "text-green-500"}`}>{stock?.["% Chg"]}
                                                    </td>
                                                </tr>
                                                {expandedRow === stock.Symbol && (
                                                    <tr>
                                                        <td colSpan={3} className="border-b py-2 px-2 bg-gradient-to-r from-gray-50 via-gray-100 to-gray-50 rounded-lg">
                                                            {stockDetails[stock.Symbol] ? (
                                                                <div className="p-2 rounded-lg shadow-lg">
                                                                    <div className="flex items-center justify-between mb-4">
                                                                        <p className="text-sm font-bold text-gray-700">
                                                                            <span
                                                                                className={`px-2 py-1 text-xs font-semibold rounded-full ${stockDetails[stock.Symbol]?.category === "Large-Cap"
                                                                                    ? "bg-blue-100 text-blue-600"
                                                                                    : stockDetails[stock.Symbol]?.category === "Mid-Cap"
                                                                                        ? "bg-yellow-100 text-yellow-600"
                                                                                        : "bg-green-100 text-green-600"
                                                                                    }`}
                                                                            >
                                                                                {stockDetails[stock.Symbol]?.category.charAt(0)}
                                                                            </span>
                                                                            {` ${stockDetails[stock.Symbol]?.stock_name}`}
                                                                        </p>
                                                                    </div>
                                                                    <div className="grid grid-cols-2 gap-4 text-xs">
                                                                        <div>
                                                                            <p><strong>M.Cap:</strong> ₹{stockDetails[stock.Symbol]?.market_cap_crores.toLocaleString()} Cr.</p>
                                                                        </div>
                                                                        <div>
                                                                            <p><strong>Volume:</strong> {stockDetails[stock.Symbol]?.volume.toLocaleString()}</p>
                                                                        </div>
                                                                        <div>
                                                                            <p><strong>Qty:</strong> {parseInt(amtPerTrade / stock?.Price)}</p>
                                                                        </div>
                                                                        <div>
                                                                            <p><strong>Invest:</strong> {(parseInt(amtPerTrade / stock?.Price) * stock?.Price).toFixed(2)}</p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <div className="p-4 flex items-center justify-center">
                                                                    <div className="loader border-t-4 border-blue-500 rounded-full w-8 h-8 animate-spin"></div>
                                                                    <p className="ml-4 text-xs text-gray-500">Loading details...</p>
                                                                </div>
                                                            )}
                                                        </td>
                                                    </tr>
                                                )}
                                            </React.Fragment>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            )}
            <div className="relative">
                <div className="fixed bottom-16 right-4">
                    <button
                        className="px-4 py-2 rounded-full font-semibold transition duration-300 ease-in-out bg-gradient-to-r from-blue-500 to-teal-500 text-white hover:from-blue-600 hover:to-teal-600 shadow-lg"
                    >
                        + Scanner
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Scanner;
