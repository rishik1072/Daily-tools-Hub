import { useState, useEffect } from 'react';
import { Calendar, Clock, Plus, Trash2, Check, Edit3, Save } from 'lucide-react';
import { safeGetItem, safeSetItem } from '../../utils/storage';

interface TimeBlock {
  id: string;
  time: string;
  title: string;
  description: string;
  completed: boolean;
}

const DailyPlanner = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [timeBlocks, setTimeBlocks] = useState<TimeBlock[]>([]);
  const [isAddingBlock, setIsAddingBlock] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newBlock, setNewBlock] = useState({
    time: '09:00',
    title: '',
    description: '',
  });

  useEffect(() => {
    const saved = safeGetItem<TimeBlock[]>(`daily-planner-${selectedDate}`, []);
    setTimeBlocks(saved || []);
  }, [selectedDate]);

  const saveTimeBlocks = (blocks: TimeBlock[]) => {
    setTimeBlocks(blocks);
    safeSetItem(`daily-planner-${selectedDate}`, blocks);
  };

  const addTimeBlock = () => {
    if (!newBlock.title.trim()) return;

    const block: TimeBlock = {
      id: Date.now().toString(),
      time: newBlock.time,
      title: newBlock.title.trim(),
      description: newBlock.description.trim(),
      completed: false,
    };

    const updatedBlocks = [...timeBlocks, block].sort((a, b) => a.time.localeCompare(b.time));
    saveTimeBlocks(updatedBlocks);

    setNewBlock({ time: '09:00', title: '', description: '' });
    setIsAddingBlock(false);
  };

  const updateTimeBlock = (id: string, updates: Partial<TimeBlock>) => {
    const updatedBlocks = timeBlocks.map(block =>
      block.id === id ? { ...block, ...updates } : block
    );
    saveTimeBlocks(updatedBlocks);
  };

  const deleteTimeBlock = (id: string) => {
    const updatedBlocks = timeBlocks.filter(block => block.id !== id);
    saveTimeBlocks(updatedBlocks);
  };

  const toggleComplete = (id: string) => {
    const block = timeBlocks.find(b => b.id === id);
    if (block) {
      updateTimeBlock(id, { completed: !block.completed });
    }
  };

  const startEditing = (block: TimeBlock) => {
    setEditingId(block.id);
    setNewBlock({
      time: block.time,
      title: block.title,
      description: block.description,
    });
  };

  const saveEdit = () => {
    if (editingId && newBlock.title.trim()) {
      updateTimeBlock(editingId, {
        time: newBlock.time,
        title: newBlock.title.trim(),
        description: newBlock.description.trim(),
      });
      setEditingId(null);
      setNewBlock({ time: '09:00', title: '', description: '' });
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setNewBlock({ time: '09:00', title: '', description: '' });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getCompletionStats = () => {
    const total = timeBlocks.length;
    const completed = timeBlocks.filter(block => block.completed).length;
    return { total, completed, percentage: total > 0 ? Math.round((completed / total) * 100) : 0 };
  };

  const stats = getCompletionStats();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Daily Planner
          </h2>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-1 border border-border rounded bg-background"
          />
        </div>

        <div className="mb-4">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">
            {formatDate(selectedDate)}
          </h3>
          <div className="flex items-center gap-4 text-sm">
            <span>{stats.completed}/{stats.total} tasks completed</span>
            <div className="flex-1 bg-secondary rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all"
                style={{ width: `${stats.percentage}%` }}
              />
            </div>
            <span className="text-muted-foreground">{stats.percentage}%</span>
          </div>
        </div>

        {/* Add/Edit Form */}
        {(isAddingBlock || editingId) && (
          <div className="mb-6 p-4 border border-border rounded-lg bg-secondary/50">
            <h3 className="text-sm font-medium mb-3">
              {editingId ? 'Edit Time Block' : 'Add Time Block'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">Time</label>
                <input
                  type="time"
                  value={newBlock.time}
                  onChange={(e) => setNewBlock(prev => ({ ...prev, time: e.target.value }))}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  value={newBlock.title}
                  onChange={(e) => setNewBlock(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Task title..."
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                />
              </div>
            </div>
            <div className="mt-3">
              <label className="block text-sm font-medium mb-1">Description (optional)</label>
              <textarea
                value={newBlock.description}
                onChange={(e) => setNewBlock(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Task description..."
                className="w-full px-3 py-2 border border-border rounded-lg bg-background resize-none"
                rows={2}
              />
            </div>
            <div className="flex gap-2 mt-3">
              <button
                onClick={editingId ? saveEdit : addTimeBlock}
                disabled={!newBlock.title.trim()}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90"
              >
                {editingId ? <Save className="w-4 h-4 inline mr-1" /> : <Plus className="w-4 h-4 inline mr-1" />}
                {editingId ? 'Save Changes' : 'Add Block'}
              </button>
              <button
                onClick={() => {
                  setIsAddingBlock(false);
                  cancelEdit();
                }}
                className="px-4 py-2 bg-secondary text-secondary-foreground rounded hover:bg-accent"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Time Blocks */}
        <div className="space-y-3">
          {timeBlocks.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">No time blocks scheduled for this day</p>
              <button
                onClick={() => setIsAddingBlock(true)}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
              >
                <Plus className="w-4 h-4 inline mr-1" />
                Add Your First Task
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Scheduled Tasks</h3>
                <button
                  onClick={() => setIsAddingBlock(true)}
                  className="flex items-center gap-1 px-3 py-1 bg-primary text-primary-foreground rounded hover:bg-primary/90"
                >
                  <Plus className="w-4 h-4" />
                  Add Task
                </button>
              </div>

              {timeBlocks.map((block) => (
                <div
                  key={block.id}
                  className={`border border-border rounded-lg p-4 ${
                    block.completed ? 'bg-green-50 dark:bg-green-950/20' : 'bg-card'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => toggleComplete(block.id)}
                      className={`w-6 h-6 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        block.completed
                          ? 'bg-green-500 border-green-500 text-white'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {block.completed && <Check className="w-3 h-3" />}
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium text-muted-foreground">
                          {block.time}
                        </span>
                      </div>
                      <h4 className={`font-medium ${block.completed ? 'line-through text-muted-foreground' : ''}`}>
                        {block.title}
                      </h4>
                      {block.description && (
                        <p className={`text-sm text-muted-foreground mt-1 ${block.completed ? 'line-through' : ''}`}>
                          {block.description}
                        </p>
                      )}
                    </div>

                    <div className="flex gap-1">
                      <button
                        onClick={() => startEditing(block)}
                        className="p-1 text-muted-foreground hover:text-foreground"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteTimeBlock(block.id)}
                        className="p-1 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DailyPlanner;