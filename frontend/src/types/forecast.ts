export interface ForecastRow { id: string; label: string; values: Record<string, number> }

export interface ForecastData {
  periods: string[]                  // "2026-01" … "2028-12"
  unit_price: number
  rows: ForecastRow[]                // must include "current_ibp" and "prior_ibp"
  overrides: Record<string, number>  // saved overrides, always VOLUME
}

export interface Impact { touched: number; deltaVol: number; deltaValue: number; pct: number }