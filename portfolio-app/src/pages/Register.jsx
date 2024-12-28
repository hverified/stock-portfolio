import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const navigate = useNavigate();

    const handleRegister = () => {
        if (password === confirmPassword) {
            // You can integrate your registration logic here.
            navigate("/login"); // Redirect to login page after registration
        } else {
            alert("Passwords do not match.");
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-md w-80">
                <h2 className="text-xl font-semibold text-center mb-4">Register</h2>
                <input
                    type="text"
                    placeholder="Username"
                    className="w-full p-2 border rounded-lg mb-4"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    className="w-full p-2 border rounded-lg mb-4"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Confirm Password"
                    className="w-full p-2 border rounded-lg mb-4"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                    onClick={handleRegister}
                    className="w-full p-2 bg-blue-500 text-white rounded-lg"
                >
                    Register
                </button>
                <p className="text-center mt-4">
                    Already have an account?{" "}
                    <a href="/login" className="text-blue-500">
                        Login here
                    </a>
                </p>
            </div>
        </div>
    );
};

export default Register;
