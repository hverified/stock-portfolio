import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Navbar from "./components/Navbar";
import Orders from "./pages/Orders";
import Basket from "./pages/Basket";
import '@fortawesome/fontawesome-free/css/all.min.css';

const App = () => {
  return (
    <Router>
      <div className="bg-gray-100 min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/basket" element={<Basket />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
        <Navbar />
      </div>
    </Router>
  );
};

export default App;
