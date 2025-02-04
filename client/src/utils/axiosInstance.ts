import axios from "axios";
import { message } from "antd"; // Import Ant Design's message component for notifications

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      switch (status) {
        case 400:
          message.error(data.message || "Bad Request");
          break;
        case 401:
          message.error(data.message || "Unauthorized");
          break;
        case 403:
          message.error(data.message || "Forbidden");
          break;
        case 404:
          message.error(data.message || "Not Found");
          break;
        case 500:
          message.error(data.message || "Internal Server Error");
          break;
        default:
          message.error(data.message || "An error occurred");
      }
    } else if (error.request) {
      message.error("No response received from server");
    } else {
      message.error("Error in setting up request");
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
