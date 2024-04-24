import React from 'react';
import { Dropdown } from 'react-bootstrap';

const UserProfile = ({ user, onShowModal, onLogout }) => (
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
      <Dropdown.Item eventKey="2" onClick={onShowModal}>Settings</Dropdown.Item>
      <Dropdown.Divider />
      <Dropdown.Item eventKey="3" onClick={onLogout}>
        Log out
      </Dropdown.Item>
    </Dropdown.Menu>
  </Dropdown>
);

export default UserProfile;
