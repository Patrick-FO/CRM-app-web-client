import { Note } from "@/domain/entities/Note";

export interface GetNotesForContactUseCase {
    execute(contactId: number): Promise<Note[]>; 
}

export interface GetNoteByIdUseCase {
    execute(noteID: number): Promise<Note>; 
}

export interface CreateNoteUseCase {
    execute(
        contactIds: number[], 
        title: string, 
        description?: string
    ): Promise<Note>;
}

export interface EditNoteUseCase {
    execute(
        noteId: number, 
        contactIds: number[], 
        title: string, 
        description?: string
    ): Promise<boolean>; 
}

export interface DeleteNoteUseCase {
    execute(noteId: number): Promise<boolean>; 
}