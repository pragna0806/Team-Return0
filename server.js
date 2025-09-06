import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { pool, initDb } from './src/db.js';
import authRouter from './src/routes/auth.js';
import productRouter from './src/routes/products.js';
import cartRouter from './src/routes/cart.js';
import orderRouter from './src/routes/orders.js';
import userRouter from './src/routes/user.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.CLIENT_ORIGIN?.split(',') || '*',
  credentials: true
}));
app.use(express.json({ limit: '2mb' }));

app.get('/', (req, res) => {
  res.json({ status: 'EcoFinds API running' });
});

app.use('/api/auth', authRouter);
app.use('/api/products', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/orders', orderRouter);
app.use('/api/user', userRouter);

// Initialize DB schema
initDb().then(() => {
  app.listen(PORT, () => console.log(`EcoFinds API listening on port ${PORT}`));
}).catch(err => {
  console.error('DB init failed:', err);
  process.exit(1);
});
