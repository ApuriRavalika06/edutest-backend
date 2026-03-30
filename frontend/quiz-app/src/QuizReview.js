function QuizReview({ reviewData, onBack, onRetry }) {
  const correct = reviewData.filter(r => r.correct === "true").length;
  const wrong   = reviewData.length - correct;

  return (
    <div className="dashboard">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "28px", flexWrap: "wrap", gap: "12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <button className="btn btn-secondary" onClick={onBack} style={{ width: "auto", padding: "8px 20px" }}>← Back</button>
          <div>
            <h2 style={{ margin: 0, fontSize: "28px" }}>📋 Quiz Review</h2>
            <p style={{ margin: 0, color: "var(--text-muted)" }}>
              {correct}/{reviewData.length} correct · {(correct / reviewData.length * 100).toFixed(0)}% accuracy
            </p>
          </div>
        </div>
        {wrong > 0 && (
          <button className="btn" onClick={onRetry} style={{ width: "auto", padding: "10px 20px", fontSize: "14px" }}>
            🔁 Retry {wrong} Wrong Question{wrong > 1 ? "s" : ""}
          </button>
        )}
      </div>

      {reviewData.map((item, idx) => {
        const isCorrect = item.correct === "true";
        return (
          <div key={idx} className="card" style={{
            marginBottom: "16px",
            borderLeft: `5px solid ${isCorrect ? "var(--accent)" : "var(--danger)"}`,
          }}>
            {/* Question heading */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px" }}>
              <div style={{ flex: 1 }}>
                {item.category && (
                  <span style={{ display: "inline-block", background: "rgba(99,102,241,0.1)", color: "var(--primary)", padding: "2px 8px", borderRadius: "6px", fontSize: "12px", marginBottom: "6px" }}>
                    {item.category}
                  </span>
                )}
                <h4 style={{ margin: "0 0 0", fontSize: "16px" }}>
                  <span style={{ color: "var(--primary)", marginRight: "8px" }}>Q{idx + 1}.</span>{item.question}
                </h4>
              </div>
              <span style={{
                padding: "4px 14px", borderRadius: "20px", fontWeight: "bold", fontSize: "13px", flexShrink: 0, marginLeft: "10px",
                background: isCorrect ? "rgba(5,205,153,0.15)" : "rgba(239,68,68,0.15)",
                color: isCorrect ? "var(--accent)" : "var(--danger)"
              }}>
                {isCorrect ? "✅ Correct" : "❌ Wrong"}
              </span>
            </div>

            {/* Options — color coded */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "14px" }}>
              {["A", "B", "C", "D"].map(opt => {
                const val = item[`option${opt}`];
                const isYours = val === item.yourAnswer;
                const isAnswer = val === item.correctAnswer;
                let bg = "rgba(43,54,116,0.04)", border = "var(--border)", color = "var(--text-main)";
                if (isAnswer) { bg = "rgba(5,205,153,0.15)"; border = "var(--accent)"; color = "var(--accent)"; }
                else if (isYours && !isAnswer) { bg = "rgba(239,68,68,0.1)"; border = "var(--danger)"; color = "var(--danger)"; }
                return (
                  <div key={opt} style={{ padding: "10px 14px", borderRadius: "8px", border: `1px solid ${border}`, background: bg, color, fontSize: "14px", display: "flex", alignItems: "center", gap: "8px" }}>
                    <strong style={{ minWidth: "18px" }}>{opt}.</strong> {val}
                    {isAnswer && <span style={{ marginLeft: "auto" }}>✓</span>}
                    {isYours && !isAnswer && <span style={{ marginLeft: "auto" }}>✗</span>}
                  </div>
                );
              })}
            </div>

            {/* Correct answer reminder row */}
            {!isCorrect && (
              <div style={{ padding: "10px 14px", background: "rgba(5,205,153,0.08)", borderRadius: "8px", fontSize: "14px", marginBottom: item.explanation ? "10px" : "0" }}>
                <span style={{ color: "var(--text-muted)" }}>Correct Answer: </span>
                <span style={{ color: "var(--accent)", fontWeight: "bold" }}>{item.correctAnswer}</span>
              </div>
            )}

            {/* 📖 Explanation */}
            {item.explanation && (
              <div style={{ padding: "12px 16px", background: "rgba(99,102,241,0.07)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: "10px", fontSize: "14px" }}>
                <p style={{ margin: "0 0 4px", fontWeight: "bold", color: "var(--primary)" }}>📖 Explanation</p>
                <p style={{ margin: 0, color: "var(--text-main)", lineHeight: "1.6" }}>{item.explanation}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default QuizReview;
