import { useState } from 'react'
import { fmtNum, parseNum } from '../utils/format'

interface Props {
  value: number | null          // null = no real override -> empty cell
  placeholder?: number          // IBP value, starting point when editing
  className: string
  onCommit: (v: number) => void
}

export default function EditableCell({ value, placeholder, className, onCommit }: Props) {
  const [draft, setDraft] = useState<string | null>(null)

  const start = value ?? placeholder ?? 0

  const commit = () => {
    const n = parseNum(draft ?? '')
    if (draft?.trim() && !Number.isNaN(n) && n !== Math.round(start)) onCommit(n)
    setDraft(null)
  }

  return (
    <td className={className} onClick={() => draft === null && setDraft(String(Math.round(start)))}>
      {draft === null ? (value == null ? '' : fmtNum(value)) : (
        <input className="cell-input" autoFocus value={draft}
          onChange={e => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={e => { if (e.key === 'Enter') commit(); if (e.key === 'Escape') setDraft(null) }} />
      )}
    </td>
  )
}