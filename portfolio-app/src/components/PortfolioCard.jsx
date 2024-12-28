const PortfolioCard = () => {
    // Sample data for the portfolio
    const stocks = {
        dailyPL: {
            amount: -150.25,
            percent: -1.23
        },
        totalPL: {
            amount: 1250.75,
            percent: 12.58
        },
        totalValue: 6282.21,
        totalInvested: 5000.00, // Added total invested
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h3 className="text-lg font-semibold text-secondary">My Portfolio</h3>

            {/* Grid layout for 2x2 */}
            <div className="mt-2 grid grid-cols-2 gap-2">

                {/* Current Amount */}
                <div>
                    <p className="text-sm text-gray-500">Current</p>
                    <p className="text-md font-semibold">{`₹${stocks.totalValue.toLocaleString()}`}</p>
                </div>
                {/* Total Returns */}
                <div>
                    <p className="text-sm text-gray-500">Total Returns</p>
                    {/* <p className="text-lg font-semibold">{`₹${stocks.totalPL.amount.toLocaleString()}`}</p> */}
                    <p className={`text-sm font-medium ${stocks.totalPL.amount >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {stocks.totalPL.amount >= 0 ? `+₹${stocks.totalPL.amount.toFixed(2)}` : `-₹${Math.abs(stocks.totalPL.amount).toFixed(2)}`}
                        {" "}({stocks.totalPL.percent.toFixed(2)}%)
                    </p>
                </div>
                {/* Total Invested */}
                <div>
                    <p className="text-sm text-gray-500">Invested</p>
                    <p className="text-md font-semibold">{`₹${stocks.totalInvested.toLocaleString()}`}</p>
                </div>



                {/* 1D Returns */}
                <div>
                    <p className="text-sm text-gray-500">1D Returns</p>
                    <p className={`text-sm font-medium ${stocks.dailyPL.amount >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {stocks.dailyPL.amount >= 0 ? `+₹${stocks.dailyPL.amount.toFixed(2)}` : `-₹${Math.abs(stocks.dailyPL.amount).toFixed(2)}`}
                        {" "}({stocks.dailyPL.percent.toFixed(2)}%)
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PortfolioCard;
