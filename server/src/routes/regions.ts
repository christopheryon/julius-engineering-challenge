import { Router } from 'express';
import { loadOccupations } from '../data.js';

const router = Router();

/**
 * GET /api/regions
 *
 * Returns the unique list of regions present in the data.
 * Response shape: string[]
 */
router.get('/regions', (_req, res) => {
  const occupations = loadOccupations();
  const regions = Array.from(new Set(occupations.map((o) => o.region))).sort();
  res.json(regions);
});

export default router;
