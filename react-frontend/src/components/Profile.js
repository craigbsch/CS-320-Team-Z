import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Dropdown, Modal, Button, Form } from 'react-bootstrap';
import "../styling/Profile.css"

const Profile = () => {
  const { user, isAuthenticated, isLoading, getAccessTokenSilently, logout } = useAuth0();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchAccessToken = async () => {
      try {
        const accessToken = await getAccessTokenSilently();
        console.log("Access Token:", accessToken);
      } catch (error) {
        console.error("Error fetching access token:", error);
      }
    };

    if (isAuthenticated) {
      fetchAccessToken();
    }
  }, [isAuthenticated, getAccessTokenSilently]);

  const handleLogout = () => logout({ returnTo: window.location.origin });
  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  const testEndpoint = () => {
    // Test endpoint functionality
  }

  console.log(user);

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
          <Dropdown.Item eventKey="3" onClick={testEndpoint}>Test Endpoint</Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item eventKey="4" onClick={handleLogout}>
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
            <Form.Group controlId="formUserName">
              <Form.Label>Height</Form.Label>
              <Form.Control type="text" defaultValue={user.custom_metadata.height} />
            </Form.Group>
            <Form.Group controlId="formUserNickname">
              <Form.Label>Weight</Form.Label>
              <Form.Control type="text" defaultValue={user.custom_metadata.weight} />
            </Form.Group>
            <Form.Group controlId="formUserGender">
              <Form.Label>Gender</Form.Label>
              <Form.Select defaultValue={user.custom_metadata.gender}>
                <option value="prefer_not_to_say">Prefer not to say</option>
                <option value="other">Other</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </Form.Select>
            </Form.Group>
            {/* Add more user metadata fields here as needed */}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary">
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Profile;
