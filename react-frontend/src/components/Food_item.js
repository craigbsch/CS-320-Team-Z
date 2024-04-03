import React from 'react';

const Food_item = ({ meal, onSelect, onRemove, isSelected }) => {
  return (
    <li>
      <span>{meal.name}</span>
      <button onClick={() => onSelect(meal)}>+</button>
      {isSelected && <button onClick={() => onRemove(meal)}>-</button>}
    </li>
  );
};

export default Food_item;
