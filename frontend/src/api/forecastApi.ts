import { apiGet, apiPut } from './client'
import type { ForecastData } from '../types/forecast'

const scope = (brand: string, sku: string | null) =>
  new URLSearchParams(sku ? { brand, sku } : { brand }).toString()

export const getForecast = (brand: string, sku: string | null) =>
  apiGet<ForecastData>(`/forecast?${scope(brand, sku)}`)

export const saveOverrides = (brand: string, sku: string | null, overrides: Record<string, number>) =>
  apiPut('/forecast/overrides', { brand, sku, overrides })