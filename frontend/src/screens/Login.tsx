import './Login.css'

interface Props {
  onLogin: () => void
}

/** Screen 1 - placeholder only. Real app defers to Databricks Apps SSO. */
export default function Login({ onLogin }: Props) {
  return (
    <div className="login-screen">
      <div className="login-card">
        <div className="login-mark">IBP</div>
        <h1>Demand Planning Review</h1>
        <p className="login-sub">Italy &middot; IBP Cycle 2026-09</p>
        <button type="button" className="login-btn" onClick={onLogin}>
          Login
        </button>
        <p className="login-foot">Proof of concept &mdash; mock data only</p>
      </div>
    </div>
  )
}