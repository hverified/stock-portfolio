import React, { useState, useEffect } from "react";

const Orders = () => {
    // Sample data for the portfolio
    const portfolio = {
        totalValue: 52850.25,
        unrealizedPL: {
            amount: 1500.75,
            percent: 2.85,
        },
    };

    // State for managing stock orders and modal visibility
    const [stockOrders, setStockOrders] = useState([]);  // Default to an empty array
    const [selectedStock, setSelectedStock] = useState(null);

    // Function to handle card click and open modal
    const handleCardClick = (stock) => {
        setSelectedStock(stock);
    };

    // Function to close the modal
    const closeModal = () => {
        setSelectedStock(null);
    };

    // Function to handle exit trade
    const exitTrade = () => {
        alert(`Exit trade for ${selectedStock.symbol} executed.`);
        closeModal();
    };

    // Helper function to format numbers with commas
    const formatNumber = (num) => {
        return num.toLocaleString();
    };

    // Function to calculate total profit/loss for the selected stock
    const calculateTotalPL = (stock) => {
        const totalInvestment = parseFloat(stock.price.replace(",", "")) * stock.quantity;
        const totalProfitLoss = (parseFloat(stock.price.replace(",", "")) - stock.bought_at) * stock.quantity;
        return { totalInvestment, totalProfitLoss };
    };

    // Fetch stock data from the FastAPI backend
    useEffect(() => {
        const fetchStockData = async () => {
            try {
                const response = await fetch("http://127.0.0.1:8000/screener/stocks");
                const data = await response.json();
                // Ensure data is an array before setting it to state
                if (Array.isArray(data)) {
                    setStockOrders(data);
                } else {
                    console.error("Fetched data is not an array:", data);
                    setStockOrders([]);  // Set an empty array in case of unexpected data
                }
            } catch (error) {
                console.error("Error fetching stock data:", error);
                setStockOrders([]);  // Set an empty array in case of an error
            }
        };

        fetchStockData();
    }, []);

    return (
        <div className="p-4 bg-gray-100 min-h-screen pb-20">
            {/* Portfolio Overview */}
            <div className="bg-white p-4 rounded-lg shadow-md mb-6">
                <h2 className="text-lg font-semibold text-secondary mb-2">Total Portfolio</h2>
                <div className="flex justify-between items-center">
                    <div>
                        <p className="text-xs text-gray-500">Portfolio Value</p>
                        <p className="text-sm font-semibold">{`₹${formatNumber(portfolio.totalValue)}`}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-gray-500">Unrealized P/L</p>
                        <p className="text-sm font-semibold text-green-500">{portfolio.unrealizedPL.amount >= 0 ? `+₹${portfolio.unrealizedPL.amount?.toFixed(2)}` : `-₹${Math.abs(portfolio.unrealizedPL.amount)?.toFixed(2)}`} ({portfolio.unrealizedPL.percent?.toFixed(2)}%)</p>
                    </div>
                </div>
            </div>

            {/* Stock Orders */}
            <h2 className="text-lg font-semibold text-secondary mb-4">Stock Orders</h2>
            <div className="space-y-3">
                {Array.isArray(stockOrders) && stockOrders.length > 0 ? (
                    stockOrders.map((stock, index) => {
                        const investedAmount = parseFloat(stock.price.replace(",", "")) * stock.quantity;
                        const { totalProfitLoss } = calculateTotalPL(stock);
                        const totalProfitLossPercent = ((parseFloat(stock.price.replace(",", "")) - stock.bought_at) / stock.bought_at) * 100;
                        const dailyProfitLoss = (stock.change / 100) * parseFloat(stock.price.replace(",", "")) * stock.quantity;

                        return (
                            <div
                                key={index}
                                className="bg-white p-3 rounded-lg shadow-md cursor-pointer"
                                onClick={() => handleCardClick(stock)}
                            >
                                <div className="grid grid-cols-2 gap-2 items-center">
                                    <div>
                                        <p className="text-sm font-semibold flex items-center">
                                            {stock.symbol}
                                            <span
                                                className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${stock.status === "bought"
                                                    ? "bg-green-100 text-green-700"
                                                    : stock.status === "sold"
                                                        ? "bg-red-100 text-red-700"
                                                        : "bg-yellow-100 text-yellow-700"
                                                    }`}
                                            >
                                                {stock.status.charAt(0).toUpperCase() + stock.status.slice(1)}
                                            </span>
                                        </p>
                                        <p className="text-xs text-gray-500">Quantity: {stock.quantity}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-gray-500">Bought At: ₹{stock.bought_at?.toFixed(2)}</p>
                                        <p className="text-xs text-gray-500">LTP: ₹{stock.price}</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-2 items-center mt-2">
                                    <div>
                                        <p className="text-xs text-gray-500">Invested Amount: ₹{investedAmount?.toFixed(2)}</p>
                                    </div>
                                    <div className="text-right">
                                        <p
                                            className={`text-xs font-medium ${totalProfitLoss >= 0 ? "text-green-500" : "text-red-500"
                                                }`}
                                        >
                                            {totalProfitLoss >= 0 ? `+₹${totalProfitLoss?.toFixed(2)}` : `-₹${Math.abs(totalProfitLoss)?.toFixed(2)}`}
                                            {" "}
                                            ({totalProfitLossPercent >= 0 ? `+${totalProfitLossPercent?.toFixed(2)}%` : `${totalProfitLossPercent?.toFixed(2)}%`})
                                        </p>
                                        <p
                                            className={`text-xs font-medium ${dailyProfitLoss >= 0 ? "text-green-500" : "text-red-500"
                                                }`}
                                        >
                                            {dailyProfitLoss >= 0 ? `+₹${dailyProfitLoss?.toFixed(2)}` : `-₹${Math.abs(dailyProfitLoss)?.toFixed(2)}`}
                                            {" "}
                                            ({stock.change >= 0 ? `+${stock.change?.toFixed(2)}%` : `${stock.change?.toFixed(2)}%`})
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <p>No stock orders available.</p>
                )}
            </div>

            {/* Modal Popup */}
            {selectedStock && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg w-96">
                        <h3 className="text-xl font-semibold mb-4">{selectedStock.symbol} - Stock Details</h3>
                        <div className="grid grid-cols-2 gap-2 mb-4">
                            <div>
                                <p className="text-sm text-gray-500">Order Type: {selectedStock.status.charAt(0).toUpperCase() + selectedStock.status.slice(1)}</p>
                                <p className="text-sm text-gray-500">Quantity: {selectedStock.quantity}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-gray-500">Bought At: ₹{selectedStock.bought_at?.toFixed(2)}</p>
                                <p className="text-sm text-gray-500">LTP: ₹{selectedStock.price}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 mb-4">
                            <div>
                                <p className="text-sm text-gray-500">Invested Amount: ₹{(selectedStock.bought_at * selectedStock.quantity)?.toFixed(2)}</p>
                            </div>
                            <div className="text-right">
                                {/** Calculate the profit loss dynamically */}
                                {(() => {
                                    const { totalProfitLoss, totalInvestment } = calculateTotalPL(selectedStock);
                                    const totalProfitLossPercent = ((selectedStock.price - selectedStock.bought_at) / selectedStock.bought_at) * 100;
                                    return (
                                        <>
                                            <p
                                                className={`text-sm font-medium ${totalProfitLoss >= 0 ? "text-green-500" : "text-red-500"
                                                    }`}
                                            >
                                                {totalProfitLoss >= 0 ? `+₹${totalProfitLoss?.toFixed(2)}` : `-₹${Math.abs(totalProfitLoss)?.toFixed(2)}`}
                                                {" "}
                                                ({totalProfitLossPercent >= 0 ? `+${totalProfitLossPercent?.toFixed(2)}%` : `${totalProfitLossPercent?.toFixed(2)}%`})
                                            </p>
                                        </>
                                    );
                                })()}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 mb-4">
                            <div>
                                <p className="text-sm text-gray-500">Order Execution Time: {selectedStock.bought_at}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-gray-500">Daily Change: {selectedStock.change?.toFixed(2)}%</p>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={closeModal}
                                className="bg-gray-200 px-4 py-2 rounded-md text-sm"
                            >
                                Close
                            </button>
                            <button
                                onClick={exitTrade}
                                className="bg-red-500 text-white px-4 py-2 rounded-md text-sm"
                            >
                                Exit Trade
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Orders;
