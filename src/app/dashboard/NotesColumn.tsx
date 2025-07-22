import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit, Trash2, Plus } from 'lucide-react';
import { Contact } from '@/domain/entities/Contact';
import { Note } from '@/domain/entities/Note';

interface NotesColumnProps {
  selectedContact: Contact;
  notes: Note[];
  loading: boolean;
  error: string;
  onCreateNote: () => void;
  onEditNote: (note: Note) => void;
  onDeleteNote: (note: Note) => void;
}

export function NotesColumn({
  selectedContact,
  notes,
  loading,
  error,
  onCreateNote,
  onEditNote,
  onDeleteNote,
}: NotesColumnProps) {
  return (
    <div className="flex-1 flex flex-col">
      <div className="p-6 border-b bg-white">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Notes for {selectedContact.name}</h2>
          <Button onClick={onCreateNote} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Note
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {loading ? (
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
                        onClick={() => onEditNote(note)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => onDeleteNote(note)}
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
    </div>
  );
}