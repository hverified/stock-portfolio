import React, { useState, useEffect } from "react";

const Header = () => {
    const getGreetingAndIcon = () => {
        const hours = new Date().getHours();
        if (hours >= 5 && hours < 12) {
            return { greeting: "Good Morning", icon: "mug" }; // Morning
        } else if (hours >= 12 && hours < 18) {
            return { greeting: "Good Afternoon", icon: "sun" }; // Afternoon
        } else {
            return { greeting: "Good Evening", icon: "moon" }; // Evening
        }
    };

    const [currentTime, setCurrentTime] = useState(null);
    const [greetingData, setGreetingData] = useState(getGreetingAndIcon());

    useEffect(() => {
        setCurrentTime(new Date());
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        const greetingTimer = setInterval(() => {
            setGreetingData(getGreetingAndIcon());
        }, 3600000);

        return () => {
            clearInterval(timer);
            clearInterval(greetingTimer);
        };
    }, []);

    const renderIcon = (iconType) => {
        switch (iconType) {
            case "mug":
                return (
                    <svg
                        className="w-5 h-5 text-yellow-500 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M20 7l-10 6-10-6m10 13V3m-8 10h16"
                        ></path>
                    </svg>
                );
            case "sun":
                return (
                    <svg
                        className="w-5 h-5 text-yellow-500 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                        ></path>
                    </svg>
                );
            case "moon":
                return (
                    <svg
                        className="w-5 h-5 text-yellow-500 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                        ></path>
                    </svg>
                );
            default:
                return null;
        }
    };

    return (
        <div className="p-4 rounded-2xl shadow-lg bg-white transform hover:scale-105 transition-transform duration-300 border-gray-300 flex justify-between items-center">
            <div>
                <p className="text-xs text-gray-500">{greetingData.greeting}, Khalid!</p>
                <h2 className="text-xl font-bold text-gray-800 flex items-center">
                    {renderIcon(greetingData.icon)}
                    {currentTime ? currentTime.toLocaleTimeString() : "Loading..."}
                </h2>
            </div>
            <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 transition-colors duration-200">
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    ></path>
                </svg>
            </button>
        </div>
    );
};

export default Header;