const WatchlistCard = () => (
    <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold text-secondary">My Watchlist</h3>
        <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="bg-gray-100 p-4 rounded-md">
                <h4 className="font-semibold text-secondary">Apple Inc.</h4>
                <p className="text-sm text-gray-500">AAPL</p>
            </div>
            <div className="bg-gray-100 p-4 rounded-md">
                <h4 className="font-semibold text-secondary">Amazon Inc.</h4>
                <p className="text-sm text-gray-500">AMZN</p>
            </div>
        </div>
    </div>
);

export default WatchlistCard;
