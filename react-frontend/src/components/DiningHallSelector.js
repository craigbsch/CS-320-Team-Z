import { useState } from "react";
import Container from "react-bootstrap/Container";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";

const DiningHallSelector = (props) => {
	const [hall, setHall] = useState("Select Hall");
	const halls = ["Franklin", "Berkshire", "Worchester", "Hampshire"];

	return (
		<Container>
			<div style={{ display: "flex", alignItems: "center" }}>
				Select your dining hall:
				<DropdownButton id='dropdown-basic-button' title={hall}>
					{halls.map((dhall) => (
						<Dropdown.Item key={dhall} onClick={() => setHall(dhall)}>
							{dhall}
						</Dropdown.Item>
					))}
				</DropdownButton>
			</div>
		</Container>
	);
};

export default DiningHallSelector;
