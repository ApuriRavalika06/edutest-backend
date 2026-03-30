function WeakAreas({ reviewData, onBack }) {
  // Build per-category stats
  const categoryMap = {};
  reviewData.forEach(item => {
    const cat = item.category || "General";
    if (!categoryMap[cat]) categoryMap[cat] = { correct: 0, total: 0 };
    categoryMap[cat].total++;
    if (item.correct === "true") categoryMap[cat].correct++;
  });

  const stats = Object.entries(categoryMap).map(([cat, data]) => ({
    category: cat,
    correct: data.correct,
    total: data.total,
    percent: Math.round((data.correct / data.total) * 100)
  })).sort((a, b) => a.percent - b.percent); // weakest first

  const getColor = (pct) => {
    if (pct >= 80) return "var(--accent)";
    if (pct >= 50) return "#f59e0b";
    return "var(--danger)";
  };

  const getLabel = (pct) => {
    if (pct >= 80) return { text: "Strong 💪", bg: "rgba(5,205,153,0.15)", color: "var(--accent)" };
    if (pct >= 50) return { text: "Average ⚡", bg: "rgba(245,158,11,0.15)", color: "#b45309" };
    return { text: "Needs Work 📚", bg: "rgba(239,68,68,0.1)", color: "var(--danger)" };
  };

  const weakest = stats.filter(s => s.percent < 50);

  return (
    <div className="dashboard">
      <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "28px" }}>
        <button className="btn btn-secondary" onClick={onBack} style={{ width: "auto", padding: "8px 20px" }}>← Back</button>
        <div>
          <h2 style={{ margin: 0, fontSize: "28px" }}>📊 Weak Areas Report</h2>
          <p style={{ margin: 0, color: "var(--text-muted)" }}>Your performance breakdown by topic</p>
        </div>
      </div>

      {/* Overall summary bar */}
      <div className="card" style={{ marginBottom: "24px", display: "flex", gap: "30px", alignItems: "center", flexWrap: "wrap" }}>
        <div>
          <p style={{ margin: 0, color: "var(--text-muted)", fontWeight: "600", fontSize: "13px" }}>OVERALL ACCURACY</p>
          <p style={{ margin: 0, fontSize: "42px", fontWeight: "800", color: "var(--primary)" }}>
            {Math.round(reviewData.filter(r => r.correct === "true").length / reviewData.length * 100)}%
          </p>
        </div>
        <div style={{ flex: 1, minWidth: "200px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px", fontSize: "13px" }}>
            <span style={{ color: "var(--accent)" }}>✅ {reviewData.filter(r => r.correct === "true").length} Correct</span>
            <span style={{ color: "var(--danger)" }}>❌ {reviewData.filter(r => r.correct !== "true").length} Wrong</span>
          </div>
          <div style={{ width: "100%", height: "12px", background: "rgba(239,68,68,0.15)", borderRadius: "10px", overflow: "hidden" }}>
            <div style={{
              width: `${Math.round(reviewData.filter(r => r.correct === "true").length / reviewData.length * 100)}%`,
              height: "100%", background: "var(--accent)", borderRadius: "10px", transition: "width 1s ease"
            }} />
          </div>
        </div>
      </div>

      {/* Per-category breakdown */}
      <div className="card" style={{ marginBottom: "24px" }}>
        <h3 style={{ marginBottom: "20px" }}>Topic Breakdown</h3>
        {stats.map(s => {
          const label = getLabel(s.percent);
          return (
            <div key={s.category} style={{ marginBottom: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ fontWeight: "bold", fontSize: "15px" }}>{s.category}</span>
                  <span style={{ background: label.bg, color: label.color, padding: "2px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "bold" }}>
                    {label.text}
                  </span>
                </div>
                <span style={{ fontWeight: "bold", color: getColor(s.percent), fontSize: "16px" }}>
                  {s.correct}/{s.total} ({s.percent}%)
                </span>
              </div>
              <div style={{ width: "100%", height: "10px", background: "rgba(43,54,116,0.08)", borderRadius: "10px", overflow: "hidden" }}>
                <div style={{
                  width: `${s.percent}%`, height: "100%",
                  background: getColor(s.percent),
                  borderRadius: "10px", transition: "width 1s ease"
                }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Study Recommendations */}
      {weakest.length > 0 && (
        <div className="card" style={{ background: "rgba(239,68,68,0.04)", border: "1px solid rgba(239,68,68,0.2)" }}>
          <h3 style={{ marginBottom: "16px", color: "var(--danger)" }}>📌 Focus on These Topics</h3>
          <p style={{ color: "var(--text-muted)", fontSize: "14px", marginBottom: "16px" }}>
            You scored below 50% in these areas. Use Flashcard Mode to revise them!
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            {weakest.map(s => (
              <div key={s.category} style={{
                padding: "10px 18px", borderRadius: "12px",
                background: "rgba(239,68,68,0.1)", border: "1px solid var(--danger)", color: "var(--danger)", fontWeight: "bold"
              }}>
                {s.category} — {s.percent}%
              </div>
            ))}
          </div>
        </div>
      )}

      {weakest.length === 0 && (
        <div className="card" style={{ textAlign: "center", background: "rgba(5,205,153,0.06)", border: "1px solid var(--accent)" }}>
          <p style={{ fontSize: "22px", margin: "0 0 8px" }}>🎉 No Weak Areas!</p>
          <p style={{ color: "var(--text-muted)", margin: 0 }}>You scored above 50% in every topic. Keep it up!</p>
        </div>
      )}
    </div>
  );
}

export default WeakAreas;
