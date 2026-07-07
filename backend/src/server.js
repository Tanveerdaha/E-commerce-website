import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import cartRoutes from './routes/cart.js';
import wishlistRoutes from './routes/wishlist.js';
import orderRoutes from './routes/orders.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
let server;

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', message: 'Northstar API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
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

if (process.env.NODE_ENV !== 'test') {
  createServer();
}

export const startServer = () => createServer();

export const closeServer = () => new Promise((resolve) => {
  if (server) {
    server.close(() => resolve());
    server = null;
    return;
  }
  resolve();
});

export default app;
