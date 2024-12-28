import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Market from "./pages/Market";
import Wallet from "./pages/Wallet";
import Profile from "./pages/Profile";
import Navbar from "./components/Navbar";
import '@fortawesome/fontawesome-free/css/all.min.css';

const App = () => {
  return (
    <Router>
      <div className="bg-gray-100 min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/market" element={<Market />} />
          <Route path="/wallet" element={<Wallet />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
        <Navbar />
      </div>
    </Router>
  );
};

export default App;
