import type { Occupation, SortDirection, SortKey } from '../types';
import { formatCurrency, formatNumber, formatPercent } from '../utils/format';

interface Props {
  occupations: Occupation[];
  sortKey: SortKey;
  sortDirection: SortDirection;
  onSortChange: (key: SortKey) => void;
  // TODO (Part 3): wire up row clicks to open the trend view.
  onRowClick?: (occupation: Occupation) => void;
}

export function OccupationTable({
  occupations,
  sortKey,
  sortDirection,
  onSortChange,
  onRowClick,
}: Props) {
  if (occupations.length === 0) {
    return <div className="empty">No occupations match the current filters.</div>;
  }

  const sortIcon = (key: SortKey) => {
    if (sortKey !== key) {
      return '↕';
    }
    return sortDirection === 'asc' ? '▲' : '▼';
  };

  const sortOrder = (key: SortKey) => {
    if (sortKey !== key) {
      return 'none';
    }
    return sortDirection === 'asc' ? 'ascending' : 'descending';
  };

  const renderSortableHeader = (label: string, key: SortKey) => (
    <th aria-sort={sortOrder(key)}>
      <button type="button" onClick={() => onSortChange(key)}>
        {label}{' '}
        <span
          className={sortKey === key ? 'sort-icon is-active' : 'sort-icon'}
          aria-hidden="true"
        >
          {sortIcon(key)}
        </span>
      </button>
    </th>
  );

  return (
    <table className="table">
      <thead>
        <tr>
          <th>Occupation</th>
          <th>Category</th>
          <th>Region</th>
          {renderSortableHeader('Employment', 'employment')}
          {renderSortableHeader('Median wage', 'median_wage')}
          {renderSortableHeader('Projected growth', 'projected_growth_pct')}
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
