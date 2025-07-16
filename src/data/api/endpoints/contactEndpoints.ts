import { userIdStorage } from '@/lib/userIdStorage';
import { apiClient } from '../client'; 
import { ContactRequest } from '../dtos/requests/ContactRequest'; 
import { ContactResponse } from '../dtos/responses/ContactResponse'; 
import { StatusResponse } from '../dtos/responses/StatusResponse'; 

export const contactEndpoints = {
    async getAllContacts(): Promise<ContactResponse[]> {
        const userId = userIdStorage.get(); 
        if(!userId) throw new Error('User not logged in');

        const response = await apiClient.get(`/users/${userId}/contacts`); 
        return response.data;
    },

    async getContactById(contactId: number): Promise<ContactResponse> {
        const userId = userIdStorage.get(); 
        if(!userId) throw new Error('User not logged in'); 

        const response = await apiClient.get(`/users/${userId}/contacts/${contactId}`);
        return response.data;
    }, 

    async createContact(request: ContactRequest): Promise<ContactResponse> {
        const userId = userIdStorage.get(); 
        if(!userId) throw new Error('User not logged in');
        
        const response = await apiClient.post(`/users/${userId}/contacts`, request); 
        return response.data;
    }, 

    async editContact(contactId: number, request: ContactRequest): Promise<StatusResponse> {
        const userId = userIdStorage.get(); 
        if(!userId) throw new Error('User not logged in');
        
        const response = await apiClient.put(`/users/${userId}/contacts/${contactId}`, request); 
        return response.data;
    },

    async deleteContact(contactId: number): Promise<StatusResponse> {
        const userId = userIdStorage.get(); 
        if(!userId) throw new Error('User not logged in');
        
        const response = await apiClient.put(`/users/${userId}/contacts/${contactId}`);
        return response.data;
    }
}