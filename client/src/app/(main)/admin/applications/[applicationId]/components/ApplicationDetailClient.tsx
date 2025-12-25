'use client';

import { useState } from 'react';

interface Note {
  id: number;
  author: string;
  initials: string;
  time: string;
  content: string;
  color: string;
}

export default function ApplicationDetailClient({ notes }: { notes: Note[] }) {
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [noteText, setNoteText] = useState('');

  return (
    <div className="bg-white rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Team Notes</h3>
        <span className="text-sm text-gray-500">{notes.length}</span>
      </div>

      <div className="space-y-4 mb-4">
        {notes.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4">No notes yet</p>
        ) : (
          notes.map((note) => (
            <div key={note.id} className="flex gap-3">
              <div className={`w-8 h-8 ${note.color} rounded-full flex items-center justify-center text-white text-xs font-semibold shrink-0`}>{note.initials}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-gray-900 text-sm">{note.author}</span>
                  <span className="text-xs text-gray-500">{note.time}</span>
                </div>
                <p className="text-sm text-gray-700">{note.content}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {showNoteInput ? (
        <div>
          <textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="Add an internal note..."
            className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
            rows={3}
          />
          <div className="flex gap-2">
            <button
              onClick={() => {
                setShowNoteInput(false);
                setNoteText('');
              }}
              className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                // TODO: Implement note posting
                console.log('Post note:', noteText);
                setShowNoteInput(false);
                setNoteText('');
              }}
              className="flex-1 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
            >
              Post Note
            </button>
          </div>
        </div>
      ) : (
        <button onClick={() => setShowNoteInput(true)} className="w-full px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800">
          Post Note
        </button>
      )}
    </div>
  );
}
