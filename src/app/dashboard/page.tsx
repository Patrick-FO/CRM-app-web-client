'use client';

import { useState } from 'react';
import { Header } from './Header';
import { ContactsColumn } from './ContactsColumn';
import { NotesColumn } from './NotesColumn';
import { ContactEditSheet } from './ContactEditSheet';
import { NoteEditSheet } from './NoteEditSheet';
import { DeleteDialog } from './DeleteDialog';
import { AIChatFloating } from './AIChatFloating';
import { useContacts } from '@/presentation/hooks/useContacts';
import { useNotes } from '@/presentation/hooks/useNotes';
import { useLogout } from '@/presentation/hooks/useLogout';
import { Contact } from '@/domain/entities/Contact';
import { Note } from '@/domain/entities/Note';

export default function DashboardPage() {
  const { contacts, loading: contactsLoading, error: contactsError, createContact, editContact, deleteContact } = useContacts();
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const { notes, loading: notesLoading, error: notesError, createNote, editNote, deleteNote } = useNotes(selectedContact?.id || null);
  const { logout } = useLogout();

  // Edit contact state
  const [editContactSheet, setEditContactSheet] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [contactForm, setContactForm] = useState({
    name: '',
    company: '',
    phoneNumber: '',
    contactEmail: ''
  });

  // Edit note state
  const [editNoteSheet, setEditNoteSheet] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [noteForm, setNoteForm] = useState({
    title: '',
    description: ''
  });

  // Delete confirmation state
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    type: 'contact' | 'note';
    item: Contact | Note | null;
  }>({ open: false, type: 'contact', item: null });

  // Check if any modal/sheet is open (to disable AI chat)
  const hasOpenModal = editContactSheet || editNoteSheet || deleteDialog.open;

  // Event handlers
  const handleEditContact = (contact: Contact) => {
    setEditingContact(contact);
    setContactForm({
      name: contact.name,
      company: contact.company || '',
      phoneNumber: contact.phoneNumber || '',
      contactEmail: contact.contactEmail || ''
    });
    setEditContactSheet(true);
  };

  const handleCreateContact = () => {
    setEditingContact(null);
    setContactForm({
      name: '',
      company: '',
      phoneNumber: '',
      contactEmail: ''
    });
    setEditContactSheet(true);
  };

  const handleSaveContact = async () => {
    const success = editingContact
      ? await editContact(editingContact.id, contactForm.name, contactForm.company, contactForm.phoneNumber, contactForm.contactEmail)
      : await createContact(contactForm.name, contactForm.company, contactForm.phoneNumber, contactForm.contactEmail);
    
    if (success) {
      setEditContactSheet(false);
    }
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setNoteForm({
      title: note.title,
      description: note.description || ''
    });
    setEditNoteSheet(true);
  };

  const handleCreateNote = () => {
    setEditingNote(null);
    setNoteForm({
      title: '',
      description: ''
    });
    setEditNoteSheet(true);
  };

  const handleSaveNote = async (selectedContactIds: number[]) => {
    const success = editingNote
      ? await editNote(editingNote.id, selectedContactIds, noteForm.title, noteForm.description)
      : await createNote(selectedContactIds, noteForm.title, noteForm.description);
    
    if (success) {
      setEditNoteSheet(false);
    }
  };

  const handleDeleteClick = (type: 'contact' | 'note', item: Contact | Note) => {
    setDeleteDialog({ open: true, type, item });
  };

  const handleDeleteConfirm = async () => {
    const { type, item } = deleteDialog;
    if (!item) return;

    const success = type === 'contact' 
      ? await deleteContact(item.id)
      : await deleteNote(item.id);

    if (success) {
      if (type === 'contact' && selectedContact?.id === item.id) {
        setSelectedContact(null);
      }
      setDeleteDialog({ open: false, type: 'contact', item: null });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onLogout={logout} />
      
      <div className="flex h-[calc(100vh-73px)]">
        <ContactsColumn
          contacts={contacts}
          selectedContact={selectedContact}
          loading={contactsLoading}
          error={contactsError}
          onSelectContact={setSelectedContact}
          onCreateContact={handleCreateContact}
          onEditContact={handleEditContact}
          onDeleteContact={(contact) => handleDeleteClick('contact', contact)}
        />
        
        {selectedContact && (
          <NotesColumn
            selectedContact={selectedContact}
            notes={notes}
            loading={notesLoading}
            error={notesError}
            onCreateNote={handleCreateNote}
            onEditNote={handleEditNote}
            onDeleteNote={(note) => handleDeleteClick('note', note)}
          />
        )}
      </div>

      {/* Existing Sheets and Dialogs */}
      <ContactEditSheet
        open={editContactSheet}
        onOpenChange={setEditContactSheet}
        editingContact={editingContact}
        contactForm={contactForm}
        onContactFormChange={setContactForm}
        onSave={handleSaveContact}
      />

      <NoteEditSheet
        open={editNoteSheet}
        onOpenChange={setEditNoteSheet}
        editingNote={editingNote}
        noteForm={noteForm}
        onNoteFormChange={setNoteForm}
        onSave={handleSaveNote}
        contacts={contacts}
        preselectedContactIds={editingNote ? editingNote.contactIds : []} 
      />

      <DeleteDialog
        open={deleteDialog.open}
        type={deleteDialog.type}
        onOpenChange={(open) => setDeleteDialog({...deleteDialog, open})}
        onConfirm={handleDeleteConfirm}
      />

      {/* AI Chat - Disabled when any modal/sheet is open */}
      <AIChatFloating disabled={hasOpenModal} />
    </div>
  );
}