import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { formatUser } from '../utils/serialize.js';

const router = express.Router();

const createToken = (user) => jwt.sign(
  { id: user._id.toString(), email: user.email, role: user.role || 'user' },
  process.env.JWT_SECRET,
  { expiresIn: '7d' },
);

router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    if (!normalizedEmail.endsWith('@gmail.com')) {
      return res.status(400).json({ message: 'Email must be a gmail.com address' });
    }

    if (String(password).length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters' });
    }

    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      role: 'user',
    });

    const token = createToken(user);
    res.status(201).json({ token, user: formatUser(user) });
  } catch (error) {
    next(error);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = createToken(user);
    res.json({ token, user: formatUser(user) });
  } catch (error) {
    next(error);
  }
});

router.post('/admin/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user || user.role !== 'admin') {
      return res.status(401).json({ message: 'Invalid admin credentials' });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid admin credentials' });
    }

    const token = createToken(user);
    res.json({ token, user: formatUser(user) });
  } catch (error) {
    next(error);
  }
});

export default router;
