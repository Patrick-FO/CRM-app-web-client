import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { tokenStorage } from '../../lib/tokenStorage';

console.log('API Base URL:', process.env.NEXT_PUBLIC_API_URL);

const apiClient: AxiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL, 
    timeout: 10000, 
    headers: {
        'Content-Type': 'application/json'
    },
}); 

apiClient.interceptors.request.use((config) => {
    const token = tokenStorage.get(); 
    if(token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}); 

apiClient.interceptors.response.use(
    (response: AxiosResponse) => response, 
    (error) => {
        if(error.response?.status == 401) {
            tokenStorage.remove(); 
            window.location.href = '/login'; 
        }
        return Promise.reject(error)
    }
);

export { apiClient }; 