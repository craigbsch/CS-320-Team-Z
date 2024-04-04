import React from 'react';
//can change any of this. very rough

const FoodItem = ({ food, onSelect, onRemove, isSelected }) => {
  return (
    <li>
      <span>{food.name}</span>
      <button onClick={() => onSelect(food)}>+</button>
      {isSelected && <button onClick={() => onRemove(food)}>-</button>}
    </li>
  );
};

export default FoodItem;
