import DiningHallSelector from "../components/DiningHallSelector";
import Menu from "../components/Menu";
import Container from "react-bootstrap/Container";
import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setMenu } from "../redux/menuSlice";

const ViewMenuPage = () => {
	const [hall, setHall] = useState("Select hall");
	const date = new Date();
	const [day, setDay] = useState(date.getDay());
	const dispatch = useDispatch();

	useEffect(() => {
		axios
			.get(
				`https://dininginfobackend.azurewebsites.net/menu?dining_hall=${hall}&date_served=${
					date.toISOString().split("T")[0]
				}`
			)
			.then((response) => {
				dispatch(setMenu(response.data));
			})
			.catch((error) => {
				console.error("Error fetching tasks:", error);
			});
	}, [date, hall, dispatch]);

	return (
		<Container>
			<DiningHallSelector hall={hall} setHall={setHall} />
			<Menu />
		</Container>
	);
};

export default ViewMenuPage;
