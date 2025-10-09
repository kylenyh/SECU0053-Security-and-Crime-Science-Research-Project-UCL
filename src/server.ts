import express from 'express';
import cors from 'cors';
import { json } from 'express';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(json());

// Health
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// Create a participant session
app.post('/api/session', async (_req, res) => {
  const session = await prisma.session.create({ data: {} });
  res.json({ sessionId: session.id });
});

// Log an epsilon selection event
const epsilonEventSchema = z.object({
  sessionId: z.string().uuid(),
  epsilon: z.number().positive(),
  context: z.object({
    sourcePage: z.string().optional(),
    uiControl: z.string().optional(),
  }).optional(),
});

app.post('/api/epsilon', async (req, res) => {
  const parseResult = epsilonEventSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ error: 'Invalid body', details: parseResult.error.flatten() });
  }
  const { sessionId, epsilon, context } = parseResult.data;
  const event = await prisma.epsilonEvent.create({
    data: {
      sessionId,
      epsilon,
      context: context ?? {},
    },
  });
  res.json({ id: event.id });
});

// Performance model for a given epsilon
const perfQuerySchema = z.object({ epsilon: z.coerce.number().positive() });
app.get('/api/performance', async (req, res) => {
  const parseResult = perfQuerySchema.safeParse(req.query);
  if (!parseResult.success) {
    return res.status(400).json({ error: 'Invalid query', details: parseResult.error.flatten() });
  }
  const { epsilon } = parseResult.data;
  // Simple illustrative model: higher epsilon -> lower latency, fewer CAPTCHAs, higher ad relevance
  const normalized = Math.min(1, Math.max(0, Math.log10(epsilon + 1) / Math.log10(6)));
  const latencyMs = Math.round(800 - normalized * 500); // 800ms down to ~300ms
  const captchaPerHour = Math.round(10 - normalized * 8); // 10 down to 2
  const adRelevance = Math.round(40 + normalized * 50); // 40% to 90%
  const networkAccuracy = Math.round(60 + normalized * 35); // 60% to 95%
  res.json({ epsilon, latencyMs, captchaPerHour, adRelevance, networkAccuracy });
});

// Survey submission
const surveySchema = z.object({
  sessionId: z.string().uuid(),
  answers: z.array(
    z.object({ questionId: z.string(), answer: z.union([z.string(), z.number(), z.boolean()]) })
  ),
  comments: z.string().optional(),
});

app.post('/api/survey', async (req, res) => {
  const parseResult = surveySchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ error: 'Invalid body', details: parseResult.error.flatten() });
  }
  const { sessionId, answers, comments } = parseResult.data;
  const survey = await prisma.surveyResponse.create({ data: { sessionId, answers, comments } });
  res.json({ id: survey.id });
});

// Aggregated summaries for charts
app.get('/api/summary/epsilon-frequency', async (_req, res) => {
  const rows = await prisma.$queryRawUnsafe<any[]>(
    `SELECT epsilon, COUNT(*) as count FROM EpsilonEvent GROUP BY epsilon ORDER BY epsilon`
  );
  res.json(rows.map(r => ({ epsilon: Number(r.epsilon), count: Number(r.count) })));
});

app.get('/api/summary/session-count', async (_req, res) => {
  const count = await prisma.session.count();
  res.json({ count });
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
