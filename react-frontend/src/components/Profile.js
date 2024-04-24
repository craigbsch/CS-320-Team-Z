import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Dropdown, Modal, Button, Form } from 'react-bootstrap';
import "../styling/Profile.css"
import axios from "axios";

const Profile = () => {
  const { user, isAuthenticated, isLoading, getAccessTokenSilently, logout  } = useAuth0();
  const [showModal, setShowModal] = useState(false);
  const [height, setHeight] = useState(user.custom_metadata?.height || '');
  const [weight, setWeight] = useState(user.custom_metadata?.weight || '');
  const [gender, setGender] = useState(user.custom_metadata?.gender || 'prefer_not_to_say');



  const [errors, setErrors] = useState({});


  const handleHeightChange = (e) => setHeight(e.target.value);
  const handleWeightChange = (e) => setWeight(e.target.value);
  const handleGenderChange = (e) => setGender(e.target.value);





  const handleLogout = () => logout({ returnTo: window.location.origin });
  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);



  const validateMetadata = () => {
    let newErrors = {};
    // Validate height
    if (isNaN(height) || height < 0 || height > 100) {
      newErrors.height = 'Height must be a number between 0 and 100.';
    }

    // Validate weight
    if (isNaN(weight) || weight < 0 || weight > 500) {
      newErrors.weight = 'Weight must be a number between 0 and 500.';
    }

    setErrors(newErrors);
    // If there are no errors, newErrors will be an empty object
    return Object.keys(newErrors).length === 0;
  };



  const handleSubmitModal = async () => {


    if(!validateMetadata()){
      return
    }
    const metadata = {
      height,
      weight,
      gender,
    };



    try {
      const accessToken = await getAccessTokenSilently(); // ensure you get the token inside the function
      const response = await axios.post('https://dininginfobackend.azurewebsites.net/metadata/api/update_user', metadata, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
 
      console.log(response.data); // Log the response from the server
      setShowModal(false);  
    } catch (error) {
      console.error('Error submitting user metadata:', error);
      
    }

  };


  useEffect(() => {
    if (!showModal) { // This effect runs only when showModal becomes false
      const printNewAccessToken = async () => {
        try {
          const newAccessToken = await getAccessTokenSilently({ ignoreCache: true });
          console.log('New Access Token:', newAccessToken);
          console.log('User:',  user);
        } catch (error) {
          console.error('Error generating new access token:', error);
        }
      };

      printNewAccessToken();
    }
  }, [showModal, getAccessTokenSilently, user]);


  if (isLoading) {
    return <div>Loading ...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }



  return (
    <>
      <Dropdown align="end">
        <Dropdown.Toggle
          id="dropdown-custom-components"
          style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          as="a"
        >
          <img
            src={user.picture}
            alt="Profile"
            style={{ borderRadius: '50%', width: '50px', height: '50px' }}
          />
        </Dropdown.Toggle>

        <Dropdown.Menu className="dropdown-menu-right" align="end">
          <Dropdown.ItemText>{user.email}</Dropdown.ItemText>
          <Dropdown.Divider />
          <Dropdown.Item eventKey="1">My plan</Dropdown.Item>
          <Dropdown.Item eventKey="2" onClick={handleShowModal}>Settings</Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item eventKey="3" onClick={handleLogout}>
            Log out
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>User Settings</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formUserHeight">
              <Form.Label>Height</Form.Label>
              <Form.Control
              type="text"
              value={height}
              onChange={handleHeightChange}
              isInvalid={!!errors.height}
            />
            <Form.Control.Feedback type="invalid">
              {errors.height}
            </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="formUserWeight">
              <Form.Label>Weight</Form.Label>
              <Form.Control
              type="text"
              value={weight}
              onChange={handleWeightChange}
              isInvalid={!!errors.weight}
            />
            <Form.Control.Feedback type="invalid">
              {errors.weight}
            </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="formUserGender">
              <Form.Label>Gender</Form.Label> 
              <Form.Select
              value={gender}
              onChange={handleGenderChange}
            >
              <option value="prefer_not_to_say">Prefer not to say</option>
              <option value="other">Other</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmitModal}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Profile;
