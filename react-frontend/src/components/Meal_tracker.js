import React, { useState } from 'react';
import FoodItem from './Food_item';

//can change any of this. very rough

const MealTracker = ({ meal, handleAddFood }) => {
  const [selectedFoods, setSelectedFoods] = useState([]);

  const handleFoodSelect = (food) => {
    setSelectedFoods([...selectedFoods, food]);
  };

  const handleRemoveFood = (food) => {
    setSelectedFoods(selectedFoods.filter((f) => f.id !== food.id));
  };

  const handleConfirmFoods = () => {
    handleAddFood(selectedFoods);
    setSelectedFoods([]);
  };

  return (
    <div>
      <h2>{meal.name}</h2>
      <ul>
        {meal.foods.map((food) => (
          <FoodItem
            key={food.id}
            food={food}
            onSelect={handleFoodSelect}
            onRemove={handleRemoveFood}
            isSelected={selectedFoods.some((f) => f.id === food.id)}
          />
        ))}
      </ul>
      <button onClick={handleConfirmFoods}>Confirm Foods</button>
    </div>
  );
};

export default MealTracker;
