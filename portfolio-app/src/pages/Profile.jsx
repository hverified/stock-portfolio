import React from "react";

const Profile = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-6 tracking-tight text-center">
                    User Profile
                </h1>
                <div
                    className="p-6 rounded-2xl shadow-lg bg-white transform hover:scale-105 transition-transform duration-300 animate-fade-in max-w-md mx-auto"
                >
                    <div className="flex justify-center mb-4">
                        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-300 flex items-center justify-center transform hover:scale-110 transition-transform duration-200">
                            <svg
                                className="w-12 h-12 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                ></path>
                            </svg>
                        </div>
                    </div>

                    <div className="flex items-center justify-center mb-4">
                        <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                        <h2 className="text-xl font-bold text-gray-800">Mohd Khalid Siddiqui</h2>
                    </div>

                    <div className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-lg shadow-sm">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex items-center space-x-2">
                                <svg
                                    className="w-5 h-5 text-gray-500"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                    ></path>
                                </svg>
                                <div>
                                    <p className="text-xs text-gray-500">Contact</p>
                                    <p className="text-sm font-medium text-gray-800">9716519550</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <svg
                                    className="w-5 h-5 text-gray-500"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                    ></path>
                                </svg>
                                <div>
                                    <p className="text-xs text-gray-500">Email</p>
                                    <p className="text-sm font-medium text-gray-800">khalid@example.com</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-center">
                        <button className="flex items-center space-x-2 px-4 py-2 text-sm text-white bg-emerald-500 rounded-lg shadow-md hover:bg-emerald-600 transition-colors duration-200">
                            <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                ></path>
                            </svg>
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;