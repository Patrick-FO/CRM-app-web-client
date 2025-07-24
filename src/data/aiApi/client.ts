import axios, { AxiosInstance } from 'axios';

console.log('AI API Base URL:', process.env.PYTHON_AI_BACKEND_URL);

const aiApiClient: AxiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL, 
    timeout: 10000, 
    headers: {
        'Content-Type': 'application/json'
    },
}); 

export { aiApiClient }