import React from 'react';
import { Form } from 'react-bootstrap';

const ProteinForm = ({ value, onChange, error }) => (
  <Form.Group controlId="formUserProtein">
    <Form.Label>Protein</Form.Label>
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

export default ProteinForm;
