import React from "react";
import { render, screen } from "@testing-library/react";
import { ViewMenuPage } from "../pages";
import { Provider } from "react-redux";
import { store } from "../redux/store";

render(
	<Provider store={store}>
		<ViewMenuPage />
	</Provider>
);

describe("ViewMenuPage Tests", () => {
	it("renders header", () => {
		expect(screen.getByText("View Menus")).toBeInTheDocument();
	});

	it("renders Dining Hall Selector", () => {
		expect(screen.getByText("Select your dining hall:")).toBeInTheDocument();
	});
});
