import { useState } from "react";

function RetryQuiz({ reviewData, onDone, onBack }) {
  // Only show questions that were answered wrong
  const wrongQs = reviewData.filter(r => r.correct === "false");
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [retryResult, setRetryResult] = useState(null);

  if (wrongQs.length === 0) return (
    <div className="auth-container">
      <div className="auth-box" style={{ textAlign: "center", maxWidth: "420px" }}>
        <p style={{ fontSize: "48px", margin: "0 0 14px" }}>🎉</p>
        <h2 style={{ marginBottom: "10px" }}>No Wrong Answers!</h2>
        <p style={{ color: "var(--text-muted)", marginBottom: "24px" }}>You got everything correct. Nothing to retry!</p>
        <button className="btn" onClick={onBack}>← Go Back</button>
      </div>
    </div>
  );

  const handleSubmit = () => {
    let correct = 0;
    wrongQs.forEach(q => {
      if (answers[q.question] === q.correctAnswer) correct++;
    });
    setRetryResult({ correct, total: wrongQs.length });
    setSubmitted(true);
  };

  if (submitted && retryResult) return (
    <div className="auth-container">
      <div className="auth-box" style={{ maxWidth: "440px", textAlign: "center" }}>
        <p style={{ fontSize: "48px", margin: "0 0 14px" }}>{retryResult.correct === retryResult.total ? "🏆" : "💪"}</p>
        <h2 style={{ marginBottom: "8px" }}>Retry Complete!</h2>
        <p style={{ color: "var(--text-muted)", marginBottom: "24px" }}>
          You got <strong style={{ color: "var(--accent)" }}>{retryResult.correct}</strong> out of <strong>{retryResult.total}</strong> correct this time.
        </p>
        {/* Per-question feedback */}
        <div style={{ textAlign: "left", marginBottom: "24px" }}>
          {wrongQs.map((q, i) => {
            const isNowCorrect = answers[q.question] === q.correctAnswer;
            return (
              <div key={i} style={{ padding: "12px 14px", marginBottom: "10px", borderRadius: "10px", borderLeft: `4px solid ${isNowCorrect ? "var(--accent)" : "var(--danger)"}`, background: isNowCorrect ? "rgba(5,205,153,0.06)" : "rgba(239,68,68,0.05)" }}>
                <p style={{ margin: "0 0 4px", fontSize: "14px", fontWeight: "600" }}>{q.question}</p>
                <p style={{ margin: 0, fontSize: "13px", color: isNowCorrect ? "var(--accent)" : "var(--danger)" }}>
                  {isNowCorrect ? "✅ Correct!" : `❌ Still wrong — Answer: ${q.correctAnswer}`}
                </p>
              </div>
            );
          })}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {retryResult.correct < retryResult.total && (
            <button className="btn" onClick={() => { setAnswers({}); setSubmitted(false); setRetryResult(null); }}>
              🔁 Try Again
            </button>
          )}
          <button className="btn btn-secondary" onClick={onBack} style={{ background: "var(--primary-light)", color: "var(--primary)" }}>
            ← Back to Results
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="dashboard">
      <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "28px" }}>
        <button className="btn btn-secondary" onClick={onBack} style={{ width: "auto", padding: "8px 18px" }}>← Back</button>
        <div>
          <h2 style={{ margin: 0, fontSize: "26px" }}>🔁 Retry Wrong Questions</h2>
          <p style={{ margin: 0, color: "var(--text-muted)" }}>{wrongQs.length} question{wrongQs.length > 1 ? "s" : ""} to redo</p>
        </div>
      </div>

      <div style={{ marginBottom: "24px", padding: "14px 18px", background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.3)", borderRadius: "12px", fontSize: "14px", color: "#92400e" }}>
        💡 These are the questions you got wrong. Try again without any time pressure!
      </div>

      {wrongQs.map((q, idx) => (
        <div key={idx} className="card" style={{ marginBottom: "16px" }}>
          {q.category && (
            <span style={{ display: "inline-block", background: "var(--primary-light)", color: "var(--primary)", padding: "2px 10px", borderRadius: "6px", fontSize: "12px", marginBottom: "10px" }}>
              {q.category}
            </span>
          )}
          <h4 style={{ margin: "0 0 16px", fontSize: "16px" }}>
            <span style={{ color: "var(--primary)", marginRight: "8px" }}>Q{idx + 1}.</span>{q.question}
          </h4>
          {["A", "B", "C", "D"].map(opt => {
            const val = q[`option${opt}`];
            const selected = answers[q.question] === val;
            return (
              <label key={opt} className="option-label" style={{
                background: selected ? "var(--primary-light)" : "",
                borderColor: selected ? "var(--primary)" : ""
              }}>
                <input type="radio" name={`retry-${idx}`} checked={selected} onChange={() => setAnswers({ ...answers, [q.question]: val })} />
                <span>{val}</span>
              </label>
            );
          })}
        </div>
      ))}

      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "10px" }}>
        <button className="btn" style={{ width: "200px" }} onClick={handleSubmit}
          disabled={Object.keys(answers).length < wrongQs.length}>
          Submit Retry
        </button>
      </div>
    </div>
  );
}

export default RetryQuiz;
