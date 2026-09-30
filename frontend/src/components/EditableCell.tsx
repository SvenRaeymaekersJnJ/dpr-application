import { useState } from 'react'
import { fmtNum, parseNum } from '../utils/format'

interface Props { value: number; className: string; onCommit: (v: number) => void }

export default function EditableCell({ value, className, onCommit }: Props) {
  const [draft, setDraft] = useState<string | null>(null)

  const commit = () => {
    const n = parseNum(draft ?? '')
    if (draft?.trim() && !Number.isNaN(n)) onCommit(n)
    setDraft(null)
  }

  return (
    <td className={className} onClick={() => draft === null && setDraft(String(Math.round(value)))}>
      {draft === null ? fmtNum(value) : (
        <input className="cell-input" autoFocus value={draft}
          onChange={e => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={e => { if (e.key === 'Enter') commit(); if (e.key === 'Escape') setDraft(null) }} />
      )}
    </td>
  )
}