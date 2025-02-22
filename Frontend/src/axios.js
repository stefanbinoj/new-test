import axios from "axios";

const axiosWithCookie = () => {
  // Set up the axios instance
  const instance = axios.create({
    baseURL: process.env.REACT_APP_API_URL, // Set the base URL for your API
    withCredentials: true,
    headers: {
      "Content-Type": "application/json", // Ensure you're sending JSON data
    },
  });

  return instance;
};

export default axiosWithCookie;
