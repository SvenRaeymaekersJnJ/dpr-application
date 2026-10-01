import { LineChart, Line, XAxis, YAxis, Tooltip, Legend } from 'recharts'
import { fmtNum } from '../utils/format'
import type { useForecast } from '../hooks/useForecast'

type F = ReturnType<typeof useForecast>

export const LABEL_W = 152   // width of the grid's label column
export const COL_W = 64      // width of one month column

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

export default function ForecastChart({ f }: { f: F }) {
  const id = (label: string) => f.rows.find(r => r.label === label)?.id
  const ibp = id('Current IBP'), fin = id('Financial plan')
  const ov = f.rows.find(r => r.kind === 'override')?.id

  const data = f.data!.periods.map(p => {
    const base = ibp ? f.cell(ibp, p) : null
    const o = ov ? f.cell(ov, p) : null
    return {
      period: p,
      ibp: base,
      target: fin ? f.cell(fin, p) : null,
      proposed: o ?? base,          // falls back to IBP where there is no override
    }
  })

  const width = LABEL_W + data.length * COL_W

  return (
    <LineChart width={width} height={260} data={data}
      margin={{ top: 10, right: 0, bottom: 0, left: 0 }}>
      <XAxis
        dataKey="period"
        interval={0}
        padding={{ left: COL_W / 2, right: COL_W / 2 }}
        tickFormatter={(p: string) => MONTHS[Number(p.slice(5, 7)) - 1]}
        fontSize={11}
      />
      <YAxis width={LABEL_W} tickFormatter={fmtNum} fontSize={11} />
      <Tooltip formatter={(v) => (typeof v === 'number' ? fmtNum(v) : String(v ?? ''))} />
      <Legend />
      <Line dataKey="ibp" name="Current IBP" stroke="#1f6feb" dot={false} />
      <Line dataKey="target" name="Business targets" stroke="#9aa4b2" dot={false} />
      <Line dataKey="proposed" name="Proposed" stroke="#d1242f" strokeDasharray="5 4" dot={false} />
    </LineChart>
  )
}