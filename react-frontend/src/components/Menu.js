import React, { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { Table } from "react-bootstrap";
import { selectMenu } from "../redux/menuSlice";
import "../styling/Menu.css";
import RestrictionSelector from "./RestrictionSelector";

const Menu = (props) => {
	let menuItems = useSelector(selectMenu);
	const [open, setOpen] = useState({}); // State to track open rows

	//Collects all present allergens
	const updateAllergens = () => {
		const set = new Set();
		menuItems.forEach((item) => {
			item.allergens.forEach((allergen) => set.add(allergen));
		});
		props.setAllergens(set);
	};

	//Filters out food that has any of the restrictions
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
			breakfast_menu: menuItems.filter((item) => item.meal_type === "breakfast_menu"),
			lunch_menu: menuItems.filter((item) => item.meal_type === "lunch_menu"),
			dinner_menu: menuItems.filter((item) => item.meal_type === "dinner_menu"),
			latenight_menu: menuItems.filter((item) => item.meal_type === "latenight_menu"),
			grabngo: menuItems.filter((item) => item.meal_type === "grabngo")
		}),
		[menuItems]
	);

	const toggleRow = (index) => {
		setOpen((prev) => ({ ...prev, [index]: !prev[index] }));
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

	return (
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
							<td>{renderAllergens(item.allergens)}</td>
						</tr>
						{open[index] && (
							<tr onClick={() => toggleRow(index)} key={`details-${index}`}>
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
	);
};

export default Menu;
