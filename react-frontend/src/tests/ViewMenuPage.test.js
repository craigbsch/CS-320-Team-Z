import React from "react";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import { ViewMenuPage } from "../pages";
import { Provider } from "react-redux";
import { store } from "../redux/store";

const rend = () =>
	render(
		<Provider store={store}>
			<ViewMenuPage />
		</Provider>
	);

describe("ViewMenuPage Tests", () => {
	const originalConsoleError = console.error;
	beforeAll(() => {
		console.error = jest.fn();
	});

	afterAll(() => {
		cleanup();
		console.error = originalConsoleError;
	});

	it("renders header", () => {
		rend();
		expect(screen.getByText("View Menus")).toBeInTheDocument();
	});

	it("renders Dining Hall Selector", () => {
		rend();
		expect(
			screen.getByRole("button", {
				name: /Select hall/i,
			})
		).toBeInTheDocument();
	});

	it("renders Date Selector", () => {
		rend();
		const buttons = screen.getAllByRole("button");
		expect(
			buttons.find((button) => /^\d{4}-\d{2}-\d{2}$/.test(button.textContent))
		).toBeInTheDocument();
	});

	it.skip("renders Menu", async () => {
		rend();
		fireEvent.click(
			screen.getByRole("button", {
				name: /Select hall/i,
			})
		);
		fireEvent.click(
			screen.getByRole("button", {
				name: /Worcester/i,
			})
		);
		expect(await screen.findByRole("table")).toBeInTheDocument();
	});
});
