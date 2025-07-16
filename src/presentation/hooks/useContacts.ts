import { useState, useEffect } from 'react';
import { container, TOKENS } from '@/lib/di/container';
import { Contact } from '@/domain/entities/Contact';
import type { 
  GetAllContactsUseCase, 
  CreateContactUseCase, 
  EditContactUseCase, 
  DeleteContactUseCase 
} from '@/domain/usecases/interfaces/ContactUseCases';

export function useContacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadContacts = async () => {
    setLoading(true);
    setError('');
    
    try {
      const useCase = container.resolve<GetAllContactsUseCase>(TOKENS.GetAllContactsUseCase);
      const data = await useCase.execute();
      setContacts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load contacts');
    } finally {
      setLoading(false);
    }
  };

  const createContact = async (name: string, company?: string, phoneNumber?: string, contactEmail?: string) => {
    try {
      const useCase = container.resolve<CreateContactUseCase>(TOKENS.CreateContactUseCase);
      const newContact = await useCase.execute(name, company, phoneNumber, contactEmail);
      setContacts([...contacts, newContact]);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create contact');
      return false;
    }
  };

  const editContact = async (contactId: number, name: string, company?: string, phoneNumber?: string, contactEmail?: string) => {
    try {
      const useCase = container.resolve<EditContactUseCase>(TOKENS.EditContactUseCase);
      const success = await useCase.execute(contactId, name, company, phoneNumber, contactEmail);
      
      if (success) {
        // Update local state
        setContacts(contacts.map(contact => 
          contact.id === contactId 
            ? { ...contact, name, company, phoneNumber, contactEmail }
            : contact
        ));
      }
      return success;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to edit contact');
      return false;
    }
  };

  const deleteContact = async (contactId: number) => {
    try {
      const useCase = container.resolve<DeleteContactUseCase>(TOKENS.DeleteContactUseCase);
      const success = await useCase.execute(contactId);
      
      if (success) {
        setContacts(contacts.filter(contact => contact.id !== contactId));
      }
      return success;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete contact');
      return false;
    }
  };

  useEffect(() => {
    loadContacts();
  }, []);

  return {
    contacts,
    loading,
    error,
    createContact,
    editContact,
    deleteContact,
    refreshContacts: loadContacts
  };
}