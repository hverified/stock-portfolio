import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons"; // Import the icon you want

const Profile = () => {
    return (
        <div className="min-h-screen bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 p-8">
            <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-xl">
                <div className="flex justify-center mb-8">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-primary flex items-center justify-center">
                        <FontAwesomeIcon icon={faUserCircle} size="6x" className="text-gray-400" />
                    </div>
                </div>

                <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">Mohd Khalid Siddiqui</h1>

                <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
                    <p className="text-gray-600">
                        <span className="font-semibold text-gray-800">Contact:</span> 9716519550
                    </p>
                    <p className="text-gray-600">
                        <span className="font-semibold text-gray-800">Email:</span> khalid@example.com
                    </p>
                </div>

                <div className="mt-8 flex justify-center">
                    <button className="px-6 py-2 text-white bg-primary rounded-lg shadow-md hover:bg-primary-dark transition-colors duration-300">
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Profile;
