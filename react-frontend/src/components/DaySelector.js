import Container from "react-bootstrap/Container";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";

const DaySelector = (props) => {
	const days = [
		"Sunday",
		"Monday",
		"Tuesday",
		"Wednesday",
		"Thursday",
		"Friday",
		"Saturday",
	];

	return (
		<Container className='d-flex justify-content-center align-items-center'>
			Day:
			<DropdownButton id='dropdown-basic-button' title={days[props.day]}>
				{days.map((day) => (
					<Dropdown.Item
						key={day}
						onClick={() => props.setDay(days.indexOf(day))}
					>
						{day}
					</Dropdown.Item>
				))}
			</DropdownButton>
		</Container>
	);
};

export default DaySelector;
