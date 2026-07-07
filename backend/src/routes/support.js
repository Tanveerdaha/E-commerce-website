import express from 'express';
import jwt from 'jsonwebtoken';
import SupportMessage from '../models/SupportMessage.js';

const router = express.Router();

const optionalAuth = (req, _res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) {
    try {
      const token = authHeader.split(' ')[1];
      req.user = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      // ignore invalid token for public support form
    }
  }
  next();
};

router.post('/', optionalAuth, async (req, res, next) => {
  try {
    const name = String(req.body.name || '').trim();
    const email = String(req.body.email || '').trim().toLowerCase();
    const subject = String(req.body.subject || '').trim();
    const message = String(req.body.message || '').trim();

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: 'Please enter a valid email address' });
    }

    if (message.length < 10) {
      return res.status(400).json({ message: 'Message must be at least 10 characters' });
    }

    const supportMessage = await SupportMessage.create({
      name,
      email,
      subject,
      message,
      userId: req.user?.id || null,
    });

    res.status(201).json({
      message: 'Your message has been sent. Our support team will get back to you soon.',
      id: supportMessage._id.toString(),
    });
  } catch (error) {
    next(error);
  }
});

export default router;
