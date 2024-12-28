import React from "react";

const Profile = () => {
    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Profile</h1>
            <div className="bg-white p-4 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold">User Details</h2>
                <p className="mt-2">Name: Randy Dorwart</p>
                <p>Email: randy@example.com</p>
            </div>
        </div>
    );
};

export default Profile;
