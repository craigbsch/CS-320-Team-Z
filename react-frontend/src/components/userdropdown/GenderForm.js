import React from 'react';
import { Form } from 'react-bootstrap';

const GenderForm = ({ value, onChange }) => (
  
<Form.Group controlId="formUserGender">
    <Form.Label>Gender</Form.Label> 
    <Form.Select
    value={value}
    onChange={onChange}
    >   
    <option value="prefer_not_to_say">Prefer not to say</option>
    <option value="other">Other</option>
    <option value="male">Male</option>
    <option value="female">Female</option>
</Form.Select>
</Form.Group>
);

export default GenderForm;


