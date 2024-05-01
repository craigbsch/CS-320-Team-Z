import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

const SubmitMeals = (props) => {
	const [visible, setVisibility] = useState(false);

	return props.selectedItems.length > 0 ? (
		<>
			<Button
				size='lg'
				className='fixed-bottom mb-3 mx-3'
				onClick={() => setVisibility(!visible)}
			>
				Save Changes {visible ? "hi" : "monkey"}
			</Button>
			<Modal show={visible} onHide={() => setVisibility(false)}>
				<Modal.Header closeButton>
					<Modal.Title>Modal heading</Modal.Title>
				</Modal.Header>
				<Modal.Body>Woohoo, you are reading this text in a modal!</Modal.Body>
				<Modal.Footer>
					<Button variant='secondary' onClick={() => setVisibility(false)}>
						Close
					</Button>
					<Button variant='primary' onClick={() => setVisibility(false)}>
						Save Changes
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	) : (
		<></>
	);
};

export default SubmitMeals;
