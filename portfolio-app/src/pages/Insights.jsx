import React, { useState, useEffect } from "react";
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import currencyFormat from "../utils/helperFunction";

const MetricsCard = ({ metrics }) => (
    <div className="p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 shadow-lg hover:shadow-xl transition-shadow duration-300">
        <h3 className="text-base font-semibold text-gray-800 mb-3">Key Metrics</h3>
        <div className="grid grid-cols-2 gap-3">
            {metrics.map(({ label, value, icon, color, isPercentage }, index) => {
                const percentage = isPercentage ? parseFloat(value) : null;
                const radius = 10;
                const circumference = 2 * Math.PI * radius;
                const strokeDashoffset = percentage ? circumference - (percentage / 100) * circumference : 0;

                return (
                    <div
                        key={index}
                        className="flex items-center p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300 animate-fade-in"
                        style={{ animationDelay: `${index * 0.1}s` }}
                    >
                        {isPercentage ? (
                            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                                <circle
                                    cx="12"
                                    cy="12"
                                    r={radius}
                                    fill="none"
                                    stroke="#e5e7eb/50"
                                    strokeWidth="3"
                                />
                                <circle
                                    cx="12"
                                    cy="12"
                                    r={radius}
                                    fill="none"
                                    stroke={color}
                                    strokeWidth="3"
                                    strokeDasharray={circumference}
                                    strokeDashoffset={strokeDashoffset}
                                    className="transition-all duration-1000 ease-in-out"
                                    style={{ transform: "rotate(-90deg)", transformOrigin: "50% 50%" }}
                                />
                            </svg>
                        ) : (
                            <div className="p-1 rounded-full bg-opacity-20 mr-2" style={{ backgroundColor: color }}>
                                {React.cloneElement(icon, { className: `${icon.props.className} w-4 h-4` })}
                            </div>
                        )}
                        <div>
                            <p className="text-[10px] font-medium text-gray-700 leading-tight">{label}</p>
                            <p className="text-sm font-bold text-gray-900">{value}</p>
                        </div>
                    </div>
                );
            })}
        </div>
    </div>
);

const ChartCard = ({ title, children }) => (
    <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 shadow-lg border border-white/20">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
        {children}
    </div>
);

