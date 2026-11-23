import axios from 'axios';

/**
 * HTTP client for the backend API. Requests are same-origin, so the BFF session cookie is sent automatically.
 */
export default axios.create({
    baseURL: '/api',
    headers: {
        Accept: 'application/json',
    },
});
