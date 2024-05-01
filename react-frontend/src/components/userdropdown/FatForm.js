import React from 'react';
import { Form } from 'react-bootstrap';

const FatForm = ({ value, onChange, error }) => (
  <Form.Group controlId="formUserFat">
    <Form.Label>Fat</Form.Label>
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

export default FatForm;
