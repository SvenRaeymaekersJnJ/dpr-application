import type { usePlannerFilters } from '../hooks/usePlannerFilters'
import type { Measure } from '../types/planner'

type Props = ReturnType<typeof usePlannerFilters>
const MEASURES: Measure[] = ['VOLUME', 'VALUE']

export default function PlannerFilters(p: Props) {
  return (
    <div className="filters">
      
      <label className="field"><span>Brand</span>
        <select value={p.brand} onChange={e => p.setBrand(e.target.value)}>
          {p.brands.map(b => <option key={b.brand}>{b.brand}</option>)}
        </select>
      </label>
      <label className="field wide"><span>SKU</span>
        <select value={p.skuId} onChange={e => p.setSkuId(e.target.value)}>
          <option value="ALL">All SKUs (brand total)</option>
          {p.skus.map(s => <option key={s.sku} value={s.sku}>{s.sku} &mdash; {s.description}</option>)}
        </select>
      </label>
      <div className="toggle" role="group" aria-label="Measure">
        {MEASURES.map(m => (
          <button key={m} type="button" onClick={() => p.setMeasure(m)}
            className={p.measure === m ? 'toggle-btn active' : 'toggle-btn'}>
            {m === 'VOLUME' ? 'Volumes' : 'Values'}
          </button>
        ))}
      </div>
    </div>
  )
}