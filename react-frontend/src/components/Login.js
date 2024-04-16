import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container"; // Import Container

const Login = () => {
	return (
		<div>
			{/* Form component for collecting user login information */}
			<Form>
				{/* Form header */}
				<h2>Login with your credentials</h2>
				{/* Form group for email input */}
				<Form.Group className='mb-3' controlId='formBasicEmail'>
					<Form.Label>Email address</Form.Label>
					{/* Input field for email */}
					<Form.Control type='email' placeholder='Enter email' />

					<Form.Text className='text-muted'>
						We'll never share your email with anyone else.
					</Form.Text>
				</Form.Group>

				{/* Form group for password input */}
				<Form.Group className='mb-3' controlId='formBasicPassword'>
					<Form.Label>Password</Form.Label>
					{/* Input field for password */}
					<Form.Control type='password' placeholder='Password' />
				</Form.Group>
				{/* Checkbox for "Remember me" option */}
				<Form.Group className='mb-3' controlId='formBasicCheckbox'>
					<Form.Check type='checkbox' label='Remember me' />
				</Form.Group>
				{/* Submit button for the form */}
				<Button variant='primary'>Submit</Button>
			</Form>
		</div>
	);
};

export default Login;

