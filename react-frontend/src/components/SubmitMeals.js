import React, { useState } from "react";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

const SubmitMeals = (props) => {
	const [visible, setVisibility] = useState(false);
	const [items, setItems] = useState({}); // No types since this isn't TS

	const processItems = () => {
		const tempItems = {};
		props.selectedItems.forEach((m) =>
			tempItems[m.meal_name]
				? tempItems[m.meal_name]++
				: (tempItems[m.meal_name] = 1)
		);
		setItems(tempItems);
	};

	return props.selectedItems.length > 0 ? (
		<>
			<Button
				size='lg'
				className='fixed-bottom mb-3 mx-3'
				onClick={() => {
					processItems();
					setVisibility(!visible);
				}}
			>
				Submit
			</Button>
			<Modal show={visible} onHide={() => setVisibility(false)}>
				<Modal.Header closeButton>
					<Modal.Title>Submit meals?</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Table striped bordered hover responsive>
						<thead>
							<tr>
								<th>Meal Name</th>
								<th>Count</th>
							</tr>
						</thead>
						<tbody>
							{Object.keys(items).map((item, i) => (
								<React.Fragment key={`item-${i}`}>
									<tr>
										<td>{item}</td>
										<td>{items[item]}</td>
									</tr>
								</React.Fragment>
							))}
						</tbody>
					</Table>
				</Modal.Body>
				<Modal.Footer>
					<Button variant='danger' onClick={() => setVisibility(false)}>
						Cancel
					</Button>
					<Button variant='success' onClick={() => setVisibility(false)}>
						Submit
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	) : (
		<></>
	);
};

export default SubmitMeals;
