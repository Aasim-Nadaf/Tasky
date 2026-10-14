import { useEffect, useMemo, useState } from 'react';
import request from '../api.js';
import { useAuth } from '../AuthContext.jsx';
import TaskForm from '../components/TaskForm.jsx';
import TaskItem from '../components/TaskItem.jsx';

const TABS = [
  { value: 'all', label: 'All' },
  { value: 'todo', label: 'To do' },
  { value: 'in-progress', label: 'In progress' },
  { value: 'done', label: 'Done' },
];
const RANK = { high: 0, medium: 1, low: 2 };
const SORTS = {
  newest: () => 0,
  due: (a, b) => (a.dueDate || '9999').localeCompare(b.dueDate || '9999'),
  priority: (a, b) => RANK[a.priority] - RANK[b.priority],
};

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(null); // null | 'new' | task
  const [tab, setTab] = useState('all');
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('newest');

  useEffect(() => {
    request('/tasks')
      .then(setTasks)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const counts = useMemo(
    () => Object.fromEntries(TABS.map(({ value }) => [value, value === 'all' ? tasks.length : tasks.filter((t) => t.status === value).length])),
    [tasks]
  );

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tasks
      .filter((t) => (tab === 'all' || t.status === tab) && (!q || `${t.title} ${t.description}`.toLowerCase().includes(q)))
      .sort(SORTS[sort]);
  }, [tasks, tab, query, sort]);

  const save = async (data) => {
    const isNew = editing === 'new';
    const saved = await request(isNew ? '/tasks' : `/tasks/${editing._id}`, { method: isNew ? 'POST' : 'PUT', body: data });
    setTasks((prev) => (isNew ? [saved, ...prev] : prev.map((t) => (t._id === saved._id ? saved : t))));
    setEditing(null);
  };

  const change = async (task, patch) => {
    try {
      const saved = await request(`/tasks/${task._id}`, { method: 'PUT', body: patch });
      setTasks((prev) => prev.map((t) => (t._id === saved._id ? saved : t)));
    } catch (err) {
      setError(err.message);
    }
  };

  const remove = async (task) => {
    if (!window.confirm(`Delete "${task.title}"?`)) return;
    try {
      await request(`/tasks/${task._id}`, { method: 'DELETE' });
      setTasks((prev) => prev.filter((t) => t._id !== task._id));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
          <h1 className="text-lg font-semibold">Task Manager</h1>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-stone-500">{user.name}</span>
            <button className="btn-ghost" onClick={logout}>Sign out</button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-5 px-4 py-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold">Your tasks</h2>
            <p className="text-sm text-stone-500">
              {counts.all - counts.done} open, {counts.done} completed
            </p>
          </div>
          {!editing && <button className="btn-primary" onClick={() => setEditing('new')}>New task</button>}
        </div>

        {error && (
          <p role="alert" className="flex items-center justify-between rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
            <button className="font-medium underline" onClick={() => setError('')}>Dismiss</button>
          </p>
        )}

        {editing && <TaskForm key={editing === 'new' ? 'new' : editing._id} task={editing === 'new' ? null : editing} onSave={save} onCancel={() => setEditing(null)} />}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-1 overflow-x-auto" role="tablist">
            {TABS.map(({ value, label }) => (
              <button
                key={value}
                role="tab"
                aria-selected={tab === value}
                onClick={() => setTab(value)}
                className={`btn whitespace-nowrap ${tab === value ? 'bg-stone-900 text-white' : 'text-stone-600 hover:bg-stone-200/60'}`}
              >
                {label} <span className="opacity-70">{counts[value]}</span>
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <input className="input sm:w-44" type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search tasks" aria-label="Search tasks" />
            <select className="input w-auto" value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort tasks">
              <option value="newest">Newest first</option>
              <option value="due">Due date</option>
              <option value="priority">Priority</option>
            </select>
          </div>
        </div>

        {loading ? (
          <p className="py-10 text-center text-sm text-stone-500">Loading tasks</p>
        ) : visible.length === 0 ? (
          <p className="rounded-lg border border-dashed border-stone-300 py-10 text-center text-sm text-stone-500">
            {tasks.length === 0 ? 'No tasks yet. Select New task to add your first one.' : 'No tasks match your filters.'}
          </p>
        ) : (
          <ul className="space-y-3">
            {visible.map((task) => (
              <TaskItem key={task._id} task={task} onChange={change} onEdit={setEditing} onDelete={remove} />
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
