import { ContactRepository } from '../../domain/repositories/ContactRepository'; 
import { Contact } from '../../domain/entities/Contact'; 
import { contactEndpoints } from '../api/endpoints/contactEndpoints';
import { ContactMapper } from '../mappers/ContactMapper';
import { injectable } from 'tsyringe';

@injectable()
export class ContactRepositoryImpl implements ContactRepository {
    async getAllContacts(): Promise<Contact[]> {
        const response = await contactEndpoints.getAllContacts(); 
        return ContactMapper.toDomainList(response);
    }

    async getContactById(contactId: number): Promise<Contact> {
        const response = await contactEndpoints.getContactById(contactId); 
        return ContactMapper.toDomain(response); 
    }

    async createContact(
        name: string, 
        company?: string, 
        phoneNumber?: string,
        contactEmail?: string
    ): Promise<Contact> {
        const response = await contactEndpoints.createContact({
            name, 
            company, 
            phoneNumber, 
            contactEmail
        }); 
        return ContactMapper.toDomain(response); 
    }

    async editContact(
        contactId: number, 
        name: string, 
        company?: string, 
        phoneNumber?: string, 
        contactEmail?: string
    ): Promise<boolean> {
        try {
            await contactEndpoints.editContact(contactId, {
                name, 
                company, 
                phoneNumber, 
                contactEmail
            })

            return true
        } catch (error) {
            console.error('Failed to edit contact:', error);
            return false; 
        }
    }

    async deleteContact(contactId: number): Promise<boolean> {
        try {
            await contactEndpoints.deleteContact(contactId); 
            return true; 
        } catch(error) {
            console.error('Failed to delete contact:', error); 
            return false; 
        }
    }
}