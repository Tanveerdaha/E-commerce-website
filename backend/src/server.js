import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import categoryRoutes from './routes/categories.js';
import adminRoutes from './routes/admin.js';
import cartRoutes from './routes/cart.js';
import wishlistRoutes from './routes/wishlist.js';
import orderRoutes from './routes/orders.js';
import { connectDB } from './config/db.js';
import { ensureSeedData } from './utils/seed.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
let server;

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', message: 'Northstar API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/orders', orderRoutes);

app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
});

const createServer = () => {
  if (server) return server;

  server = app.listen(PORT, () => {
    console.log(`Northstar backend listening on port ${PORT}`);
  });

  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      console.error(`Port ${PORT} is already in use. Please stop the existing server and try again.`);
      server = null;
      process.exitCode = 1;
      return;
    }

    throw error;
  });

  return server;
};

const startApp = async () => {
  await connectDB();
  await ensureSeedData();
  createServer();
};

if (process.env.NODE_ENV !== 'test') {
  startApp().catch((error) => {
    console.error('Failed to start server:', error);
    process.exitCode = 1;
  });
}

export const startServer = async () => {
  await connectDB();
  await ensureSeedData();
  return createServer();
};

export const closeServer = () => new Promise((resolve) => {
  if (server) {
    server.close(() => resolve());
    server = null;
    return;
  }
  resolve();
});

export default app;
