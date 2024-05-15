import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import { NutritionHistoryPage, ViewMenuPage } from "../pages";
import { BrowserRouter } from "react-router-dom";
import {
	AutoLogin,
	ProtectedRoute,
	Auth0ProviderWithRedirectCallback,
} from "../components";

Object.defineProperty(window, "crypto", {
	value: {
		subtle: {},
		getRandomValues: jest.fn(),
	},
});

const rend = () =>
	render(
		<BrowserRouter>
			<Auth0ProviderWithRedirectCallback
				domain='dev-dvb6li7z8kj02il0.us.auth0.com'
				clientId='VhHtVyvfRtjN3ldu7gY8D2uAOuHD2pTV'
				useRefreshTokens='true'
				useRefreshTokensFallback='true'
				cacheLocation='localstorage'
				authorizationParams={{
					redirect_uri: window.location.origin + "/viewMenu",
					audience: "https://nutrition/info",
					scope: "openid profile email offline_access",
				}}
			>
				<NutritionHistoryPage />
			</Auth0ProviderWithRedirectCallback>
		</BrowserRouter>
	);

describe.skip("NutritionHistoryPage tests", () => {
	const originalConsoleError = console.error;
	beforeAll(() => {
		console.error = jest.fn();
	});

	afterAll(() => {
		cleanup();
		console.error = originalConsoleError;
	});

	it("renders dropdown", () => {
		rend();
		expect(screen.getByRole("combobox")).toBeInTheDocument();
	});
});
