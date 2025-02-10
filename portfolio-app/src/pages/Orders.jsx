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
        <div className="p-6 bg-gradient-to-b from-blue-50 to-gray-100 min-h-screen pb-32">
            <h2 className="text-xl text-gray-700 mb-6">Stock Queue</h2>
            <div className="space-y-4">
                {stockOrders.length > 0 ? (
                    stockOrders.map((stock, index) => (
                        <div
                            key={index}
                            className={`bg-gradient-to-r ${stock.status === "bought"
                                ? "from-green-50 to-green-100"
                                : stock.status === "sold"
                                    ? "from-red-50 to-red-100"
                                    : "from-yellow-50 to-yellow-100"
                                } rounded-xl shadow-md p-4 hover:shadow-lg cursor-pointer transition-transform transform hover:scale-105`}
                            onClick={() => handleCardClick(stock)}
                        >
                            <div className="flex justify-between items-center mb-3">
                                <div className="flex items-center">
                                    <p className="text-lg font-semibold text-gray-800">{stock.symbol}</p>
                                    <span
                                        className={`ml-3 text-sm font-bold px-3 py-1 rounded-full ${stock.status === "bought"
                                            ? "bg-green-100 text-green-700"
                                            : stock.status === "sold"
                                                ? "bg-red-100 text-red-700"
                                                : "bg-yellow-100 text-yellow-700"
                                            }`}
                                    >
                                        {stock.status.charAt(0).toUpperCase() + stock.status.slice(1)}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-500">{stock.date}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
                                <div>
                                    <p>
                                        <span className="font-medium">Quantity:</span> {stock.quantity}
                                    </p>
                                    <p>
                                        <span className="font-medium">Bought At:</span> ₹{stock.bought_at}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p>
                                        <span className="font-medium">LTP:</span>{" "}
                                        <span className="text-lg font-bold">₹{stock.price}</span>
                                    </p>
                                </div>
                            </div>
                            <div className="text-right mt-2">
                                <button
                                    className="text-sm font-medium text-blue-600 hover:text-blue-800 underline"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleCardClick(stock);
                                    }}
                                >
                                    View More
                                </button>
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
