import React from "react";
import PropTypes from "prop-types";

const BaseCard = ({
    children,
    className = "",
    bgColor = "bg-white",
    borderColor = "border-gray-300",
    shadow = "shadow-lg",
    rounded = "rounded-2xl",
    padding = "p-6",
    flexDir = "flex-row",
    gap = "gap-4",
    hoverEffect = true,
    onClick,
    ...props
}) => {
    return (
        <div
            className={`
        ${padding}
        ${rounded}
        ${shadow}
        ${bgColor}
        transition-transform
        justify-between
        w-full 
        mx-auto
        ${borderColor}
        flex
        ${flexDir}
        ${gap}
        max-w-2xl
        items-center
        transition-all
        duration-300
        ${hoverEffect ? "transform hover:scale-105 hover:shadow-xl" : ""}
        ${onClick ? "cursor-pointer" : ""}
        ${className}
      `}
            onClick={onClick}
            {...props}
        >
            {children}
        </div>
    );
};

BaseCard.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    bgColor: PropTypes.string,
    borderColor: PropTypes.string,
    shadow: PropTypes.string,
    rounded: PropTypes.string,
    padding: PropTypes.string,
    flexDir: PropTypes.string,
    gap: PropTypes.string,
    hoverEffect: PropTypes.bool,
    onClick: PropTypes.func,
};

export default BaseCard;