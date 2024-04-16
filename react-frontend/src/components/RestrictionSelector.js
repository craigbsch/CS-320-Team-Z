import Dropdown from "react-bootstrap/Dropdown";
import Container from "react-bootstrap/Container";
import DropdownMenu from "react-bootstrap/DropdownMenu";
import Form from "react-bootstrap/Form";

const RestrictionSelector = (props) => {
	const toggleRestriction = (value) => {
		const restrictions = new Set(props.restrictions);
		props.restrictions.has(value)
			? restrictions.delete(value)
			: restrictions.add(value);
		props.setRestrictions(restrictions);
	};

	return (
		<Container className='d-flex justify-content-center align-items-center'>
			<Dropdown>
				<Dropdown.Toggle id='dropdown-autoclose-false'>
					Allergens
				</Dropdown.Toggle>
				<DropdownMenu>
					<Dropdown.ItemText>Allergens present:</Dropdown.ItemText>
					<Container className='d-flex align-items-center'>
						<Form>
							{[...props.allergens].map((a) => (
								<Form.Check
									type='checkbox'
									key={a}
									label={a}
									onChange={() => toggleRestriction(a)}
									checked={!props.restrictions.has(a)}
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
