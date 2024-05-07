import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Profile from "../components/Profile";
import CustomTab from "../components/CustomTab";
import UpdateGoalButton from "../components/UpdateGoalButton";
import NutritionGraph from "../components/NutritionGraph";

const NutritionHistoryPage = () => {
  const navigate = useNavigate();
  const [showCustomTab, setShowCustomTab] = useState(false); // State to control the visibility of the custom tab

  const navigateToMenu = () => {
    navigate('/viewMenu');
  };

  const handleShowCustomTab = () => {
    setShowCustomTab(true); // Show the custom tab when the button is clicked
  };

  const handleCloseCustomTab = () => {
    setShowCustomTab(false); // Close the custom tab
  };

  const handleSubmitCustomItem = (formData) => {
    // Logic to handle submission of custom item
    console.log("Custom item submitted:", formData);
  };

  return (
    <div className="container" style={{ textAlign: 'center', marginTop: '20px' }}>
      {/* Graph display centered */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <NutritionGraph />
      </div>

      {/* User profile and goal management with button, aligned horizontally */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '40px' }}>
        <div style={{ marginRight: '10px'}}>
          <Profile userComponent={UpdateGoalButton} defaultActiveTab="goals" />
        </div>
        <Button variant="primary" onClick={navigateToMenu}>
          Add Meal
        </Button>
        <div style={{ marginRight: '10px'}}></div>
        <Button variant="primary" onClick={handleShowCustomTab}> {/* Button to show the custom tab */}
          Add Custom Meal
        </Button>
      </div>

      {/* Conditional rendering of the custom tab */}
      {showCustomTab && <CustomTab onSubmitCustomItem={handleSubmitCustomItem} onCloseModal={handleCloseCustomTab} />}
    </div>
  );
};

export default NutritionHistoryPage;