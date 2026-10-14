import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import auth from '../middleware/auth.js';

const router = Router();

const respond = (res, user, status = 200) =>
  res.status(status).json({
    token: jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' }),
    user: { id: user._id, name: user.name, email: user.email },
  });

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  respond(res, await User.create({ name, email, password }), 201);
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email?.toLowerCase() });
  if (!user || !(await bcrypt.compare(password || '', user.password))) {
    return res.status(401).json({ message: 'Incorrect email or password' });
  }
  respond(res, user);
});

router.get('/me', auth, async (req, res) => {
  const user = await User.findById(req.userId);
  if (!user) return res.status(401).json({ message: 'Not authorized' });
  res.json({ id: user._id, name: user.name, email: user.email });
});

export default router;
