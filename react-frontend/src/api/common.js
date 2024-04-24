import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";

const axiosFASTAPI = axios.create({
	baseURL: "https://dininginfobackend.azurewebsites.net",
	headers: {
		Authorization: `Bearer ${getToken()}`,
		"Content-Type": "application/json",
	},
});

export default axiosFASTAPI;
