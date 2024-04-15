import ListGroup from "react-bootstrap/ListGroup";
import { selectMenu } from "../redux/menuSlice";
import { useSelector } from "react-redux";
import { useMemo } from "react";

const Menu = (props) => {
	const menuItems = useSelector(selectMenu);
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
