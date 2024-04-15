import ListGroup from "react-bootstrap/ListGroup";
import { selectMenu } from "../redux/menuSlice";
import { useSelector } from "react-redux";
import { useMemo } from "react";

const Menu = (props) => {
	let menuItems = useSelector(selectMenu);
	if (props.restrictions)
		menuItems = menuItems.filter(
			(item) => props.restrictions.isDisjointFrom(item.allergens) //Filters out food that has any of the restrictions
		);
	//Mapping of the different times of day to sort the menu, useMemo hook allows memoization
	const menuTOD = useMemo(
		() => ({
			breakfast_menu: menuItems.filter(
				(item) => item.meal_type === "breakfast_menu"
			),
			lunch_menu: menuItems.filter((item) => item.meal_type === "lunch_menu"),
			dinner_menu: menuItems.filter((item) => item.meal_type === "dinner_menu"),
		}),
		[menuItems]
	);

	// props.setAllergens(
	// 	useMemo(() => {
	// 		const allergenSet = new Set();
	// 		menuItems.forEach((item) => allergenSet.union(item.allergens));
	// 		return allergenSet;
	// 	}, [menuItems])
	// );

	return (
		<ListGroup style={{ maxHeight: "80vh", overflowY: "auto" }}>
			{menuTOD[props.menuTime].map((item, i) => (
				<ListGroup.Item key={i}>{item.meal_name}</ListGroup.Item>
			))}
		</ListGroup>
	);
};

export default Menu;
