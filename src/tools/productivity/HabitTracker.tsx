import { useState, useEffect } from 'react';
import { Target, Plus, Check, X, Calendar, Flame } from 'lucide-react';
import { safeGetItem, safeSetItem } from '../../utils/storage';

interface Habit {
  id: string;
  name: string;
  description: string;
  color: string;
  streak: number;
  lastCompleted: string | null;
  createdAt: string;
  completedDates: string[];
}

const HabitTracker = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [newHabitName, setNewHabitName] = useState('');
  const [newHabitDescription, setNewHabitDescription] = useState('');
  const [newHabitColor, setNewHabitColor] = useState('#3b82f6');
  const [isAddingHabit, setIsAddingHabit] = useState(false);

  const colors = [
    '#3b82f6', // blue
    '#ef4444', // red
    '#10b981', // green
    '#f59e0b', // yellow
    '#8b5cf6', // purple
    '#ec4899', // pink
    '#06b6d4', // cyan
    '#84cc16', // lime
  ];

  useEffect(() => {
    const savedHabits = safeGetItem<Habit[]>('habit-tracker', []);
    if (savedHabits) {
      setHabits(savedHabits);
    }
  }, []);

  const saveHabits = (newHabits: Habit[]) => {
    setHabits(newHabits);
    safeSetItem('habit-tracker', newHabits);
  };

  const addHabit = () => {
    if (!newHabitName.trim()) return;

    const habit: Habit = {
      id: Date.now().toString(),
      name: newHabitName.trim(),
      description: newHabitDescription.trim(),
      color: newHabitColor,
      streak: 0,
      lastCompleted: null,
      createdAt: new Date().toISOString(),
      completedDates: [],
    };

    saveHabits([...habits, habit]);
    setNewHabitName('');
    setNewHabitDescription('');
    setNewHabitColor('#3b82f6');
    setIsAddingHabit(false);
  };

  const deleteHabit = (id: string) => {
    saveHabits(habits.filter(habit => habit.id !== id));
  };

  const toggleHabitCompletion = (habit: Habit) => {
    const today = new Date().toDateString();
    const isCompletedToday = habit.completedDates.includes(today);

    let updatedHabit: Habit;

    if (isCompletedToday) {
      // Remove today's completion
      updatedHabit = {
        ...habit,
        completedDates: habit.completedDates.filter(date => date !== today),
        streak: Math.max(0, habit.streak - 1),
        lastCompleted: habit.completedDates.filter(date => date !== today).sort().pop() || null,
      };
    } else {
      // Add today's completion
      const newCompletedDates = [...habit.completedDates, today].sort();
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toDateString();

      const newStreak = habit.completedDates.includes(yesterdayStr) ? habit.streak + 1 : 1;

      updatedHabit = {
        ...habit,
        completedDates: newCompletedDates,
        streak: newStreak,
        lastCompleted: today,
      };
    }

    saveHabits(habits.map(h => h.id === habit.id ? updatedHabit : h));
  };

  const isCompletedToday = (habit: Habit) => {
    const today = new Date().toDateString();
    return habit.completedDates.includes(today);
  };

  const getStreakEmoji = (streak: number) => {
    if (streak === 0) return '🌱';
    if (streak < 7) return '🔥';
    if (streak < 30) return '💪';
    return '👑';
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Target className="w-5 h-5" />
            Habit Tracker
          </h2>
          <button
            onClick={() => setIsAddingHabit(!isAddingHabit)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
          >
            <Plus className="w-4 h-4" />
            Add Habit
          </button>
        </div>

        {/* Add Habit Form */}
        {isAddingHabit && (
          <div className="mb-6 p-4 border border-border rounded-lg bg-secondary/50">
            <h3 className="text-sm font-medium mb-3">Create New Habit</h3>
            <div className="space-y-3">
              <input
                type="text"
                value={newHabitName}
                onChange={(e) => setNewHabitName(e.target.value)}
                placeholder="Habit name (e.g., Drink water)"
                className="w-full px-3 py-2 border border-border rounded-lg bg-background"
              />
              <input
                type="text"
                value={newHabitDescription}
                onChange={(e) => setNewHabitDescription(e.target.value)}
                placeholder="Description (optional)"
                className="w-full px-3 py-2 border border-border rounded-lg bg-background"
              />
              <div>
                <label className="block text-sm font-medium mb-2">Color</label>
                <div className="flex gap-2">
                  {colors.map(color => (
                    <button
                      key={color}
                      onClick={() => setNewHabitColor(color)}
                      className={`w-8 h-8 rounded-full border-2 ${
                        newHabitColor === color ? 'border-gray-400' : 'border-gray-200'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={addHabit}
                  disabled={!newHabitName.trim()}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90"
                >
                  Create Habit
                </button>
                <button
                  onClick={() => setIsAddingHabit(false)}
                  className="px-4 py-2 bg-secondary text-secondary-foreground rounded hover:bg-accent"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Habits List */}
        <div className="space-y-4">
          {habits.length === 0 ? (
            <div className="text-center py-12">
              <Target className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No habits yet. Create your first habit to get started!</p>
            </div>
          ) : (
            habits.map((habit) => (
              <div key={habit.id} className="border border-border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <button
                      onClick={() => toggleHabitCompletion(habit)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                        isCompletedToday(habit)
                          ? 'bg-green-500 border-green-500 text-white'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                      style={{ borderColor: habit.color, backgroundColor: isCompletedToday(habit) ? habit.color : 'transparent' }}
                    >
                      {isCompletedToday(habit) ? <Check className="w-5 h-5" /> : <div className="w-3 h-3 rounded-full" style={{ backgroundColor: habit.color }} />}
                    </button>
                    <div className="flex-1">
                      <h3 className="font-medium">{habit.name}</h3>
                      {habit.description && (
                        <p className="text-sm text-muted-foreground mt-1">{habit.description}</p>
                      )}
                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center gap-1 text-sm">
                          <Flame className="w-4 h-4 text-orange-500" />
                          <span className="font-medium">{habit.streak}</span>
                          <span className="text-muted-foreground">day streak</span>
                          <span className="text-lg">{getStreakEmoji(habit.streak)}</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          <span>Created {new Date(habit.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteHabit(habit.id)}
                    className="p-1 text-muted-foreground hover:text-destructive"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {habits.length > 0 && (
          <div className="mt-6 p-4 bg-secondary/50 rounded-lg">
            <h3 className="text-sm font-medium mb-2">💡 Tips</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Click the circle to mark a habit as completed for today</li>
              <li>• Maintain streaks by completing habits daily</li>
              <li>• Delete habits you no longer want to track</li>
              <li>• Build consistency with small, achievable habits</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default HabitTracker;