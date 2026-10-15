import axios from "axios"

export const url = "http://localhost:3000"
const api = axios.create({
    baseURL: url,
    withCredentials: true,
});

export default api