import React, { useState } from "react";

const Scanner = () => {
    const [scanners, setScanners] = useState([]);
    const [selectedScanner, setSelectedScanner] = useState(null);
    const [scannedStocks, setScannedStocks] = useState([]);
    const [loading, setLoading] = useState(false);

    const addScanner = () => {
        const newScanner = `Scanner ${scanners.length + 1}`;
        setScanners([...scanners, newScanner]);
    };

    const fetchScannedStocks = async () => {
        setLoading(true);
        try {
            // Mock API call (replace with your API call)
            const response = await new Promise((resolve) =>
                setTimeout(
                    () =>
                        resolve([
                            { ticker: "AAPL", price: 150, change: 1.5 },
                            { ticker: "GOOGL", price: 2800, change: 2.3 },
                            { ticker: "MSFT", price: 310, change: -0.8 },
                            // Repeat data for testing scroll
                            { ticker: "AAPL", price: 150, change: 1.5 },
                            { ticker: "GOOGL", price: 2800, change: 2.3 },
                            { ticker: "MSFT", price: 310, change: -0.8 },
                            { ticker: "AAPL", price: 150, change: 1.5 },
                            { ticker: "GOOGL", price: 2800, change: 2.3 },
                            { ticker: "MSFT", price: 310, change: -0.8 },
                            { ticker: "AAPL", price: 150, change: 1.5 },
                            { ticker: "GOOGL", price: 2800, change: 2.3 },
                            { ticker: "MSFT", price: 310, change: -0.8 },
                        ]),
                    1000
                )
            );
            setScannedStocks(response);
        } catch (error) {
            console.error("Error fetching scanned stocks:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCardClick = (scanner) => {
        setSelectedScanner(scanner);
        fetchScannedStocks();
    };

    const closeModal = () => {
        setSelectedScanner(null);
        setScannedStocks([]);
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-2xl font-semibold text-gray-800 mb-6">Stock Scanner</h1>

            {/* Add Scanner Button */}
            <button
                onClick={addScanner}
                className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-md mb-4 hover:bg-blue-600"
            >
                Add Scanner
            </button>

            {/* Scanners as Cards */}
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

            {/* Popup for Scanned Stocks */}
            {selectedScanner && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white w-11/12 max-w-3xl rounded-lg p-6 shadow-lg">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-semibold">{selectedScanner} - Scanned Stocks</h3>
                            <button
                                onClick={fetchScannedStocks}
                                className="bg-blue-500 text-white px-3 py-1 rounded-full hover:bg-blue-600"
                            >
                                Refresh
                            </button>
                        </div>

                        {/* Loading Indicator */}
                        {loading ? (
                            <div className="flex justify-center items-center h-40">
                                <div className="loader border-t-4 border-blue-500 rounded-full w-12 h-12 animate-spin"></div>
                            </div>
                        ) : (
                            <div className="h-48 overflow-y-auto border rounded-lg">
                                <table className="w-full text-left border-collapse">
                                    <thead className="sticky top-0 bg-gray-100">
                                        <tr>
                                            <th className="border-b py-2 px-4">Ticker</th>
                                            <th className="border-b py-2 px-4">Price</th>
                                            <th className="border-b py-2 px-4">Change (%)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {scannedStocks.map((stock, index) => (
                                            <tr key={index}>
                                                <td className="border-b py-2 px-4">{stock.ticker}</td>
                                                <td className="border-b py-2 px-4">₹{stock.price.toFixed(2)}</td>
                                                <td
                                                    className={`border-b py-2 px-4 ${stock.change >= 0 ? "text-green-500" : "text-red-500"
                                                        }`}
                                                >
                                                    {stock.change >= 0 ? "+" : ""}
                                                    {stock.change.toFixed(2)}%
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        <div className="flex justify-end mt-4">
                            <button
                                onClick={closeModal}
                                className="bg-gray-300 px-4 py-2 rounded-full hover:bg-gray-400"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Scanner;
