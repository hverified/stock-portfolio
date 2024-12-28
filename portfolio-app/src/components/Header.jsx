import React, { useState, useEffect } from "react";
import { faBell, faSun, faMoon, faMugSaucer } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Header = () => {
    const getGreetingAndIcon = () => {
        const hours = new Date().getHours();
        if (hours >= 5 && hours < 12) {
            return { greeting: "Good Morning", icon: faMugSaucer }; // Morning
        } else if (hours >= 12 && hours < 18) {
            return { greeting: "Good Afternoon", icon: faSun }; // Afternoon
        } else {
            return { greeting: "Good Evening", icon: faMoon }; // Evening
        }
    };

    const [currentTime, setCurrentTime] = useState(new Date());
    const [greetingData, setGreetingData] = useState(getGreetingAndIcon);

    useEffect(() => {
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

    return (
        <div className="flex justify-between items-center bg-white shadow-md px-4 py-3 rounded-lg">
            <div>
                <p className="text-sm text-gray-500">
                    {greetingData.greeting}, Khalid!
                </p>
                <h2 className="text-lg font-semibold text-secondary flex items-center">
                    <FontAwesomeIcon
                        icon={greetingData.icon}
                        className="text-yellow-500 mr-2" // Yellow color for both sun and moon
                    />
                    It is {currentTime.toLocaleTimeString()}
                </h2>
            </div>
            <button className="text-gray-500 hover:text-primary">
                <FontAwesomeIcon icon={faBell} className="text-xl" />
            </button>
        </div>
    );
};

export default Header;
