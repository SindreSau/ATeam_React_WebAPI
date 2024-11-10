// src/api/axios.ts
import axios from 'axios';

let baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

// Create an axios instance
const api = axios.create({
    baseURL: baseURL + '/api',
    withCredentials: true, // Important for sending cookies
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// Add response interceptor for handling errors
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response) {
            // Error returned by the server
            const { status, data } = error.response;

            // Log details based on status
            switch (status) {
                case 400:
                    console.error('Bad Request - 400:', data);
                    break;
                case 401:
                    console.error('Unauthorized - 401: Redirecting to login');
                    // Optionally handle logout or redirect logic here
                    // e.g., window.location.href = '/login';
                    break;
                case 403:
                    console.error('Forbidden - 403:', data);
                    alert('You do not have permission to perform this action.');
                    break;
                case 404:
                    console.error('Not Found - 404:', data);
                    break;
                case 500:
                    console.error('Internal Server Error - 500:', data);
                    break;
                default:
                    console.error(`Unhandled status code - ${status}:`, data);
            }
        } else if (error.request) {
            // No response received from server
            console.error('Network Error - No response:', error.request);
            alert('Network error. Please check your connection and try again.');
        } else {
            // Error occurred during request setup
            console.error('Request Setup Error:', error.message);
        }

        return Promise.reject(error);
    }
);

export default api;
