import {
	DiningHallSelector,
	Menu,
	DaySelector,
	MenuTODSelector,
	SubmitMeals,
} from "../components";
import Container from "react-bootstrap/Container";
import { useEffect, useState } from "react";
import axiosFASTAPI from "../api/common";
import { useDispatch } from "react-redux";
import { setMenu } from "../redux/menuSlice";

const ViewMenuPage = () => {
	const [hall, setHall] = useState("Select hall"); //State variable for currently selected bar
	// eslint-disable-next-line react-hooks/exhaustive-deps
	const [day, setDay] = useState(new Date().toISOString().split('T')[0]); //Currently selected day for viewing
	const dispatch = useDispatch();
	const [menuTime, setMenuTime] = useState("");
	const [allergens, setAllergens] = useState(new Set());
	const [restrictions, setRestrictions] = useState(new Set()); //Can add import here for user data once setup to remember filters
	const [mealTypes, setMealTypes] = useState([]);
	const [selectedItems, setSelectedItems] = useState([]); // State to track selected items

	//Hook to access data from the database, updates whenever the date, hall, or day variables change
	useEffect(() => {
		
		const time = day;
		axiosFASTAPI
			.get("/menu", {
				params: {
					dining_hall: hall,
					date_served: time,
				},
			})
			.then((response) => {
				dispatch(setMenu(response.data));
				console.log("Response: ", response.data);
			})
			.catch((error) => {
				console.error("Error fetching meals:", error);
			});

		axiosFASTAPI
			.get("/menu/meal_types", {
				params: {
					dining_hall: hall,
					date_served: time,
				},
			})
			.then((response) => {
				setMealTypes(response.data);
				if (!response.data.includes(menuTime)) {
					setMenuTime(
						response.data[
							menuTime === "latenight_menu" || menuTime === "grabngo"
								? response.data.length - 1
								: 0
						]
					);
				}
			})
			.catch((error) => {
				console.error("Error fetching meal types:", error);
			});
	}, [hall, dispatch, day]);

	return (
		<Container style={{ paddingBottom: "5vh" }}>
			<Container className='d-flex justify-content-center align-items-center'>
				<h2>View Menus</h2>
			</Container>
			<Container className='d-flex justify-content-center align-items-center'>
				<DiningHallSelector hall={hall} setHall={setHall} />
				<DaySelector day={day} setDay={setDay} hall={hall} />
				<MenuTODSelector
					menuTime={menuTime}
					setMenuTime={setMenuTime}
					mealTypes={mealTypes}
				/>
			</Container>
			<Menu
				menuTime={menuTime}
				allergens={allergens}
				setAllergens={setAllergens}
				restrictions={restrictions}
				setRestrictions={setRestrictions}
				selectedItems={selectedItems}
				setSelectedItems={setSelectedItems}
			/>
			<SubmitMeals
				selectedItems={selectedItems}
				setSelectedItems={setSelectedItems}
			/>
		</Container>
	);
};

export default ViewMenuPage;
