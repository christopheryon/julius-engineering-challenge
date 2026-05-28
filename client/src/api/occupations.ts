import type { Occupation, OccupationTrend, OccupationsResponse } from '../types';

const API_BASE = '/api';

async function request<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) {
    throw new Error(`Request failed: ${res.status} ${res.statusText}`);
  }
  return res.json() as Promise<T>;
}

export async function fetchOccupations(): Promise<Occupation[]> {
  const response = await request<OccupationsResponse>('/occupations');
  return response.data;
}

export async function fetchRegions(): Promise<string[]> {
  return request<string[]>('/regions');
}

export async function fetchOccupationTrend(occupationCode: string): Promise<OccupationTrend> {
  return request<OccupationTrend>(
    `/occupations/${encodeURIComponent(occupationCode)}/trend`,
  );
}
