// Importing necessary components from react-bootstrap
import ToggleButtonGroup from "react-bootstrap/ToggleButtonGroup";
import ToggleButton from "react-bootstrap/ToggleButton";
import Container from "react-bootstrap/Container";
import { useEffect, useState } from "react";

// Defining a MenuTODSelector component
const MenuTODSelector = (props) => {
	// Object mapping meal type keys to their display names
	const mealTypeNames = {
		breakfast_menu: "Breakfast",
		lunch_menu: "Lunch",
		dinner_menu: "Dinner",
		latenight_menu: "Late&nbsp;Night",
		grabngo: "Grab&nbsp;N'Go",
	};
	// Rendering the component
	return (
		<Container className='d-flex justify-content-center align-items-center'>
			<ToggleButtonGroup
				type='radio'
				name='options'
				value={props.menuTime}
				onChange={props.setMenuTime}
			>
				{props.mealTypes.length > 0 ? (
					// Mapping through mealTypes to create ToggleButton for each
					props.mealTypes.map((tod, i) => (
						<ToggleButton id={`radio-${i}`} key={i} value={tod}>
							<span
								dangerouslySetInnerHTML={{ __html: mealTypeNames[tod] }}
							></span>
						</ToggleButton>
					))
				) : (
					// Displaying a disabled ToggleButton when mealTypes is empty
					<ToggleButton id='tbg-radio-1' disabled>
						Choose a menu
					</ToggleButton>
				)}
			</ToggleButtonGroup>
		</Container>
	);
};

export default MenuTODSelector;