const PerformanceTable = ({ title, data, keyField, valueField }) => (
    <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 shadow-lg border border-white/20 overflow-x-auto">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
        <table className="w-full text-sm text-left">
            <thead className="bg-gray-50/50">
                <tr>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">{keyField}</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase text-right">Profit/Loss</th>
                </tr>
            </thead>
            <tbody>
                {data.map((item) => (
                    <tr key={item[keyField]} className="border-t border-gray-200/20">
                        <td className="px-6 py-4 font-medium text-gray-800">{item[keyField]}</td>
                        <td className={`px-6 py-4 text-right font-semibold ${item[valueField] >= 0 ? "text-green-600" : "text-red-600"}`}>
                            ₹ {currencyFormat(item[valueField])}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

const Dashboard = () => {
    const [insights, setInsights] = useState({});
    const [monthWiseData, setMonthWiseData] = useState([]);
    const [yearlyWiseData, setYearlyWiseData] = useState([]);
    const [loading, setLoading] = useState(true);
    const baseUrl = import.meta.env.VITE_API_BASE_URL;

    useEffect(() => {
        const fetchStockData = async () => {
            try {
                const response = await fetch(`${baseUrl}/screener/stocks`);
                const data = await response.json();
                if (Array.isArray(data)) processStockData(data);
            } catch (error) {
                console.error("Error fetching stock data:", error);
            } finally {
                setLoading(false);
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
            monthWiseMap = {},
            yearlyWiseMap = {};

        data.forEach(({ sell_price, buy_price, quantity, date }) => {
            if (sell_price > 0) {
                const profitLoss = (sell_price - buy_price) * quantity;
                totalInvestment += buy_price * quantity;
                profitLoss > 0 ? profitCount++ : lossCount++;
                totalProfit += Math.max(0, profitLoss);
                totalLoss += Math.min(0, profitLoss);

                const monthKey = new Date(date).toLocaleString("default", { month: "short", year: "numeric" });
                monthWiseMap[monthKey] = (monthWiseMap[monthKey] || 0) + profitLoss;

                const yearKey = new Date(date).getFullYear();
                yearlyWiseMap[yearKey] = (yearlyWiseMap[yearKey] || 0) + profitLoss;
            }
        });

        const totalTrades = profitCount + lossCount;
        const netProfitLoss = totalProfit + totalLoss;
        const profitFactor = totalLoss !== 0 ? (totalProfit / Math.abs(totalLoss)).toFixed(2) : totalProfit.toFixed(2) || 0;

        setInsights({
            totalTrades,
            profitCount,
            lossCount,
            winRate: totalTrades > 0 ? ((profitCount / totalTrades) * 100).toFixed(2) : 0,
            lossRate: totalTrades > 0 ? ((lossCount / totalTrades) * 100).toFixed(2) : 0,
            totalProfit: totalProfit.toFixed(2),
            totalLoss: Math.abs(totalLoss).toFixed(2),
            netProfitLoss: netProfitLoss.toFixed(2),
            profitFactor,
            avgProfitPerTrade: profitCount > 0 ? (totalProfit / profitCount).toFixed(2) : 0,
            avgLossPerTrade: lossCount > 0 ? (Math.abs(totalLoss) / lossCount).toFixed(2) : 0,
            totalInvestment: totalInvestment.toFixed(2),
            totalReturns: (parseFloat(totalInvestment) + parseFloat(netProfitLoss)).toFixed(2),
            returnOnInvestment: totalInvestment > 0 ? ((netProfitLoss / totalInvestment) * 100).toFixed(2) : 0,
        });

        setMonthWiseData(
            Object.entries(monthWiseMap)
                .map(([month, profitLoss]) => ({ month, profitLoss: profitLoss.toFixed(2) }))
                .sort((a, b) => new Date(`01-${a.month}`) - new Date(`01-${b.month}`))
        );

        setYearlyWiseData(
            Object.entries(yearlyWiseMap)
                .map(([year, profitLoss]) => ({ year: String(year), profitLoss: profitLoss.toFixed(2) }))
                .sort((a, b) => parseInt(a.year) - parseInt(b.year))
        );
    };

    const metrics = [
        {
            label: "Total Trades",
            value: insights.totalTrades,
            icon: (
                <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13v8a2 2 0 01-2 2H5a2 2 0 01-2-2v-8l3-3m6-3h6m-6 3v6" />
                </svg>
            ),
            color: "rgba(59, 130, 246, 0.1)",
        },
        {
            label: "Total Investment",
            value: `₹ ${currencyFormat(insights.totalInvestment)}`,
            icon: (
                <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            color: "rgba(99, 102, 241, 0.1)",
        },
        {
            label: "Total Returns",
            value: `₹ ${currencyFormat(insights?.totalReturns)}`,
            icon: (
                <svg className={`w-6 h-6 ${insights?.netProfitLoss >= 0 ? "text-green-600" : "text-red-600"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
            ),
            color: insights?.netProfitLoss >= 0 ? "rgba(34, 197, 94, 0.1)" : "rgba(239, 68, 68, 0.1)",
        },
        {
            label: "Net Profit/Loss",
            value: `₹ ${currencyFormat(insights?.netProfitLoss)}`,
            icon: insights?.netProfitLoss >= 0 ? (
                <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
            ) : (
                <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                </svg>
            ),
            color: insights?.netProfitLoss >= 0 ? "rgba(34, 197, 94, 0.1)" : "rgba(239, 68, 68, 0.1)",
        },
        {
            label: "Win Rate",
            value: `${insights.winRate}%`,
            isPercentage: true,
            color: "#84cc16",
        },
        {
            label: "Loss Rate",
            value: `${insights.lossRate}%`,
            isPercentage: true,
            color: "#f97316",
        },
        {
            label: "ROI",
            value: `${Math.abs(insights.returnOnInvestment)}%`,
            isPercentage: true,
            color: insights.returnOnInvestment >= 0 ? "#9333ea" : "#dc2626",
        },
        {
            label: "Profit Factor",
            value: insights?.profitFactor,
            icon: (
                <svg className="w-6 h-6 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 4v-2m3 4v-2m2-2h4a2 2 0 002-2v-1H5v1a2 2 0 002 2h4m2 4h.01M19 13v-3m-9 10h2m-3-10h3m-3-6h3" />
                </svg>
            ),
            color: "rgba(20, 184, 166, 0.1)",
        },
        {
            label: "Avg Profit/Trade",
            value: `₹ ${currencyFormat(insights?.avgProfitPerTrade)}`,
            icon: (
                <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
            ),
            color: "rgba(34, 197, 94, 0.1)",
        },
        {
            label: "Avg Loss/Trade",
            value: `₹ ${currencyFormat(insights?.avgLossPerTrade)}`,
            icon: (
                <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                </svg>
            ),
            color: "rgba(239, 68, 68, 0.1)",
        },
    ];

    const monthlyBarData = monthWiseData.map(({ month, profitLoss }) => ({
        month,
        Profit: Math.max(0, parseFloat(profitLoss)),
        Loss: Math.min(0, parseFloat(profitLoss)),
    }));

    const yearlyBarData = yearlyWiseData.map(({ year, profitLoss }) => ({
        year,
        Profit: Math.max(0, parseFloat(profitLoss)),
        Loss: Math.min(0, parseFloat(profitLoss)),
    }));

    return (
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
            <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
            <div className="max-w-7xl mx-auto">
                <h2 className="text-3xl font-bold text-gray-900 mb-8">Trading Dashboard</h2>

                {loading ? (
                    <div className="flex justify-center items-center h-48">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {/* Consolidated Metrics Card */}
                        <MetricsCard metrics={metrics} />

                        {/* Monthly Profit/Loss Bar Chart */}
                        {monthWiseData.length > 0 && (
                            <ChartCard title="Monthly Profit & Loss">
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={monthlyBarData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb/50" />
                                        <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#6b7280" }} />
                                        <YAxis tickFormatter={(value) => `₹${currencyFormat(value)}`} tick={{ fontSize: 12, fill: "#6b7280" }} />
                                        <Tooltip
                                            formatter={(value) => `₹${currencyFormat(value)}`}
                                            labelFormatter={(label) => `Month: ${label}`}
                                            contentStyle={{ backgroundColor: "rgba(255, 255, 255, 0.9)", borderRadius: "8px", border: "1px solid rgba(229, 231, 235, 0.5)" }}
                                        />
                                        <Legend wrapperStyle={{ fontSize: 12 }} />
                                        <Bar dataKey="Profit" fill="url(#profitGradient)" name="Profit" radius={[4, 4, 0, 0]} />
                                        <Bar dataKey="Loss" fill="url(#lossGradient)" name="Loss" radius={[4, 4, 0, 0]} />
                                        <defs>
                                            <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8} />
                                                <stop offset="95%" stopColor="#16a34a" stopOpacity={0.6} />
                                            </linearGradient>
                                            <linearGradient id="lossGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                                                <stop offset="95%" stopColor="#dc2626" stopOpacity={0.6} />
                                            </linearGradient>
                                        </defs>
                                    </BarChart>
                                </ResponsiveContainer>
                            </ChartCard>
                        )}

                        {/* Yearly Profit/Loss Bar Chart */}
                        {yearlyWiseData.length > 0 && (
                            <ChartCard title="Yearly Profit & Loss">
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={yearlyBarData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb/50" />
                                        <XAxis dataKey="year" tick={{ fontSize: 12, fill: "#6b7280" }} />
                                        <YAxis tickFormatter={(value) => `₹${currencyFormat(value)}`} tick={{ fontSize: 12, fill: "#6b7280" }} />
                                        <Tooltip
                                            formatter={(value) => `₹${currencyFormat(value)}`}
                                            labelFormatter={(label) => `Year: ${label}`}
                                            contentStyle={{ backgroundColor: "rgba(255, 255, 255, 0.9)", borderRadius: "8px", border: "1px solid rgba(229, 231, 235, 0.5)" }}
                                        />
                                        <Legend wrapperStyle={{ fontSize: 12 }} />
                                        <Bar dataKey="Profit" fill="url(#profitGradient)" name="Profit" radius={[4, 4, 0, 0]} />
                                        <Bar dataKey="Loss" fill="url(#lossGradient)" name="Loss" radius={[4, 4, 0, 0]} />
                                        <defs>
                                            <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8} />
                                                <stop offset="95%" stopColor="#16a34a" stopOpacity={0.6} />
                                            </linearGradient>
                                            <linearGradient id="lossGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                                                <stop offset="95%" stopColor="#dc2626" stopOpacity={0.6} />
                                            </linearGradient>
                                        </defs>
                                    </BarChart>
                                </ResponsiveContainer>
                            </ChartCard>
                        )}

                        {/* Month-Wise Profit/Loss Table */}
                        {monthWiseData.length > 0 && (
                            <PerformanceTable title="Monthly Performance" data={monthWiseData} keyField="month" valueField="profitLoss" />
                        )}

                        {/* Year-Wise Profit/Loss Table */}
                        {yearlyWiseData.length > 0 && (
                            <PerformanceTable title="Yearly Performance" data={yearlyWiseData} keyField="year" valueField="profitLoss" />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;