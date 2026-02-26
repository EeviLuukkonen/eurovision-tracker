import express from 'express';
import yearsRouter from './routes/years';
import { errorHandler } from './middleware/errorHandler';

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get('/ping', (_req, res) => {
  res.json({ success: true, message: 'pong' });
});

app.use('/api/years', yearsRouter);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});