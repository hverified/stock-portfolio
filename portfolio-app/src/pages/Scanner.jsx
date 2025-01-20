import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../components/Header";

const Scanner = () => {
    const [scanners, setScanners] = useState([]);
    const [selectedScanner, setSelectedScanner] = useState(null);
    const [scannedStocks, setScannedStocks] = useState([]);
    const [stockDetails, setStockDetails] = useState({});
    const [expandedRow, setExpandedRow] = useState(null);
    const [amtPerTrade, setAmtPerTrade] = useState(10000);
    const [showAddScannerModal, setShowAddScannerModal] = useState(false);
    const [newScanner, setNewScanner] = useState({ name: "", description: "", url: "", table_id: "" });
    const [showToolbar, setShowToolbar] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
    const [lastUpdatedAt, setLastUpdatedAt] = useState("");
    const [loading, setLoading] = useState(false);

    const baseUrl = `${import.meta.env.VITE_API_BASE_URL}`

    const fetchScanners = async () => {
        try {
            const response = await axios.get(`${baseUrl}/scanner/get_scanners`);
            setScanners(response.data);
            console.log("Scanners fetched:", response.data);
        } catch (error) {
            console.error("Error fetching scanners:", error);
        }
    };

    useEffect(() => {
        fetchScanners();
    }, []);

    const fetchScannedStocks = async (scanner) => {
        setLoading(true);
        console.log("Fetching scanned stocks for:", scanner);
        try {
            const requestBody = {
                url: scanner.url,
                table_id: scanner.table_id,
            };

            const response = await axios.post(
                `${baseUrl}/scrape/table`,
                requestBody
            );
            console.log("Scanned stocks fetched:", response.data.data);
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
            console.log("Scanned stocks fetched for:", scanner);
            setLoading(false);
        }
    };
    const closeModal = () => {
        setSelectedScanner(null);
        setScannedStocks([]);
    };
    const handleCardClick = (scanner) => {
        setSelectedScanner(scanner);
        fetchScannedStocks(scanner);
    };

    const handleAddScanner = async () => {
        if (!newScanner.name || !newScanner.description || !newScanner.url || !newScanner.table_id) {
            alert("Please fill all fields to add a scanner.");
            return;
        }
        try {
            await axios.post(`${baseUrl}/scanner/add_scanner`, newScanner);
            setNewScanner({ name: "", description: "", url: "", table_id: "" });
            setShowAddScannerModal(false);
            fetchScanners();
        } catch (error) {
            console.error("Error adding scanner:", error);
        }
    };

    const handleDeleteScanner = async (scanner_id) => {
        try {
            await axios.delete(`${baseUrl}/scanner/delete_scanner/${scanner_id}`);
            fetchScanners();
        } catch (error) {
            console.error("Error deleting scanner:", error);
        }
    };

    const handleUpdateScanner = (scanner) => {
        // Open the edit modal instead of directly updating the scanner
        setSelectedScanner(scanner);
    };

    const toggleToolbar = (scanner_id) => {
        setShowToolbar((prev) => (prev === scanner_id ? null : scanner_id));
    };

    const confirmDelete = (scanner_id) => {
        setShowDeleteConfirm(scanner_id);
    };

    const cancelDelete = () => {
        setShowDeleteConfirm(null);
    };

    const deleteConfirmed = () => {
        handleDeleteScanner(showDeleteConfirm);
        setShowDeleteConfirm(null);
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
                `${baseUrl}/market/stock-detail?index_symbol=${symbol}`
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

    const handleInputChange = (e) => {
        const input = e.target.value;
        setAmtPerTrade(input);
    };

    return (
        <div className="p-4 space-y-6 pb-20">
            <Header />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <label htmlFor="amountPerTrade">
                    Amt/Trade: ₹
                </label>
                <input
                    id="amountPerTrade"
                    type="text"
                    placeholder="Enter amount per trade"
                    value={amtPerTrade}
                    onChange={handleInputChange}
                    className="p-2 rounded-lg border border-gray-300 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {scanners.map((scanner) => (
                    <div
                        key={scanner.scanner_id}
                        className="bg-white p-4 rounded-lg shadow-md relative hover:shadow-lg"
                        style={{ zIndex: showToolbar === scanner.scanner_id ? 10 : "auto" }} // Ensure toolbar stays on top
                    >
                        <div onClick={() => handleCardClick(scanner)} className="cursor-pointer">
                            <h3 className="text-lg font-semibold text-gray-700">{scanner.name}</h3>
                            <p className="text-sm text-gray-500">{scanner.description}</p>
                        </div>
                        <button
                            onClick={() => toggleToolbar(scanner.scanner_id)}
                            className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
                        >
                            &#x22EE;
                        </button>
                        {showToolbar === scanner.scanner_id && (
                            <div className="absolute top-8 right-2 bg-white shadow-lg rounded-md p-2 z-20">
                                <button
                                    onClick={() => handleUpdateScanner(scanner)}
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => confirmDelete(scanner.scanner_id)}
                                    className="block w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-gray-100"
                                >
                                    Delete
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {selectedScanner && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white w-11/12 max-w-4xl rounded-lg p-4 shadow-lg h-4/5 flex flex-col">
                        {/* Header */}
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-semibold">{selectedScanner.name}</h3>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => fetchScannedStocks(selectedScanner)}
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
                                                        ${stock?.["% Chg"]?.includes("-") ? "text-red-500" :
                                                            parseFloat(stock?.["% Chg"]?.replace("%", "")) >= 7 || parseFloat(stock?.["% Chg"].replace("%", "")) <= 1 ?
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

            {showAddScannerModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white w-11/12 max-w-lg rounded-lg p-6 shadow-lg">
                        <h3 className="text-xl font-semibold mb-4">Add New Scanner</h3>
                        <div className="space-y-4">
                            <input
                                type="text"
                                placeholder="Scanner Name"
                                value={newScanner.name}
                                onChange={(e) => setNewScanner({ ...newScanner, name: e.target.value })}
                                className="w-full p-3 rounded-lg bg-white border border-gray-300"
                            />
                            <textarea
                                placeholder="Description"
                                value={newScanner.description}
                                onChange={(e) => setNewScanner({ ...newScanner, description: e.target.value })}
                                className="w-full p-3 rounded-lg bg-white border border-gray-300"
                            />
                            <input
                                type="text"
                                placeholder="URL"
                                value={newScanner.url}
                                onChange={(e) => setNewScanner({ ...newScanner, url: e.target.value })}
                                className="w-full p-3 rounded-lg bg-white border border-gray-300"
                            />
                            <input
                                type="text"
                                placeholder="Table ID"
                                value={newScanner.table_id}
                                onChange={(e) => setNewScanner({ ...newScanner, table_id: e.target.value })}
                                className="w-full p-3 rounded-lg bg-white border border-gray-300"
                            />
                        </div>
                        <div className="flex justify-end mt-4">
                            <button
                                onClick={() => setShowAddScannerModal(false)}
                                className="text-gray-500 hover:text-gray-700 border border-gray-300 rounded-full px-4 py-2 shadow-md mr-2"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddScanner}
                                className="px-4 py-2 rounded-full font-semibold transition duration-300 ease-in-out bg-gradient-to-r from-blue-500 to-teal-500 text-white hover:from-blue-600 hover:to-teal-600 shadow-lg"
                            >
                                Add Scanner
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white w-11/12 max-w-lg rounded-lg p-6 shadow-lg">
                        <h3 className="text-xl font-semibold mb-4">Are you sure you want to delete this scanner?</h3>
                        <div className="flex justify-end mt-4">
                            <button
                                onClick={cancelDelete}
                                className="text-gray-500 hover:text-gray-700 border border-gray-300 rounded-md p-2 mr-2"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={deleteConfirmed}
                                className="text-white bg-red-500 hover:bg-red-600 rounded-md p-2"
                            >
                                Confirm Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="fixed bottom-16 right-4">
                <button
                    onClick={() => setShowAddScannerModal(true)}
                    className="px-4 py-2 rounded-full font-semibold transition duration-300 ease-in-out bg-gradient-to-r from-blue-500 to-teal-500 text-white hover:from-blue-600 hover:to-teal-600 shadow-lg"
                >
                    + Scanner
                </button>
            </div>
        </div>
    );
};

export default Scanner;
