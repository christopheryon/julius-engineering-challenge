import { fetchOccupations } from './api/occupations';
import { EmploymentByCategoryChart } from './components/EmploymentByCategoryChart';
import { KpiCards } from './components/KpiCards';
import { OccupationTable } from './components/OccupationTable';
import { useFetch } from './hooks/useFetch';
import type { Occupation } from './types';

export default function App() {
  const { data: occupations, loading, error } = useFetch<Occupation[]>(
    fetchOccupations,
    [],
  );

  return (
    <div className="app">
      <header className="app__header">
        <h1>Workforce Dashboard</h1>
        <p>Occupational employment, wages, and projected growth by region.</p>
      </header>

      {/* TODO (Part 2): add filter controls (region select, search, sort) here. */}

      {loading && <div className="loading">Loading data…</div>}
      {error && <div className="error">Failed to load data: {error.message}</div>}

      {!loading && !error && occupations && (
        <>
          <KpiCards occupations={occupations} />

          <section className="panel">
            <div className="panel__header">
              <h2 className="panel__title">Employment by category</h2>
            </div>
            <EmploymentByCategoryChart occupations={occupations} />
          </section>

          <section className="panel">
            <div className="panel__header">
              <h2 className="panel__title">Occupations</h2>
            </div>
            <OccupationTable occupations={occupations} />
          </section>

          {/* TODO (Part 3): when a row is clicked, render the employment trend chart. */}
        </>
      )}
    </div>
  );
}
