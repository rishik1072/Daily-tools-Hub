import { useState, useEffect } from 'react';
import { CheckSquare, Plus, Trash2, Calendar } from 'lucide-react';
import { safeGetItem, safeSetItem } from '../../utils/storage';

interface TodoItem {
  id: string;
  text: string;
  done: boolean;
  dueDate?: string;
  createdAt: string;
}

const TodoList = () => {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [dueDate, setDueDate] = useState('');

  useEffect(() => {
    const savedTodos = safeGetItem<TodoItem[]>('todo-list', []);
    if (savedTodos) {
      setTodos(savedTodos);
    }
  }, []);

  const saveTodos = (newTodos: TodoItem[]) => {
    setTodos(newTodos);
    safeSetItem('todo-list', newTodos);
  };

  const addTodo = () => {
    if (!newTodo.trim()) return;

    const todo: TodoItem = {
      id: Date.now().toString(),
      text: newTodo.trim(),
      done: false,
      dueDate: dueDate || undefined,
      createdAt: new Date().toISOString(),
    };

    saveTodos([...todos, todo]);
    setNewTodo('');
    setDueDate('');
  };

  const toggleTodo = (id: string) => {
    const updatedTodos = todos.map(todo =>
      todo.id === id ? { ...todo, done: !todo.done } : todo
    );
    saveTodos(updatedTodos);
  };

  const deleteTodo = (id: string) => {
    saveTodos(todos.filter(todo => todo.id !== id));
  };

  const pendingTodos = todos.filter(todo => !todo.done);
  const completedTodos = todos.filter(todo => todo.done);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <CheckSquare className="w-5 h-5" />
          To-do List
        </h2>

        {/* Add Todo */}
        <div className="space-y-3 mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTodo()}
              placeholder="Add a new task..."
              className="flex-1 px-3 py-2 border border-border rounded-lg bg-background"
            />
            <button
              onClick={addTodo}
              disabled={!newTodo.trim()}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="px-3 py-2 border border-border rounded-lg bg-background"
          />
        </div>

        {/* Todos */}
        <div className="space-y-4">
          {pendingTodos.length > 0 && (
            <div>
              <h3 className="text-sm font-medium mb-2">Pending ({pendingTodos.length})</h3>
              <div className="space-y-2">
                {pendingTodos.map((todo) => (
                  <div key={todo.id} className="flex items-center gap-3 p-3 border border-border rounded-lg">
                    <input
                      type="checkbox"
                      checked={todo.done}
                      onChange={() => toggleTodo(todo.id)}
                      className="w-4 h-4"
                    />
                    <div className="flex-1">
                      <p className={todo.done ? 'line-through text-muted-foreground' : ''}>
                        {todo.text}
                      </p>
                      {todo.dueDate && (
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(todo.dueDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => deleteTodo(todo.id)}
                      className="p-1 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {completedTodos.length > 0 && (
            <div>
              <h3 className="text-sm font-medium mb-2">Completed ({completedTodos.length})</h3>
              <div className="space-y-2">
                {completedTodos.map((todo) => (
                  <div key={todo.id} className="flex items-center gap-3 p-3 border border-border rounded-lg opacity-75">
                    <input
                      type="checkbox"
                      checked={todo.done}
                      onChange={() => toggleTodo(todo.id)}
                      className="w-4 h-4"
                    />
                    <div className="flex-1">
                      <p className="line-through text-muted-foreground">{todo.text}</p>
                      {todo.dueDate && (
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(todo.dueDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => deleteTodo(todo.id)}
                      className="p-1 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {todos.length === 0 && (
            <p className="text-muted-foreground text-center py-8">
              No tasks yet. Add your first task above!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TodoList;