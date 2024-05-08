// Importing necessary components from react-bootstrap
import Container from "react-bootstrap/Container";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";

// Defining a DiningHallSelector component
const DiningHallSelector = (props) => {
	// Array containing the names of dining halls
	const halls = ["Franklin", "Berkshire", "Worcester", "Hampshire"];

	// Rendering the component
	return (
		<Container className='d-flex justify-content-center align-items-center'>
			Select your dining hall:
			<DropdownButton id='dropdown-basic-button' title={props.hall}>
				{halls.map((hall) => (
					<Dropdown.Item key={hall} onClick={() => props.setHall(hall)}>
						{hall}
					</Dropdown.Item>
				))}
			</DropdownButton>
		</Container>
	);
};

export default DiningHallSelector;
