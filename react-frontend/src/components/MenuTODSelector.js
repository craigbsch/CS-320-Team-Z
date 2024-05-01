import ToggleButtonGroup from "react-bootstrap/ToggleButtonGroup";
import ToggleButton from "react-bootstrap/ToggleButton";
import Container from "react-bootstrap/Container";

const MenuTODSelector = (props) => {
	const tempVal = props.menuTime;
	const mealTypeNames = {
		breakfast_menu: "Breakfast",
		lunch_menu: "Lunch",
		dinner_menu: "Dinner",
		latenight_menu: "Late&nbsp;night",
		grabngo: "Grab&nbsp;N'Go",
	};
	return (
		<Container className='d-flex justify-content-center align-items-center'>
			<ToggleButtonGroup
				type='radio'
				name='options'
				defaultValue={tempVal}
				onChange={props.setMenuTime}
			>
				{props.mealTypes.length > 0 ? (
					props.mealTypes.map((tod, i) => (
						<ToggleButton id={`radio-${i}`} key={i} value={tod}>
							<span
								dangerouslySetInnerHTML={{ __html: mealTypeNames[tod] }}
							></span>
						</ToggleButton>
					))
				) : (
					<ToggleButton id='tbg-radio-1' disabled>
						Choose a day
					</ToggleButton>
				)}
			</ToggleButtonGroup>
		</Container>
	);
};

export default MenuTODSelector;
