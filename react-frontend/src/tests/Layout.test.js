import React from "react";
import { render, screen } from "@testing-library/react";
import { Layout } from "../pages";

it.skip("renders Layout Text", () => {
	render(<Layout />);
	expect(screen.getByText("Nutrition Calc")).toBeInTheDocument();
});
