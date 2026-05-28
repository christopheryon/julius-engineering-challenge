import { useMemo } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { Occupation } from '../types';

interface Props {
  occupations: Occupation[];
}

/**
 * Aggregates employment by category and renders as a bar chart.
 */
export function EmploymentByCategoryChart({ occupations }: Props) {
  const data = useMemo(() => {
    const byCategory = new Map<string, number>();
    for (const o of occupations) {
      byCategory.set(o.category, (byCategory.get(o.category) ?? 0) + o.employment);
    }
    return Array.from(byCategory, ([category, employment]) => ({
      category,
      employment,
    })).sort((a, b) => b.employment - a.employment);
  }, []);

  if (occupations.length === 0) {
    return <div className="empty">No data to display.</div>;
  }

  return (
    <div style={{ width: '100%', height: 320 }}>
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 8, right: 16, bottom: 8, left: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="category" tick={{ fontSize: 12 }} />
          <YAxis
            tick={{ fontSize: 12 }}
            tickFormatter={(v) => `${(v / 1_000_000).toFixed(1)}M`}
          />
          <Tooltip
            formatter={(value: number) => new Intl.NumberFormat('en-US').format(value)}
          />
          <Bar dataKey="employment" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
