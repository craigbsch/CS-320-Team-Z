// importing necessary components from the React Bootstrap library
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import LogoutButton from "../components/LogoutButton";
import Profile from "./Profile";

//functional component for the navigation bar
const NavBar = () => {
	//rendering for the navigation bar
	return (
		<Navbar style={{ backgroundColor: "#6C1515" }}>
			<Container style={{ display: "flex", justifyContent: "center" }}>
				<Navbar.Brand>
					<h1 style={{ color: "white" }}>Nutrition Calc</h1>
				</Navbar.Brand>
				<LogoutButton></LogoutButton>
				<Profile></Profile>
			</Container>
		</Navbar>
	);
};

//Exporting the NavBar component to be used elsewhere in the app
export default NavBar;
