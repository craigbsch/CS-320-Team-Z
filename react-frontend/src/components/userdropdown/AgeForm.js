import React from 'react';
import { Form } from 'react-bootstrap';

const AgeForm = ({ value, onChange, error }) => (
  <Form.Group controlId="formUserAge">
    <Form.Label>Age</Form.Label>
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

export default AgeForm;
