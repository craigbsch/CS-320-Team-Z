import DiningHallSelector from "../components/DiningHallSelector";
import Menu from "../components/Menu";
import Container from "react-bootstrap/Container";
import { useState } from "react";

const ViewMenuPage = () => {
	const [hall, setHall] = useState("Select hall");

	return (
		<Container>
			<DiningHallSelector hall={hall} setHall={setHall} />
			<Menu />
		</Container>
	);
};

export default ViewMenuPage;
