import React, { useState, useEffect } from "react";

const Orders = () => {
    const [stockOrders, setStockOrders] = useState([]);
    const [selectedStock, setSelectedStock] = useState(null);
    const baseUrl = `${import.meta.env.VITE_API_BASE_URL}`;

    const handleCardClick = (stock) => {
        setSelectedStock(stock);
    };

    const fetchStockData = async () => {
        try {
            const response = await fetch(`${baseUrl}/screener/stocks`);
            const data = await response.json();
            if (Array.isArray(data)) {
                setStockOrders(data);
            } else {
                console.error("Fetched data is not an array:", data);
                setStockOrders([]);
            }
        } catch (error) {
            console.error("Error fetching stock data:", error);
            setStockOrders([]);
        }
    };

    useEffect(() => {
        fetchStockData();
    }, []);

    return (
        <div className="p-6 bg-gradient-to-b from-blue-50 to-gray-100 min-h-screen">
            <h2 className="text-xl font-bold text-gray-700 mb-6">Stock Queue</h2>
            <div className="space-y-4">
                {stockOrders.length > 0 ? (
                    stockOrders.map((stock, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg cursor-pointer transition-transform transform hover:scale-105"
                            onClick={() => handleCardClick(stock)}
                        >
                            <div className="flex justify-between items-center mb-2">
                                <p className="text-lg font-medium text-gray-800">{stock.symbol}</p>
                                <span
                                    className={`text-xs font-semibold px-3 py-1 rounded-full ${stock.status === "bought"
                                        ? "bg-green-100 text-green-700"
                                        : stock.status === "sold"
                                            ? "bg-red-100 text-red-700"
                                            : "bg-yellow-100 text-yellow-700"
                                        }`}
                                >
                                    {stock.status.charAt(0).toUpperCase() + stock.status.slice(1)}
                                </span>
                            </div>
                            <div className="text-sm text-gray-600 grid grid-cols-2 gap-4">
                                <div>
                                    <p>Date: {stock.date}</p>
                                    <p>Quantity: {stock.quantity}</p>
                                </div>
                                <div className="text-right">
                                    <p>LTP: ₹{stock.price}</p>
                                    <p>Bought At: ₹{stock.bought_at}</p>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500 text-center">No stock orders available.</p>
                )}
            </div>
        </div>
    );
};

export default Orders;
