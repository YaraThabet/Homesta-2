import axios from 'axios';

const api = axios.create({
    baseURL: '/api/',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        console.log("⬆️ API Request:", config.method.toUpperCase(), config.url, config.data);
        return config;
    },
    (error) => {
        console.error("❌ API Request Error:", error);
        return Promise.reject(error);
    }
);

// Add a response interceptor
api.interceptors.response.use(
    (response) => {
        // If response.data is a string that looks like JSON, parse it
        if (typeof response.data === 'string') {
            try {
                // Check if it's a JSON string
                const trimmed = response.data.trim();
                if ((trimmed.startsWith('{') && trimmed.endsWith('}')) ||
                    (trimmed.startsWith('[') && trimmed.endsWith(']'))) {
                    response.data = JSON.parse(response.data);
                    console.log("⬇️ API Response (parsed from string):", response.status, response.url, response.data);
                } else {
                    console.log("⬇️ API Response:", response.status, response.url, response.data);
                }
            } catch (e) {
                // Not JSON, keep as string
                console.log("⬇️ API Response (string, not JSON):", response.status, response.url, response.data);
            }
        } else {
            console.log("⬇️ API Response:", response.status, response.url, response.data);
        }
        return response;
    },
    (error) => {
        // Also try to parse error response if it's a string
        if (error.response && typeof error.response.data === 'string') {
            try {
                const trimmed = error.response.data.trim();
                if ((trimmed.startsWith('{') && trimmed.endsWith('}')) ||
                    (trimmed.startsWith('[') && trimmed.endsWith(']'))) {
                    error.response.data = JSON.parse(error.response.data);
                }
            } catch (e) {
                // Not JSON, keep as string
            }
        }
        console.error("❌ API Response Error:", error.response?.status, error.response?.data || error.message);
        return Promise.reject(error);
    }
);
export default api;
