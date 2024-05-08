// Importing necessary dependencies from react and Auth0
import { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

// Defining a component for automatic login
const AutoLogin = () => {
  // Accessing the loginWithRedirect function from Auth0
  const { loginWithRedirect } = useAuth0();
  // Using the useEffect hook to trigger automatic login when the component mounts
  useEffect(() => {
    loginWithRedirect(); // Initiating login with redirection
  }, [loginWithRedirect]); // Dependency array to ensure useEffect runs only once

  return null; // No UI to render
};

export default AutoLogin;
