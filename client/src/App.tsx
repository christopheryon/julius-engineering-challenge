import { useMemo, useState } from 'react';
import { fetchOccupations, fetchRegions } from './api/occupations';
import { EmploymentByCategoryChart } from './components/EmploymentByCategoryChart';
import { KpiCards } from './components/KpiCards';
import { OccupationTable } from './components/OccupationTable';
import { useFetch } from './hooks/useFetch';
import type { FiltersState, Occupation } from './types';

export default function App() {
  const { data: occupations, loading, error } = useFetch<Occupation[]>(
    fetchOccupations,
    [],
  );
  const { data: regions } = useFetch<string[]>(fetchRegions, []);

  const [filters, setFilters] = useState<FiltersState>({
    region: 'All',
    query: '',
    sortKey: 'median_wage',
    sortDirection: 'desc',
  });

  const filteredOccupations = useMemo(() => {
    if (!occupations) {
      return [];
    }

    const query = filters.query.trim().toLowerCase();
    let result = occupations;

    if (filters.region !== 'All') {
      result = result.filter((o) => o.region === filters.region);
    }

    if (query) {
      result = result.filter((o) => o.occupation_title.toLowerCase().includes(query));
    }

    const direction = filters.sortDirection === 'asc' ? 1 : -1;
    result = [...result].sort((left, right) => {
      const diff = (left[filters.sortKey] - right[filters.sortKey]) * direction;
      if (diff !== 0) {
        return diff;
      }
      return left.occupation_title.localeCompare(right.occupation_title);
    });

    return result;
  }, [occupations, filters]);

  return (
    <div className="app">
      <header className="app__header">
        <h1>Workforce Dashboard</h1>
        <p>Occupational employment, wages, and projected growth by region.</p>
      </header>

      {loading && <div className="loading">Loading data…</div>}
      {error && <div className="error">Failed to load data: {error.message}</div>}

      {!loading && !error && occupations && (
        <>
          <KpiCards occupations={filteredOccupations} />

          <section className="panel">
            <div className="panel__header">
              <h2 className="panel__title">Employment by category</h2>
            </div>
            <EmploymentByCategoryChart occupations={filteredOccupations} />
          </section>

          <section className="panel">
            <div className="panel__header">
              <h2 className="panel__title">Occupations</h2>
            </div>
            <section className="filters">
              <label className="filters__control">
                <span className="filters__label">Region</span>
                <select
                  value={filters.region}
                  onChange={(event) =>
                    setFilters((prev) => ({ ...prev, region: event.target.value }))
                  }
                >
                  <option value="All">All regions</option>
                  {(regions ?? []).map((region) => (
                    <option key={region} value={region}>
                      {region}
                    </option>
                  ))}
                </select>
              </label>

              <label className="filters__control filters__search">
                <span className="filters__label">Search</span>
                <input
                  type="search"
                  placeholder="Search occupations"
                  value={filters.query}
                  onChange={(event) =>
                    setFilters((prev) => ({ ...prev, query: event.target.value }))
                  }
                />
              </label>
            </section>
            <OccupationTable
              occupations={filteredOccupations}
              sortKey={filters.sortKey}
              sortDirection={filters.sortDirection}
              onSortChange={(nextKey) =>
                setFilters((prev) => ({
                  ...prev,
                  sortKey: nextKey,
                  sortDirection:
                    prev.sortKey === nextKey && prev.sortDirection === 'desc'
                      ? 'asc'
                      : 'desc',
                }))
              }
            />
          </section>

          {/* TODO (Part 3): when a row is clicked, render the employment trend chart. */}
        </>
      )}
    </div>
  );
}
