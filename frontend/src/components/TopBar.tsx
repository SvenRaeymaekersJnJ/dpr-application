export default function TopBar({ onLogout }: { onLogout: () => void }) {
  return (
    <header className="topbar">
      <div className="topbar-left">
        <span className="brand-mark">IBP</span>
        <div>
          <h1>Demand Planning Review</h1>
          <span className="topbar-sub">Italy</span>
        </div>
      </div>
      <button type="button" className="ghost-btn" onClick={onLogout}>Sign out</button>
    </header>
  )
}