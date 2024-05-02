import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import Profile from "../components/Profile";
import UpdateGoalButton from "../components/UpdateGoalButton";

import {
  Chart as ChartJS,
  CategoryScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  LinearScale,
  BarController,
  BarElement
} from 'chart.js';
import {Bar} from "react-chartjs-2"

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarController,
  BarElement
);

const NutritionHistoryPage = () => {
  const [foods, setFoods] = useState([]);
  const [totalCalories, setTotalCalories] = useState(0);
  const [totalCarbs, setTotalCarbs] = useState(0);
  const [totalProtein, setTotalProtein] = useState(0);
  const [totalFat, setTotalFat] = useState(0); // New state for total fat
  const [foodName, setFoodName] = useState("");
  const [foodCalories, setFoodCalories] = useState(0);
  const [foodCarbs, setFoodCarbs] = useState(0);
  const [foodProtein, setFoodProtein] = useState(0);
  const [foodFat, setFoodFat] = useState(0); // New state for individual fat

  useEffect(() => {
    // Calculate total nutrition values whenever foods change
    const calories = foods.reduce((total, food) => total + food.calories, 0);
    const carbs = foods.reduce((total, food) => total + food.carbs, 0);
    const protein = foods.reduce((total, food) => total + food.protein, 0);
    const fat = foods.reduce((total, food) => total + food.fat, 0); // Calculate total fat
    setTotalCalories(calories);
    setTotalCarbs(carbs);
    setTotalProtein(protein);
    setTotalFat(fat); // Set total fat
  }, [foods]);

  const addFood = () => {
    const newFood = {
      name: foodName,
      calories: parseInt(foodCalories),
      carbs: parseInt(foodCarbs),
      protein: parseInt(foodProtein),
      fat: parseInt(foodFat), // Include fat consumption
    };
    setFoods([...foods, newFood]);
    // Clear input fields after adding food
    setFoodName("");
    setFoodCalories(0);
    setFoodCarbs(0);
    setFoodProtein(0);
    setFoodFat(0); // Clear fat input field
  };

  const removeFood = (index) => {
    const updatedFoods = [...foods];
    updatedFoods.splice(index, 1);
    setFoods(updatedFoods);
  };

  // Data for the bar graph
  const data = {
    labels: ["Calories", "Carbs (g)", "Protein (g)", "Fat (g)"], // Add fat to labels
    datasets: [
      {
        label: "Amount Consumed",
        backgroundColor: ["rgba(255, 99, 132, 0.2)", "rgba(54, 162, 235, 0.2)", "rgba(255, 206, 86, 0.2)", "rgba(75, 192, 192, 0.2)"],
        borderColor: ["rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)", "rgba(255, 206, 86, 1)", "rgba(75, 192, 192, 1)"],
        borderWidth: 1,
        data: [totalCalories, totalCarbs, totalProtein, totalFat], // Add total fat to data
      },
    ],
  };

  return (
    <div style={{ display: "flex" }}>
      {/* Left side with Add button and food list */}
      <div style={{ marginRight: "20px" }}>
        <h2>Nutrition History</h2>
        <div className="add-food">
          <input
            type="text"
            placeholder="Food Name"
            value={foodName}
            onChange={(e) => setFoodName(e.target.value)}
          />
          <input
            type="number"
            placeholder="Calories"
            value={foodCalories}
            onChange={(e) => setFoodCalories(e.target.value)}
          />
          <input
            type="number"
            placeholder="Carbs (g)"
            value={foodCarbs}
            onChange={(e) => setFoodCarbs(e.target.value)}
          />
          <input
            type="number"
            placeholder="Protein (g)"
            value={foodProtein}
            onChange={(e) => setFoodProtein(e.target.value)}
          />
          <input
            type="number"
            placeholder="Fat (g)" // Add fat input field
            value={foodFat}
            onChange={(e) => setFoodFat(e.target.value)}
          />
          <Button variant="primary" onClick={addFood}>
            Add
          </Button>
        </div>

        {/* Display added foods */}
        <div>
          <h4>Added Foods:</h4>
          <ul>
            {foods.map((food, index) => (
              <li key={index}>
                {food.name}{" "}
                <Button variant="danger" onClick={() => removeFood(index)}>
                  Remove
                </Button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Right side with the bar graph */}
      <div>
        {/* Bar graph to display nutrition information */}
        <div className="bar-graph">
          <Bar
            data={data}
            width={400}
            height={300}
            options={{
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    callback: function (value) {
                      return value;
                    },
                  },
                  scaleLabel: {
                    display: true,
                    labelString: "Amount",
                  },
                },
              },
            }}
          />
        </div>
      </div>


      <div>

      <Profile userComponent={UpdateGoalButton} defaultActiveTab="goals" />
      


      </div>
    </div>
  );
};

export default NutritionHistoryPage;
