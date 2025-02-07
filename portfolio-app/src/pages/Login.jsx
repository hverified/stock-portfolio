import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { login } = useAuth();

    const handleLogin = () => {
        if (email && password) {
            if (email === "9716" && password === "9716") {
                login();
            } else {
                toast.error("Invalid credentials.", { position: "top-center" });
            }
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-50">
            <div className="bg-white p-8 rounded-lg shadow-xl w-96 max-w-sm">
                <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">Welcome Back!</h2>
                <div className="mb-6">
                    <label className="block text-lg font-medium text-gray-700 mb-2">Username</label>
                    <div className="relative">
                        <input
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your username"
                        />
                    </div>
                </div>
                <div className="mb-6">
                    <label className="block text-lg font-medium text-gray-700 mb-2">Password</label>
                    <div className="relative">
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your password"
                        />
                    </div>
                </div>
                <button
                    onClick={handleLogin}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition duration-300"
                >
                    Log In
                </button>
            </div>
            <ToastContainer />
        </div>
    );
};

export default Login;
