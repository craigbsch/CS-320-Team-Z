import Dropdown from "react-bootstrap/Dropdown";
import Container from "react-bootstrap/Container";
import DropdownMenu from "react-bootstrap/DropdownMenu";
import Form from "react-bootstrap/Form";

// Defining a RestrictionSelector component
const RestrictionSelector = (props) => {
	// Function to toggle restrictions
	const toggleRestriction = (value) => {
		//needs to be setup this way to avoid state variable shenanigans
		const restrictions = new Set(props.restrictions);
		props.restrictions.has(value)
			// Toggling the presence of the value in restrictions
			? restrictions.delete(value)
			: restrictions.add(value);
		// Setting the updated restrictions
		props.setRestrictions(restrictions);
	};
	// Rendering the component
	return (
		<Container className='d-flex justify-content-start align-items-start'>
			<Dropdown>
				<Dropdown.Toggle id='dropdown-autoclose-false'>
					Allergies
				</Dropdown.Toggle>
				<DropdownMenu>
					<Dropdown.ItemText>Current allergens:</Dropdown.ItemText>
					<Container className='d-flex align-items-center'>
						<Form>
							{[...props.allergens].map((a) => (
								<Form.Check
									type='checkbox'
									key={a}
									label={a}
									onChange={() => toggleRestriction(a)}
									checked={props.restrictions.has(a)}
								/>
							))}
						</Form>
					</Container>
				</DropdownMenu>
			</Dropdown>
		</Container>
	);
};

export default RestrictionSelector;
