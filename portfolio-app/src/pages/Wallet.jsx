import React from "react";

const Wallet = () => {
    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Wallet</h1>
            <div className="bg-white p-4 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold">Total Balance</h2>
                <p className="text-3xl font-bold mt-2">$6,282.21</p>
            </div>
        </div>
    );
};

export default Wallet;
