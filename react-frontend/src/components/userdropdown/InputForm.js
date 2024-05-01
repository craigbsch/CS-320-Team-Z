import React from 'react';
import { Form } from 'react-bootstrap';

const InputForm = ({ controlId, label, type, value, onChange, error, options }) => {
  const renderControl = () => {
    if (type === "select") {
      return (
        <Form.Select value={value} onChange={onChange} isInvalid={!!error}>
          {options.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </Form.Select>
      );
    } else {
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

  return (
    <Form.Group controlId={controlId}>
      <Form.Label>{label}</Form.Label>
      {renderControl()}
      {error && <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>}
    </Form.Group>
  );
};

export default InputForm;
