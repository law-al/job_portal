'use client';
import React, { useOptimistic, useState, useTransition } from 'react';
import { formatDistanceToNowStrict } from 'date-fns';
import { createNoteAction } from '@/app/actions/notes.actions';
import { toast } from 'sonner';

interface Note {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    email: string;
  };
}

interface TeamNotesProps {
  initialNotes: Note[];
  applicationId: string;
  companyId: string;
  userEmail: string;
}

const TeamNotes = ({ initialNotes, applicationId, userEmail }: TeamNotesProps) => {
  const [optimisticsNote, addOptimisticsNote] = useOptimistic<Note[], Note>(initialNotes, (state, newNote: Note) => [...state, newNote]);
  const [showInput, setShowInput] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [isPending, startTransition] = useTransition();

  const getInitials = (email: string) => {
    const parts = email.split('@')[0].split('.');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return email.substring(0, 2).toUpperCase();
  };

  const getColor = (email: string) => {
    const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-pink-500', 'bg-yellow-500', 'bg-indigo-500'];
    const hash = email.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  const getAuthorName = (email: string) => {
    const name = email.split('@')[0];
    return name
      .split('.')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  };

  const handlePostNote = () => {
    if (!noteText.trim()) {
      return;
    }

    const content = noteText.trim();
    const tempNote: Note = {
      id: `temp-${Date.now()}`,
      content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      author: {
        id: 'temp',
        email: userEmail || 'loading@example.com',
      },
    };
    // Create the note via server action
    startTransition(async () => {
      // Optimistically add the note
      addOptimisticsNote(tempNote);
      setNoteText('');
      setShowInput(false);

      const result = await createNoteAction(applicationId, content);

      if (result.success && result.data) {
        // Replace the temp note with the real one
        // The page will revalidate and show the real note
        toast.success('Note created successfully');
      } else {
        // Remove the optimistic note on error
        // The page will revalidate and show the correct state
        toast.error(result.error || 'Failed to create note');
      }
    });
  };

  const handleCancel = () => {
    setNoteText('');
    setShowInput(false);
  };

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200 max-w-md">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-gray-900 text-lg">Team Notes</h3>
        <span className="text-sm text-gray-500">{optimisticsNote.length}</span>
      </div>

      {/* Notes List or Empty State */}
      {optimisticsNote.length === 0 && !showInput ? (
        <div className="text-center py-8">
          <p className="text-gray-400 mb-6">No notes yet</p>
        </div>
      ) : (
        <div className="space-y-4 mb-6">
          {optimisticsNote.map((note) => (
            <div key={note.id} className="flex gap-3">
              <div className={`w-9 h-9 ${getColor(note.author.email)} rounded-full flex items-center justify-center text-white text-xs font-semibold shrink-0`}>
                {getInitials(note.author.email)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-gray-900 text-sm">{getAuthorName(note.author.email)}</span>
                  <span className="text-xs text-gray-500">{formatDistanceToNowStrict(new Date(note.createdAt), { addSuffix: true })}</span>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">{note.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Input Form */}
      {showInput ? (
        <div>
          <textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="Add an internal note..."
            className="w-full p-4 border border-gray-200 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none mb-4"
            rows={4}
            autoFocus
          />
          <div className="flex gap-3">
            <button onClick={handleCancel} className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors">
              Cancel
            </button>
            <button
              onClick={handlePostNote}
              disabled={isPending || !noteText.trim()}
              className="flex-1 px-4 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? 'Posting...' : 'Post Note'}
            </button>
          </div>
        </div>
      ) : (
        <button onClick={() => setShowInput(true)} className="w-full px-4 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 font-medium transition-colors">
          Post Note
        </button>
      )}
    </div>
  );
};

export default TeamNotes;
