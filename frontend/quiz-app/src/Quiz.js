import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import API from "./api";

function Quiz({ user, setResult, logout }) {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [pinned, setPinned] = useState({});
  const [essay, setEssay] = useState("");
  const [time, setTime] = useState(() => parseInt(localStorage.getItem("examDuration") || "60"));
  const [tabWarnings, setTabWarnings] = useState(0);
  const [showWarning, setShowWarning] = useState(false);

  const submitExam = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const payload = Object.keys(answers).map((qId) => ({
        questionId: parseInt(qId),
        answer: answers[qId],
      }));
      const res = await axios.post(
        `${API}/exam/submit/${user}`, payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResult({ ...res.data, userEssay: essay });
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        alert("Session expired. Please log in again.");
        logout();
      } else {
        alert("Submit failed");
      }
    }
  }, [answers, essay, user, setResult, logout]);

  useEffect(() => {
    fetchQuestions();

    const timer = setInterval(() => {
      setTime((prev) => {
        if (prev <= 1) { submitExam(); clearInterval(timer); return 0; }
        return prev - 1;
      });
    }, 1000);

    // Anti-cheat: detect tab switch
    const handleBlur = () => {
      setTabWarnings(w => {
        const next = w + 1;
        setShowWarning(true);
        setTimeout(() => setShowWarning(false), 3000);
        if (next >= 3) { alert("⚠️ You switched tabs 3 times. Exam auto-submitting!"); submitExam(); }
        return next;
      });
    };
    window.addEventListener("blur", handleBlur);

    return () => { clearInterval(timer); window.removeEventListener("blur", handleBlur); };
  }, [submitExam]);

  const fetchQuestions = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) { logout(); return; }
      const res = await axios.get(
        `${API}/exam/start/${user}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Shuffle client-side too
      const shuffled = res.data.sort(() => Math.random() - 0.5);
      setQuestions(shuffled);
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        alert("Session expired. Please log in again.");
        logout();
      } else {
        alert("Error loading questions");
      }
    }
  };

  const handleAnswer = (qid, option) => setAnswers({ ...answers, [qid]: option });
  const togglePin = (qid) => setPinned({ ...pinned, [qid]: !pinned[qid] });

  const answered = Object.keys(answers).length + (essay.length > 10 ? 1 : 0);
  const total = questions.length + 1;
  const progress = total > 0 ? Math.round((answered / total) * 100) : 0;

  return (
    <div className="dashboard">
      {/* Anti-cheat warning banner */}
      {showWarning && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 9999,
          background: "var(--danger)", color: "#fff",
          padding: "14px", textAlign: "center", fontWeight: "bold", fontSize: "16px",
          animation: "slideDown 0.3s ease"
        }}>
          ⚠️ Warning! Tab switch detected ({tabWarnings}/3). Exam will auto-submit on 3rd switch!
        </div>
      )}

      <div className="header" style={{ marginBottom: "20px", marginTop: showWarning ? "50px" : "0" }}>
        <div>
          <h2 style={{ fontSize: "28px", margin: 0 }}>Knowledge Quiz</h2>
          <p style={{ color: "var(--text-muted)", margin: "5px 0 0 0" }}>Good luck, {user}!</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <div style={{
            padding: "8px 16px", borderRadius: "20px",
            background: time <= 10 ? "rgba(239, 68, 68, 0.2)" : "rgba(16, 185, 129, 0.2)",
            color: time <= 10 ? "var(--danger)" : "var(--accent)",
            fontWeight: "bold", display: "flex", alignItems: "center", gap: "8px"
          }}>
            ⏱ {time}s
          </div>
          <button className="btn btn-secondary" onClick={logout} style={{ padding: "8px", margin: 0 }}>Logout</button>
        </div>
      </div>

      {questions.length > 0 && (
        <div style={{ marginBottom: "30px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", color: "var(--text-muted)", marginBottom: "8px" }}>
            <span>Quiz Progress</span>
            <span>{answered} of {total} Answered</span>
          </div>
          <div style={{ width: "100%", height: "8px", background: "rgba(43, 54, 116, 0.1)", borderRadius: "10px", overflow: "hidden" }}>
            <div style={{ width: `${progress}%`, height: "100%", background: "var(--primary)", transition: "width 0.4s ease" }} />
          </div>
        </div>
      )}

      {questions.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px" }}>
          <p style={{ color: "var(--text-muted)", fontSize: "18px" }}>Loading questions...</p>
        </div>
      ) : (
        <div className="grid">
          {questions.map((q, idx) => (
            <div key={q.id} className="card" style={{ border: pinned[q.id] ? "2px solid #f59e0b" : "1px solid var(--border)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ flex: 1 }}>
                  {q.category && (
                    <span style={{ display: "inline-block", background: "rgba(99,102,241,0.1)", color: "var(--primary)", padding: "2px 8px", borderRadius: "6px", fontSize: "12px", marginBottom: "8px" }}>
                      {q.category}
                    </span>
                  )}
                  <h4 style={{ marginBottom: "20px", fontSize: "18px", color: "var(--text-main)" }}>
                    <span style={{ color: "var(--primary)", marginRight: "10px" }}>Q{idx + 1}.</span>
                    {q.question}
                  </h4>
                </div>
                <button onClick={() => togglePin(q.id)} title="Pin for Review"
                  style={{ background: pinned[q.id] ? "#f59e0b" : "transparent", color: pinned[q.id] ? "#fff" : "var(--text-muted)", border: "none", borderRadius: "50%", width: "32px", height: "32px", cursor: "pointer", fontSize: "16px" }}>
                  📌
                </button>
              </div>

              {["A", "B", "C", "D"].map((opt) => (
                <label key={opt} className="option-label" style={{
                  background: answers[q.id] === q[`option${opt}`] ? "#fff0f4" : "#ffffff",
                  borderColor: answers[q.id] === q[`option${opt}`] ? "rgba(255, 71, 126, 0.5)" : "var(--border)"
                }}>
                  <input type="radio" name={`question-${q.id}`}
                    checked={answers[q.id] === q[`option${opt}`]}
                    onChange={() => handleAnswer(q.id, q[`option${opt}`])} />
                  <span>{q[`option${opt}`]}</span>
                </label>
              ))}
            </div>
          ))}

          {/* AI Bonus Essay */}
          <div className="card" style={{ gridColumn: "1 / -1", border: "2px dashed var(--primary)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "15px" }}>
              <div className="success-anim" style={{ width: "12px", height: "12px", background: "var(--primary)", borderRadius: "50%" }} />
              <h4 style={{ margin: 0, fontSize: "18px", color: "var(--primary)" }}>Bonus AI-Graded Essay</h4>
            </div>
            <p style={{ color: "var(--text-muted)" }}>Write a short explanation of any computer science concept. Our Neural Net will grade it instantly.</p>
            <textarea
              style={{ width: "100%", height: "100px", padding: "15px", borderRadius: "10px", border: "1px solid var(--border)", outline: "none", fontSize: "16px", background: "#f4f7fe", color: "var(--text-main)", resize: "vertical" }}
              placeholder="Start typing your essay here..."
              value={essay}
              onChange={(e) => setEssay(e.target.value)}
            />
          </div>
        </div>
      )}

      {questions.length > 0 && (
        <div style={{ marginTop: "30px", display: "flex", justifyContent: "flex-end" }}>
          <button className="btn" style={{ width: "200px" }} onClick={submitExam}>
            Submit Answers
          </button>
        </div>
      )}
    </div>
  );
}

export default Quiz;