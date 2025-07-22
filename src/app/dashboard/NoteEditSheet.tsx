import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';
import { Note } from '@/domain/entities/Note';
import { Contact } from '@/domain/entities/Contact';

interface NoteEditSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingNote: Note | null;
  noteForm: {
    title: string;
    description: string;
  };
  onNoteFormChange: (form: {
    title: string;
    description: string;
  }) => void;
  onSave: (selectedContactIds: number[]) => void;
  contacts: Contact[]; // All available contacts
  preselectedContactIds?: number[]; // For editing existing notes
}

export function NoteEditSheet({
  open,
  onOpenChange,
  editingNote,
  noteForm,
  onNoteFormChange,
  onSave,
  contacts,
  preselectedContactIds = [],
}: NoteEditSheetProps) {
  const [selectedContactIds, setSelectedContactIds] = useState<number[]>(preselectedContactIds);

  // Reset selection when opening/closing
  React.useEffect(() => {
    if (open) {
      setSelectedContactIds(preselectedContactIds);
    }
  }, [open, preselectedContactIds]);

  const toggleContactSelection = (contactId: number) => {
    setSelectedContactIds(prev => 
      prev.includes(contactId) 
        ? prev.filter(id => id !== contactId)
        : [...prev, contactId]
    );
  };

  const handleSave = () => {
    onSave(selectedContactIds);
  };

  const getSelectedContactNames = () => {
    return contacts
      .filter(contact => selectedContactIds.includes(contact.id))
      .map(contact => contact.name);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[540px] flex flex-col h-full">
        <SheetHeader>
          <SheetTitle>
            {editingNote ? 'Edit Note' : 'Create Note'}
          </SheetTitle>
        </SheetHeader>

        {/* Main content area now scrollable and flexible */}
        <div className="flex flex-col px-6 pt-4 pb-0 gap-6 flex-1 overflow-hidden">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={noteForm.title}
              onChange={(e) => onNoteFormChange({ ...noteForm, title: e.target.value })}
              placeholder="Enter note title"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={noteForm.description}
              onChange={(e) => onNoteFormChange({ ...noteForm, description: e.target.value })}
              placeholder="Enter note description"
              rows={4}
            />
          </div>

          {/* Contact selection */}
          <div className="flex flex-col flex-1 overflow-hidden space-y-2">
            <Label>Select Contacts</Label>

            

            {/* Scrollable list that takes remaining height */}
            <div className="flex-1 overflow-y-auto border rounded-md p-1 space-y-2">
              {contacts.map(contact => (
                <Card
                  key={contact.id}
                  className={`cursor-pointer transition-all hover:shadow-sm text-sm ${
                    selectedContactIds.includes(contact.id)
                      ? 'ring-2 ring-blue-500 bg-blue-50'
                      : 'hover:bg-muted'
                  }`}
                  onClick={() => toggleContactSelection(contact.id)}
                >
                  <CardContent className="px-2 py-0">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-sm leading-tight">{contact.name}</div>
                        {contact.company && (
                          <div className="text-xs text-gray-500">{contact.company}</div>
                        )}
                      </div>
                      {selectedContactIds.includes(contact.id) && (
                        <Check className="h-4 w-4 text-blue-600" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {selectedContactIds.length === 0 && (
              <p className="text-sm text-gray-500 mt-2">
                Select at least one contact for this note
              </p>
            )}
          </div>
        </div>

        {/* Footer buttons - pinned to bottom */}
        <div className="flex justify-end space-x-2 px-6 py-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={selectedContactIds.length === 0}>
            {editingNote ? 'Update' : 'Create'}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}