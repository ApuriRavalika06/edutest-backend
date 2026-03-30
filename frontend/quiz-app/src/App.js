import { useState, useEffect } from "react";
import Login from "./Login";
import Quiz from "./Quiz";
import Result from "./Result";
import AdminDashboard from "./AdminDashboard";
import Leaderboard from "./Leaderboard";
import QuizReview from "./QuizReview";
import WeakAreas from "./WeakAreas";
import Flashcard from "./Flashcard";
import StudentProfile from "./StudentProfile";
import RetryQuiz from "./RetryQuiz";
import Chatbot from "./Chatbot";

function App() {
  const [user, setUser]     = useState(localStorage.getItem("username"));
  const [result, setResult] = useState(null);
  // views: quiz | result | leaderboard | review | weakareas | flashcard | profile | retry
  const [view, setView]     = useState("quiz");
  const [darkMode, setDarkMode] = useState(localStorage.getItem("darkMode") === "true");

  const role = localStorage.getItem("role");

  useEffect(() => {
    if (darkMode) {
      document.documentElement.style.setProperty("--bg-color",   "#0a0a1a");
      document.documentElement.style.setProperty("--card-bg",    "#13132a");
      document.documentElement.style.setProperty("--text-main",  "#e2e8f0");
      document.documentElement.style.setProperty("--text-muted", "#64748b");
      document.documentElement.style.setProperty("--border",     "rgba(99,102,241,0.2)");
    } else {
      document.documentElement.style.setProperty("--bg-color",   "#f0f2ff");
      document.documentElement.style.setProperty("--card-bg",    "#ffffff");
      document.documentElement.style.setProperty("--text-main",  "#1e1b4b");
      document.documentElement.style.setProperty("--text-muted", "#6b7280");
      document.documentElement.style.setProperty("--border",     "rgba(99,102,241,0.12)");
    }
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    setUser(null); setResult(null); setView("quiz");
  };

  // Floating dark-mode toggle
  const DarkToggle = () => (
    <button onClick={() => setDarkMode(!darkMode)} title="Toggle dark/light mode"
      style={{
        position: "fixed", bottom: "24px", right: "24px", zIndex: 9998,
        width: "48px", height: "48px", borderRadius: "50%",
        background: darkMode ? "#f0f2ff" : "#13132a",
        color: darkMode ? "#1e1b4b" : "#e2e8f0",
        border: "none", cursor: "pointer", fontSize: "20px",
        boxShadow: "0 4px 14px rgba(0,0,0,0.25)",
        display: "flex", alignItems: "center", justifyContent: "center",
        transition: "all 0.3s"
      }}>
      {darkMode ? "☀️" : "🌙"}
    </button>
  );

  const wrap = (children) => <>{children}<DarkToggle /><Chatbot /></>;

  if (!user)            return wrap(<Login setUser={setUser} />);
  if (role === "ROLE_ADMIN") return wrap(<AdminDashboard user={user} logout={logout} />);

  if (view === "flashcard")  return wrap(<Flashcard onBack={() => setView("quiz")} />);
  if (view === "profile")    return wrap(<StudentProfile user={user} onBack={() => setView("quiz")} />);
  if (view === "leaderboard") return wrap(<Leaderboard onBack={() => setView(result ? "result" : "quiz")} />);

  if (view === "retry"      && result?.reviewData)
    return wrap(<RetryQuiz reviewData={result.reviewData} onBack={() => setView("review")} />);
  if (view === "review"     && result?.reviewData)
    return wrap(<QuizReview reviewData={result.reviewData} onBack={() => setView("result")} onRetry={() => setView("retry")} />);
  if (view === "weakareas"  && result?.reviewData)
    return wrap(<WeakAreas reviewData={result.reviewData} onBack={() => setView("result")} />);

  if (view === "result" && result)
    return wrap(
      <Result
        result={result}
        logout={logout}
        showLeaderboard={() => setView("leaderboard")}
        showReview={() => setView("review")}
        showWeakAreas={() => setView("weakareas")}
      />
    );

  // ── Default: Quiz Page ──
  return wrap(
    <>
      {/* Topbar */}
      <div style={{ padding: "14px 28px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border)", background: "var(--card-bg)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "34px", height: "34px", background: "linear-gradient(135deg, var(--primary), #818cf8)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px" }}>🎓</div>
          <span style={{ fontSize: "18px", fontWeight: "800", letterSpacing: "-0.5px" }}>EduTest</span>
        </div>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <button onClick={() => setView("flashcard")} className="btn"
            style={{ width: "auto", padding: "8px 16px", fontSize: "13px", background: "var(--primary-light)", color: "var(--primary)" }}>
            🃏 Flashcards
          </button>
          <button onClick={() => setView("leaderboard")} className="btn"
            style={{ width: "auto", padding: "8px 16px", fontSize: "13px", background: "var(--primary-light)", color: "var(--primary)" }}>
            🏆 Leaderboard
          </button>
          <button onClick={() => setView("profile")} style={{
            width: "36px", height: "36px", borderRadius: "50%", border: "2px solid var(--primary)",
            background: "linear-gradient(135deg, var(--primary), #818cf8)",
            color: "#fff", fontWeight: "800", fontSize: "15px", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center"
          }}>
            {user?.[0]?.toUpperCase()}
          </button>
        </div>
      </div>
      <Quiz user={user} setResult={(res) => { setResult(res); setView("result"); }} logout={logout} showLeaderboard={() => setView("leaderboard")} />
    </>
  );
}

export default App;