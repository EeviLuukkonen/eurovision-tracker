import express from 'express';
import cookieParser from 'cookie-parser';
import yearsRouter from './routes/years';
import entrysRouter from './routes/entrys';
import authRouter from './routes/auth';
import rankingsRouter from './routes/rankings';
import { errorHandler } from './middleware/errorHandler';

const app = express();
app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 3000;

app.get('/ping', (_req, res) => {
  res.json({ success: true, message: 'pong' });
});

app.use('/api/years', yearsRouter);
app.use('/api/entrys', entrysRouter);
app.use('/api/auth', authRouter);
app.use('/api/rankings', rankingsRouter);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});