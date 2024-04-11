import Container from "react-bootstrap/Container";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";

const DiningHallSelector = (props) => {
	const halls = ["Franklin", "Berkshire", "Worcester", "Hampshire"];

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
