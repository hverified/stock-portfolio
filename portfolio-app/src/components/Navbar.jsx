import React from "react";
import { NavLink } from "react-router-dom";

const NavbarLink = ({ to, icon: Icon, label }) => {
    return (
        <NavLink
            to={to}
            className={({ isActive }) =>
                `flex flex-col items-center relative p-2 rounded-full transition-all duration-200 transform active:scale-95 ${isActive
                    ? "text-blue-500 bg-blue-100"
                    : "text-gray-600 hover:text-blue-500 hover:bg-blue-50/50"
                }`
            }
        >
            {({ isActive }) => (
                <>
                    {isActive && (
                        <span className="absolute -top-1 w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                    )}
                    <Icon className="w-6 h-6" />
                    <p className="text-xs font-medium hidden sm:block">{label}</p>
                </>
            )}
        </NavLink>
    );
};

const Navbar = () => {
    const navLinks = [
        {
            to: "/",
            label: "Home",
            icon: (props) => (
                <svg
                    {...props}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    ></path>
                </svg>
            ),
        },
        {
            to: "/orders",
            label: "Orders",
            icon: (props) => (
                <svg
                    {...props}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    ></path>
                </svg>
            ),
        },
        {
            to: "/logs",
            label: "Logs",
            icon: (props) => (
                <svg
                    {...props}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01m-.01 4h.01"
                    ></path>
                </svg>
            ),
        },
        {
            to: "/insights",
            label: "Insights",
            icon: (props) => (
                <svg
                    {...props}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
                    ></path>
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M20.488 9H15V15.488"
                    ></path>
                </svg>
            ),
        },
        {
            to: "/profile",
            label: "Profile",
            icon: (props) => (
                <svg
                    {...props}
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
            ),
        },
    ];

    return (
        <div className="fixed bottom-0 w-full max-w-md mx-auto bg-white/90 backdrop-blur-md shadow-md rounded-t-xl flex justify-around items-center py-2 h-14 z-50 transform hover:-translate-y-1 transition-transform duration-300 animate-fade-in border-t border-blue-200/50">
            {navLinks.map((link) => (
                <NavbarLink
                    key={link.to}
                    to={link.to}
                    icon={link.icon}
                    label={link.label}
                />
            ))}
        </div>
    );
};

export default Navbar;