import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Navbar from "./components/Navbar";
import Orders from "./pages/Orders";
import Login from "./pages/Login";
import { useAuth } from "./context/AuthContext";
import '@fortawesome/fontawesome-free/css/all.min.css';
import LogViewer from "./pages/LogViewer";
import Insights from "./pages/Insights";

const App = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      <div className="bg-gray-100 min-h-screen pb-16">
        {isAuthenticated && <Navbar />}

        <Routes>
          <Route path="/" element={isAuthenticated ? <Home /> : <Login />} />
          <Route path="/orders" element={isAuthenticated ? <Orders /> : <Login />} />
          <Route path="/logs" element={isAuthenticated ? <LogViewer /> : <Login />} />
          <Route path="/insights" element={isAuthenticated ? <Insights /> : <Login />} />
          <Route path="/profile" element={isAuthenticated ? <Profile /> : <Login />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
