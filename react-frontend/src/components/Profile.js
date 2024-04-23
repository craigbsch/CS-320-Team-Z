import {React, useEffect} from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Dropdown } from 'react-bootstrap';
import "../styling/Profile.css"

const Profile = () => {
  const { user, isAuthenticated, isLoading, getAccessTokenSilently, logout } = useAuth0();

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

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  const handleLogout = () => logout({ returnTo: window.location.origin });
  console.log(user)
  
  return (
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
        <Dropdown.Item eventKey="2">Settings</Dropdown.Item>
        <Dropdown.Divider />
        <Dropdown.Item eventKey="3" onClick={handleLogout}>
          Log out
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default Profile;
