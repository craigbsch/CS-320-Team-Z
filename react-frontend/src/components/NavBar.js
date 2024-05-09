import React from "react";
import Navbar from "react-bootstrap/Navbar";
import { Button } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import Profile from "./Profile";
import UserProfile from "./userdropdown/UserProfile";
import "../styling/Navbar.css";

const NavBar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Determines where to navigate when back button is clicked
    const handleBack = () => {
        if (location.pathname === "/nutritionHistory") {
            navigate("/viewMenu");
        } else if (location.pathname === "/viewMenu") {
            navigate("/nutritionHistory");
        }
    };

    return (
        <Navbar className="navbar">
            <Button variant="link" onClick={handleBack} className="back-button">
                    <FaArrowLeft />
                </Button>
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
