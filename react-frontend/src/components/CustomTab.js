import React, { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';

const CustomTab = ({ onCloseModal, onSubmitCustomItem }) => {
  const [formData, setFormData] = useState({
    calories: '',
    carbohydrates: '',
    fat: '',
    protein: ''
  });
  const [error, setError] = useState(null); // State to manage the error message

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Check if all fields contain a positive number
    const isValid = Object.values(formData).every(value => !isNaN(value) && value.trim() !== '' && parseFloat(value) >= 0);
    if (isValid) {
      // Handle form submission if all fields contain positive numbers
      onSubmitCustomItem(formData); // Call the onSubmitCustomItem function passed as prop
      onCloseModal(); // Close the modal after successful submission
    } else {
      // Display error message if any field is blank, not a number, or negative
      setError('Error: All fields need to contain a positive number.');
    }
  };
  
  return (
    <Modal show={true} onHide={onCloseModal} size="md" centered>
      <Modal.Header closeButton>
        <Modal.Title>New Tab</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="calories">
            <Form.Label>Calories</Form.Label>
            <Form.Control
              type="number"
              name="calories"
              value={formData.calories}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="carbohydrates">
            <Form.Label>Carbohydrates</Form.Label>
            <Form.Control
              type="number"
              name="carbohydrates"
              value={formData.carbohydrates}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="fat">
            <Form.Label>Fat</Form.Label>
            <Form.Control
              type="number"
              name="fat"
              value={formData.fat}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="protein">
            <Form.Label>Protein</Form.Label>
            <Form.Control
              type="number"
              name="protein"
              value={formData.protein}
              onChange={handleChange}
            />
          </Form.Group>
          {error && <Alert variant="danger">{error}</Alert>} {/* Display error message if present */}
          <div style={{ marginTop: '10px' }}>
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CustomTab;