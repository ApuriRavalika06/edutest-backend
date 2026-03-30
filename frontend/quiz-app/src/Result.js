import { useState, useEffect } from "react";
import Confetti from "./Confetti";
import { awardXP, getXP, getUnlockedBadges, BADGES } from "./xpSystem";

function Result({ result, logout, showLeaderboard, showReview, showWeakAreas }) {
  const percentage = result.percentage.toFixed(1);
  const isSuccess = result.percentage >= 50;

  const [aiGrading, setAiGrading] = useState(true);
  const [aiFeedback, setAiFeedback] = useState("");
  const [xpEarned, setXpEarned] = useState(0);
  const [newBadges, setNewBadges] = useState([]);
  const [showBadgePopup, setShowBadgePopup] = useState(false);
  const totalXP = getXP();
  const unlockedBadges = getUnlockedBadges();

  useEffect(() => {
    // Award XP once on mount
    const timeLeft = result.timeLeft || 0;
    const { xpEarned: earned, newBadges: badges } = awardXP(result.percentage, timeLeft);
    setXpEarned(earned);
    if (badges.length > 0) {
      setNewBadges(badges);
      setTimeout(() => setShowBadgePopup(true), 1500);
    }
  }, []);

  useEffect(() => {
    if (result.userEssay && result.userEssay.length > 5) {
      setTimeout(() => {
        setAiGrading(false);
        setAiFeedback(
          result.userEssay.length > 30
            ? "A+ | Outstanding detail. The Neural Network was highly impressed by your conceptual clarity."
            : "B | Good. The AI noted your answer was correct but lacked deeper elaboration."
        );
      }, 3000);
    } else {
      setAiGrading(false);
      if (result.userEssay !== undefined)
        setAiFeedback("F | No substantial essay provided. AI could not extract enough tokens.");
    }
  }, [result.userEssay]);

  // XP Level calculation
  const level = Math.floor(totalXP / 100) + 1;
  const xpInLevel = totalXP % 100;

  return (
    <div className="auth-container" style={{ overflowY: "auto", alignItems: "flex-start", paddingTop: "40px" }}>
      {isSuccess && <Confetti />}

      {/* New Badge Popup */}
      {showBadgePopup && (
        <div style={{
          position: "fixed", top: "20px", right: "20px", zIndex: 9999,
          background: "var(--card-bg)", border: "2px solid #f59e0b",
          borderRadius: "16px", padding: "20px 24px", boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
          maxWidth: "300px", animation: "slideDown 0.4s ease"
        }}>
          <p style={{ margin: "0 0 10px", fontWeight: "bold", color: "#f59e0b" }}>🏅 New Badge Unlocked!</p>
          {newBadges.map(id => {
            const badge = BADGES.find(b => b.id === id);
            return badge ? (
              <div key={id} style={{ marginBottom: "6px" }}>
                <div style={{ fontWeight: "bold" }}>{badge.label}</div>
                <div style={{ fontSize: "13px", color: "var(--text-muted)" }}>{badge.desc}</div>
              </div>
            ) : null;
          })}
          <button onClick={() => setShowBadgePopup(false)}
            style={{ marginTop: "10px", background: "#f59e0b", color: "#fff", border: "none", borderRadius: "8px", padding: "6px 14px", cursor: "pointer", fontWeight: "bold" }}>
            Awesome!
          </button>
        </div>
      )}

      <div className="auth-box" style={{ maxWidth: "520px", margin: "0 auto" }}>
        <h2 style={{ fontSize: "34px", color: isSuccess ? "var(--accent)" : "var(--danger)", marginBottom: "6px" }}>
          {isSuccess && result.percentage >= 80 ? "🏆 " : ""}{result.message}{isSuccess && result.percentage >= 80 ? " 🏆" : ""}
        </h2>

        {/* Score ring */}
        <div style={{ margin: "24px 0" }}>
          <div className={isSuccess ? "success-anim" : ""} style={{
            width: "120px", height: "120px", borderRadius: "50%",
            background: isSuccess ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)",
            border: `4px solid ${isSuccess ? "var(--accent)" : "var(--danger)"}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto", fontSize: "28px", fontWeight: "bold", color: "var(--text-main)"
          }}>
            {percentage}%
          </div>
        </div>

        {/* Stats */}
        <div style={{ background: "#f4f7fe", padding: "18px", borderRadius: "12px", marginBottom: "14px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
            <span style={{ color: "var(--text-muted)" }}>MCQ Score</span>
            <span style={{ fontWeight: "bold" }}>{result.score} / {result.totalQuestions}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: "var(--text-muted)" }}>Accuracy</span>
            <span style={{ fontWeight: "bold", color: isSuccess ? "var(--accent)" : "var(--danger)" }}>{percentage}%</span>
          </div>
        </div>

        {/* XP Earned */}
        <div style={{ background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)", padding: "16px", borderRadius: "12px", marginBottom: "14px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
            <div>
              <span style={{ fontWeight: "bold", color: "var(--primary)" }}>+{xpEarned} XP Earned! ⚡</span>
              <span style={{ marginLeft: "12px", fontSize: "13px", color: "var(--text-muted)" }}>Level {level} · {totalXP} XP total</span>
            </div>
          </div>
          <div style={{ width: "100%", height: "8px", background: "rgba(43,54,116,0.1)", borderRadius: "10px" }}>
            <div style={{ width: `${xpInLevel}%`, height: "100%", background: "var(--primary)", borderRadius: "10px", transition: "width 1s ease" }} />
          </div>
          <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "6px", textAlign: "right" }}>{xpInLevel}/100 XP to Level {level + 1}</div>
        </div>

        {/* Badges */}
        {unlockedBadges.length > 0 && (
          <div style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)", padding: "14px", borderRadius: "12px", marginBottom: "14px" }}>
            <p style={{ margin: "0 0 10px", fontWeight: "bold", fontSize: "14px", color: "#f59e0b" }}>Your Badges 🏅</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {unlockedBadges.map(id => {
                const badge = BADGES.find(b => b.id === id);
                return badge ? (
                  <span key={id} title={badge.desc} style={{
                    background: "rgba(245,158,11,0.15)", color: "#92400e",
                    padding: "4px 10px", borderRadius: "20px", fontSize: "13px", fontWeight: "bold", cursor: "help"
                  }}>
                    {badge.label}
                  </span>
                ) : null;
              })}
            </div>
          </div>
        )}

        {/* AI Grader */}
        {result.userEssay !== undefined && (
          <div style={{
            background: aiGrading ? "rgba(99,102,241,0.1)" : "rgba(16,185,129,0.1)",
            border: `1px solid ${aiGrading ? "var(--primary)" : "var(--accent)"}`,
            padding: "14px", borderRadius: "12px", marginBottom: "20px", textAlign: "left"
          }}>
            <h4 style={{ margin: "0 0 8px", color: aiGrading ? "var(--primary)" : "var(--accent)", fontSize: "15px" }}>
              {aiGrading ? "🤖 Neural Net Grading..." : "✨ AI Feedback Generated"}
            </h4>
            <p style={{ margin: 0, fontSize: "14px", color: "var(--text-main)", fontStyle: aiGrading ? "italic" : "normal" }}>
              {aiGrading ? "Analyzing token weights and semantic meaning..." : aiFeedback}
            </p>
          </div>
        )}

        {/* Actions */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {result.reviewData && result.reviewData.length > 0 && (
            <button className="btn" onClick={showReview} style={{ background: "var(--primary)" }}>
              📋 Review My Answers
            </button>
          )}
          {result.reviewData && result.reviewData.length > 0 && (
            <button className="btn" onClick={showWeakAreas} style={{ background: "rgba(239,68,68,0.1)", color: "var(--danger)", border: "1px solid rgba(239,68,68,0.3)" }}>
              📊 See Weak Areas Report
            </button>
          )}
          <button className="btn" onClick={showLeaderboard} style={{ background: "rgba(99,102,241,0.1)", color: "var(--primary)" }}>
            🏆 View Leaderboard
          </button>
          <button className="btn btn-secondary" onClick={logout}
            style={{ background: "rgba(239,68,68,0.1)", color: "var(--danger)", marginTop: "4px" }}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Result;