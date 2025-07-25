import { container, TOKENS } from './container'; 
import { UserRepository } from '@/domain/repositories/UserRepository';
import { ContactRepository } from '@/domain/repositories/ContactRepository';
import { NoteRepository } from '@/domain/repositories/NoteRepository';
import { UserRepositoryImpl } from '@/data/repositories/UserRepositoryImpl';
import { ContactRepositoryImpl } from '@/data/repositories/ContactRepositoryImpl';
import { NoteRepositoryImpl } from '@/data/repositories/NoteRepositoryImpl';
import { AIRepository } from '@/domain/repositories/AiRepository';
import { AIRepositoryImpl } from '@/data/repositories/AIRepositoryImpl';

export function setupRepositories() {
    container.register<UserRepository>(TOKENS.UserRepository, {
        useClass: UserRepositoryImpl
    }); 

    container.register<ContactRepository>(TOKENS.ContactRepository, {
        useClass: ContactRepositoryImpl
    }); 

    container.register<NoteRepository>(TOKENS.NoteRepository, {
        useClass: NoteRepositoryImpl
    }); 

    container.register<AIRepository>(TOKENS.AIRepository, {
        useClass: AIRepositoryImpl
    }); 
}