import { injectable, inject } from 'tsyringe'; 
import type { NoteRepository } from '@/domain/repositories/NoteRepository';
import { Note } from '@/domain/entities/Note';
import { TOKENS } from '@/lib/di/container';
import {
    GetNotesForContactUseCase, 
    GetNoteByIdUseCase, 
    CreateNoteUseCase, 
    EditNoteUseCase, 
    DeleteNoteUseCase
} from '../interfaces/NoteUseCases'; 

@injectable()
export class GetNotesForContactUseCaseImpl implements GetNotesForContactUseCase {
    constructor(@inject(TOKENS.NoteRepository) private noteRepository: NoteRepository) {}

    async execute(contactId: number): Promise<Note[]> {
        if(!contactId) {
            throw new Error('Contact ID is required'); 
        }

        return this.noteRepository.getNotesForContact(contactId); 
    }
}

@injectable()
export class GetNoteByIdUseCaseImpl implements GetNoteByIdUseCase {
    constructor(@inject(TOKENS.NoteRepository) private noteRepository: NoteRepository) {}

    async execute(noteId: number): Promise<Note> {
        if(!noteId) {
            throw new Error('Note ID is required'); 
        }

        return this.noteRepository.getNoteById(noteId); 
    }
}

@injectable()
export class CreateNoteUseCaseImpl implements CreateNoteUseCase {
    constructor(@inject(TOKENS.NoteRepository) private noteRepository: NoteRepository) {}

    async execute(
        contactIds: number[], 
        title: string, 
        description?: string
    ): Promise<Note> {
        if(!contactIds || contactIds.length == 0) {
            throw new Error('At least one contact ID is required'); 
        }

        if(!title || title.trim().length == 0) {
            throw new Error('Title is required and cannot be empty'); 
        }

        return this.noteRepository.createNote(
            contactIds, 
            title, 
            description
        ); 
    }
}

@injectable()
export class EditNoteUseCaseImpl implements EditNoteUseCase {
    constructor(@inject(TOKENS.NoteRepository) private noteRepository: NoteRepository) {}

    async execute(
        noteId: number, 
        contactIds: number[], 
        title: string, 
        description?: string
    ): Promise<boolean> {
        if(!noteId) {
            throw new Error('Note ID is required'); 
        }

        if(!contactIds || contactIds.length == 0) {
            throw new Error('At least one contact ID is required'); 
        }

        if(!title || title.trim().length == 0) {
            throw new Error('Title is required and cannot be empty'); 
        }

        return this.noteRepository.editNote(
            noteId, 
            contactIds, 
            title, 
            description
        ); 
    }
}

@injectable()
export class DeleteNoteUseCaseImpl implements DeleteNoteUseCase {
    constructor(@inject(TOKENS.DeleteNoteUseCase) private noteRepository: NoteRepository) {}

    async execute(
        noteId: number
    ): Promise<boolean> {
        if(!noteId) {
            throw new Error('Note ID is required'); 
        }

        return this.noteRepository.deleteNote(noteId); 
    }
}