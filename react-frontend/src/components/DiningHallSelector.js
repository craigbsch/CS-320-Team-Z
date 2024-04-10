import { useState } from "react";
import Container from "react-bootstrap/Container";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";

const DiningHallSelector = (props) => {
	const halls = ["Franklin", "Berkshire", "Worcester", "Hampshire"];

	return (
		<Container>
			<div style={{ display: "flex", alignItems: "center" }}>
				Select your dining hall:
				<DropdownButton id='dropdown-basic-button' title={props.hall}>
					{halls.map((hall) => (
						<Dropdown.Item key={hall} onClick={() => props.setHall(hall)}>
							{hall}
						</Dropdown.Item>
					))}
				</DropdownButton>
			</div>
		</Container>
	);
};

export default DiningHallSelector;
