import React from "react";
import {
	render,
	screen,
	cleanup,
	getAllByRole,
	getByRole,
} from "@testing-library/react";
import { Layout } from "../pages";
import { BrowserRouter } from "react-router-dom";

const rend = () =>
	render(
		<BrowserRouter>
			<Layout />
		</BrowserRouter>
	);

describe("Layout Tests", () => {
	const originalConsoleError = console.error;
	beforeAll(() => {
		console.error = jest.fn();
	});

	afterAll(() => {
		cleanup();
		console.error = originalConsoleError;
	});

	it("renders header Text", () => {
		rend();
		expect(screen.getByText("Nutrition Calc")).toBeInTheDocument();
	});

	it("renders Back Button", () => {
		rend();
		expect(
			screen.getByRole("button", { class: "back-button btn btn-link" })
		).toBeInTheDocument();
	});

	it.skip("renders Profile button", () => {
		rend();
		expect(
			screen.getByRole("generic", { name: "profile-container" })
		).toBeInTheDocument();
	});
});
