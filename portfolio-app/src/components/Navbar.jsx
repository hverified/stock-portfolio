import React from "react";
import { NavLink } from "react-router-dom";

const Navbar = () => {
    return (
        <div className="fixed bottom-0 w-full bg-white shadow-lg rounded-t-3xl flex justify-around items-center py-4 h-16 border-t-2 border-gray-200">
            <NavLink
                to="/"
                className={({ isActive }) =>
                    isActive
                        ? "text-primary font-semibold transform scale-110 transition-all duration-300"
                        : "text-gray-500 hover:text-primary hover:scale-105 transform transition-all duration-300"
                }
            >
                <i className="fas fa-home text-2xl mb-1"></i>
                <p className="text-xs">Home</p>
            </NavLink>
            <NavLink
                to="/orders"
                className={({ isActive }) =>
                    isActive
                        ? "text-primary font-semibold transform scale-110 transition-all duration-300"
                        : "text-gray-500 hover:text-primary hover:scale-105 transform transition-all duration-300"
                }
            >
                <i className="fa-solid fa-book text-2xl mb-1"></i>
                <p className="text-xs">Orders</p>
            </NavLink>
            <NavLink
                to="/basket"
                className={({ isActive }) =>
                    isActive
                        ? "text-primary font-semibold transform scale-110 transition-all duration-300"
                        : "text-gray-500 hover:text-primary hover:scale-105 transform transition-all duration-300"
                }
            >
                <i className="fas fa-cart-plus text-2xl mb-1"></i>
                <p className="text-xs">Basket</p>
            </NavLink>
            <NavLink
                to="/profile"
                className={({ isActive }) =>
                    isActive
                        ? "text-primary font-semibold transform scale-110 transition-all duration-300"
                        : "text-gray-500 hover:text-primary hover:scale-105 transform transition-all duration-300"
                }
            >
                <i className="fas fa-user text-2xl mb-1"></i>
                <p className="text-xs">Profile</p>
            </NavLink>
        </div>
    );
};

export default Navbar;
