import { useState } from "react";
import axios from "axios";
import API from "./api";

function Login({ setUser }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    if (!username.trim() || !password.trim()) {
      setError("Please fill in all fields."); return;
    }
    setLoading(true);
    const url = isLogin
      ? `${API}/auth/login`
      : `${API}/auth/register`;

    try {
      const res = await axios.post(url, { username, password });
      if (res.data.success) {
        if (isLogin) {
          localStorage.setItem("token",    res.data.token);
          localStorage.setItem("username", res.data.username);
          localStorage.setItem("role",     res.data.role || "ROLE_STUDENT");
          setUser(res.data.username);
        } else {
          setSuccess("✅ Account created! Please log in.");
          setIsLogin(true);
          setPassword("");
        }
      } else {
        setError(res.data.message || "Something went wrong.");
      }
    } catch {
      setError("Cannot connect to server. Is the backend running?");
    } finally { setLoading(false); }
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setError(""); setSuccess(""); setPassword("");
  };

  return (
    <div className="auth-container">
      <div className="auth-box">

        {/* ── Branding ── */}
        <div style={{ marginBottom: "28px" }}>
          <div style={{
            width: "60px", height: "60px", margin: "0 auto 14px",
            background: "linear-gradient(135deg, var(--primary), #818cf8)",
            borderRadius: "18px", display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: "28px",
            boxShadow: "0 8px 24px var(--primary-glow)"
          }}>🎓</div>
          <h1 style={{ fontSize: "22px", fontWeight: "800", margin: "0 0 4px", letterSpacing: "-0.5px" }}>
            EduTest Platform
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "14px", margin: 0 }}>
            {isLogin ? "Sign in to continue your learning journey" : "Create your free student account"}
          </p>
        </div>

        {/* ── Tabs ── */}
        <div style={{ display: "flex", background: "rgba(99,102,241,0.06)", borderRadius: "10px", padding: "4px", marginBottom: "24px" }}>
          {["Login", "Sign Up"].map(tab => (
            <button key={tab} onClick={() => { setIsLogin(tab === "Login"); setError(""); setSuccess(""); setPassword(""); }}
              style={{
                flex: 1, padding: "9px", border: "none", borderRadius: "8px", cursor: "pointer",
                fontFamily: "inherit", fontWeight: "600", fontSize: "14px", transition: "all 0.2s",
                background: (isLogin ? tab === "Login" : tab === "Sign Up") ? "#fff" : "transparent",
                color: (isLogin ? tab === "Login" : tab === "Sign Up") ? "var(--primary)" : "var(--text-muted)",
                boxShadow: (isLogin ? tab === "Login" : tab === "Sign Up") ? "0 2px 8px rgba(0,0,0,0.08)" : "none"
              }}>
              {tab}
            </button>
          ))}
        </div>

        {/* ── Toast messages ── */}
        {error && (
          <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: "10px", padding: "12px 16px", marginBottom: "18px", color: "var(--danger)", fontSize: "14px", textAlign: "left", animation: "slideDown 0.3s ease" }}>
            ⚠️ {error}
          </div>
        )}
        {success && (
          <div style={{ background: "rgba(5,205,153,0.1)", border: "1px solid rgba(5,205,153,0.3)", borderRadius: "10px", padding: "12px 16px", marginBottom: "18px", color: "var(--accent)", fontSize: "14px", textAlign: "left", animation: "slideDown 0.3s ease" }}>
            {success}
          </div>
        )}

        {/* ── Form ── */}
        <form onSubmit={handleSubmit}>
          <div className="input-grp">
            <label>Username</label>
            <input type="text" required placeholder="Enter your username"
              value={username} onChange={e => setUsername(e.target.value)} autoFocus />
          </div>

          <div className="input-grp" style={{ position: "relative" }}>
            <label>Password</label>
            <input type={showPw ? "text" : "password"} required placeholder="Enter your password"
              value={password} onChange={e => setPassword(e.target.value)}
              style={{ paddingRight: "46px" }} />
            <button type="button" onClick={() => setShowPw(!showPw)}
              style={{ position: "absolute", right: "14px", bottom: "14px", background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", fontSize: "18px", lineHeight: 1, padding: 0 }}>
              {showPw ? "🙈" : "👁️"}
            </button>
          </div>

          <button type="submit" className="btn" disabled={loading}
            style={{ marginTop: "8px", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", opacity: loading ? 0.8 : 1 }}>
            {loading && (
              <div style={{ width: "18px", height: "18px", border: "2px solid rgba(255,255,255,0.4)", borderTop: "2px solid #fff", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
            )}
            {loading ? (isLogin ? "Signing in..." : "Creating account...") : (isLogin ? "Sign In →" : "Create Account →")}
          </button>
        </form>


      </div>

      {/* Spin animation */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default Login;