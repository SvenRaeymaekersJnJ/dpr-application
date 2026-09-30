import { useEffect, useMemo, useState } from 'react'
import { getBrands, getCycles } from '../api/plannerApi'
import type { Brand, Measure } from '../types/planner'

export function usePlannerFilters() {
  const [brands, setBrands] = useState<Brand[]>([])
  const [brand, setBrandRaw] = useState('')
  const [skuId, setSkuId] = useState('ALL')
  const [cycle, setCycle] = useState('')
  const [measure, setMeasure] = useState<Measure>('VOLUME')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getBrands()]).then(([b]) => {
      setBrands(b); 
      setBrandRaw(b[0]?.brand ?? '');
    }).finally(() => setLoading(false))
  }, [])

  const skus = useMemo(() => brands.find(b => b.brand === brand)?.skus ?? [], [brands, brand])
  const sku = useMemo(() => skus.find(s => s.sku === skuId) ?? null, [skus, skuId])
  const setBrand = (b: string) => { setBrandRaw(b); setSkuId('ALL') }

  return { loading, brands, skus, sku, brand, setBrand, skuId, setSkuId, measure, setMeasure }
}