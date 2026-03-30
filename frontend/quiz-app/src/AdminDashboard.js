import { useEffect, useState } from "react";
import axios from "axios";
import API from "./api";

const TABS = ["Questions", "Students", "Monitor", "Settings"];

function AdminDashboard({ user, logout }) {
  const [activeTab, setActiveTab] = useState("Questions");
  const [questions, setQuestions] = useState([]);
  const [students, setStudents] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filterCat, setFilterCat] = useState("All");
  const [activeUsers, setActiveUsers] = useState(42);
  const [examDuration, setExamDuration] = useState(60);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [newQuestion, setNewQuestion] = useState({
    question: "", optionA: "", optionB: "", optionC: "", optionD: "",
    correctAnswer: "", category: "General", explanation: ""
  });

  useEffect(() => {
    fetchAll();
    const iv = setInterval(() => setActiveUsers(p => Math.max(1, p + Math.floor(Math.random() * 5) - 2)), 3000);
    return () => clearInterval(iv);
  }, []);

  const fetchAll = async () => {
    try {
      const [qRes, sRes, lRes] = await Promise.all([
        axios.get(`${API}/questions`),
        axios.get(`${API}/questions/students`),
        axios.get(`${API}/exam/leaderboard`),
      ]);
      setQuestions(qRes.data);
      setStudents(sRes.data);
      setLeaderboard(lRes.data);
      const cats = [...new Set(qRes.data.map(q => q.category || "General"))];
      setCategories(cats);
    } catch (err) { console.error(err); }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/questions`, newQuestion);
      setNewQuestion({ question: "", optionA: "", optionB: "", optionC: "", optionD: "", correctAnswer: "", category: "General", explanation: "" });
      fetchAll();
    } catch { alert("Error adding question"); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this question?")) return;
    await axios.delete(`${API}/questions/${id}`);
    fetchAll();
  };

  const handleEdit = (q) => {
    setEditingId(q.id);
    setEditForm({ question: q.question, optionA: q.optionA, optionB: q.optionB, optionC: q.optionC, optionD: q.optionD, correctAnswer: "", category: q.category || "General", explanation: q.explanation || "" });
  };

  const handleSaveEdit = async (id) => {
    await axios.put(`${API}/questions/${id}`, editForm);
    setEditingId(null);
    fetchAll();
  };

  const exportCSV = () => {
    const rows = [["Username", "Score", "Total", "Percentage"]];
    leaderboard.forEach(r => rows.push([r.username, r.score, r.totalQuestions, r.percentage.toFixed(1) + "%"]));
    const csv = rows.map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "quiz_results.csv"; a.click();
  };

  const filteredQ = filterCat === "All" ? questions : questions.filter(q => (q.category || "General") === filterCat);

  const inp = (label, field, obj, setObj) => (
    <div className="input-grp">
      <label>{label}</label>
      <input value={obj[field] || ""} onChange={e => setObj({ ...obj, [field]: e.target.value })} />
    </div>
  );

  const ta = (label, field, obj, setObj) => (
    <div className="input-grp">
      <label>{label}</label>
      <textarea rows={3} value={obj[field] || ""} onChange={e => setObj({ ...obj, [field]: e.target.value })}
        style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid var(--border)", outline: "none", fontSize: "14px", background: "rgba(99,102,241,0.03)", color: "var(--text-main)", resize: "vertical", fontFamily: "inherit" }} />
    </div>
  );

  return (
    <div className="dashboard">

      {/* Header */}
      <div className="header" style={{ marginBottom: "24px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
            <div style={{ width: "36px", height: "36px", background: "linear-gradient(135deg, var(--primary), #818cf8)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px" }}>🎓</div>
            <h2 style={{ margin: 0, fontSize: "26px", fontWeight: "800" }}>EduTest Admin</h2>
          </div>
          <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "14px" }}>
            Welcome back, <strong>{user}</strong> · {questions.length} Questions · {students.filter(s => s.role !== "ROLE_ADMIN").length} Students
          </p>
        </div>
        <button className="btn" onClick={logout} style={{ background: "rgba(239,68,68,0.1)", color: "var(--danger)", width: "auto", padding: "10px 20px", border: "1px solid rgba(239,68,68,0.25)" }}>
          Logout
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "4px", marginBottom: "30px", borderBottom: "2px solid var(--border)" }}>
        {TABS.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{
            padding: "10px 20px", border: "none", cursor: "pointer", fontFamily: "inherit",
            fontWeight: activeTab === tab ? "700" : "500", fontSize: "14px",
            background: "transparent",
            color: activeTab === tab ? "var(--primary)" : "var(--text-muted)",
            borderBottom: activeTab === tab ? "2px solid var(--primary)" : "2px solid transparent",
            marginBottom: "-2px", transition: "all 0.2s"
          }}>
            {tab === "Questions" ? "📚 Questions" : tab === "Students" ? "👩‍🎓 Students" : tab === "Monitor" ? "📡 Live Monitor" : "⚙️ Settings"}
          </button>
        ))}
      </div>

      {/* ── QUESTIONS TAB ── */}
      {activeTab === "Questions" && (
        <div className="grid">
          {/* Add Form */}
          <div>
            <h3 style={{ marginBottom: "14px" }}>Add New Question</h3>
            <div className="card">
              <form onSubmit={handleAdd}>
                {inp("Question", "question", newQuestion, setNewQuestion)}
                <div className="input-grp">
                  <label>Category</label>
                  <input list="cat-options" value={newQuestion.category} onChange={e => setNewQuestion({ ...newQuestion, category: e.target.value })} />
                  <datalist id="cat-options">
                    {["Java", "Python", "DSA", "Web", "DBMS", "OS", "OOP", "General"].map(c => <option key={c} value={c} />)}
                  </datalist>
                </div>
                {inp("Option A", "optionA", newQuestion, setNewQuestion)}
                {inp("Option B", "optionB", newQuestion, setNewQuestion)}
                {inp("Option C", "optionC", newQuestion, setNewQuestion)}
                {inp("Option D", "optionD", newQuestion, setNewQuestion)}
                {inp("Correct Answer (exact text)", "correctAnswer", newQuestion, setNewQuestion)}
                {ta("📖 Explanation (shown after quiz)", "explanation", newQuestion, setNewQuestion)}
                <button type="submit" className="btn" style={{ marginTop: "6px" }}>Deploy Question</button>
              </form>
            </div>
          </div>

          {/* Question Bank */}
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
              <h3 style={{ margin: 0 }}>Question Bank ({filteredQ.length})</h3>
              <select value={filterCat} onChange={e => setFilterCat(e.target.value)}
                style={{ padding: "6px 12px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--card-bg)", color: "var(--text-main)", cursor: "pointer", fontFamily: "inherit" }}>
                <option>All</option>
                {categories.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>

            {filteredQ.length === 0 ? (
              <div style={{ textAlign: "center", padding: "50px 20px", background: "var(--card-bg)", borderRadius: "16px", border: "2px dashed var(--border)" }}>
                <p style={{ fontSize: "48px", margin: "0 0 14px" }}>{filterCat !== "All" ? "🔍" : "📭"}</p>
                <h3 style={{ margin: "0 0 8px" }}>{filterCat !== "All" ? `No "${filterCat}" questions yet` : "Question Bank is Empty"}</h3>
                <p style={{ color: "var(--text-muted)", margin: 0, fontSize: "14px" }}>
                  {filterCat !== "All" ? "Try a different category or add questions." : "Add your first question using the form on the left!"}
                </p>
              </div>
            ) : (
              filteredQ.map(q => (
                <div key={q.id} className="card" style={{ marginBottom: "12px" }}>
                  {editingId === q.id ? (
                    <div>
                      {inp("Question", "question", editForm, setEditForm)}
                      {inp("Category", "category", editForm, setEditForm)}
                      {inp("Option A", "optionA", editForm, setEditForm)}
                      {inp("Option B", "optionB", editForm, setEditForm)}
                      {inp("Option C", "optionC", editForm, setEditForm)}
                      {inp("Option D", "optionD", editForm, setEditForm)}
                      {inp("Correct Answer", "correctAnswer", editForm, setEditForm)}
                      {ta("📖 Explanation", "explanation", editForm, setEditForm)}
                      <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
                        <button className="btn" style={{ width: "auto", padding: "8px 16px" }} onClick={() => handleSaveEdit(q.id)}>Save</button>
                        <button className="btn btn-secondary" style={{ width: "auto", padding: "8px 16px", margin: 0 }} onClick={() => setEditingId(null)}>Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <span style={{ display: "inline-block", background: "var(--primary-light)", color: "var(--primary)", padding: "2px 10px", borderRadius: "6px", fontSize: "12px", marginBottom: "8px", fontWeight: "600" }}>
                        {q.category || "General"}
                      </span>
                      <h4 style={{ margin: "0 0 8px", fontSize: "15px" }}>{q.question}</h4>
                      <div style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "12px" }}>
                        A: {q.optionA} · B: {q.optionB} · C: {q.optionC} · D: {q.optionD}
                      </div>
                      {q.explanation && (
                        <div style={{ padding: "8px 12px", background: "rgba(99,102,241,0.06)", borderRadius: "8px", fontSize: "13px", color: "var(--text-muted)", marginBottom: "12px" }}>
                          📖 {q.explanation.substring(0, 100)}{q.explanation.length > 100 ? "..." : ""}
                        </div>
                      )}
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button className="btn" style={{ width: "auto", padding: "6px 14px", fontSize: "13px" }} onClick={() => handleEdit(q)}>✏️ Edit</button>
                        <button className="btn btn-danger" style={{ width: "auto", padding: "6px 14px", fontSize: "13px" }} onClick={() => handleDelete(q.id)}>🗑 Remove</button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ── STUDENTS TAB ── */}
      {activeTab === "Students" && (
        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h3 style={{ margin: 0 }}>Registered Students ({students.filter(s => s.role !== "ROLE_ADMIN").length})</h3>
          </div>
          {students.filter(s => s.role !== "ROLE_ADMIN").length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <p style={{ fontSize: "40px", margin: "0 0 12px" }}>👩‍🎓</p>
              <h3 style={{ margin: "0 0 8px" }}>No Students Yet</h3>
              <p style={{ color: "var(--text-muted)", margin: 0, fontSize: "14px" }}>Students will appear here once they register.</p>
            </div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid var(--border)" }}>
                  {["#", "Username", "Role", "Status"].map(h => (
                    <th key={h} style={{ padding: "12px 10px", textAlign: "left", color: "var(--text-muted)", fontWeight: "600", fontSize: "13px" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {students.filter(s => s.role !== "ROLE_ADMIN").map((s, i) => (
                  <tr key={s.id} style={{ borderBottom: "1px solid var(--border)" }}>
                    <td style={{ padding: "14px 10px", color: "var(--text-muted)" }}>{i + 1}</td>
                    <td style={{ padding: "14px 10px", fontWeight: "bold" }}>{s.username}</td>
                    <td style={{ padding: "14px 10px" }}>
                      <span style={{ background: "var(--primary-light)", color: "var(--primary)", padding: "2px 10px", borderRadius: "20px", fontSize: "12px" }}>Student</span>
                    </td>
                    <td style={{ padding: "14px 10px" }}>
                      <span style={{ background: "rgba(5,205,153,0.15)", color: "var(--accent)", padding: "2px 10px", borderRadius: "20px", fontSize: "12px" }}>Active</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* ── MONITOR TAB ── */}
      {activeTab === "Monitor" && (
        <div>
          <div className="grid" style={{ marginBottom: "24px" }}>
            <div className="card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <p style={{ margin: 0, color: "var(--text-muted)", fontWeight: "600", fontSize: "13px" }}>LIVE STUDENTS</p>
                <p style={{ margin: 0, fontSize: "38px", fontWeight: "800", color: "var(--primary)" }}>{activeUsers}</p>
              </div>
              <div className="success-anim" style={{ width: "16px", height: "16px", background: "var(--accent)", borderRadius: "50%" }} />
            </div>
            <div className="card">
              <p style={{ margin: 0, color: "var(--text-muted)", fontWeight: "600", fontSize: "13px" }}>TOTAL SUBMISSIONS</p>
              <p style={{ margin: 0, fontSize: "38px", fontWeight: "800", color: "var(--text-main)" }}>{leaderboard.length}</p>
            </div>
            <div className="card">
              <p style={{ margin: 0, color: "var(--text-muted)", fontWeight: "600", fontSize: "13px" }}>PASS RATE</p>
              <p style={{ margin: 0, fontSize: "38px", fontWeight: "800", color: "var(--accent)" }}>
                {leaderboard.length > 0 ? Math.round((leaderboard.filter(r => r.percentage >= 50).length / leaderboard.length) * 100) : 0}%
              </p>
            </div>
            <div className="card" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <p style={{ margin: 0, color: "var(--text-muted)", fontWeight: "600", fontSize: "13px" }}>EXPORT</p>
                <p style={{ margin: "4px 0 0", fontSize: "13px", color: "var(--text-muted)" }}>Download leaderboard CSV</p>
              </div>
              <button className="btn" style={{ width: "auto", padding: "10px 16px" }} onClick={exportCSV}>⬇ CSV</button>
            </div>
          </div>

          <div className="card">
            <h3 style={{ marginBottom: "20px" }}>Live Leaderboard</h3>
            {leaderboard.length === 0 ? (
              <div style={{ textAlign: "center", padding: "30px 0" }}>
                <p style={{ fontSize: "36px", margin: "0 0 10px" }}>🏆</p>
                <p style={{ color: "var(--text-muted)", margin: 0 }}>No quiz submissions yet. Leaderboard will appear here once students take the quiz.</p>
              </div>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid var(--border)" }}>
                    {["Rank", "Student", "Score", "Accuracy", "Status"].map(h => (
                      <th key={h} style={{ padding: "10px", textAlign: "left", color: "var(--text-muted)", fontSize: "13px" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((r, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid var(--border)" }}>
                      <td style={{ padding: "14px 10px" }}>{["🥇", "🥈", "🥉"][i] || `#${i + 1}`}</td>
                      <td style={{ padding: "14px 10px", fontWeight: "bold" }}>{r.username}</td>
                      <td style={{ padding: "14px 10px", color: "var(--primary)", fontWeight: "bold" }}>{r.score}/{r.totalQuestions}</td>
                      <td style={{ padding: "14px 10px" }}>{r.percentage.toFixed(1)}%</td>
                      <td style={{ padding: "14px 10px" }}>
                        <span style={{ background: r.percentage >= 50 ? "rgba(5,205,153,0.15)" : "rgba(239,68,68,0.15)", color: r.percentage >= 50 ? "var(--accent)" : "var(--danger)", padding: "3px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "bold" }}>
                          {r.percentage >= 50 ? "PASSED" : "FAILED"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* ── SETTINGS TAB ── */}
      {activeTab === "Settings" && (
        <div style={{ maxWidth: "500px" }}>
          <div className="card">
            <h3 style={{ marginBottom: "16px" }}>Exam Settings</h3>
            <div className="input-grp">
              <label>Exam Duration (seconds)</label>
              <input type="number" value={examDuration} onChange={e => setExamDuration(e.target.value)} min="30" max="600" />
            </div>
            <p style={{ color: "var(--text-muted)", fontSize: "13px", marginBottom: "16px" }}>
              Current: <strong>{examDuration}s</strong> — this sets the countdown timer for all students.
            </p>
            <button className="btn" onClick={() => { localStorage.setItem("examDuration", examDuration); alert(`Duration set to ${examDuration}s`); }}>
              Save Settings
            </button>
          </div>
          <div className="card" style={{ marginTop: "20px", background: "rgba(239,68,68,0.04)", border: "1px solid rgba(239,68,68,0.2)" }}>
            <h3 style={{ color: "var(--danger)", marginBottom: "10px", fontSize: "18px" }}>Danger Zone</h3>
            <p style={{ color: "var(--text-muted)", fontSize: "14px", marginBottom: "20px" }}>
              Logout from the admin dashboard. Students can still take the exam.
            </p>
            <button className="btn btn-danger" onClick={logout} style={{ width: "auto", padding: "10px 20px" }}>
              Logout Admin
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
