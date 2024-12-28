import React from "react";
import { NavLink } from "react-router-dom";

const Navbar = () => {
    return (
        <div className="fixed bottom-0 w-full bg-white shadow-md flex justify-around py-4 h-16">
            <NavLink
                to="/"
                className={({ isActive }) =>
                    isActive
                        ? "text-primary font-semibold"
                        : "text-gray-500 hover:text-primary"
                }
            >
                <i className="fas fa-home text-xl"></i>
                <p className="text-xs">Home</p>
            </NavLink>
            <NavLink
                to="/profile"
                className={({ isActive }) =>
                    isActive
                        ? "text-primary font-semibold"
                        : "text-gray-500 hover:text-primary"
                }
            >
                <i className="fa-solid fa-book text-xl"></i>
                <p className="text-xs">Orders</p>
            </NavLink>
            <NavLink
                to="/market"
                className={({ isActive }) =>
                    isActive
                        ? "text-primary font-semibold"
                        : "text-gray-500 hover:text-primary"
                }
            >
                <i className="fas fa-chart-line text-xl"></i>
                <p className="text-xs">Market</p>
            </NavLink>
            <NavLink
                to="/wallet"
                className={({ isActive }) =>
                    isActive
                        ? "text-primary font-semibold"
                        : "text-gray-500 hover:text-primary"
                }
            >
                <i className="fas fa-wallet text-xl"></i>
                <p className="text-xs">Wallet</p>
            </NavLink>
            <NavLink
                to="/profile"
                className={({ isActive }) =>
                    isActive
                        ? "text-primary font-semibold"
                        : "text-gray-500 hover:text-primary"
                }
            >
                <i className="fas fa-user text-xl"></i>
                <p className="text-xs">Profile</p>
            </NavLink>
        </div>
    );
};

export default Navbar;
