import React from "react";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faBook, faBug, faChartPie, faUser } from "@fortawesome/free-solid-svg-icons";

const NavbarLink = ({ to, icon, label }) => {
    return (
        <NavLink
            to={to}
            aria-label={label}
            className={({ isActive }) =>
                `flex flex-col items-center relative p-2 sm:p-3 md:p-2.5 rounded-xl transition-all duration-200 transform active:scale-90 hover:scale-110 hover:shadow-md ${isActive
                    ? "text-blue-700 bg-blue-100/80"
                    : "text-gray-600 hover:text-blue-600 hover:bg-blue-50/70"
                }`
            }
        >
            {({ isActive }) => (
                <>
                    <div
                        className={`p-2 sm:p-2.5 rounded-full transition-all duration-200 ${isActive ? "bg-blue-100/70 scale-110 shadow-sm" : "bg-transparent"
                            }`}
                    >
                        <FontAwesomeIcon
                            icon={icon}
                            className={`w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0 ${isActive ? "text-blue-700" : "text-gray-600 opacity-60"
                                }`}
                        />
                    </div>
                    <p className="text-xs sm:text-sm font-semibold mt-1 hidden sm:block">
                        {label}
                    </p>
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
            icon: faHouse,
        },
        {
            to: "/orders",
            label: "Orders",
            icon: faBook,
        },
        {
            to: "/logs",
            label: "Logs",
            icon: faBug,
        },
        {
            to: "/insights",
            label: "Insights",
            icon: faChartPie,
        },
        {
            to: "/profile",
            label: "Profile",
            icon: faUser,
        },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 w-full max-w-2xl mx-auto bg-gradient-to-t from-blue-50/50 to-white/95 backdrop-blur-xl shadow-xl hover:shadow-2xl rounded-t-3xl flex justify-around items-center py-2 sm:py-4 h-16 sm:h-20 z-50 transition-all duration-300 animate-slide-in-up border-t border-blue-200/50 supports-[backdrop-filter]:bg-white/80">
            <style>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-in-up {
          animation: slideInUp 0.4s ease-out forwards;
        }
      `}</style>
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