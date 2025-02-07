import React from "react";
import { NavLink } from "react-router-dom";

const NavbarLink = ({ to, iconClass, label }) => {
    return (
        <NavLink
            to={to}
            className={({ isActive }) =>
                isActive
                    ? "text-primary font-semibold transform scale-110 transition-all duration-300"
                    : "text-gray-500 hover:text-primary hover:scale-105 transform transition-all duration-300"
            }
        >
            <i className={`${iconClass} text-2xl mb-1`}></i>
            <p className="text-xs">{label}</p>
        </NavLink>
    );
};

const Navbar = () => {
    return (
        <div className="fixed bottom-0 w-full bg-white shadow-lg rounded-t-3xl flex justify-around items-center py-4 h-16 border-t-2 border-gray-200">
            <NavbarLink to="/" iconClass="fas fa-home" label="Home" />
            <NavbarLink to="/orders" iconClass="fa-solid fa-book" label="Screener" />
            <NavbarLink to="/logs" iconClass="fa-solid fa-list" label="Logs" />
            <NavbarLink to="/profile" iconClass="fas fa-user" label="Profile" />
        </div>
    );
};

export default Navbar;
