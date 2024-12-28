const HomeCard = () => (
    <div className="relative p-6 rounded-lg shadow-lg border border-white/20 overflow-hidden bg-gray-800">
        <div className="relative z-10 text-white">
            <p className="text-sm text-gray-400">Total Asset Value</p> {/* Muted color for the label */}
            <h1 className="text-3xl font-bold mt-2">$42,256.18</h1>
            <p className="text-green-400 mt-2">+2.84% (+2.83% from last week)</p> {/* Green for positive */}
        </div>
    </div>
);

export default HomeCard;
