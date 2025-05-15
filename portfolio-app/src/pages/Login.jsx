import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock } from "@fortawesome/free-solid-svg-icons";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { login } = useAuth();

    const handleLogin = () => {
        if (email && password) {
            if (email === "9716" && password === "9716") {
                login();
            } else {
                toast.error("Invalid credentials.", {
                    position: "top-center",
                    autoClose: 3000,
                    theme: "colored",
                });
            }
        }
    };

    const isButtonDisabled = !email || !password;

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6">
            <style>{`
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-in-up {
          animation: slideInUp 0.4s ease-out forwards;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.4s ease-out forwards;
        }
      `}</style>
            <div className="max-w-2xl mx-auto w-full max-w-sm bg-white/95 backdrop-blur-xl rounded-3xl shadow-xl hover:shadow-2xl border border-blue-200/50 p-4 sm:p-6 space-y-4 sm:space-y-6 animate-slide-in-up transition-all duration-300">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 text-center">
                    Welcome Back!
                </h2>
                <div className="space-y-4 sm:space-y-6">
                    <div className="animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
                        <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
                            Username
                        </label>
                        <div className="relative">
                            <FontAwesomeIcon
                                icon={faUser}
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-600 flex-shrink-0"
                            />
                            <input
                                type="text"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full p-2.5 sm:p-3 pl-10 sm:pl-12 bg-blue-50 border border-gray-200 rounded-xl text-gray-700 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:bg-blue-50/70 transition-all duration-200"
                                placeholder="Enter your username"
                            />
                        </div>
                    </div>
                    <div className="animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
                        <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
                            Password
                        </label>
                        <div className="relative">
                            <FontAwesomeIcon
                                icon={faLock}
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-600 flex-shrink-0"
                            />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full p-2.5 sm:p-3 pl-10 sm:pl-12 bg-blue-50 border border-gray-200 rounded-xl text-gray-700 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:bg-blue-50/70 transition-all duration-200"
                                placeholder="Enter your password"
                            />
                        </div>
                    </div>
                    <button
                        onClick={handleLogin}
                        disabled={isButtonDisabled}
                        className={`w-full bg-blue-600 text-white py-2.5 sm:py-3 rounded-xl text-base font-semibold shadow-sm hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all duration-200 animate-fade-in-up ${isButtonDisabled
                                ? "bg-blue-400 cursor-not-allowed scale-100"
                                : ""
                            }`}
                        style={{ animationDelay: "0.3s" }}
                    >
                        Log In
                    </button>
                </div>
            </div>
            <ToastContainer
                position="top-center"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
                toastStyle={{
                    backgroundColor: "#2563eb",
                    color: "white",
                    borderRadius: "0.75rem",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                }}
            />
        </div>
    );
};

export default Login;