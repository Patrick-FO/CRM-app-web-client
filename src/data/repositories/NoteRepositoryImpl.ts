import { NoteRepository } from "@/domain/repositories/NoteRepository";
import { Note } from "@/domain/entities/Note";
import { noteEndpoints } from "../api/endpoints/noteEndpoints";
import { NoteMapper } from "../mappers/NoteMapper";
import { injectable } from 'tsyringe';

@injectable()
export class NoteRepositoryImpl implements NoteRepository {
    async getNotesForContact(contactId: number): Promise<Note[]> {
        const response = await noteEndpoints.getNotesForContact(contactId); 
        return NoteMapper.toDomainList(response); 
    }

    async getNoteById(noteId: number): Promise<Note> {
        const response = await noteEndpoints.getNoteById(noteId); 
        return NoteMapper.toDomain(response); 
    }

    async createNote(
        contactIds: number[], 
        title: string, 
        description?: string
    ): Promise<Note> {
        const response = await noteEndpoints.createNote({
            contactIds, 
            title, 
            description
        }); 
        return NoteMapper.toDomain(response); 
    }

    async editNote(
        noteId: number, 
        contactIds: number[], 
        title: string, 
        description?: string
    ): Promise<boolean> {
        try {
            const response = await noteEndpoints.editNote(noteId, {
                contactIds,
                title, 
                description
            }); 
            return true; 
        } catch (error) {
            console.error('Failed to edit note:', error);
            return false;
        }
    }

    async deleteNote(noteId: number): Promise<boolean> {
        try {
            const response = await noteEndpoints.deleteNote(noteId); 
            return true; 
        } catch(error) {
            console.error('Failed to delete note:', error); 
            return false;
        }
    }
}