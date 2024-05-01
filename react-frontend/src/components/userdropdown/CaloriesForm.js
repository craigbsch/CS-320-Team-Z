import React from 'react';
import { Form } from 'react-bootstrap';

const CaloriesForm = ({ value, onChange, error }) => (
  <Form.Group controlId="formUserCalories">
    <Form.Label>Calories</Form.Label>
    <Form.Control
      type="text"
      value={value}
      onChange={onChange}
      isInvalid={error}
    />
    <Form.Control.Feedback type="invalid">
      {error}
    </Form.Control.Feedback>
  </Form.Group>
);

export default CaloriesForm;
