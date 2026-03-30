import { useEffect, useState } from "react";
import axios from "axios";
import API from "./api";
import { getXP, getUnlockedBadges, BADGES } from "./xpSystem";

function StudentProfile({ user, onBack }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const xp = getXP();
  const level = Math.floor(xp / 100) + 1;
  const xpInLevel = xp % 100;
  const badges = getUnlockedBadges();

  useEffect(() => {
    axios.get(`${API}/exam/results/${user}`)
      .then(res => setHistory(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  const best    = history.length ? Math.max(...history.map(r => r.percentage)) : 0;
  const avg     = history.length ? history.reduce((s, r) => s + r.percentage, 0) / history.length : 0;
  const passed  = history.filter(r => r.percentage >= 50).length;

  const statBox = (label, value, color) => (
    <div style={{ flex: 1, textAlign: "center", padding: "20px 14px", background: "var(--card-bg)", borderRadius: "14px", border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)" }}>
      <div style={{ fontSize: "30px", fontWeight: "800", color }}>{value}</div>
      <div style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "4px", fontWeight: "600" }}>{label}</div>
    </div>
  );

  return (
    <div className="dashboard">
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "28px" }}>
        <button className="btn btn-secondary" onClick={onBack} style={{ width: "auto", padding: "8px 18px" }}>← Back</button>
        <div>
          <h2 style={{ margin: 0, fontSize: "28px" }}>👤 My Profile</h2>
          <p style={{ margin: 0, color: "var(--text-muted)" }}>@{user}</p>
        </div>
      </div>

      {/* Avatar + XP card */}
      <div className="card" style={{ display: "flex", alignItems: "center", gap: "24px", marginBottom: "24px", flexWrap: "wrap" }}>
        <div style={{
          width: "80px", height: "80px", borderRadius: "50%", flexShrink: 0,
          background: "linear-gradient(135deg, var(--primary), #818cf8)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "34px", boxShadow: "0 4px 16px var(--primary-glow)"
        }}>
          {user?.[0]?.toUpperCase() || "S"}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "10px" }}>
            <h3 style={{ margin: 0, fontSize: "22px" }}>{user}</h3>
            <span style={{ background: "var(--primary-light)", color: "var(--primary)", padding: "3px 12px", borderRadius: "20px", fontSize: "13px", fontWeight: "700" }}>
              Level {level} ⚡
            </span>
          </div>
          <div style={{ marginBottom: "6px", fontSize: "13px", color: "var(--text-muted)", display: "flex", justifyContent: "space-between" }}>
            <span>{xp} XP total</span>
            <span>{xpInLevel}/100 XP to Level {level + 1}</span>
          </div>
          <div style={{ width: "100%", height: "10px", background: "rgba(43,54,116,0.08)", borderRadius: "10px", overflow: "hidden" }}>
            <div style={{ width: `${xpInLevel}%`, height: "100%", background: "linear-gradient(90deg, var(--primary), #818cf8)", borderRadius: "10px", transition: "width 1s ease" }} />
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: "flex", gap: "14px", marginBottom: "24px", flexWrap: "wrap" }}>
        {statBox("Quizzes Taken",  history.length,      "var(--primary)")}
        {statBox("Quizzes Passed", passed,              "var(--accent)")}
        {statBox("Best Score",     `${best.toFixed(0)}%`, "#f59e0b")}
        {statBox("Avg Score",      `${avg.toFixed(0)}%`,  "var(--text-main)")}
      </div>

      {/* Badges */}
      <div className="card" style={{ marginBottom: "24px" }}>
        <h3 style={{ marginBottom: "16px" }}>🏅 My Badges ({badges.length}/{BADGES.length})</h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
          {BADGES.map(badge => {
            const unlocked = badges.includes(badge.id);
            return (
              <div key={badge.id} title={badge.desc} style={{
                padding: "8px 16px", borderRadius: "20px", fontSize: "13px", fontWeight: "600", cursor: "help",
                background: unlocked ? "rgba(245,158,11,0.15)" : "rgba(43,54,116,0.05)",
                color: unlocked ? "#92400e" : "var(--text-muted)",
                border: `1px solid ${unlocked ? "rgba(245,158,11,0.4)" : "var(--border)"}`,
                opacity: unlocked ? 1 : 0.5,
                filter: unlocked ? "none" : "grayscale(1)"
              }}>
                {badge.label}
              </div>
            );
          })}
        </div>
        {badges.length === 0 && (
          <p style={{ color: "var(--text-muted)", fontSize: "14px", margin: "10px 0 0" }}>
            No badges yet — take a quiz to earn your first badge! 🎯
          </p>
        )}
      </div>

      {/* Quiz History */}
      <div className="card">
        <h3 style={{ marginBottom: "18px" }}>📊 Quiz History</h3>
        {loading && <p style={{ color: "var(--text-muted)" }}>Loading history...</p>}
        {!loading && history.length === 0 && (
          <div style={{ textAlign: "center", padding: "30px 0" }}>
            <p style={{ fontSize: "40px", margin: "0 0 10px" }}>🎯</p>
            <p style={{ color: "var(--text-muted)", margin: 0 }}>No quiz attempts yet. Take your first quiz!</p>
          </div>
        )}
        {!loading && history.length > 0 && (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid var(--border)" }}>
                {["Attempt", "Score", "Accuracy", "Status"].map(h => (
                  <th key={h} style={{ padding: "10px 12px", textAlign: "left", color: "var(--text-muted)", fontWeight: "600", fontSize: "13px" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {history.map((r, i) => (
                <tr key={i} style={{ borderBottom: "1px solid var(--border)" }}>
                  <td style={{ padding: "14px 12px", color: "var(--text-muted)", fontSize: "14px" }}>#{history.length - i}</td>
                  <td style={{ padding: "14px 12px", fontWeight: "bold" }}>{r.score}/{r.totalQuestions}</td>
                  <td style={{ padding: "14px 12px", color: r.percentage >= 50 ? "var(--accent)" : "var(--danger)", fontWeight: "bold" }}>
                    {r.percentage.toFixed(1)}%
                  </td>
                  <td style={{ padding: "14px 12px" }}>
                    <span style={{
                      padding: "3px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "bold",
                      background: r.percentage >= 50 ? "rgba(5,205,153,0.12)" : "rgba(239,68,68,0.1)",
                      color: r.percentage >= 50 ? "var(--accent)" : "var(--danger)"
                    }}>
                      {r.percentage >= 50 ? "✅ PASSED" : "❌ FAILED"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default StudentProfile;
