'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Edit, Trash2, Plus, LogOut, User } from 'lucide-react';
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

  // Handle contact edit
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

  // Handle contact creation
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

  // Save contact
  const handleSaveContact = async () => {
    const success = editingContact
      ? await editContact(editingContact.id, contactForm.name, contactForm.company, contactForm.phoneNumber, contactForm.contactEmail)
      : await createContact(contactForm.name, contactForm.company, contactForm.phoneNumber, contactForm.contactEmail);
    
    if (success) {
      setEditContactSheet(false);
    }
  };

  // Handle note edit
  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setNoteForm({
      title: note.title,
      description: note.description || ''
    });
    setEditNoteSheet(true);
  };

  // Handle note creation
  const handleCreateNote = () => {
    if (!selectedContact) return;
    
    setEditingNote(null);
    setNoteForm({
      title: '',
      description: ''
    });
    setEditNoteSheet(true);
  };

  // Save note
  const handleSaveNote = async () => {
    if (!selectedContact) return;
    
    const success = editingNote
      ? await editNote(editingNote.id, [selectedContact.id], noteForm.title, noteForm.description)
      : await createNote([selectedContact.id], noteForm.title, noteForm.description);
    
    if (success) {
      setEditNoteSheet(false);
    }
  };

  // Handle delete confirmation
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
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">CRM Application</h1>
          
          <div className="flex items-center space-x-4">
            <Avatar className="h-8 w-8">
              <AvatarFallback>
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <Button variant="outline" size="sm" onClick={logout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-73px)]">
        {/* Contacts Column */}
        <div className="w-1/3 border-r bg-white p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Contacts</h2>
            <Button onClick={handleCreateContact} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Contact
            </Button>
          </div>

          {contactsError && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {contactsError}
            </div>
          )}

          {contactsLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-20 bg-gray-200 rounded-lg"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {contacts.map((contact) => (
                <Card 
                  key={contact.id} 
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedContact?.id === contact.id ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => setSelectedContact(contact)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{contact.name}</CardTitle>
                      <div className="flex space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditContact(contact);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteClick('contact', contact);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1 text-sm text-gray-600">
                      {contact.company && <p>Company: {contact.company}</p>}
                      {contact.phoneNumber && <p>Phone: {contact.phoneNumber}</p>}
                      {contact.contactEmail && <p>Email: {contact.contactEmail}</p>}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Notes Column */}
        {selectedContact && (
          <div className="flex-1 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Notes for {selectedContact.name}</h2>
              <Button onClick={handleCreateNote} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Note
              </Button>
            </div>

            {notesError && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {notesError}
              </div>
            )}

            {notesLoading ? (
              <div className="space-y-4">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-24 bg-gray-200 rounded-lg"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {notes.map((note) => (
                  <Card key={note.id}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{note.title}</CardTitle>
                        <div className="flex space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleEditNote(note)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDeleteClick('note', note)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    {note.description && (
                      <CardContent>
                        <p className="text-gray-600">{note.description}</p>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Edit Contact Sheet */}
      <Sheet open={editContactSheet} onOpenChange={setEditContactSheet}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>
              {editingContact ? 'Edit Contact' : 'Create Contact'}
            </SheetTitle>
          </SheetHeader>
          <div className="space-y-4 mt-6">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={contactForm.name}
                onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                placeholder="Enter contact name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                value={contactForm.company}
                onChange={(e) => setContactForm({...contactForm, company: e.target.value})}
                placeholder="Enter company"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={contactForm.phoneNumber}
                onChange={(e) => setContactForm({...contactForm, phoneNumber: e.target.value})}
                placeholder="Enter phone number"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={contactForm.contactEmail}
                onChange={(e) => setContactForm({...contactForm, contactEmail: e.target.value})}
                placeholder="Enter email"
              />
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <Button variant="outline" onClick={() => setEditContactSheet(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveContact}>
                {editingContact ? 'Update' : 'Create'}
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Edit Note Sheet */}
      <Sheet open={editNoteSheet} onOpenChange={setEditNoteSheet}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>
              {editingNote ? 'Edit Note' : 'Create Note'}
            </SheetTitle>
          </SheetHeader>
          <div className="space-y-4 mt-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={noteForm.title}
                onChange={(e) => setNoteForm({...noteForm, title: e.target.value})}
                placeholder="Enter note title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={noteForm.description}
                onChange={(e) => setNoteForm({...noteForm, description: e.target.value})}
                placeholder="Enter note description"
                rows={4}
              />
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <Button variant="outline" onClick={() => setEditNoteSheet(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveNote}>
                {editingNote ? 'Update' : 'Create'}
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({...deleteDialog, open})}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the {deleteDialog.type}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}