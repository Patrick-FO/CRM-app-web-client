import { Contact } from '../entities/Contact'; 

export interface ContactRepository {
    getAllContacts(): Promise<Contact[]>;

    getContactById(contactId: number): Promise<Contact>;

    createContact(
        name: string, 
        company?: string, 
        phoneNumber?: string,
        contactEmail?: string
    ): Promise<Contact>;

    editContact(
        contactId: number, 
        name: string, 
        company?: string, 
        phoneNumber?: string, 
        contactEmail?: string
    ): Promise<boolean>;

    deleteContact(contactId: number): Promise<boolean>;
}