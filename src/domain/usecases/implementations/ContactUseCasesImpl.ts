import { injectable, inject } from "tsyringe";
import type { ContactRepository } from "@/domain/repositories/ContactRepository";
import { Contact } from "@/domain/entities/Contact";
import { TOKENS } from "@/lib/di/container";
import {
    GetAllContactsUseCase, 
    GetContactByIdUseCase, 
    CreateContactUseCase, 
    EditContactUseCase, 
    DeleteContactUseCase
} from '../interfaces/ContactUseCases'; 

@injectable()
export class GetAllContactsUseCaseImpl implements GetAllContactsUseCase {
    constructor(@inject(TOKENS.ContactRepository) private contactRepository: ContactRepository) {}

    async execute(): Promise<Contact[]> {
        return this.contactRepository.getAllContacts(); 
    }
}

@injectable()
export class GetContactByIdUseCaseImpl implements GetContactByIdUseCase {
    constructor(@inject(TOKENS.ContactRepository) private contactRepository: ContactRepository) {}

    async execute(contactId: number): Promise<Contact> {
        if(!contactId) {
            throw new Error('Contact ID is required');
        }

        return this.contactRepository.getContactById(contactId); 
    }
}

@injectable()
export class CreateContactUseCaseImpl implements CreateContactUseCase {
    constructor(@inject(TOKENS.ContactRepository) private contactRepository: ContactRepository) {}

    async execute(
        name: string, 
        company?: string, 
        phoneNumber?: string, 
        contactEmail?: string
    ): Promise<Contact> {
        if(!name) {
            throw new Error('Name is required'); 
        }

        return this.contactRepository.createContact(
            name, 
            company, 
            phoneNumber, 
            contactEmail
        ); 
    }
}

@injectable()
export class EditContactUseCaseImpl implements EditContactUseCase {
    constructor(@inject(TOKENS.ContactRepository) private contactRepository: ContactRepository) {}

    async execute(
        contactId: number, 
        name: string, 
        company?: string, 
        phoneNumber?: string, 
        contactEmail?: string
    ): Promise<boolean> {
        if(!contactId) {
            throw new Error('Contact ID is required'); 
        }

        if(!name || name.trim().length == 0) {
            throw new Error('Name is required and cannot be empty'); 
        }

        return this.contactRepository.editContact(
            contactId, 
            name, 
            company, 
            phoneNumber, 
            contactEmail
        ); 
    }
}

@injectable() 
export class DeleteContactUseCaseImpl implements DeleteContactUseCase {
    constructor(@inject(TOKENS.ContactRepository) private contactRepository: ContactRepository) {}

    async execute(contactId: number): Promise<boolean> {
        if(!contactId) {
            throw new Error('Contact ID is required'); 
        }

        return this.contactRepository.deleteContact(contactId); 
    }
}