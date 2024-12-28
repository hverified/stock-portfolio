import React from "react";

const Market = () => {
    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Market</h1>
            <div className="bg-white p-4 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold">Top Gainers</h2>
                {/* Example: Dynamic List of Gainers */}
                <ul>
                    <li className="flex justify-between py-2 border-b">
                        <span>Apple Inc. (AAPL)</span>
                        <span className="text-green-500">+4.2%</span>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default Market;
