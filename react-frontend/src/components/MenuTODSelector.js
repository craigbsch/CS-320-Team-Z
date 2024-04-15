import ToggleButtonGroup from "react-bootstrap/ToggleButtonGroup";
import ToggleButton from "react-bootstrap/ToggleButton";

const MenuTODSelector = (props) => {
	const tempVal = props.menuTime;
	return (
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
	);
};

export default MenuTODSelector;
