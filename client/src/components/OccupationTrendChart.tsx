import { useMemo } from 'react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { OccupationTrend } from '../types';
import { formatNumber } from '../utils/format';

interface Props {
  trend: OccupationTrend | null;
  occupationTitle?: string;
}

/**
 * Renders a line chart of employment trend over time for a single occupation.
 */
export function OccupationTrendChart({ trend, occupationTitle }: Props) {
  const data = useMemo(() => {
    if (!trend) {
      return [];
    }
    return trend.points.map((point) => ({
      year: point.year,
      employment: point.employment,
    }));
  }, [trend]);

  if (!trend || data.length === 0) {
    return (
      <div className="empty">
        {occupationTitle ? 'No trend data available.' : 'Select an occupation to view trend.'}
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: 320 }}>
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 8, right: 16, bottom: 8, left: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="year" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => formatNumber(v)} />
          <Tooltip formatter={(value: number) => formatNumber(value)} />
          <Line
            type="monotone"
            dataKey="employment"
            stroke="var(--color-primary)"
            strokeWidth={2}
            dot={{ r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
