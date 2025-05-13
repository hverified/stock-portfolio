import React from "react";
import Header from "../components/Header";
import PortfolioCard from "../components/PortfolioCard";
import MarketCard from "../components/MarketCard";

const Home = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 pb-20">
            <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
                <Header />
                <MarketCard />
                <PortfolioCard />
            </div>
        </div>
    );
};

export default Home;