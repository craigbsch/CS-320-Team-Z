import React from 'react';
import { Button } from 'react-bootstrap'; // Import Button from react-bootstrap

const UpdateGoalButton = ({ onShowModal }) => (
  <Button onClick={onShowModal} variant="primary">Edit Goals</Button> // Use Bootstrap Button with 'primary' variant
);

export default UpdateGoalButton;
