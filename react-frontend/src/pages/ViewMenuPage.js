import DiningHallSelector from "../components/DiningHallSelector";
import Menu from "../components/Menu";
import Container from "react-bootstrap/Container";
import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setMenu } from "../redux/menuSlice";
import DaySelector from "../components/DaySelector";

const ViewMenuPage = () => {
	const [hall, setHall] = useState("Select hall"); //State variable for currently selected bar
	// eslint-disable-next-line react-hooks/exhaustive-deps
	const date = new Date();
	const [day, setDay] = useState(date.getDay()); //Currently selected day for viewing
	const dispatch = useDispatch();

	//Hook to access data from the database, updates whenever the date, hall, or day variables change
	useEffect(() => {
		axios
			.get(
				`https://dininginfobackend.azurewebsites.net/menu?dining_hall=${hall}&date_served=${
					new Date(
						new Date().setDate(new Date().getDate() + day - new Date().getDay()) //Gets date +/- day of the week selected
					)
						.toISOString()
						.split("T")[0]
				}`
			)
			.then((response) => {
				dispatch(setMenu(response.data));
			})
			.catch((error) => {
				console.error("Error fetching tasks:", error);
			});
	}, [date, hall, dispatch, day]);

	return (
		<Container>
			<Container className='d-flex justify-content-center align-items-center'>
				<h2>View Menus</h2>
			</Container>
			<Container className='d-flex justify-content-center align-items-center'>
				<DiningHallSelector hall={hall} setHall={setHall} />
				<DaySelector day={day} setDay={setDay} />
			</Container>
			<Menu />
		</Container>
	);
};

export default ViewMenuPage;
