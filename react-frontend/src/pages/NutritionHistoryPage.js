import React from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Profile from "../components/Profile";
import UpdateGoalButton from "../components/UpdateGoalButton";
import NutritionGraph from "../components/NutritionGraph";

const NutritionHistoryPage = () => {
  const navigate = useNavigate();

  const navigateToMenu = () => {
    navigate('/viewMenu');
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
      </div>
    </div>
  );
};

export default NutritionHistoryPage;
