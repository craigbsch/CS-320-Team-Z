import React from 'react';
import { Modal, Button, Form, Tab, Tabs} from 'react-bootstrap';
import HeightForm from './HeightForm';
import WeightForm from './WeightForm';
import GenderForm from './GenderForm';
import AgeForm from './AgeForm';
import './UserModal.css'
import CaloriesForm from './CaloriesForm';
import CarbohydratesForm from './CarbohydratesForm';
import ProteinForm from './ProteinForm';
import FatForm from './FatForm';

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
 *  - onAgeChange (function): called for changes to the age input.
 *  - onWeightChange (function): called for changes to the weight input.
 *  - onGenderChange (function): called for changes to the gender selection.
 *  - onSubmitModal (function): called when the user submits the form.
 *
*/
const UserModal = ({ showModal, onCloseModal, height, weight, age, gender, calories, carbohydrates, protein, fat, errors, onHeightChange, onWeightChange, onChangeGoals, onAgeChange, onGenderChange, onCaloriesChange, onCarbohydratesChange, onProteinChange, onFatChange, onSubmitModal }) => (
  <Modal show={showModal} onHide={onCloseModal} centered-size="1g">
    <Modal.Header closeButton>
      <Modal.Title>User Settings</Modal.Title>
    </Modal.Header>
    <Modal.Body>
    <Tabs
  defaultActiveKey="personal"
  id="fill-tab-example"
  className="mb-3"
  fill
  justify
>
        
      <Tab eventKey="personal" title="User Metadata">
        <Form>
          <HeightForm value={height} onChange={onHeightChange} error={errors.height} /> 
          <WeightForm value={weight} onChange={onWeightChange} error={errors.weight} />
          <AgeForm value = {age} onChange = {onAgeChange} error = {errors.age} />
          <GenderForm value={gender} onChange={onGenderChange} />
        </Form>
      </Tab>


      <Tab eventKey="goals" title = "User Goals">
      <Form>
          <CaloriesForm value={calories} onChange={onCaloriesChange}  /> 
          <CarbohydratesForm value={carbohydrates} onChange={onCarbohydratesChange}  />
          <ProteinForm value = {protein} onChange = {onProteinChange} />
          <FatForm value={fat} onChange={onFatChange} />
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
