import express from 'express';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import yearsRouter from './routes/years';
import entrysRouter from './routes/entrys';
import authRouter from './routes/auth';
import rankingsRouter from './routes/rankings';
import resultsRouter from './routes/results';
import { errorHandler } from './middleware/errorHandler';

const app = express();

app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

app.get('/ping', (_req, res) => {
  res.json({ success: true, message: 'pong' });
});

app.use('/api/years', yearsRouter);
app.use('/api/entrys', entrysRouter);
app.use('/api/auth', authRouter);
app.use('/api/rankings', rankingsRouter);
app.use('/api/results', resultsRouter);

app.use(errorHandler);

export default app;
