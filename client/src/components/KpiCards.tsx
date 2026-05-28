import type { Occupation } from '../types';
import { formatCurrency, formatNumber } from '../utils/format';

interface Props {
  occupations: Occupation[];
}

export function KpiCards({ occupations }: Props) {
  const totalEmployment = occupations.reduce((sum, o) => sum + o.employment, 0);

  const avgWage =
    occupations.length > 0
      ? Math.round(
          occupations.reduce((sum, o) => sum + o.median_wage, 0) / occupations.length,
        )
      : 0;

  const fastestGrowing =
    occupations.length > 0
      ? [...occupations].sort((a, b) => b.projected_growth_pct - a.projected_growth_pct)[0]
      : null;

  return (
    <div className="kpi-grid">
      <Card label="Occupations shown" value={formatNumber(occupations.length)} />
      <Card label="Total employment" value={formatNumber(totalEmployment)} />
      <Card label="Avg. median wage" value={formatCurrency(avgWage)} />
      <Card
        label="Fastest growing"
        value={fastestGrowing ? fastestGrowing.occupation_title : '—'}
      />
    </div>
  );
}

function Card({ label, value }: { label: string; value: string }) {
  return (
    <div className="kpi-card">
      <div className="kpi-card__label">{label}</div>
      <div className="kpi-card__value">{value}</div>
    </div>
  );
}
