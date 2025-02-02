import axios from "axios";

export const axiosClient = axios.create({
	baseURL: process.env.REACT_APP_API_URL,
	headers: {
		"X-RapidAPI-Key": process.env.REACT_APP_API_KEY,
		"X-RapidAPI-Host": "sky-scrapper.p.rapidapi.com",
		"Content-Type": "application/json",
	},
});

// Add request interceptor to handle errors
axiosClient.interceptors.response.use(
	(response) => response,
	(error) => {
		console.error("API Error:", error.response?.data || error.message);
		return Promise.reject(error);
	}
);
