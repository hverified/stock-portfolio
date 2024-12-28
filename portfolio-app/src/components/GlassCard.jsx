import React from "react";

const GlassCard = ({ title, content }) => {
    return (
        <div className="bg-white bg-opacity-20 backdrop-blur-md shadow-lg rounded-lg p-4 border border-white border-opacity-30">
            <h2 className="text-lg font-semibold text-white">{title}</h2>
            <p className="text-sm text-gray-200">{content}</p>
        </div>
    );
};

export default GlassCard;
