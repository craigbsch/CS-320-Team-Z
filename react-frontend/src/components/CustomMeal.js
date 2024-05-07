import React from 'react';
import { Button } from 'react-bootstrap'; // Import Button from react-bootstrap

const customMeal = ({ onClick }) => (
  <Button onClick={onClick} variant="primary">Add Custom Meal</Button> // Use Bootstrap Button with 'primary' variant
);

export default customMeal;
