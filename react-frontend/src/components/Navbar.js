import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";

const NavBar = () => {
	return (
		<Navbar style={{ backgroundColor: "#6C1515" }}>
			<Container style={{ display: "flex", justifyContent: "center" }}>
				<Navbar.Brand>
					<h1 style={{ color: "white" }}>Nutrition Calc</h1>
				</Navbar.Brand>
			</Container>
		</Navbar>
	);
};

export default NavBar;
