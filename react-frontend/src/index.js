import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
import ViewMenuPage from "./pages/ViewMenuPage";
import "bootstrap/dist/css/bootstrap.min.css";
import { Provider } from "react-redux";
import { store } from "./redux/store.js";
import AutoLogin from "./components/AutoLogin.js";
import ProtectedRoute from "./components/ProtectedRoute.js";
import Auth0ProviderWithRedirectCallback from "./components/Auth0ProviderWithRedirectCallback.js";


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(

	<Provider store={store}>
	<BrowserRouter>
		<Auth0ProviderWithRedirectCallback
			domain="dev-dvb6li7z8kj02il0.us.auth0.com"
			clientId="VhHtVyvfRtjN3ldu7gY8D2uAOuHD2pTV"
			authorizationParams={{
			redirect_uri: window.location.origin + '/viewMenu'
			}}
		>
		<Routes>
			<Route index element={<AutoLogin />} /> 
			<Route path='/' element={<ProtectedRoute component = {Layout} />}>
			<Route path='viewMenu' element={<ProtectedRoute component = {ViewMenuPage} />} />
			</Route>
		</Routes>
		</Auth0ProviderWithRedirectCallback>
	</BrowserRouter>
	</Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
