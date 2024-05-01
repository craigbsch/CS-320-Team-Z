import React, { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { Table, Button, Container } from "react-bootstrap"; // Added Button import
import { selectMenu } from "../redux/menuSlice";
import "../styling/Menu.css";
import RestrictionSelector from "./RestrictionSelector";

const Menu = (props) => {
	let menuItems = useSelector(selectMenu);
	const [open, setOpen] = useState({}); // State to track open rows
	const [selectedItems, setSelectedItems] = useState([]); // State to track selected items

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
		setSelectedItems([...selectedItems, item]);
	};

	const handleRemoveItem = (item, e) => {
		e.stopPropagation(); // Stop event propagation
		const index = selectedItems.indexOf(item);
		if (index !== -1) {
			const updatedItems = [...selectedItems];
			updatedItems.splice(index, 1);
			setSelectedItems(updatedItems);
		}
	};

	const renderAllergens = (allergens) => {
		let set = new Set();
		allergens.forEach((allergen) => set.add(allergen));
		if (set.size === 0) {
			return "None";
		}

		// Convert the set to a string, with allergens separated by commas
		return Array.from(set).join(", ");
	};

	return menuTOD[props.menuTime].length > 0 ? (
		<Container>
			<Table striped bordered hover responsive>
				<thead>
					<tr>
						<th>Meal Name</th>
						<th>Calories</th>
						<th>
							{" "}
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
									<span style={{ marginRight: "8px" }}>
										{/* Display quantity */}
										{
											selectedItems.filter(
												(selectedItem) => selectedItem === item
											).length
										}
									</span>
									<span>
										{/* Minus button */}
										<Button
											onClick={(e) => handleRemoveItem(item, e)}
											disabled={
												selectedItems.filter(
													(selectedItem) => selectedItem === item
												).length === 0
											}
											variant='light'
											size='sm'
										>
											-
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
			>
				{/* Submit button */}
				<Button variant='primary' size='lg'>
					Submit
				</Button>
			</div>
		</Container>
	) : (
		<Container></Container>
	);
};

export default Menu;
