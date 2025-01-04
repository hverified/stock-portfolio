import React, { useState } from "react";

const Basket = () => {
    const [baskets, setBaskets] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [basketName, setBasketName] = useState("");
    const [maxTradeAmount, setMaxTradeAmount] = useState(0);
    const [selectedBasket, setSelectedBasket] = useState(null);
    const [newStock, setNewStock] = useState({ ticker: "", price: "", quantity: 0 });

    // Function to add a new basket
    const addBasket = () => {
        if (basketName && maxTradeAmount) {
            const newBasket = {
                name: basketName,
                maxTradeAmount,
                stocks: [],
            };
            setBaskets([...baskets, newBasket]);
            setBasketName("");
            setMaxTradeAmount(0);
            setShowModal(false);
        }
    };

    // Function to handle adding a stock to a basket
    const addStockToBasket = () => {
        if (newStock.ticker && newStock.quantity) {
            // Update the selected basket by adding the new stock
            const updatedBaskets = baskets.map((basket) => {
                if (basket.name === selectedBasket.name) {
                    return {
                        ...basket,
                        stocks: [...basket.stocks, newStock], // Add the new stock to the stocks array
                    };
                }
                return basket;
            });
            setBaskets(updatedBaskets); // Set the updated baskets state
            setNewStock({ ticker: "", price: "", quantity: 0 }); // Clear the stock input fields
        }
    };

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-6">
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md"
                >
                    Add Basket
                </button>
            </div>

            {/* Show the baskets created */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {baskets.length === 0 ? (
                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <p>No baskets created</p>
                    </div>
                ) : (
                    baskets.map((basket, index) => (
                        <div
                            key={index}
                            className="bg-white p-4 rounded-lg shadow-md cursor-pointer"
                            onClick={() => setSelectedBasket(basket)}
                        >
                            <h3 className="text-xl font-semibold">{basket.name}</h3>
                            <p>Max Trade Amount: ₹{basket.maxTradeAmount}</p>
                            <div>
                                <h4 className="mt-2 font-semibold">Stocks:</h4>
                                <div>
                                    {basket.stocks.length > 0 ? (
                                        basket.stocks.map((stock, index) => (
                                            <div key={index} className="mt-2">
                                                <p>
                                                    Ticker: {stock.ticker}, Quantity: {stock.quantity}
                                                </p>
                                            </div>
                                        ))
                                    ) : (
                                        <p>No stocks added</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Modal for adding a basket */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg w-96">
                        <h3 className="text-xl font-semibold mb-4">Add Basket</h3>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-600">Basket Name</label>
                            <input
                                type="text"
                                value={basketName}
                                onChange={(e) => setBasketName(e.target.value)}
                                className="w-full px-4 py-2 mt-2 border rounded-md bg-white text-black"
                                placeholder="Enter basket name"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-600">Max Trade Amount</label>
                            <input
                                type="number"
                                value={maxTradeAmount}
                                onChange={(e) => setMaxTradeAmount(Number(e.target.value))}
                                className="w-full px-4 py-2 mt-2 border rounded-md bg-white text-black"
                                placeholder="Enter maximum trade amount"
                            />
                        </div>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowModal(false)}
                                className="bg-gray-200 px-4 py-2 rounded-md text-sm"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={addBasket}
                                className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm"
                            >
                                Add Basket
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal for adding a stock */}
            {selectedBasket && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg w-96">
                        <h3 className="text-xl font-semibold mb-4">Add Stock to {selectedBasket.name}</h3>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-600">Ticker</label>
                            <input
                                type="text"
                                value={newStock.ticker}
                                onChange={(e) => setNewStock({ ...newStock, ticker: e.target.value })}
                                className="w-full px-4 py-2 mt-2 border rounded-md bg-white text-black"
                                placeholder="Enter stock ticker"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-600">Price (Optional)</label>
                            <input
                                type="number"
                                value={newStock.price}
                                onChange={(e) => setNewStock({ ...newStock, price: e.target.value })}
                                className="w-full px-4 py-2 mt-2 border rounded-md bg-white text-black"
                                placeholder="Enter stock price (Optional)"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-600">Quantity</label>
                            <input
                                type="number"
                                value={newStock.quantity}
                                onChange={(e) => setNewStock({ ...newStock, quantity: e.target.value })}
                                className="w-full px-4 py-2 mt-2 border rounded-md bg-white text-black"
                                placeholder="Enter quantity"
                            />
                        </div>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setSelectedBasket(null)}
                                className="bg-gray-200 px-4 py-2 rounded-md text-sm"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={addStockToBasket}
                                className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm"
                            >
                                Add Stock
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Basket;
