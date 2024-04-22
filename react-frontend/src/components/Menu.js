import ListGroup from "react-bootstrap/ListGroup";
import { selectMenu } from "../redux/menuSlice";
import { useSelector } from "react-redux";
import { useEffect, useMemo } from "react";

const Menu = (props) => {
	let menuItems = useSelector(selectMenu);
	
	//Collects all present allergens
	const allergensSet = useMemo(() => {
		const set = new Set();
		menuItems.forEach((item) => {
			item.allergens.forEach((allergen) => set.add(allergen));
		});
		return set;
	}, [menuItems]);

	//Sets allergens for the page
	const { setAllergens } = props;
	useEffect(() => {
		setAllergens(allergensSet);
	}, [allergensSet, setAllergens]);

	//Filters out food that has any of the restrictions
	menuItems = useMemo(
		() =>
			props.restrictions
				? menuItems.filter((item) => 	{
					for (const restriction of props.restrictions) {
					if (item.allergens.has(restriction)) {
						return false; // Not disjoint
					}
				}
				return true; // Disjoint
 				} )
				: menuItems,
		[props.restrictions, menuItems]
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

	return (
		<ListGroup style={{ maxHeight: "80vh", overflowY: "auto" }}>
			{menuTOD[props.menuTime].map((item, i) => (
				<ListGroup.Item key={i}>{item.meal_name}</ListGroup.Item>
			))}
		</ListGroup>
	);
};

export default Menu;
