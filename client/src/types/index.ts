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
