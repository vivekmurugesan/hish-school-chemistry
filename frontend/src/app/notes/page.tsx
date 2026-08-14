'use client';

import { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { Plus, Trash2, Save } from 'lucide-react';

interface Note {
  id: number;
  title: string;
  content: string;
  createdAt: Date;
}

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([
    {
      id: 1,
      title: 'Carbon Properties',
      content: 'Carbon is the 6th element in the periodic table. It has 6 protons, 6 neutrons, and 6 electrons.',
      createdAt: new Date(),
    },
    {
      id: 2,
      title: 'Water Formation',
      content: 'Water (H₂O) is formed when 2 hydrogen atoms bond with 1 oxygen atom through covalent bonds.',
      createdAt: new Date(),
    },
  ]);

  const [newNote, setNewNote] = useState({ title: '', content: '' });

  const addNote = () => {
    if (newNote.title && newNote.content) {
      setNotes([
        {
          id: Date.now(),
          title: newNote.title,
          content: newNote.content,
          createdAt: new Date(),
        },
        ...notes,
      ]);
      setNewNote({ title: '', content: '' });
    }
  };

  const deleteNote = (id: number) => {
    setNotes(notes.filter((note) => note.id !== id));
  };

  return (
    <main className="min-h-screen">
      <Navigation />

      <div className="container mx-auto px-4 py-20">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2 gradient-text">My Study Notes</h1>
          <p className="text-slate-400">Save and organize important chemistry concepts</p>
        </div>

        {/* New Note Section */}
        <div className="card mb-12 p-8">
          <h2 className="text-2xl font-bold mb-6">Add a New Note</h2>

          <div className="space-y-4">
            <input
              type="text"
              placeholder="Note title..."
              value={newNote.title}
              onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:border-purple-500"
            />

            <textarea
              placeholder="Write your note here..."
              value={newNote.content}
              onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
              rows={5}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:border-purple-500 resize-none"
            />

            <button
              onClick={addNote}
              className="btn-primary inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Save Note
            </button>
          </div>
        </div>

        {/* Notes List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold mb-6">Your Notes ({notes.length})</h2>

          {notes.length === 0 ? (
            <div className="text-center py-12 card">
              <p className="text-slate-400">No notes yet. Start by adding your first note!</p>
            </div>
          ) : (
            notes.map((note) => (
              <div key={note.id} className="card p-6 hover:border-purple-500/50 transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">{note.title}</h3>
                    <p className="text-sm text-slate-400">
                      {note.createdAt.toLocaleDateString()} at{' '}
                      {note.createdAt.toLocaleTimeString()}
                    </p>
                  </div>
                  <button
                    onClick={() => deleteNote(note.id)}
                    className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5 text-red-400" />
                  </button>
                </div>

                <p className="text-slate-300 whitespace-pre-wrap mb-4">{note.content}</p>

                <button className="text-sm text-purple-400 hover:text-purple-300 transition-colors inline-flex items-center gap-1">
                  <Save className="w-4 h-4" />
                  Export
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
