const BASE = '/api'

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) throw new Error(`${res.status} ${await res.text()}`)
  return (await res.json()) as T
}

export interface ForecastUpdate {
  sku: string
  forecast_month: string
  measure_type: string
  override_value: number
  assumption?: string | null
  modified_by: string
}

export const getBrands = () =>
  request<{ brand: string }[]>('/brands')

export const saveForecastUpdate = (update: ForecastUpdate) =>
  request('/forecast-updates', {
    method: 'POST',
    body: JSON.stringify(update),
  })