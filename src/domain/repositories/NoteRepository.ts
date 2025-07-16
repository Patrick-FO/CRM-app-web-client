import { Note } from '../entities/Note'; 

export interface NoteRepository {
    getNotesForContact(contactId: number): Promise<Note[]>; 

    getNoteById(noteId: number): Promise<Note>; 

    createNote(
        contactIds: number[], 
        title: string, 
        description?: string
    ): Promise<Note>; 

    editNote(
        noteId: number, 
        contactIds: number[], 
        title: string, 
        description?: string
    ): Promise<boolean>; 

    deleteNote(noteId: number): Promise<boolean>;
}