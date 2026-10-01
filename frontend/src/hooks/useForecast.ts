import { useEffect, useState } from 'react'
import { getForecast, saveOverrides } from '../api/forecastApi'
import type { ForecastData, Impact } from '../types/forecast'
import type { Measure } from '../types/planner'

export interface GridRow { id: string; label: string; kind: 'base' | 'price' | 'override' | 'variance'; editable?: boolean }

export function useForecast(brand: string, sku: string | null, measure: Measure) {
  const [data, setData] = useState<ForecastData | null>(null)
  const [overrides, setOverrides] = useState<Record<string, number>>({})
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!brand) return
    setError(null)
    getForecast(brand, sku, measure)
      .then(d => { setData(d); setOverrides(d.overrides) })
      .catch(e => setError(String(e)))
  }, [brand, sku, measure])

  const price = data?.unit_price ?? 0
  const series = (id: string) => data?.rows.find(r => r.id === id)?.values ?? {}
  const current = series('current_ibp')
  const prior = series('financial')
  const effective = (p: string) => overrides[p] ?? current[p] ?? 0
  const show = (n: number) => n

  const rows: GridRow[] = data ? [
    ...data.rows.map(r => ({ id: r.id, label: r.label, kind: 'base' as const })),
    { id: 'price', label: 'Unit price (EUR)', kind: 'price' },
    { id: 'proposed', label: 'Proposed (override)', kind: 'override', editable: sku !== null },
    { id: 'variance_prior', label: 'Variance vs financial', kind: 'variance' },
  ] : []

  const cell = (rowId: string, p: string) => {
    if (rowId === 'price') return price
    if (rowId === 'proposed') return show(effective(p))
    if (rowId === 'variance_prior') return show(effective(p) - (prior[p] ?? 0))
    return show(series(rowId)[p] ?? 0)
  }

  const setOverride = (p: string, shown: number) => {
    const volume = Math.round(shown)
    setOverrides(o => {
      const next = { ...o }
      next[p] = volume
      return next
    })
  }

  const delta = Object.entries(overrides).reduce((s, [p, v]) => s + v - (current[p] ?? 0), 0)
  const baseTotal = (data?.periods ?? []).reduce((s, p) => s + (current[p] ?? 0), 0)
  const impact: Impact = {
    touched: Object.keys(overrides).length,
    deltaVol: measure === 'VOLUME' ? delta : (price ? delta / price : 0),
    deltaValue: measure === 'VALUE' ? delta : delta * price,
    pct: baseTotal ? (delta / baseTotal) * 100 : 0,
  }

  const dirty = !!data && JSON.stringify(overrides) !== JSON.stringify(data.overrides)

  const save = async () => {
    setSaving(true)
    try {
      await saveOverrides(brand, sku, measure, overrides)
      setData(d => d && { ...d, overrides })
    } catch (e) { setError(String(e)) }
    finally { setSaving(false) }
  }

  return {
    data, error, rows, cell, impact, dirty, saving, save, setOverride,
    isOverridden: (p: string) => overrides[p] !== undefined,
    reset: () => setOverrides({}),
  }
}