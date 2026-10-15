import axios from "axios";

// Use Vite's built-in DEV flag or MODE
export const url = import.meta.env.DEV
    ? "http://localhost:3000"
    : "https://echo-mind-zd7k.onrender.com";

const api = axios.create({
    baseURL: url,
    withCredentials: true,
});

// Use a request interceptor to dynamically get the item on every request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("echomind-token");
        if (token) {
            config.headers["authCookie"] = token;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;