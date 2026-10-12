// ==========================================
// IMPORT AXIOS
// ==========================================

import axios from "axios";


// ==========================================
// CREATE AXIOS INSTANCE
// ==========================================

const api = axios.create({
    baseURL: "http://localhost:5000/api"
});


// ==========================================
// ADD JWT TOKEN TO REQUEST
// ==========================================

api.interceptors.request.use((config) => {

    const token = localStorage.getItem("token");

    console.log("TOKEN FROM LOCAL STORAGE:", token);

    if (token) {

        config.headers.Authorization =
            `Bearer ${token}`;
    }

    console.log(
        "AUTHORIZATION HEADER:",
        config.headers.Authorization
    );

    return config;
});


// ==========================================
// EXPORT API
// ==========================================

export default api;