import { useMemo, useState } from 'react';
import { fetchOccupationTrend, fetchOccupations, fetchRegions } from './api/occupations';
import { EmploymentByCategoryChart } from './components/EmploymentByCategoryChart';
import { KpiCards } from './components/KpiCards';
import { OccupationTable } from './components/OccupationTable';
import { OccupationTrendChart } from './components/OccupationTrendChart';
import { useFetch } from './hooks/useFetch';
import type { FiltersState, Occupation, OccupationTrend } from './types';

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

  const [selectedOccupation, setSelectedOccupation] = useState<Occupation | null>(null);

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

  const selectedRowKey = selectedOccupation
    ? `${selectedOccupation.occupation_code}-${selectedOccupation.region}`
    : null;

  const {
    data: trend,
    loading: trendLoading,
    error: trendError,
  } = useFetch<OccupationTrend | null>(
    () => {
      if (!selectedOccupation) {
        return Promise.resolve(null);
      }
      return fetchOccupationTrend(selectedOccupation.occupation_code);
    },
    [selectedOccupation?.occupation_code],
  );

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
              onRowClick={(occupation) =>
                setSelectedOccupation((prev) => {
                  if (!prev) {
                    return occupation;
                  }
                  const prevKey = `${prev.occupation_code}-${prev.region}`;
                  const nextKey = `${occupation.occupation_code}-${occupation.region}`;
                  return prevKey === nextKey ? null : occupation;
                })
              }
              expandedRowKey={selectedRowKey}
              expandedContent={
                selectedOccupation ? (
                  <div className="trend-panel">
                    <div className="trend-panel__header">
                      <div>
                        <div className="trend-panel__title">Employment trend</div>
                        <div className="trend-panel__subtitle">
                          {selectedOccupation.occupation_title}
                        </div>
                      </div>
                      <button
                        type="button"
                        className="trend-panel__close"
                        onClick={() => setSelectedOccupation(null)}
                        aria-label="Close trend chart"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          width="16"
                          height="16"
                          aria-hidden="true"
                          focusable="false"
                        >
                          <path
                            d="M18 6L6 18M6 6l12 12"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                        </svg>
                      </button>
                    </div>
                    {trendLoading && <div className="loading">Loading trend…</div>}
                    {trendError && (
                      <div className="error">
                        Failed to load trend: {trendError.message}
                      </div>
                    )}
                    {!trendLoading && !trendError && (
                      <OccupationTrendChart
                        trend={trend}
                        occupationTitle={selectedOccupation.occupation_title}
                      />
                    )}
                  </div>
                ) : null
              }
            />
          </section>
        </>
      )}
    </div>
  );
}
