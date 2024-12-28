const MarketCard = () => {
    // Sample data for Nifty50 and Sensex
    const nifty50 = {
        price: 19150.25,
        change: 150.75,
        percentChange: 0.79
    };

    const sensex = {
        price: 65640.48,
        change: -320.42,
        percentChange: -0.49
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-secondary">Market Overview</h3>

            <div className="flex justify-between items-center gap-2 mt-4">
                {/* Nifty50 Data */}
                <div className="mr-4">
                    <p className="text-sm text-gray-500">Nifty50</p>
                    <p className="text-md font-semibold">{`₹${nifty50.price.toLocaleString()}`}</p>
                    <p className={`text-sm font-medium ${nifty50.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {nifty50.change >= 0 ? `+₹${nifty50.change.toFixed(2)}` : `-₹${Math.abs(nifty50.change).toFixed(2)}`}
                        {" "}({nifty50.percentChange.toFixed(2)}%)
                    </p>
                </div>

                {/* Sensex Data */}
                <div>
                    <p className="text-sm text-gray-500">Sensex</p>
                    <p className="text-md font-semibold">{`₹${sensex.price.toLocaleString()}`}</p>
                    <p className={`text-sm font-medium ${sensex.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {sensex.change >= 0 ? `+₹${sensex.change.toFixed(2)}` : `-₹${Math.abs(sensex.change).toFixed(2)}`}
                        {" "}({sensex.percentChange.toFixed(2)}%)
                    </p>
                </div>
            </div>

            {/* <button className="bg-gray-800 text-white py-2 px-4 rounded-md hover:bg-opacity-90 mt-4 w-full">
                View Details
            </button> */}
        </div>
    );
};

export default MarketCard;
