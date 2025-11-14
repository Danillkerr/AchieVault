import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.REACT_APP_BACKEND_URL || "http://localhost:3000/",

  withCredentials: true,
});

export default apiClient;
