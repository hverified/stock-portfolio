import React, { useState } from "react";

const Orders = () => {
    // Sample data for the portfolio and stock orders
    const portfolio = {
        totalValue: 52850.25,
        unrealizedPL: {
            amount: 1500.75,
            percent: 2.85,
        },
    };

    const stockOrders = [
        {
            ticker: "AAPL",
            quantity: 10,
            orderType: "Buy",
            boughtAt: 150.5,
            ltp: 155.2,
            dailyChangePercent: 1.2,
            orderExecutionTime: "2024-12-28 10:30:00",
        },
        {
            ticker: "GOOGL",
            quantity: 5,
            orderType: "Buy",
            boughtAt: 2800,
            ltp: 2850,
            dailyChangePercent: 0.85,
            orderExecutionTime: "2024-12-28 11:00:00",
        },
        {
            ticker: "MSFT",
            quantity: 8,
            orderType: "Sell",
            boughtAt: 310,
            ltp: 305,
            dailyChangePercent: -0.75,
            orderExecutionTime: "2024-12-28 09:45:00",
        },
        {
            ticker: "TCS",
            quantity: 10,
            orderType: "Buy",
            boughtAt: 4120,
            ltp: 4236,
            dailyChangePercent: 0.75,
            orderExecutionTime: "2024-12-28 12:15:00",
        },
    ];

    // State for managing modal visibility and selected stock
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
        alert(`Exit trade for ${selectedStock.ticker} executed.`);
        closeModal();
    };

    // Helper function to format numbers with commas
    const formatNumber = (num) => {
        return num.toLocaleString();
    };

    // Function to calculate total profit/loss for the selected stock
    const calculateTotalPL = (stock) => {
        const totalInvestment = stock.boughtAt * stock.quantity;
        const totalProfitLoss = (stock.ltp - stock.boughtAt) * stock.quantity;
        return { totalInvestment, totalProfitLoss };
    };

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
                        <p className="text-sm font-semibold text-green-500">{portfolio.unrealizedPL.amount >= 0 ? `+₹${portfolio.unrealizedPL.amount.toFixed(2)}` : `-₹${Math.abs(portfolio.unrealizedPL.amount).toFixed(2)}`} ({portfolio.unrealizedPL.percent.toFixed(2)}%)</p>
                    </div>
                </div>
            </div>

            {/* Stock Orders */}
            <h2 className="text-lg font-semibold text-secondary mb-4">Stock Orders</h2>
            <div className="space-y-3">
                {stockOrders.map((stock, index) => {
                    const investedAmount = stock.boughtAt * stock.quantity;
                    const { totalProfitLoss } = calculateTotalPL(stock);
                    const totalProfitLossPercent = ((stock.ltp - stock.boughtAt) / stock.boughtAt) * 100;
                    const dailyProfitLoss = (stock.dailyChangePercent / 100) * stock.ltp * stock.quantity;

                    return (
                        <div
                            key={index}
                            className="bg-white p-3 rounded-lg shadow-md cursor-pointer"
                            onClick={() => handleCardClick(stock)}
                        >
                            <div className="grid grid-cols-2 gap-2 items-center">
                                <div>
                                    <p className="text-sm font-semibold flex items-center">
                                        {stock.ticker}
                                        <span
                                            className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${stock.orderType === "Buy"
                                                ? "bg-green-100 text-green-700"
                                                : "bg-red-100 text-red-700"
                                                }`}
                                        >
                                            {stock.orderType}
                                        </span>
                                    </p>
                                    <p className="text-xs text-gray-500">Quantity: {stock.quantity}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-gray-500">Bought At: ₹{stock.boughtAt.toFixed(2)}</p>
                                    <p className="text-xs text-gray-500">LTP: ₹{stock.ltp.toFixed(2)}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2 items-center mt-2">
                                <div>
                                    <p className="text-xs text-gray-500">Invested Amount: ₹{investedAmount.toFixed(2)}</p>
                                </div>
                                <div className="text-right">
                                    <p
                                        className={`text-xs font-medium ${totalProfitLoss >= 0 ? "text-green-500" : "text-red-500"
                                            }`}
                                    >
                                        {totalProfitLoss >= 0 ? `+₹${totalProfitLoss.toFixed(2)}` : `-₹${Math.abs(totalProfitLoss).toFixed(2)}`}
                                        {" "}
                                        ({totalProfitLossPercent >= 0 ? `+${totalProfitLossPercent.toFixed(2)}%` : `${totalProfitLossPercent.toFixed(2)}%`})
                                    </p>
                                    <p
                                        className={`text-xs font-medium ${dailyProfitLoss >= 0 ? "text-green-500" : "text-red-500"
                                            }`}
                                    >
                                        {dailyProfitLoss >= 0 ? `+₹${dailyProfitLoss.toFixed(2)}` : `-₹${Math.abs(dailyProfitLoss).toFixed(2)}`}
                                        {" "}
                                        ({stock.dailyChangePercent >= 0 ? `+${stock.dailyChangePercent.toFixed(2)}%` : `${stock.dailyChangePercent.toFixed(2)}%`})
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Modal Popup */}
            {selectedStock && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg w-96">
                        <h3 className="text-xl font-semibold mb-4">{selectedStock.ticker} - Stock Details</h3>
                        <div className="grid grid-cols-2 gap-2 mb-4">
                            <div>
                                <p className="text-sm text-gray-500">Order Type: {selectedStock.orderType}</p>
                                <p className="text-sm text-gray-500">Quantity: {selectedStock.quantity}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-gray-500">Bought At: ₹{selectedStock.boughtAt.toFixed(2)}</p>
                                <p className="text-sm text-gray-500">LTP: ₹{selectedStock.ltp.toFixed(2)}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 mb-4">
                            <div>
                                <p className="text-sm text-gray-500">Invested Amount: ₹{(selectedStock.boughtAt * selectedStock.quantity).toFixed(2)}</p>
                            </div>
                            <div className="text-right">
                                {/** Calculate the profit loss dynamically */}
                                {(() => {
                                    const { totalProfitLoss, totalInvestment } = calculateTotalPL(selectedStock);
                                    const totalProfitLossPercent = ((selectedStock.ltp - selectedStock.boughtAt) / selectedStock.boughtAt) * 100;
                                    return (
                                        <>
                                            <p
                                                className={`text-sm font-medium ${totalProfitLoss >= 0 ? "text-green-500" : "text-red-500"
                                                    }`}
                                            >
                                                {totalProfitLoss >= 0 ? `+₹${totalProfitLoss.toFixed(2)}` : `-₹${Math.abs(totalProfitLoss).toFixed(2)}`}
                                                {" "}
                                                ({totalProfitLossPercent >= 0 ? `+${totalProfitLossPercent.toFixed(2)}%` : `${totalProfitLossPercent.toFixed(2)}%`})
                                            </p>
                                        </>
                                    );
                                })()}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 mb-4">
                            <div>
                                <p className="text-sm text-gray-500">Order Execution Time: {selectedStock.orderExecutionTime}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-gray-500">Daily Change: {selectedStock.dailyChangePercent.toFixed(2)}%</p>
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
