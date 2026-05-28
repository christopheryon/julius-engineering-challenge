export interface Occupation {
  occupation_code: string;
  occupation_title: string;
  category: string;
  region: string;
  employment: number;
  median_wage: number;
  projected_growth_pct: number;
}

export interface OccupationsResponse {
  data: Occupation[];
  count: number;
}

export interface TrendPoint {
  year: number;
  employment: number;
}

export interface OccupationTrend {
  occupation_code: string;
  points: TrendPoint[];
}

export type SortKey = 'median_wage' | 'projected_growth_pct' | 'employment';
export type SortDirection = 'asc' | 'desc';

export interface FiltersState {
  region: string;
  query: string;
  sortKey: SortKey;
  sortDirection: SortDirection;
}
