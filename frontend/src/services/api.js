import axios from "axios";

const api = axios.create({
    baseURL: "https://stable-ops-api.onrender.com",
});

export default api;