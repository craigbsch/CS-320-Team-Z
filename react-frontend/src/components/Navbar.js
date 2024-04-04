// importing necessary components from the React Bootstrap library
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";

//functional component for the navigation bar
const NavBar = () => {
	//rendering for the navigation bar
	return (
		<Navbar expand='lg' className='bg-body-tertiary'>
			<Container>
				<Navbar.Brand>Nutrition Calc </Navbar.Brand>
			</Container>
		</Navbar>
	);
};

//Exporting the NavBar component to be used elsewhere in the app
export default NavBar;
