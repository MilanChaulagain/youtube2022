import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8800/api",
    withCredentials: true,
});

// Add token from localStorage (if using Authorization header)
api.interceptors.request.use((config) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user?.token;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
