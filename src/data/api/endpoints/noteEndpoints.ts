import { userIdStorage } from '@/lib/userIdStorage';
import { apiClient } from '../client'; 
import { NoteRequest } from '../dtos/requests/NoteRequest'; 
import { NoteResponse } from '../dtos/responses/NoteResponse'; 
import { StatusResponse } from '../dtos/responses/StatusResponse'; 

export const noteEndpoints = {
    async getNotesForContact(contactId: number): Promise<NoteResponse[]> {
        const userId = userIdStorage.get(); 
        if(!userId) throw new Error('User not logged in');
        
        const response = await apiClient.get(`/users/${userId}/contacts/${contactId}/notes`); 
        return response.data; 
    }, 

    async getNoteById(noteId: number): Promise<NoteResponse> {
        const userId = userIdStorage.get(); 
        if(!userId) throw new Error('User not logged in');
        
        const response = await apiClient.get(`/users/${userId}/contacts/notes/${noteId}`); 
        return response.data; 
    }, 

    async createNote(request: NoteRequest): Promise<NoteResponse> {
        const userId = userIdStorage.get(); 
        if(!userId) throw new Error('User not logged in');

        const response = await apiClient.post(`/users/${userId}/contacts/notes`, request); 
        return response.data;
    }, 
    
    async editNote(noteId: number, request: NoteRequest): Promise<StatusResponse> {
        const userId = userIdStorage.get(); 
        if(!userId) throw new Error('User not logged in');
        
        const response = await apiClient.put(`/users/${userId}/contacts/notes/${noteId}`, request); 
        return response.data; 
    }, 

    async deleteNote(noteId: number): Promise<StatusResponse> {
        const userId = userIdStorage.get(); 
        if(!userId) throw new Error('User not logged in');

        const response = await apiClient.delete(`/users/${userId}/contacts/notes/${noteId}`); 
        return response.data; 
    }
}