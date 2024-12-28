import React from "react";
import Header from "../components/Header";
import PortfolioCard from "../components/PortfolioCard";
import HomeCard from "../components/HomeCard";
import MarketCard from "../components/MarketCard";

const Home = () => {
    return (
        <div className="p-4 space-y-6 pb-20">
            <Header />
            {/* <HomeCard /> */}
            <MarketCard />
            <PortfolioCard />
        </div>
    );
};

export default Home;
