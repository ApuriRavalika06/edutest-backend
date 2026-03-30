import { useEffect, useState } from "react";
import axios from "axios";
import API from "./api";

function Flashcard({ onBack }) {
  const [cards, setCards] = useState([]);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState([]);
  const [unsure, setUnsure] = useState([]);
  const [catFilter, setCatFilter] = useState("All");
  const [done, setDone] = useState(false);

  useEffect(() => {
    axios.get(`${API}/exam/flashcards`)
      .then(res => setCards(res.data))
      .catch(() => alert("Could not load flashcards. Is backend running?"));
  }, []);

  const categories = ["All", ...new Set(cards.map(c => c.category || "General"))];
  const filtered = catFilter === "All" ? cards : cards.filter(c => (c.category || "General") === catFilter);
  const card = filtered[index];
  const total = filtered.length;

  const next = (verdict) => {
    if (verdict === "known") setKnown(p => [...p, card.question]);
    else setUnsure(p => [...p, card.question]);
    setFlipped(false);
    setTimeout(() => {
      if (index + 1 >= total) setDone(true);
      else setIndex(index + 1);
    }, 200);
  };

  const restart = () => { setIndex(0); setFlipped(false); setKnown([]); setUnsure([]); setDone(false); };

  if (cards.length === 0) return (
    <div className="auth-container">
      <div className="auth-box" style={{ textAlign: "center" }}>
        <p style={{ color: "var(--text-muted)", fontSize: "18px" }}>Loading flashcards...</p>
        <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>Make sure the backend is running and questions are added by Admin.</p>
        <button className="btn btn-secondary" onClick={onBack} style={{ marginTop: "20px", width: "auto", padding: "10px 20px" }}>← Back</button>
      </div>
    </div>
  );

  if (done) return (
    <div className="auth-container">
      <div className="auth-box" style={{ maxWidth: "480px", textAlign: "center" }}>
        <h2 style={{ fontSize: "36px", marginBottom: "8px" }}>🎉 Session Complete!</h2>
        <p style={{ color: "var(--text-muted)", marginBottom: "30px" }}>You reviewed all {total} flashcards</p>
        <div className="grid" style={{ marginBottom: "24px" }}>
          <div style={{ background: "rgba(5,205,153,0.1)", border: "1px solid var(--accent)", borderRadius: "12px", padding: "20px" }}>
            <div style={{ fontSize: "36px", fontWeight: "bold", color: "var(--accent)" }}>{known.length}</div>
            <div style={{ color: "var(--text-muted)", fontSize: "14px" }}>I Know This ✅</div>
          </div>
          <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid var(--danger)", borderRadius: "12px", padding: "20px" }}>
            <div style={{ fontSize: "36px", fontWeight: "bold", color: "var(--danger)" }}>{unsure.length}</div>
            <div style={{ color: "var(--text-muted)", fontSize: "14px" }}>Need to Revise 🔁</div>
          </div>
        </div>
        {unsure.length > 0 && (
          <div style={{ textAlign: "left", background: "rgba(239,68,68,0.05)", borderRadius: "12px", padding: "16px", marginBottom: "20px" }}>
            <p style={{ fontWeight: "bold", color: "var(--danger)", marginBottom: "10px" }}>📌 Revise These:</p>
            {unsure.map((q, i) => <p key={i} style={{ margin: "4px 0", fontSize: "14px", color: "var(--text-main)" }}>• {q}</p>)}
          </div>
        )}
        <div style={{ display: "flex", gap: "10px", flexDirection: "column" }}>
          <button className="btn" onClick={restart}>🔁 Restart Session</button>
          <button className="btn btn-secondary" onClick={onBack} style={{ background: "transparent", color: "var(--text-muted)" }}>← Back to Quiz</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="dashboard">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <button className="btn btn-secondary" onClick={onBack} style={{ width: "auto", padding: "8px 16px" }}>← Back</button>
          <div>
            <h2 style={{ margin: 0, fontSize: "26px" }}>🃏 Flashcard Study</h2>
            <p style={{ margin: 0, color: "var(--text-muted)" }}>{index + 1} of {total} cards</p>
          </div>
        </div>
        <select value={catFilter} onChange={e => { setCatFilter(e.target.value); setIndex(0); setFlipped(false); }}
          style={{ padding: "8px 14px", borderRadius: "10px", border: "1px solid var(--border)", background: "var(--card-bg)", color: "var(--text-main)", cursor: "pointer" }}>
          {categories.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>

      {/* Progress bar */}
      <div style={{ width: "100%", height: "6px", background: "rgba(43,54,116,0.1)", borderRadius: "10px", marginBottom: "28px", overflow: "hidden" }}>
        <div style={{ width: `${((index) / total) * 100}%`, height: "100%", background: "var(--primary)", transition: "width 0.4s" }} />
      </div>

      {/* XP tally */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "20px", fontSize: "14px" }}>
        <span style={{ color: "var(--accent)", fontWeight: "bold" }}>✅ Know: {known.length}</span>
        <span style={{ color: "var(--danger)", fontWeight: "bold" }}>🔁 Revise: {unsure.length}</span>
      </div>

      {/* Flashcard — flip on click */}
      <div onClick={() => setFlipped(!flipped)} style={{ cursor: "pointer", perspective: "1200px", marginBottom: "28px" }}>
        <div style={{
          position: "relative", width: "100%", minHeight: "280px",
          transformStyle: "preserve-3d",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
          transition: "transform 0.6s cubic-bezier(0.4, 0.2, 0.2, 1)"
        }}>
          {/* Front — Question */}
          <div style={{
            position: "absolute", width: "100%", minHeight: "280px",
            backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden",
            background: "var(--card-bg)", borderRadius: "20px",
            border: "2px solid var(--border)",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            padding: "40px", boxShadow: "0 8px 40px rgba(0,0,0,0.08)", textAlign: "center"
          }}>
            <span style={{ display: "inline-block", background: "rgba(99,102,241,0.1)", color: "var(--primary)", padding: "3px 12px", borderRadius: "20px", fontSize: "12px", marginBottom: "20px" }}>
              {card.category || "General"} · Click to flip 👆
            </span>
            <h3 style={{ fontSize: "22px", color: "var(--text-main)", lineHeight: "1.5", margin: 0 }}>{card.question}</h3>
            <div style={{ marginTop: "24px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", width: "100%" }}>
              {["A", "B", "C", "D"].map(opt => (
                <div key={opt} style={{ padding: "8px 12px", background: "rgba(43,54,116,0.04)", borderRadius: "8px", fontSize: "13px", textAlign: "left", color: "var(--text-muted)" }}>
                  <strong>{opt}.</strong> {card[`option${opt}`]}
                </div>
              ))}
            </div>
          </div>

          {/* Back — Answer + Explanation */}
          <div style={{
            position: "absolute", width: "100%", minHeight: "280px",
            backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            background: "linear-gradient(135deg, rgba(5,205,153,0.08), rgba(99,102,241,0.08))",
            borderRadius: "20px", border: "2px solid var(--accent)",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            padding: "32px", boxShadow: "0 8px 40px rgba(0,0,0,0.08)", textAlign: "center"
          }}>
            <p style={{ margin: "0 0 6px", fontSize: "13px", color: "var(--text-muted)", fontWeight: "600" }}>✅ CORRECT ANSWER</p>
            <h2 style={{ fontSize: "26px", color: "var(--accent)", marginBottom: "20px" }}>{card.correctAnswer}</h2>
            {card.explanation && card.explanation !== "No explanation provided." && (
              <div style={{ background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: "12px", padding: "14px 18px", width: "100%", textAlign: "left" }}>
                <p style={{ margin: "0 0 6px", fontWeight: "bold", color: "var(--primary)", fontSize: "13px" }}>📖 Explanation</p>
                <p style={{ margin: 0, fontSize: "14px", color: "var(--text-main)", lineHeight: "1.6" }}>{card.explanation}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div style={{ display: "flex", justifyContent: "center", gap: "16px" }}>
        <button onClick={() => next("unsure")}
          style={{ padding: "14px 36px", borderRadius: "50px", background: "rgba(239,68,68,0.1)", color: "var(--danger)", border: "2px solid var(--danger)", fontWeight: "bold", fontSize: "16px", cursor: "pointer", transition: "all 0.2s" }}>
          🔁 Revise
        </button>
        <button onClick={() => next("known")}
          style={{ padding: "14px 36px", borderRadius: "50px", background: "rgba(5,205,153,0.15)", color: "var(--accent)", border: "2px solid var(--accent)", fontWeight: "bold", fontSize: "16px", cursor: "pointer", transition: "all 0.2s" }}>
          ✅ I Know This
        </button>
      </div>
    </div>
  );
}

export default Flashcard;
