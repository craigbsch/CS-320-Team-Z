import React from 'react';
import { Modal, Button, Form, Tab, Tabs } from 'react-bootstrap';
import InputForm from './InputForm';
import './UserModal.css'

const UserModal = ({
  showModal, onCloseModal, height, weight, age, gender, calories, carbohydrates, protein, fat, errors,
  onHeightChange, onWeightChange, onAgeChange, onGenderChange,
  onCaloriesChange, onCarbohydratesChange, onProteinChange, onFatChange,
  onSubmitModal
}) => (
  <Modal show={showModal} onHide={onCloseModal} centered-size="1g">
    <Modal.Header closeButton>
      <Modal.Title>User Settings</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <Tabs defaultActiveKey="personal" id="fill-tab-example" className="mb-3" fill justify>
        <Tab eventKey="personal" title="User Metadata">
          <Form>
            <InputForm controlId="formUserHeight" label="Height" type="text" value={height} onChange={onHeightChange} error={errors.height} />
            <InputForm controlId="formUserWeight" label="Weight" type="text" value={weight} onChange={onWeightChange} error={errors.weight} />
            <InputForm controlId="formUserAge" label="Age" type="text" value={age} onChange={onAgeChange} error={errors.age} />
            <InputForm controlId="formUserGender" label="Gender" type="select" value={gender} onChange={onGenderChange} options={[
              { value: "prefer_not_to_say", label: "Prefer not to say" },
              { value: "other", label: "Other" },
              { value: "male", label: "Male" },
              { value: "female", label: "Female" }
            ]} />
          </Form>
        </Tab>
        <Tab eventKey="goals" title="User Goals">
          <Form>
            <InputForm controlId="formUserCalories" label="Calories" type="number" value={calories} onChange={onCaloriesChange} />
            <InputForm controlId="formUserCarbohydrates" label="Carbohydrates" type="number" value={carbohydrates} onChange={onCarbohydratesChange} />
            <InputForm controlId="formUserProtein" label="Protein" type="number" value={protein} onChange={onProteinChange} />
            <InputForm controlId="formUserFat" label="Fat" type="number" value={fat} onChange={onFatChange} />
          </Form>
        </Tab>
      </Tabs>
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={onCloseModal}>Close</Button>
      <Button variant="primary" onClick={onSubmitModal}>Save Changes</Button>
    </Modal.Footer>
  </Modal>
);

export default UserModal;
