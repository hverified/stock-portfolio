const PortfolioCard = () => {
    // Sample data for the portfolio
    const stocks = {
        numberOfStocks: 50,
        dailyPL: {
            amount: 150.25,
            percent: 1.23
        },
        totalPL: {
            amount: 1250.75,
            percent: 12.58
        },
        totalValue: 6282.21
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h3 className="text-xl font-semibold text-secondary">My Portfolio</h3>

            <div className="mt-4 flex justify-between items-center">
                {/* Portfolio value */}
                <div>
                    <p className="text-sm text-gray-500">Stocks</p>
                    <p className="text-lg font-semibold">{`₹${stocks.totalValue.toLocaleString()}`}</p>
                    <p className={`text-sm font-medium ${stocks.dailyPL.amount >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {stocks.dailyPL.amount >= 0 ? `+₹${stocks.dailyPL.amount.toFixed(2)}` : `-₹${Math.abs(stocks.dailyPL.amount).toFixed(2)}`}
                        {" "}({stocks.dailyPL.percent.toFixed(2)}%)
                    </p>
                </div>

                {/* Total P/L */}
                <div className="ml-4">
                    <p className="text-sm text-gray-500">Total P/L</p>
                    <p className="text-lg font-semibold">{`₹${stocks.totalPL.amount.toLocaleString()}`}</p>
                    <p className={`text-sm font-medium ${stocks.totalPL.amount >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {stocks.totalPL.amount >= 0 ? `+₹${stocks.totalPL.amount.toFixed(2)}` : `-₹${Math.abs(stocks.totalPL.amount).toFixed(2)}`}
                        {" "}({stocks.totalPL.percent.toFixed(2)}%)
                    </p>
                </div>
            </div>

            {/* Number of Stocks */}
            <div className="mt-4 flex justify-between items-center">
                <div>
                    <p className="text-sm text-gray-500">Number of Stocks</p>
                    <p className="text-lg font-semibold">{stocks.numberOfStocks}</p>
                </div>
            </div>

            {/* <button className="bg-gray-800 text-white py-2 px-4 rounded-md hover:bg-opacity-90 mt-4 w-full">
                View Details
            </button> */}
        </div>
    );
};

export default PortfolioCard;
