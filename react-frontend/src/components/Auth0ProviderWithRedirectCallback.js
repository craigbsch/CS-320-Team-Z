//Importing necessary dependencies from react-router and Auth0
import { useNavigate } from "react-router";
import { Auth0Provider } from "@auth0/auth0-react";

// Defining a custom Auth0Provider component that includes a redirect callback
const Auth0ProviderWithRedirectCallback = ({ children, ...props }) => {
	const navigate = useNavigate();
	const onRedirectCallback = (appState) => {
	  navigate((appState && appState.returnTo) || window.location.pathname);
	};
	return (
	  <Auth0Provider onRedirectCallback={onRedirectCallback} {...props}>
		{children}
	  </Auth0Provider>
	);
  };

export default Auth0ProviderWithRedirectCallback
