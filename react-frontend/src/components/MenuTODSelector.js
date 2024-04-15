import ToggleButtonGroup from "react-bootstrap/ToggleButtonGroup";
import ToggleButton from "react-bootstrap/ToggleButton";
import Container from "react-bootstrap/Container";

const MenuTODSelector = (props) => {
	const tempVal = props.menuTime;
	return (
		<Container className='d-flex justify-content-center align-items-center'>
			<ToggleButtonGroup
				type='radio'
				name='options'
				defaultValue={tempVal}
				onChange={props.setMenuTime}
			>
				<ToggleButton id='tbg-radio-1' value={"breakfast_menu"}>
					Breakfast
				</ToggleButton>
				<ToggleButton id='tbg-radio-2' value={"lunch_menu"}>
					Lunch
				</ToggleButton>
				<ToggleButton id='tbg-radio-3' value={"dinner_menu"}>
					Dinner
				</ToggleButton>
			</ToggleButtonGroup>
		</Container>
	);
};

export default MenuTODSelector;
