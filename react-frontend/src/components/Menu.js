import ListGroup from "react-bootstrap/ListGroup";
import { selectMenu } from "../redux/menuSlice";
import { useSelector } from "react-redux";
import { useState } from "react";

const Menu = () => {
	const menuItems = useSelector(selectMenu);

	return (
		<ListGroup variant='flush'>
			{menuItems.map((item) => (
				<ListGroup.Item>{item.meal_name}</ListGroup.Item>
			))}
		</ListGroup>
	);
};

export default Menu;
