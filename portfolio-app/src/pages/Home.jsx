import React from "react";
import Header from "../components/Header";
import PortfolioCard from "../components/PortfolioCard";
import WatchlistCard from "../components/WatchlistCard";
import HomeCard from "../components/HomeCard";
import MarketCard from "../components/MarketCard";

const Home = () => {
    return (
        <div className="p-4 space-y-6 pb-20"> {/* Added pb-20 for padding-bottom */}
            <Header />
            <HomeCard />
            <MarketCard />
            <PortfolioCard />
            <WatchlistCard />
        </div>
    );
};

export default Home;
