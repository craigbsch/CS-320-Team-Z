import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container"; // Import Container

const Login = () => {
    return (
        // Use inline styling for vertical padding or margin as needed
        <Container className="d-flex justify-content-center" style={{ minHeight: "100vh", paddingTop: "10vh" }}>
            {/* Adjusted width or max-width for better control over form's width */}
            <div style={{ minWidth: "320px", maxWidth: "400px", width: "100%" }}> 
                <Form>
                    <h2>Login with your credentials</h2>
                    <Form.Group className='mb-3' controlId='formBasicEmail'>
                        <Form.Label>Email address</Form.Label>
                        <Form.Control type='email' placeholder='Enter email' />
                        <Form.Text className='text-muted'>
                            We'll never share your email with anyone else.
                        </Form.Text>
                    </Form.Group>

                    <Form.Group className='mb-3' controlId='formBasicPassword'>
                        <Form.Label>Password</Form.Label>
                        <Form.Control type='password' placeholder='Password' />
                    </Form.Group>
                    <Form.Group className='mb-3' controlId='formBasicCheckbox'>
                        <Form.Check type='checkbox' label='Remember me' />
                    </Form.Group>
                    <Button variant='primary'>Submit</Button>
                </Form>
            </div>
        </Container>
    );
};

export default Login;
