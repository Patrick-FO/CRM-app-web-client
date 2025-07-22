import { useState, useEffect } from 'react';
import { container, TOKENS } from '@/lib/di/container';
import { Note } from '@/domain/entities/Note';
import type { 
  GetNotesForContactUseCase, 
  CreateNoteUseCase, 
  EditNoteUseCase, 
  DeleteNoteUseCase 
} from '@/domain/usecases/interfaces/NoteUseCases';

export function useNotes(contactId: number | null) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadNotes = async () => {
    if (!contactId) {
      setNotes([]);
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const useCase = container.resolve<GetNotesForContactUseCase>(TOKENS.GetNotesForContactUseCase);
      const data = await useCase.execute(contactId);
      setNotes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load notes');
    } finally {
      setLoading(false);
    }
  };

  const createNote = async (contactIds: number[], title: string, description?: string) => {
    try {
      const useCase = container.resolve<CreateNoteUseCase>(TOKENS.CreateNoteUseCase);
      const newNote = await useCase.execute(contactIds, title, description);
      loadNotes();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create note');
      return false;
    }
  };

  const editNote = async (noteId: number, contactIds: number[], title: string, description?: string) => {
    try {
      const useCase = container.resolve<EditNoteUseCase>(TOKENS.EditNoteUseCase);
      const success = await useCase.execute(noteId, contactIds, title, description);
      
      if (success) {
        setNotes(notes.map(note => 
          note.id === noteId 
            ? { ...note, contactIds, title, description }
            : note
        ));
      }
      return success;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to edit note');
      return false;
    }
  };

  const deleteNote = async (noteId: number) => {
    try {
      const useCase = container.resolve<DeleteNoteUseCase>(TOKENS.DeleteNoteUseCase);
      const success = await useCase.execute(noteId);
      
      if (success) {
        setNotes(notes.filter(note => note.id !== noteId));
      }
      return success;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete note');
      return false;
    }
  };

  useEffect(() => {
    loadNotes();
  }, [contactId]);

  return {
    notes,
    loading,
    error,
    createNote,
    editNote,
    deleteNote,
    refreshNotes: loadNotes
  };
}