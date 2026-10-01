import { apiGet, apiPut } from './client'
import type { ForecastData } from '../types/forecast'
import { Measure } from '../types/planner'

const scope = (brand: string, sku: string | null) =>
  new URLSearchParams(sku ? { brand, sku } : { brand }).toString()

export const getForecast = (brand: string, sku: string | null, measure: Measure) =>
  fetch(`/api/forecast?${new URLSearchParams({ brand, measure, ...(sku ? { sku } : {}) })}`)
    .then(r => r.json())

export const saveOverrides = (
  brand: string,
  sku: string | null,
  measure: Measure,
  overrides: Record<string, number>,
) =>
  fetch('/api/forecast/overrides', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ brand, sku, measure, overrides }),
  })