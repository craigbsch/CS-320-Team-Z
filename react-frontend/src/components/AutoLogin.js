import { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const AutoLogin = () => {
  const { loginWithRedirect } = useAuth0();

  useEffect(() => {
    loginWithRedirect();
  }, [loginWithRedirect]); 

  return null; // No UI to render
};

export default AutoLogin;
