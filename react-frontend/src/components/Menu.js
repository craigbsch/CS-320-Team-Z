import ListGroup from "react-bootstrap/ListGroup";
import { selectMenu } from "../redux/menuSlice";
import { useSelector } from "react-redux";

const Menu = () => {
	const menuItems = useSelector(selectMenu);

	return (
		<ListGroup style={{ maxHeight: "80vh", overflowY: "auto" }}>
			{menuItems.map((item, i) => (
				<ListGroup.Item key={i}>{item.meal_name}</ListGroup.Item>
			))}
		</ListGroup>
	);
};

export default Menu;
