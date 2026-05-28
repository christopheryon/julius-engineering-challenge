import { Router } from 'express';
import { loadOccupations, loadTrends } from '../data.js';

const router = Router();

// Cache the parsed data on first load. Fine for a mock backend.
const occupations = loadOccupations();
const trends = loadTrends();

/**
 * GET /api/occupations
 *
 * Returns all occupation records.
 * Response shape: { data: OccupationRecord[], count: number }
 */
router.get('/occupations', (_req, res) => {
  res.json({
    data: occupations,
    count: occupations.length,
  });
});

/**
 * GET /api/occupations/:code/trend
 *
 * Returns historical employment for a single occupation, sorted by year ascending.
 * Response shape: { occupation_code: string, points: { year: number, employment: number }[] }
 */
router.get('/occupations/:code/trend', (req, res) => {
  const { code } = req.params;
  const points = trends
    .filter((t) => t.occupation_code === code)
    .sort((a, b) => a.year - b.year)
    .map((t) => ({ year: t.year, employment: t.employment }));

  if (points.length === 0) {
    return res.status(404).json({ error: `No trend data for occupation ${code}` });
  }

  res.json({
    occupation_code: code,
    points,
  });
});

export default router;
