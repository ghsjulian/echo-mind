import axios from "axios"

export const url = import.meta.env.VITE_NODE_ENV === "development" ? "http://localhost:3000" : "https://echo-mind-zd7k.onrender.com"
axios.defaults.withCredentials = true;
const api = axios.create({
    baseURL: url,
    withCredentials: true,
});

export default api