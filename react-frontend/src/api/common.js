import axios from "axios";

const axiosFASTAPI = axios.create({
	baseURL: "https://dininginfobackend.azurewebsites.net",
});

export default axiosFASTAPI;
