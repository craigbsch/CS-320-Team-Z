// Importing necessary components from react-bootstrap
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";

// Login component
const Login = () => {
    return (
        // Container component to center the login form and set its off-center vertical alignment
        <Container className="d-flex justify-content-center" style={{ minHeight: "100vh", paddingTop: "10vh" }}>
            {/* Div container for the form with responsive width settings */}
            <div style={{ minWidth: "320px", maxWidth: "400px", width: "100%" }}> 
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
        </Container>
    );
};

export default Login;
