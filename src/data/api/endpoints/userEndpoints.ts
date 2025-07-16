import { apiClient } from '../client'; 
import { UserRequest } from '../dtos/requests/UserRequest';
import { JwtResponse } from '../dtos/responses/JwtResponse';

export const userEndpoints = {
    async createUser(userData: UserRequest): Promise<void> {
        const response = await apiClient.post('/user', userData); 
        return; 
    }, 

    async getJwtToken(userData: UserRequest): Promise<{ token: string; userId: string }> {
        console.log('Making request to:', `${process.env.NEXT_PUBLIC_API_URL}/auth`);
        console.log('Request data:', userData);
        
        const response = await apiClient.post('/auth', userData)
        return {
            token: response.data.token, 
            userId: response.headers['userId']
        }
    }
}