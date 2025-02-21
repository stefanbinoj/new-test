import axios from "axios";

const axiosWithHeaders = () => {
  const token = localStorage.getItem("accessToken");

  // Set up the axios instance
  const instance = axios.create({
    baseURL: process.env.REACT_APP_API_URL, // Set the base URL for your API
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
      "Content-Type": "application/json", // Ensure you're sending JSON data
    },
  });

  return instance;
};

export default axiosWithHeaders;
