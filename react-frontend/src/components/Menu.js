import React, { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { Table, Button, Container } from "react-bootstrap";
import { selectMenu } from "../redux/menuSlice";
import "../styling/Menu.css";
import RestrictionSelector from "./RestrictionSelector";

const Menu = (props) => {
	let menuItems = useSelector(selectMenu);
	const [open, setOpen] = useState({}); // State to track open rows

	// Collects all present allergens
	const updateAllergens = () => {
		const set = new Set();
		menuItems.forEach((item) => {
			item.allergens.forEach((allergen) => set.add(allergen));
		});
		props.setAllergens(set);
	};

	// Filters out food that has any of the restrictions
	menuItems = useMemo(() => {
		updateAllergens();
		return props.restrictions
			? menuItems.filter((item) =>
					[...props.restrictions].every(
						(restriction) => !item.allergens.has(restriction)
					)
			  )
			: menuItems;
	}, [props.restrictions, menuItems]);

	//Mapping of the different times of day to sort the menu, useMemo hook allows memoization
	const menuTOD = useMemo(
		() => ({
			breakfast_menu: menuItems.filter(
				(item) => item.meal_type === "breakfast_menu"
			),
			lunch_menu: menuItems.filter((item) => item.meal_type === "lunch_menu"),
			dinner_menu: menuItems.filter((item) => item.meal_type === "dinner_menu"),
			latenight_menu: menuItems.filter(
				(item) => item.meal_type === "latenight_menu"
			),
			grabngo: menuItems.filter((item) => item.meal_type === "grabngo"),
		}),
		[menuItems]
	);

	const toggleRow = (index) => {
		setOpen((prev) => ({ ...prev, [index]: !prev[index] }));
	};

	const handleAddItem = (item, e) => {
		e.stopPropagation(); // Stop event propagation
		props.setSelectedItems([...props.selectedItems, item]);
	};

	const handleRemoveItem = (item, e) => {
		e.stopPropagation(); // Stop event propagation
		const index = props.selectedItems.indexOf(item);
		if (index !== -1) {
			const updatedItems = [...props.selectedItems];
			updatedItems.splice(index, 1);
			props.setSelectedItems(updatedItems);
		}
	};

	return menuTOD[props.menuTime]?.length > 0 ? (
		<Container>
			<Table striped bordered hover responsive>
				<thead>
					<tr>
						<th>Meal Name</th>
						<th>Calories</th>
						<th>
							<RestrictionSelector
								allergens={props.allergens}
								restrictions={props.restrictions}
								setRestrictions={props.setRestrictions}
							/>
						</th>
					</tr>
				</thead>
				<tbody>
					{menuTOD[props.menuTime].map((item, index) => (
						<React.Fragment key={`item-${index}`}>
							<tr onClick={() => toggleRow(index)}>
								<td>{item.meal_name}</td>
								<td>{item.calories}</td>
								<td style={{ textAlign: "right" }}>
									<span>
										{/* Minus button */}
										<Button
											onClick={(e) => handleRemoveItem(item, e)}
											disabled={
												props.selectedItems.filter(
													(selectedItem) => selectedItem === item
												).length === 0
											}
											variant='light'
											size='sm'
										>
											-
										</Button>
									</span>
									<span style={{ marginRight: "8px" }}>
										{/* Display quantity */}
										{
											props.selectedItems.filter(
												(selectedItem) => selectedItem === item
											).length
										}
									</span>
									<span style={{ marginRight: "8px" }}>
										{/* Plus button */}
										<Button
											onClick={(e) => handleAddItem(item, e)}
											variant='light'
											size='sm'
										>
											+
										</Button>
									</span>
								</td>
							</tr>
							{open[index] && (
								<tr key={`details-${index}`}>
									<td colSpan='3'>
										<strong>Carbohydrates:</strong> {item.carbohydrates}g<br />
										<strong>Fat:</strong> {item.fat}g<br />
										<strong>Protein:</strong> {item.protein}g<br />
										<strong>Serving Size: </strong> {item.serving_size}<br />
									</td>
								</tr>
							)}
						</React.Fragment>
					))}
				</tbody>
			</Table>
			<div
				style={{
					display: "flex",
					justifyContent: "flex-end",
					marginTop: "20px",
				}}
			></div>
		</Container>
	) : (
		<Container></Container>
	);
};

export default Menu;
