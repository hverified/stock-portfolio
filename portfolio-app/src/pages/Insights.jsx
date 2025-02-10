import React, { useState, useEffect } from "react";

const Dashboard = () => {
    const [insights, setInsights] = useState({});
    const [monthWiseData, setMonthWiseData] = useState([]);
    const baseUrl = import.meta.env.VITE_API_BASE_URL;

    useEffect(() => {
        const fetchStockData = async () => {
            try {
                const response = await fetch(`${baseUrl}/screener/stocks`);
                const data = await response.json();
                if (Array.isArray(data)) processStockData(data);
            } catch (error) {
                console.error("Error fetching stock data:", error);
            }
        };
        fetchStockData();
    }, []);

    const processStockData = (data) => {
        let profitCount = 0,
            lossCount = 0,
            totalProfit = 0,
            totalLoss = 0,
            monthWiseMap = {};

        data.forEach(({ sell_price, buy_price, quantity, date }) => {
            if (sell_price > 0) {
                const profitLoss = (sell_price - buy_price) * quantity;
                const monthKey = new Date(date).toLocaleString("default", { month: "short", year: "numeric" });
                profitLoss > 0 ? (profitCount++, (totalProfit += profitLoss)) : (lossCount++, (totalLoss += profitLoss));
                monthWiseMap[monthKey] = (monthWiseMap[monthKey] || 0) + profitLoss;
            }
        });

        setInsights({
            totalProfitCount: profitCount,
            totalLossCount: lossCount,
            totalProfitAmount: totalProfit.toFixed(2),
            totalLossAmount: Math.abs(totalLoss).toFixed(2),
            netProfitLoss: (totalProfit + totalLoss).toFixed(2),
        });

        setMonthWiseData(
            Object.entries(monthWiseMap)
                .map(([month, profitLoss]) => ({ month, profitLoss: profitLoss.toFixed(2) }))
                .sort((a, b) => new Date(`01-${a.month}`) - new Date(`01-${b.month}`))
        );
    };

    return (
        <div className="p-4 bg-gray-100 min-h-screen">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Trade Dashboard</h2>

            <div className="p-4 bg-white rounded-lg shadow-md mb-4">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Trading Insights</h3>
                <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                        ["Total Profits (Count)", insights.totalProfitCount, "text-green-600"],
                        ["Total Losses (Count)", insights.totalLossCount, "text-red-600"],
                        [
                            "Net Profit/Loss",
                            `₹${insights.netProfitLoss}`,
                            insights.netProfitLoss >= 0 ? "text-green-600" : "text-red-600",
                        ],
                    ].map(([label, value, style], idx) => (
                        <div key={idx}>
                            <p className="text-sm text-gray-600">{label}</p>
                            <p className={`text-xl font-bold ${style}`}>{value}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="p-4 bg-white rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Month-Wise Profit/Loss</h3>
                <table className="min-w-full text-sm">
                    <thead className="bg-gray-50 text-gray-500">
                        <tr>
                            <th className="px-4 py-2 text-left">Month</th>
                            <th className="px-4 py-2 text-right">Profit/Loss (₹)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {monthWiseData.map(({ month, profitLoss }) => (
                            <tr key={month}>
                                <td className="px-4 py-2">{month}</td>
                                <td className={`px-4 py-2 text-right font-bold ${profitLoss >= 0 ? "text-green-600" : "text-red-600"}`}>
                                    ₹{profitLoss}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Dashboard;
