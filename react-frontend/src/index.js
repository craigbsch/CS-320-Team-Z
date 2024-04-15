import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
import LoginPage from "./pages/LoginPage";
import ViewMenuPage from "./pages/ViewMenuPage";
import "bootstrap/dist/css/bootstrap.min.css";
import { Provider } from "react-redux";
import { store } from "./redux/store.js";
import { createRoot } from 'react-dom/client';
import { Auth0Provider } from '@auth0/auth0-react';
import AutoLogin from "./components/AutoLogin.js";


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
<Auth0Provider
    domain="dev-dvb6li7z8kj02il0.us.auth0.com"
    clientId="VhHtVyvfRtjN3ldu7gY8D2uAOuHD2pTV"
    authorizationParams={{
      redirect_uri: window.location.origin + '/viewMenu'
    }}
  >
		<Provider store={store}>
			<BrowserRouter>
				<Routes>
					<Route index element={<AutoLogin />} /> 
					<Route path='/' element={<Layout />}>
					<Route path='viewMenu' element={<ViewMenuPage />} />
					</Route>
				</Routes>
			</BrowserRouter>
		</Provider>
	</Auth0Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
