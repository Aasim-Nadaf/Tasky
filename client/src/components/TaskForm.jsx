import { useState } from 'react';

export default function TaskForm({ task, onSave, onCancel }) {
  const [form, setForm] = useState({
    title: task?.title || '',
    description: task?.description || '',
    status: task?.status || 'todo',
    priority: task?.priority || 'medium',
    dueDate: task?.dueDate ? task.dueDate.slice(0, 10) : '',
  });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const set = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await onSave({ ...form, dueDate: form.dueDate || null });
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4 rounded-lg border border-stone-200 bg-white p-4">
      {error && <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      <input className="input" name="title" value={form.title} onChange={set} placeholder="What needs to be done?" maxLength={120} required autoFocus aria-label="Title" />
      <textarea className="input" name="description" value={form.description} onChange={set} placeholder="Add details (optional)" rows={3} maxLength={1000} aria-label="Description" />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <label className="text-sm font-medium">
          Status
          <select className="input mt-1 font-normal" name="status" value={form.status} onChange={set}>
            <option value="todo">To do</option>
            <option value="in-progress">In progress</option>
            <option value="done">Done</option>
          </select>
        </label>
        <label className="text-sm font-medium">
          Priority
          <select className="input mt-1 font-normal" name="priority" value={form.priority} onChange={set}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </label>
        <label className="text-sm font-medium">
          Due date
          <input className="input mt-1 font-normal" type="date" name="dueDate" value={form.dueDate} onChange={set} />
        </label>
      </div>

      <div className="flex justify-end gap-2">
        <button type="button" className="btn-ghost" onClick={onCancel}>Cancel</button>
        <button className="btn-primary" disabled={busy}>{task ? 'Save changes' : 'Add task'}</button>
      </div>
    </form>
  );
}
