import React from 'react';
import { Form } from 'react-bootstrap';

// Define WeightForm component
const WeightForm = ({ value, onChange, error }) => (
  <Form.Group controlId="formUserWeight">
    <Form.Label>Weight</Form.Label>
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

export default WeightForm;
