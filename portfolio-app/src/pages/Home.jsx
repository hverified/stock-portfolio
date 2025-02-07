import React from "react";
import Header from "../components/Header";
import PortfolioCard from "../components/PortfolioCard";
import MarketCard from "../components/MarketCard";
import StockSearchCard from "../components/StockSearchCard";

const Home = () => {
    return (
        <div className="space-y-5 p-6 space-y-6 bg-gradient-to-b from-blue-50 to-gray-100 min-h-screen">
            <Header />
            <MarketCard />
            <PortfolioCard />
            <StockSearchCard />
        </div>
    );
};

export default Home;
