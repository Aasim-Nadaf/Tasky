const PRIORITY = {
  high: 'text-red-700',
  medium: 'text-amber-700',
  low: 'text-stone-500',
};

export default function TaskItem({ task, onChange, onEdit, onDelete }) {
  const done = task.status === 'done';
  const due = task.dueDate?.slice(0, 10);
  const overdue = due && !done && due < new Date().toLocaleDateString('en-CA');

  return (
    <li className="flex items-start gap-3 rounded-lg border border-stone-200 bg-white p-4">
      <input
        type="checkbox"
        checked={done}
        onChange={() => onChange(task, { status: done ? 'todo' : 'done' })}
        className="mt-1 h-4 w-4 rounded border-stone-300 accent-teal-700"
        aria-label={`Mark "${task.title}" as ${done ? 'not done' : 'done'}`}
      />

      <div className="min-w-0 flex-1">
        <p className={`font-medium ${done ? 'text-stone-400 line-through' : ''}`}>{task.title}</p>
        {task.description && <p className="mt-0.5 whitespace-pre-line text-sm text-stone-500">{task.description}</p>}

        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
          <select
            value={task.status}
            onChange={(e) => onChange(task, { status: e.target.value })}
            className="rounded-md border border-stone-200 bg-stone-50 px-2 py-1 text-stone-700"
            aria-label="Status"
          >
            <option value="todo">To do</option>
            <option value="in-progress">In progress</option>
            <option value="done">Done</option>
          </select>
          <span className={`font-medium ${PRIORITY[task.priority]}`}>
            {task.priority[0].toUpperCase() + task.priority.slice(1)} priority
          </span>
          {due && (
            <span className={overdue ? 'font-medium text-red-700' : 'text-stone-500'}>
              {overdue ? 'Overdue, ' : 'Due '}
              {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' })}
            </span>
          )}
        </div>
      </div>

      <div className="flex shrink-0 gap-1 text-sm">
        <button className="btn-ghost px-2 py-1" onClick={() => onEdit(task)}>Edit</button>
        <button className="btn-ghost px-2 py-1 text-red-700 hover:bg-red-50" onClick={() => onDelete(task)}>Delete</button>
      </div>
    </li>
  );
}
