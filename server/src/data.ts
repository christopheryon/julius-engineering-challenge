import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'csv-parse/sync';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.resolve(__dirname, '../data');

export interface OccupationRecord {
  occupation_code: string;
  occupation_title: string;
  category: string;
  region: string;
  employment: number;
  median_wage: number;
  projected_growth_pct: number;
}

export interface TrendRecord {
  occupation_code: string;
  year: number;
  employment: number;
}

function readCsv<T>(filename: string, cast: (row: Record<string, string>) => T): T[] {
  const filePath = path.join(DATA_DIR, filename);
  const content = fs.readFileSync(filePath, 'utf-8');
  const rows = parse(content, { columns: true, skip_empty_lines: true });
  return rows.map(cast);
}

export function loadOccupations(): OccupationRecord[] {
  return readCsv<OccupationRecord>('occupations.csv', (row) => ({
    occupation_code: row.occupation_code,
    occupation_title: row.occupation_title,
    category: row.category,
    region: row.region,
    employment: Number(row.employment),
    median_wage: Number(row.median_wage),
    projected_growth_pct: Number(row.projected_growth_pct),
  }));
}

export function loadTrends(): TrendRecord[] {
  return readCsv<TrendRecord>('employment_trends.csv', (row) => ({
    occupation_code: row.occupation_code,
    year: Number(row.year),
    employment: Number(row.employment),
  }));
}
