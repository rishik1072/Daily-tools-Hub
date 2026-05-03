import { useState, useEffect } from 'react';
import { StickyNote, Trash2, Edit3 } from 'lucide-react';
import { safeGetItem, safeSetItem } from '../../utils/storage';

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

const QuickNotes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const savedNotes = safeGetItem<Note[]>('quick-notes', []);
    if (savedNotes) {
      setNotes(savedNotes);
    }
  }, []);

  const saveNotes = (newNotes: Note[]) => {
    setNotes(newNotes);
    safeSetItem('quick-notes', newNotes);
  };

  const addNote = () => {
    if (!title.trim() || !content.trim()) return;

    const newNote: Note = {
      id: Date.now().toString(),
      title: title.trim(),
      content: content.trim(),
      createdAt: new Date().toISOString(),
    };

    saveNotes([...notes, newNote]);
    setTitle('');
    setContent('');
  };

  const updateNote = () => {
    if (!editingId || !title.trim() || !content.trim()) return;

    const updatedNotes = notes.map(note =>
      note.id === editingId
        ? { ...note, title: title.trim(), content: content.trim() }
        : note
    );

    saveNotes(updatedNotes);
    setEditingId(null);
    setTitle('');
    setContent('');
  };

  const deleteNote = (id: string) => {
    saveNotes(notes.filter(note => note.id !== id));
  };

  const startEditing = (note: Note) => {
    setEditingId(note.id);
    setTitle(note.title);
    setContent(note.content);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setTitle('');
    setContent('');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <StickyNote className="w-5 h-5" />
          Quick Notes
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Add/Edit Form */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                {editingId ? 'Edit Note' : 'New Note'}
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Note title..."
                className="w-full px-3 py-2 border border-border rounded-lg bg-background mb-2"
              />
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Note content..."
                className="w-full h-32 px-3 py-2 border border-border rounded-lg bg-background resize-none"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={editingId ? updateNote : addNote}
                disabled={!title.trim() || !content.trim()}
                className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90"
              >
                {editingId ? 'Update Note' : 'Add Note'}
              </button>
              {editingId && (
                <button
                  onClick={cancelEditing}
                  className="px-4 py-2 bg-secondary text-secondary-foreground rounded hover:bg-accent"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>

          {/* Notes List */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Your Notes ({notes.length})</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {notes.length === 0 ? (
                <p className="text-muted-foreground text-sm">No notes yet. Add your first note!</p>
              ) : (
                notes.map((note) => (
                  <div key={note.id} className="border border-border rounded-lg p-3">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-sm">{note.title}</h4>
                      <div className="flex gap-1">
                        <button
                          onClick={() => startEditing(note)}
                          className="p-1 text-muted-foreground hover:text-foreground"
                        >
                          <Edit3 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => deleteNote(note.id)}
                          className="p-1 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {note.content}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {new Date(note.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickNotes;