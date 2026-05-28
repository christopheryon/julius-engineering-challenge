import express from 'express';
import cors from 'cors';
import occupationsRouter from './routes/occupations.js';
import regionsRouter from './routes/regions.js';

const app = express();
const PORT = Number(process.env.PORT ?? 3001);

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api', occupationsRouter);
app.use('/api', regionsRouter);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`[server] API listening on http://localhost:${PORT}`);
  console.log(`[server] Try: curl http://localhost:${PORT}/api/health`);
});
