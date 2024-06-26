import React, { useState } from "react";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import axiosFASTAPI from "../api/common";
import { useAuth0 } from "@auth0/auth0-react";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";

// Define SubmitMeals component
const SubmitMeals = (props) => {
	// Define state variables
	const [visible, setVisibility] = useState(false);
	const [items, setItems] = useState({});
	const [isLoadingSubmit, setLoadingSubmit] = useState(false);
	const [submitStatus, setSubmitStatus] = useState(null); // 'success', 'error', or null
	const { getAccessTokenSilently } = useAuth0();
	// Function to process selected meal items
	const processItems = () => {
		const tempItems = {};
		props.selectedItems.forEach((m) =>
			tempItems[m.meal_name]
				? tempItems[m.meal_name]++
				: (tempItems[m.meal_name] = 1)
		);
		setItems(tempItems);
	};
	// Function to submit meal items
	const submit = async () => {
		setLoadingSubmit(true);
		setSubmitStatus(null);
		try {
			const accessToken = await getAccessTokenSilently();
			const response = await axiosFASTAPI.post(
				"/nutrition/api/update_meals",
				props.selectedItems,
				{
					headers: {
						Authorization: `Bearer ${accessToken}`,
						"Content-Type": "application/json",
					},
				}
			);
			console.log(response.data);
			// Update submit status, close modal, on successful submission
			setVisibility(false);
			setSubmitStatus({ type: "success", message: "Submission Successful!" });
		} catch (error) {
			// Handle submission error
			console.error("Error submitting user metadata:", error);
			setSubmitStatus({ type: "danger", message: "Error submitting data!" });
		} finally {
			setLoadingSubmit(false);
			setTimeout(() => setSubmitStatus(null), 3000); // Display the alert for 3 seconds
		}
	};
	// Render SubmitMeals component
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
							{Object.keys(items).map((key, i) => (
								<React.Fragment key={`item-${i}`}>
									<tr>
										<td>{key}</td>
										<td>{items[key]}</td>
									</tr>
								</React.Fragment>
							))}
						</tbody>
					</Table>
					{isLoadingSubmit && (
						<div
							style={{
								position: "fixed",
								top: "50%",
								left: "50%",
								transform: "translate(-50%, -50%)",
								zIndex: 1060, // Ensure this is above the modal z-index
							}}
						>
							<Spinner animation='border' variant='primary' />
						</div>
					)}
					
				</Modal.Body>
				<Modal.Footer>
					<Button variant='secondary' onClick={() => setVisibility(false)}>
						Cancel
					</Button>
					<Button variant='primary' onClick={() => submit()}>
						Submit
					</Button>
				</Modal.Footer>
			</Modal>
			{submitStatus && (
						<Alert
							variant={submitStatus.type}
							className={`custom-alert custom-alert-${submitStatus.type}`}
							style={{
								position: "fixed",
								bottom: "10px",
								left: "10%",
								right: "10%",
								textAlign: "center",
								zIndex: 1060,
							}}
						>
							{submitStatus.message}
						</Alert>
					)}
		</>
	) : (
		<></>
	);
};

export default SubmitMeals;
