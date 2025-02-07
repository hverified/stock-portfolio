import React, { useState, useEffect } from "react";

const PortfolioCard = () => {
    const [portfolioData, setPortfolioData] = useState(null);
    const baseUrl = `${import.meta.env.VITE_API_BASE_URL}`;

    useEffect(() => {
        const fetchPortfolioData = async () => {
            try {
                const response = await fetch(`${baseUrl}/portfolio/get_fund_limits`);
                const result = await response.json();
                if (result.status === "success") {
                    setPortfolioData(result.data);
                } else {
                    console.error("API Error:", result.remarks);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchPortfolioData();
    }, []);

    const renderField = (label, value) => {
        return (
            <div>
                <p className="text-sm text-gray-500">{label}</p>
                {(value !== undefined) ? (
                    <p className="text-md font-semibold">{`₹${value.toLocaleString()}`}</p>
                ) : (
                    <div className="bg-gray-200 animate-pulse h-5 w-24 rounded-lg"></div>
                )}
            </div>
        );
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h3 className="text-lg font-semibold text-secondary">My Portfolio</h3>

            <div className="mt-2 grid grid-cols-2 gap-2">
                {renderField("Total", portfolioData?.availabelBalance ?
                    portfolioData?.availabelBalance + portfolioData?.utilizedAmount :
                    portfolioData?.availabelBalance)}
                {renderField("SOD Limit", portfolioData?.sodLimit)}
                {renderField("Invested Amount", portfolioData?.utilizedAmount)}
                {renderField("Balance", portfolioData?.withdrawableBalance)}
            </div>
        </div>
    );
};

export default PortfolioCard;
