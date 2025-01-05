import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Navbar from "./components/Navbar";
import Orders from "./pages/Orders";
import Scanner from "./pages/Scanner";
import Login from "./pages/Login";  // Import Login page
import { useAuth } from "./context/AuthContext"; // Import useAuth hook
import '@fortawesome/fontawesome-free/css/all.min.css';

const App = () => {
  const { isAuthenticated } = useAuth(); // Get authentication status

  return (
    <Router>
      <div className="bg-gray-100 min-h-screen">
        {/* Only show Navbar if the user is authenticated */}
        {isAuthenticated && <Navbar />}

        <Routes>
          <Route path="/" element={isAuthenticated ? <Home /> : <Login />} />
          <Route path="/orders" element={isAuthenticated ? <Orders /> : <Login />} />
          <Route path="/scanner" element={isAuthenticated ? <Scanner /> : <Login />} />
          <Route path="/profile" element={isAuthenticated ? <Profile /> : <Login />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
