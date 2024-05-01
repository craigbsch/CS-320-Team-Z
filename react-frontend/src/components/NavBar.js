import React from "react";
import Navbar from "react-bootstrap/Navbar";
import Profile from "./Profile";
import UserProfile from "./userdropdown/UserProfile";
import "../styling/Navbar.css";


//functional component for the navigation bar
const NavBar = () => {
	//rendering for the navigation bar
    return (
        <Navbar className="navbar">
            <div className="brand-container">
                <Navbar.Brand>
                    <h1 className="brand-title">Nutrition Calc</h1>
                </Navbar.Brand>
            </div>
            <div className="profile-container">
                <Profile userComponent={UserProfile} />
            </div>
        </Navbar>
    );
};

export default NavBar;
