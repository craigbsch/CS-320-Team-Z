import React from 'react';
import { Form } from 'react-bootstrap';

const FormField = ({ label, type = 'text', value, onChange, error }) => (
  <Form.Group controlId={`formUser${label}`}>
    <Form.Label>{label}</Form.Label>
    <Form.Control
      type={type}
      value={value}
      onChange={onChange}
      isInvalid={!!error}
    />
    <Form.Control.Feedback type="invalid">
      {error}
    </Form.Control.Feedback>
  </Form.Group>
);

export default FormField;
