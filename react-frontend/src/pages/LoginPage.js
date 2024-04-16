const LoginPage = () => {
	return (
		<Container
			className='d-flex justify-content-center'
			style={{ minHeight: "100vh", paddingTop: "10vh" }}
		>
			<div style={{ minWidth: "320px", maxWidth: "400px", width: "100%" }}>
				<Login />
			</div>
		</Container>
	);
};
export default LoginPage;
