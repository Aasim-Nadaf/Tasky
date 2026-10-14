import { Router } from 'express';
import Task from '../models/Task.js';
import auth from '../middleware/auth.js';

const router = Router();
router.use(auth);

const FIELDS = ['title', 'description', 'status', 'priority', 'dueDate'];
const pick = (body) => Object.fromEntries(FIELDS.filter((k) => k in body).map((k) => [k, body[k]]));

router.get('/', async (req, res) => {
  res.json(await Task.find({ user: req.userId }).sort({ createdAt: -1 }));
});

router.post('/', async (req, res) => {
  res.status(201).json(await Task.create({ ...pick(req.body), user: req.userId }));
});

router.put('/:id', async (req, res) => {
  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, user: req.userId },
    pick(req.body),
    { new: true, runValidators: true }
  );
  if (!task) return res.status(404).json({ message: 'Task not found' });
  res.json(task);
});

router.delete('/:id', async (req, res) => {
  const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.userId });
  if (!task) return res.status(404).json({ message: 'Task not found' });
  res.status(204).end();
});

export default router;
