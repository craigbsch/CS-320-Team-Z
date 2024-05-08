import React from "react";
import { Outlet } from "react-router-dom";
import { NavBar } from "../components";

// Define Layout component
const Layout = () => {
	// Render Layout component
	return (
		<>
			<NavBar />
			<Outlet />
		</>
	);
};

export default Layout;
