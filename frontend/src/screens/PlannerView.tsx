import TopBar from '../components/TopBar'
import PlannerFilters from '../components/PlannerFilters'
import ForecastGrid from '../components/ForecastGrid'
import { usePlannerFilters } from '../hooks/usePlannerFilters'
import './PlannerView.css'

export default function PlannerView({ onLogout }: { onLogout: () => void }) {
  const f = usePlannerFilters()
  if (f.loading) return <div className="planner">Loading…</div>

  return (
    <div className="planner">
      <TopBar onLogout={onLogout} />
      <PlannerFilters {...f} />
      <section className="grid-section">
        <div className="grid-head">
          <h2>{f.sku ? `${f.sku.sku} - ${f.sku.description}` : `${f.brand} - all SKUs`}</h2>
          <span className="grid-range">Jan 2026 &rarr; Dec 2028 &middot; 36 periods</span>
        </div>
        <ForecastGrid brand={f.brand} sku={f.sku} measure={f.measure} />
        <p className="grid-note">
          Click any cell on the <strong>Proposed (override)</strong> row to edit it.
        </p>
      </section>
    </div>
  )
}