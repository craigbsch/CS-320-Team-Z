import React from 'react';
import { Modal, Button, Form, Tab, Tabs } from 'react-bootstrap';
import InputForm from './InputForm';
import './UserModal.css';



/**
 * UserModal Component
 * 
 * This component is a modal used for updating and managing user settings and goals.
 * It uses the InputForm component to dynamically render form fields based on the userData state passed in as props.
 * 
 * Props:
 *  - showModal (boolean): Controls the visibility of the modal.
 *  - onCloseModal (function): Callback function to close the modal.
 *  - userData (object): Contains all user-related data including metadata and goals.
 *  - errors (object): Contains any errors for the form fields to handle validation feedback.
 *  - onChange (function): Function to handle changes in form inputs, updating the state in the parent component.
 *  - onSubmitModal (function): Function to handle the submission of the form, which triggers API calls to update user data.
 */



const UserModal = ({ showModal, onCloseModal, userData, errors, onChange, onSubmitModal }) => (
  <Modal show={showModal} onHide={onCloseModal}>
    <Modal.Header closeButton>
      <Modal.Title>User Settings</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <Tabs defaultActiveKey="personal" id="fill-tab-example" className="mb-3" fill justify>
        <Tab eventKey="personal" title="User Metadata">
          <Form>
            <InputForm controlId="formUserHeight" label="Height" type="text" value={userData.height} onChange={onChange('height')} error={errors.height} />
            <InputForm controlId="formUserWeight" label="Weight" type="text" value={userData.weight} onChange={onChange('weight')} error={errors.weight} />
            <InputForm controlId="formUserAge" label="Age" type="text" value={userData.age} onChange={onChange('age')} error={errors.age} />
            <InputForm controlId="formUserGender" label="Gender" type="select" value={userData.gender} onChange={onChange('gender')} options={[
              { value: "prefer_not_to_say", label: "Prefer not to say" },
              { value: "other", label: "Other" },
              { value: "male", label: "Male" },
              { value: "female", label: "Female" }
            ]} />
          </Form>
        </Tab>
        <Tab eventKey="goals" title="User Goals">
          <Form>
            <InputForm controlId="formUserCalories" label="Calories" type="number" value={userData.calories} onChange={onChange('calories')} />
            <InputForm controlId="formUserCarbohydrates" label="Carbohydrates" type="number" value={userData.carbohydrates} onChange={onChange('carbohydrates')} />
            <InputForm controlId="formUserProtein" label="Protein" type="number" value={userData.protein} onChange={onChange('protein')} />
            <InputForm controlId="formUserFat" label="Fat" type="number" value={userData.fat} onChange={onChange('fat')} />
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
