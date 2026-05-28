import type { Occupation } from '../types';
import { formatCurrency, formatNumber, formatPercent } from '../utils/format';

interface Props {
  occupations: Occupation[];
  // TODO (Part 3): wire up row clicks to open the trend view.
  onRowClick?: (occupation: Occupation) => void;
}

export function OccupationTable({ occupations, onRowClick }: Props) {
  if (occupations.length === 0) {
    return <div className="empty">No occupations match the current filters.</div>;
  }

  return (
    <table className="table">
      <thead>
        <tr>
          <th>Occupation</th>
          <th>Category</th>
          <th>Region</th>
          <th>Employment</th>
          <th>Median wage</th>
          <th>Projected growth</th>
        </tr>
      </thead>
      <tbody>
        {occupations.map((o) => (
          <tr
            key={`${o.occupation_code}-${o.region}`}
            onClick={() => onRowClick?.(o)}
            style={{ cursor: onRowClick ? 'pointer' : 'default' }}
          >
            <td>{o.occupation_title}</td>
            <td>{o.category}</td>
            <td>{o.region}</td>
            <td>{formatNumber(o.employment)}</td>
            <td>{formatCurrency(o.median_wage)}</td>
            <td>{formatPercent(o.projected_growth_pct)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
