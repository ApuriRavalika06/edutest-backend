import { useEffect, useState } from "react";
import axios from "axios";
import API from "./api";

function Leaderboard({ onBack }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API}/exam/leaderboard`)
      .then(res => { setData(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const medals = ["🥇", "🥈", "🥉"];

  return (
    <div className="auth-container" style={{ alignItems: "flex-start", paddingTop: "60px" }}>
      <div style={{ width: "100%", maxWidth: "700px", margin: "0 auto", padding: "0 20px" }}>
        <button className="btn btn-secondary" onClick={onBack} style={{ marginBottom: "20px", width: "auto", padding: "8px 20px" }}>
          ← Back
        </button>
        <h2 style={{ fontSize: "32px", marginBottom: "5px" }}>🏆 Leaderboard</h2>
        <p style={{ color: "var(--text-muted)", marginBottom: "30px" }}>Top performers of all time</p>

        {loading ? (
          <p style={{ color: "var(--text-muted)" }}>Loading...</p>
        ) : data.length === 0 ? (
          <div className="card" style={{ textAlign: "center", padding: "40px" }}>
            <p style={{ color: "var(--text-muted)" }}>No results yet. Complete a quiz to appear here!</p>
          </div>
        ) : (
          data.map((entry, idx) => (
            <div key={idx} className="card" style={{
              display: "flex", alignItems: "center", gap: "20px",
              background: idx === 0 ? "linear-gradient(135deg, #fff8e1, #fff)" : "var(--card-bg)",
              border: idx === 0 ? "2px solid #f59e0b" : "1px solid var(--border)"
            }}>
              <div style={{ fontSize: "36px", minWidth: "50px", textAlign: "center" }}>
                {medals[idx] || `#${idx + 1}`}
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: 0, fontSize: "20px" }}>{entry.username}</h3>
                <p style={{ color: "var(--text-muted)", margin: "4px 0 0 0", fontSize: "14px" }}>
                  Score: {entry.score} / {entry.totalQuestions}
                </p>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{
                  fontSize: "28px", fontWeight: "bold",
                  color: entry.percentage >= 50 ? "var(--accent)" : "var(--danger)"
                }}>
                  {entry.percentage.toFixed(1)}%
                </div>
                <span style={{
                  background: entry.percentage >= 50 ? "rgba(5, 205, 153, 0.15)" : "rgba(239, 68, 68, 0.15)",
                  color: entry.percentage >= 50 ? "var(--accent)" : "var(--danger)",
                  padding: "2px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "bold"
                }}>
                  {entry.percentage >= 50 ? "PASSED" : "FAILED"}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Leaderboard;
