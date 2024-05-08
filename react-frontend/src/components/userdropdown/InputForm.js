import React from 'react';
import { Form } from 'react-bootstrap';

// Define InputForm component
const InputForm = ({ controlId, label, type, value, onChange, error, options }) => {
  // Function to render form control based on type
  const renderControl = () => {
    if (type === "select") {
      // Render select control for 'select' type
      return (
        <Form.Select value={value} onChange={onChange} isInvalid={!!error}>
          {options.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </Form.Select>
      );
    } else {
      // Render input control for other types
      return (
        <Form.Control
          type={type}
          value={value}
          onChange={onChange}
          isInvalid={!!error}
        />
      );
    }
  };
  // Render InputForm component
  return (
    <Form.Group controlId={controlId}>
      <Form.Label>{label}</Form.Label>
      {renderControl()}
      {error && <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>}
    </Form.Group>
  );
};

export default InputForm;
