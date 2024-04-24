import React, { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { Table } from "react-bootstrap";
import { selectMenu } from "../redux/menuSlice";
import "../styling/Menu.css";
import RestrictionSelector from "./RestrictionSelector";
import Button from 'react-bootstrap/Button';

const Menu = (props) => {
	let menuItems = useSelector(selectMenu);
	const [open, setOpen] = useState({}); // State to track open rows
    const [sortDirectionCalories, setSortDirectionCalories] = useState('asc'); // State to track sort direction
	const [sortDirectionNames, setSortDirectionNames] = useState('asc'); // State to track sort direction
    const [sortBy, setSortBy] = useState(''); // State to track sorting criteria

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
			breakfast_menu: menuItems.filter(
				(item) => item.meal_type === "breakfast_menu"
			),
			lunch_menu: menuItems.filter((item) => item.meal_type === "lunch_menu"),
			dinner_menu: menuItems.filter((item) => item.meal_type === "dinner_menu"),
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


	//sorts table by # of calories or name
	const sortMenu = (menu, sortBy) => {
        return [...menu].sort((a, b) => {

			//calories
			if (sortBy === 'calories') {
				
				if (sortDirectionCalories === 'asc') {
					return a.calories - b.calories;
				} else {
					return b.calories - a.calories;
				}

			//name
			} else if (sortBy === 'mealName') {

				if (sortDirectionNames === 'asc') {
					return a.meal_name.localeCompare(b.meal_name);
				} else {
					return b.meal_name.localeCompare(a.meal_name);
				}
			}
        });
    };

	//sets sortBy state when button is clicked
	const handleSortByCalories = () => {
		setSortBy('calories');
		setSortDirectionCalories(sortDirectionCalories === 'asc' ? 'desc' : 'asc');
	};
	
	const handleSortByMealName = () => {
		setSortBy('mealName');
		setSortDirectionNames(sortDirectionNames === 'asc' ? 'desc' : 'asc');
	};	

	const sortedMenu = useMemo(() => sortMenu(menuTOD[props.menuTime], sortBy), [menuTOD, props.menuTime, sortDirectionCalories, sortDirectionNames, sortBy]);


	return (
		<Table striped bordered hover responsive>
			<thead>
				<tr>
					<th>
						<Button variant="primary" onClick={handleSortByMealName}  >Meal Name {sortDirectionNames === 'asc' ? ' ▲' : ' ▼'} </Button>{''}
					</th>
					<th>
					<Button variant="primary" onClick={handleSortByCalories} >Calories {sortDirectionCalories === 'asc' ? ' ▲' : ' ▼'} </Button>{''}
					</th>
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
				{sortedMenu.map((item, index) => (
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
