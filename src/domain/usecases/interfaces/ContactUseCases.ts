import { Contact } from '../../entities/Contact';

export interface GetAllContactsUseCase {
    execute(): Promise<Contact[]>;
}

export interface GetContactByIdUseCase {
    execute(contactId: number): Promise<Contact>; 
}

export interface CreateContactUseCase {
    execute(
        name: string, 
        company?: string, 
        phoneNumber?: string, 
        contactEmail?: string
    ): Promise<Contact>;
}

export interface EditContactUseCase {
    execute(
        contactId: number, 
        name: string, 
        company?: string, 
        phoneNumber?: string, 
        contactEmail?: string
    ): Promise<boolean>; 
}

export interface DeleteContactUseCase {
    execute(contactId: number): Promise<boolean>; 
}