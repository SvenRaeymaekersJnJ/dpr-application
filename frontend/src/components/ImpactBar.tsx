import type { Impact } from '../types/forecast'
import { fmtEur, signed } from '../utils/format'

interface Props { impact: Impact; dirty: boolean; saving: boolean; onReset: () => void; onSave: () => void }
const tone = (n: number) => `impact-value ${n >= 0 ? 'pos' : 'neg'}`

export default function ImpactBar({ impact: i, dirty, saving, onReset, onSave }: Props) {
  const items: [string, string, string][] = [
    ['Periods changed', String(i.touched), 'impact-value'],
    ['Volume impact', signed(i.deltaVol, `${i.deltaVol.toLocaleString('it-IT')} u`), tone(i.deltaVol)],
    ['Financial impact', signed(i.deltaValue, fmtEur(i.deltaValue)), tone(i.deltaValue)],
    ['vs Current IBP', signed(i.pct, `${i.pct.toFixed(2)}%`), tone(i.pct)],
  ]

  return (
    <div className="impact">
      {items.map(([label, value, cls]) => (
        <div key={label} className="impact-item">
          <span className="impact-label">{label}</span>
          <span className={cls}>{value}</span>
        </div>
      ))}
      <button className="reset-btn" type="button" disabled={!i.touched} onClick={onReset}>Reset overrides</button>
      <button className="reset-btn" type="button" disabled={!dirty || saving} onClick={onSave}>
        {saving ? 'Saving…' : 'Save'}
      </button>
    </div>
  )
}