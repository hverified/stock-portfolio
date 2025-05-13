import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

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
            totalInvestment = 0,
            monthWiseMap = {};

        data.forEach(({ sell_price, buy_price, quantity, date }) => {
            if (sell_price > 0) {
                const profitLoss = (sell_price - buy_price) * quantity;
                totalInvestment += buy_price * quantity;
                profitLoss > 0 ? (profitCount++, (totalProfit += profitLoss)) : (lossCount++, (totalLoss += profitLoss));
                const monthKey = new Date(date).toLocaleString("default", { month: "short", year: "numeric" });
                monthWiseMap[monthKey] = (monthWiseMap[monthKey] || 0) + profitLoss;
            }
        });

        const netProfitLoss = totalProfit + totalLoss;
        const totalTrades = profitCount + lossCount;

        setInsights({
            totalProfitCount: profitCount,
            totalLossCount: lossCount,
            winPercentage: ((profitCount / totalTrades) * 100).toFixed(2),
            lossPercentage: ((lossCount / totalTrades) * 100).toFixed(2),
            netProfitLoss: netProfitLoss.toFixed(2),
            netProfitLossPercentage: ((netProfitLoss / totalInvestment) * 100).toFixed(2),
            totalInvestment: totalInvestment.toFixed(2),
            totalReturns: (totalProfit + totalLoss).toFixed(2),
        });

        setMonthWiseData(
            Object.entries(monthWiseMap)
                .map(([month, profitLoss]) => ({ month, profitLoss: profitLoss.toFixed(2) }))
                .sort((a, b) => new Date(`01-${a.month}`) - new Date(`01-${b.month}`))
        );
    };

    const pieData = [
        { name: "Won", value: parseFloat(insights.winPercentage || 0), color: "#41a564" },
        { name: "Lost", value: parseFloat(insights.lossPercentage || 0), color: "#f4796b" },
    ];

    return (
        <div className="p-4 bg-gray-100 min-h-screen pb-20">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Trade Dashboard</h2>

            {/* Insights */}
            <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {[
                    { label: "Total Investment", value: `₹${insights.totalInvestment}` },
                    { label: "Total Returns", value: `₹${insights.totalReturns}`, style: insights.totalReturns >= 0 ? "text-green-600" : "text-red-600" },
                    // { label: "Winning Trades (%)", value: `${insights.winPercentage}%`, style: "text-green-600" },
                    // { label: "Losing Trades (%)", value: `${insights.lossPercentage}%`, style: "text-red-600" },
                    { label: "Net Profit/Loss", value: `₹${insights.netProfitLoss}`, style: insights.netProfitLoss >= 0 ? "text-green-600" : "text-red-600" },
                    { label: "Net Profit/Loss (%)", value: `${insights.netProfitLossPercentage}%`, style: insights.netProfitLossPercentage >= 0 ? "text-green-600" : "text-red-600" },
                ].map(({ label, value, style }, idx) => (
                    <div key={idx} className="p-3 bg-white rounded-xl shadow text-center">
                        <p className="text-xs text-gray-600">{label}</p>
                        <p className={`text-lg font-bold ${style}`}>{value}</p>
                    </div>
                ))}
            </div>

            {/* Pie Chart */}
            <div className="p-4 bg-white rounded-xl shadow-md mt-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Trade Distribution</h3>
                <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                        <Pie
                            data={pieData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                            {pieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            {/* Monthly Stats */}
            <div className="p-4 bg-white rounded-xl shadow-md mt-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Month-Wise Profit/Loss</h3>
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
