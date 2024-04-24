import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import HeightForm from './HeightForm';
import WeightForm from './WeightForm';
import GenderForm from './GenderForm';

/**
 * UserModal Component
 * 
 * This component renders a modal dialog for user settings, allowing the user to update
 * their height, weight, and gender. 
 * 
 * Props:
 *  - showModal (boolean): Controls the visibility of the modal.
 *  - onCloseModal (function): Callback function that is called when the modal needs to be closed.
 *  - height (string): The current height value, displayed and modified in the HeightForm component.
 *  - weight (string): The current weight value, displayed and modified in the WeightForm component.
 *  - gender (string): The current gender selection, managed by the GenderForm component.
 *  - errors (object): Contains any errors related to the form inputs. Keys correspond to form names
 *                     ('height', 'weight'), and values are error messages.
 *  - onHeightChange (function): called for changes to the height input.
 *  - onWeightChange (function): called for changes to the weight input.
 *  - onGenderChange (function): called for changes to the gender selection.
 *  - onSubmitModal (function): called when the user submits the form.
 *
*/
const UserModal = ({ showModal, onCloseModal, height, weight, gender, errors, onHeightChange, onWeightChange, onGenderChange, onSubmitModal }) => (
  <Modal show={showModal} onHide={onCloseModal}>
    <Modal.Header closeButton>
      <Modal.Title>User Settings</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <Form>
        <HeightForm value={height} onChange={onHeightChange} error={errors.height} /> 
        <WeightForm value={weight} onChange={onWeightChange} error={errors.weight} />
        <GenderForm value={gender} onChange={onGenderChange} />
      </Form>
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={onCloseModal}>Close</Button>
      <Button variant="primary" onClick={onSubmitModal}>Save Changes</Button>
    </Modal.Footer>
  </Modal>
);

export default UserModal;
