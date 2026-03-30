import { useState, useRef, useEffect } from "react";

// ──────────────────────────────────────────────
// Knowledge Base — CS Concepts + App Navigation
// ──────────────────────────────────────────────
const KB = [
  // Greetings
  { patterns: ["hi", "hello", "hey", "heyy", "good morning", "good evening"],
    response: "Hey there! 👋 I'm **EduBot**, your study assistant. I can help you with:\n• 📚 CS concepts (OOP, DSA, DBMS, OS...)\n• 🃏 Flashcard & quiz tips\n• 🏆 Leaderboard & scoring\n\nWhat would you like to know?" },

  // App Navigation
  { patterns: ["how to login", "how login", "sign in", "login"],
    response: "To login:\n1. Enter your **username** and **password**\n2. Click **Login**\n\nFirst time? Click **'Sign Up'** to create your account. Use admin credentials (`admin` / `admin123`) for the Teacher Dashboard." },
  { patterns: ["how to register", "sign up", "create account", "new account"],
    response: "To register:\n1. Click **'Don't have an account? Sign up'**\n2. Enter a username & password\n3. Click **Sign Up**\n\nYou'll be logged in as a **Student** automatically." },
  { patterns: ["flashcard", "flash card", "how to study", "study mode"],
    response: "📖 **Flashcard Mode** lets you study before the quiz!\n• Click **🃏 Study with Flashcards** on the Quiz page\n• View a question, then **flip the card** to see the answer & explanation\n• Mark cards as ✅ **I Know This** or 🔁 **Revise**\n• Your session summary shows what to focus on!" },
  { patterns: ["weak area", "weak topic", "report", "performance"],
    response: "📊 **Weak Areas Report** is available after submitting a quiz!\n• It shows per-category accuracy bars\n• Topics below 50% are flagged as **'Needs Work'**\n• Focus on those in Flashcard mode to improve!" },
  { patterns: ["score", "how scoring works", "how marks", "percentage"],
    response: "🎯 **Scoring System:**\n• **+1 point** for every correct MCQ answer\n• **0 points** for wrong/unanswered questions (no negative marks!)\n• Percentage = (Score / Total) × 100\n• You **pass** if percentage ≥ 50%" },
  { patterns: ["xp", "experience points", "badge", "level", "achievement"],
    response: "⚡ **XP & Badge System:**\n• Earn XP based on your score after every quiz\n• **Speed Bonus** = +10 XP for finishing with >30s left\n• **Perfect Bonus** = +20 XP for 100% score\n• Every 100 XP = level up!\n\n🏅 **Badges to unlock:**\n🎯 First Quiz · 🥉 Bronze · 🥈 Silver · 🥇 Gold · 💯 Perfect · ⚡ Consistent · 🚀 Speedster" },
  { patterns: ["admin", "teacher", "add question", "manage question"],
    response: "🔑 **Admin Dashboard (Teacher):**\n• Login with `admin` / `admin123`\n• **Questions tab**: Add/edit/delete questions with explanations & categories\n• **Students tab**: View all registered students\n• **Live Monitor**: Real-time stats, leaderboard & CSV export\n• **Settings**: Change exam duration" },
  { patterns: ["timer", "time", "exam time", "duration", "how long"],
    response: "⏱️ The default exam time is **60 seconds**. The Admin can change this in the **Settings tab** of the Admin Dashboard.\n\n⚠️ **Anti-cheat**: Switching tabs will trigger a warning. After **3 tab switches**, your exam auto-submits!" },

  // CS Concepts — OOP
  { patterns: ["oop", "object oriented", "object-oriented"],
    response: "🔷 **Object-Oriented Programming (OOP)**\n\nOOP is a programming paradigm based on **objects** that contain data and methods.\n\n**4 Pillars:**\n1. **Encapsulation** — wrapping data + methods in a class\n2. **Inheritance** — a class inherits from another\n3. **Polymorphism** — same interface, different behavior\n4. **Abstraction** — hiding implementation details\n\n📌 *Example: Java, Python, C++ are OOP languages.*" },
  { patterns: ["encapsulation"],
    response: "🔒 **Encapsulation**\n\nBundling data (fields) and methods together inside a class, and restricting direct access using `private` modifiers.\n\n```java\nclass Student {\n  private String name;\n  public String getName() { return name; }\n  public void setName(String n) { name = n; }\n}\n```\n\n✅ Protects internal state from direct modification." },
  { patterns: ["inheritance"],
    response: "🧬 **Inheritance**\n\nAllows a class (child) to inherit properties and methods from another class (parent).\n\n```java\nclass Animal { void speak() { ... } }\nclass Dog extends Animal { ... }\n```\n\n**Types:** Single, Multilevel, Hierarchical, Multiple (via interfaces in Java)" },
  { patterns: ["polymorphism"],
    response: "🎭 **Polymorphism**\n\nOne interface, many implementations.\n\n**Types:**\n1. **Compile-time** (Method Overloading) — same method name, different parameters\n2. **Runtime** (Method Overriding) — child class overrides parent method\n\n```java\nAnimal a = new Dog(); // runtime polymorphism\na.speak(); // calls Dog's speak()\n```" },
  { patterns: ["abstraction"],
    response: "🎯 **Abstraction**\n\nHiding implementation details, showing only essential features.\n\n```java\nabstract class Shape {\n  abstract double area(); // must implement\n}\nclass Circle extends Shape {\n  double area() { return Math.PI * r * r; }\n}\n```\n\nAlso achieved via **Interfaces**." },

  // CS Concepts — DSA
  { patterns: ["array", "what is array"],
    response: "📦 **Array**\n\nA collection of elements stored at **contiguous memory locations**, accessed by index.\n\n• **Access:** O(1) | **Search:** O(n)\n• **Insert/Delete:** O(n) (shifting required)\n\n```java\nint[] arr = {10, 20, 30};\nSystem.out.println(arr[0]); // 10\n```" },
  { patterns: ["linked list", "linkedlist"],
    response: "🔗 **Linked List**\n\nA sequence of **nodes** where each node holds data + a pointer to the next node.\n\n**Types:** Singly, Doubly, Circular\n\n| Operation | Array | Linked List |\n|-----------|-------|-------------|\n| Access    | O(1)  | O(n)        |\n| Insert    | O(n)  | O(1)        |\n| Delete    | O(n)  | O(1)        |" },
  { patterns: ["stack"],
    response: "📚 **Stack**\n\nA **LIFO** (Last In, First Out) data structure.\n\n**Operations:** push(), pop(), peek()\n\n**Uses:** Undo/Redo, Browser back, Function call stack, Expression evaluation\n\n```java\nStack<Integer> s = new Stack<>();\ns.push(1); s.push(2);\ns.pop(); // returns 2\n```" },
  { patterns: ["queue"],
    response: "📬 **Queue**\n\nA **FIFO** (First In, First Out) data structure.\n\n**Operations:** enqueue(), dequeue(), peek()\n\n**Types:** Simple, Circular, Priority Queue, Deque\n\n**Uses:** CPU scheduling, Print queue, BFS graph traversal" },
  { patterns: ["sorting", "sort algorithm", "bubble sort", "quick sort", "merge sort"],
    response: "🔢 **Sorting Algorithms**\n\n| Algorithm    | Best  | Average | Worst | Space |\n|-------------|-------|---------|-------|-------|\n| Bubble Sort | O(n)  | O(n²)   | O(n²) | O(1)  |\n| Selection   | O(n²) | O(n²)   | O(n²) | O(1)  |\n| Insertion   | O(n)  | O(n²)   | O(n²) | O(1)  |\n| Merge Sort  | O(n log n) | O(n log n) | O(n log n) | O(n) |\n| Quick Sort  | O(n log n) | O(n log n) | O(n²) | O(log n) |" },
  { patterns: ["big o", "time complexity", "space complexity"],
    response: "⏱️ **Big O Notation**\n\nDescribes the worst-case performance of an algorithm.\n\n| Notation | Name | Example |\n|----------|------|--------|\n| O(1)     | Constant | Array access |\n| O(log n) | Logarithmic | Binary Search |\n| O(n)     | Linear | Linear Search |\n| O(n log n) | Linearithmic | Merge Sort |\n| O(n²)   | Quadratic | Bubble Sort |\n| O(2ⁿ)   | Exponential | Fibonacci recursive |" },

  // CS Concepts — DBMS
  { patterns: ["dbms", "database", "rdbms", "sql"],
    response: "🗄️ **DBMS** (Database Management System)\n\n**RDBMS** stores data in tables with rows and columns.\n\n**Key concepts:**\n• **Primary Key** — unique identifier for a row\n• **Foreign Key** — links to another table's primary key\n• **Normalization** — removing data redundancy\n• **ACID** — Atomicity, Consistency, Isolation, Durability\n\n**Popular:** MySQL, PostgreSQL, Oracle, H2 (used in this project!)" },
  { patterns: ["normalization", "1nf", "2nf", "3nf"],
    response: "📐 **Normalization**\n\nProcess of organizing a database to reduce redundancy.\n\n• **1NF** — Atomic values, no repeating groups\n• **2NF** — 1NF + no partial dependency on composite key\n• **3NF** — 2NF + no transitive dependency\n• **BCNF** — Stricter version of 3NF\n\n🎯 Goal: Each piece of data stored only once." },

  // CS Concepts — OS
  { patterns: ["os", "operating system"],
    response: "💻 **Operating System (OS)**\n\nSoftware that manages hardware and provides services for programs.\n\n**Key concepts:**\n• **Process Management** — scheduling, creation, termination\n• **Memory Management** — paging, segmentation, virtual memory\n• **File Systems** — FAT, NTFS, ext4\n• **Deadlocks** — prevention, avoidance, detection\n\n**Popular OS:** Windows, Linux, macOS, Android" },
  { patterns: ["deadlock", "dead lock"],
    response: "🔒 **Deadlock**\n\nA situation where two or more processes wait forever for resources held by each other.\n\n**4 Conditions (all must hold):**\n1. Mutual Exclusion\n2. Hold and Wait\n3. No Preemption\n4. Circular Wait\n\n**Prevention:** Break any one of the 4 conditions." },
  { patterns: ["process", "thread", "multithreading", "concurrency"],
    response: "⚙️ **Process vs Thread**\n\n| Feature | Process | Thread |\n|---------|---------|--------|\n| Memory | Own memory space | Shared memory |\n| Creation | Slow | Fast |\n| Weight | Heavy | Lightweight |\n| Communication | IPC needed | Direct |\n\n**Multithreading** = multiple threads within a single process running concurrently." },

  // CS Concepts — Networking
  { patterns: ["tcp", "udp", "tcp/ip", "networking", "protocol"],
    response: "🌐 **TCP vs UDP**\n\n| Feature | TCP | UDP |\n|---------|-----|-----|\n| Connection | Connection-oriented | Connectionless |\n| Reliability | Reliable | Unreliable |\n| Speed | Slower | Faster |\n| Use Cases | HTTP, Email, FTP | Video, DNS, Gaming |\n\n**TCP = Transmission Control Protocol**\n**UDP = User Datagram Protocol**" },

  // Java Specific
  { patterns: ["java", "what is java"],
    response: "☕ **Java** is a class-based, object-oriented programming language.\n\n**Key features:**\n• Platform independent (Write Once, Run Anywhere)\n• Strongly typed\n• Garbage Collection (automatic memory management)\n• Supports multithreading\n\n**Used in this project:** Spring Boot backend is written in Java!" },
  { patterns: ["jvm", "jre", "jdk"],
    response: "☕ **Java Environment Components:**\n\n• **JDK** (Java Development Kit) — compile + run Java code\n• **JRE** (Java Runtime Environment) — run Java programs only\n• **JVM** (Java Virtual Machine) — executes bytecode, inside JRE\n\n**Flow:** `.java` → (javac) → `.class` (bytecode) → (JVM) → Output" },

  // Motivational / Emotional
  { patterns: ["i failed", "failed", "i didn't pass", "did not pass", "got low score", "low score", "bad score"],
    response: "💪 Don't worry! Failure is part of the learning journey.\n\n**Here's what to do:**\n1. Click **📋 Review My Answers** to see what went wrong\n2. Check **📊 Weak Areas Report** for your weakest topics\n3. Practice with **🃏 Flashcards** for those topics\n4. Retake the quiz!\n\n*\"Every expert was once a beginner.\"* You've got this! 🚀" },
  { patterns: ["i passed", "i got good marks", "perfect score", "100 percent", "100%", "great score"],
    response: "🎉 **Congratulations!** Amazing performance!\n\n🏆 Check your **XP and Badges** — you might have unlocked a new achievement!\n\nKeep up the great work and aim even higher next time. 💯" },
  { patterns: ["help", "what can you do", "features"],
    response: "🤖 I'm **EduBot**! Here's what I can help with:\n\n📚 **CS Concepts:** OOP, DSA, DBMS, OS, Java, Networking\n\n🛠️ **App Help:** Login, Flashcards, Scoring, XP Badges, Admin Dashboard\n\n💬 **Just ask me anything** like:\n• *\"What is polymorphism?\"*\n• *\"How does scoring work?\"*\n• *\"What is a deadlock?\"*" },
  { patterns: ["bye", "goodbye", "see you", "exit", "close"],
    response: "👋 Goodbye! Good luck with your studies! Remember: **Practice makes perfect.** 🚀\n\nI'll be here whenever you need help. 😊" },
];

const DEFAULT = "🤔 I'm not sure about that. Try asking me about:\n• **CS concepts** (OOP, arrays, sorting, DBMS...)\n• **App features** (flashcards, scoring, admin...)\n• Type **'help'** to see everything I can do!";

function getResponse(input) {
  const lower = input.toLowerCase().trim();
  for (const item of KB) {
    if (item.patterns.some(p => lower.includes(p))) return item.response;
  }
  return DEFAULT;
}

// Format markdown-ish response text
function FormatMessage({ text }) {
  const lines = text.split("\n");
  return (
    <div>
      {lines.map((line, i) => {
        // Bold **text**
        const formatted = line.replace(/\*\*(.*?)\*\*/g, (_, t) => `<strong>${t}</strong>`);
        // Code block `text`
        const withCode = formatted.replace(/`(.*?)`/g, (_, t) => `<code style="background:rgba(99,102,241,0.15);padding:1px 5px;border-radius:4px;font-size:12px">${t}</code>`);
        return <p key={i} style={{ margin: "2px 0", lineHeight: "1.6", fontSize: "14px" }} dangerouslySetInnerHTML={{ __html: withCode }} />;
      })}
    </div>
  );
}

// ──────────────────────────────────────────────
// Main Chatbot Component
// ──────────────────────────────────────────────
function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: "👋 Hi! I'm **EduBot**, your study assistant!\n\nAsk me anything about **CS concepts**, the **quiz app**, or type `help` to see all I can do." }
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [unread, setUnread] = useState(0);
  const endRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) {
      endRef.current?.scrollIntoView({ behavior: "smooth" });
      setUnread(0);
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [open, messages]);

  const send = () => {
    const text = input.trim();
    if (!text) return;
    setMessages(m => [...m, { from: "user", text }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      const reply = getResponse(text);
      setMessages(m => [...m, { from: "bot", text: reply }]);
      setTyping(false);
      if (!open) setUnread(u => u + 1);
    }, 700 + Math.random() * 500);
  };

  const handleKey = (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } };

  const QUICK = ["What is OOP?", "How does scoring work?", "What is a Stack?", "I failed, help!", "How to use flashcards?"];

  return (
    <>
      {/* Floating Bubble */}
      <button onClick={() => setOpen(!open)} style={{
        position: "fixed", bottom: "84px", right: "24px", zIndex: 10000,
        width: "56px", height: "56px", borderRadius: "50%",
        background: "linear-gradient(135deg, var(--primary), #6366f1)",
        border: "none", cursor: "pointer", fontSize: "26px",
        boxShadow: "0 6px 24px rgba(99,102,241,0.5)",
        display: "flex", alignItems: "center", justifyContent: "center",
        transition: "transform 0.2s, box-shadow 0.2s",
        transform: open ? "scale(0.9)" : "scale(1)",
      }}>
        {open ? "✕" : "🤖"}
        {!open && unread > 0 && (
          <div style={{ position: "absolute", top: "-4px", right: "-4px", width: "18px", height: "18px", background: "var(--danger)", color: "#fff", borderRadius: "50%", fontSize: "11px", fontWeight: "bold", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {unread}
          </div>
        )}
      </button>

      {/* Chat Window */}
      {open && (
        <div style={{
          position: "fixed", bottom: "152px", right: "24px", zIndex: 9999,
          width: "360px", maxHeight: "520px",
          background: "var(--card-bg)",
          borderRadius: "20px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
          border: "1px solid var(--border)",
          display: "flex", flexDirection: "column",
          animation: "slideDown 0.3s ease",
          overflow: "hidden"
        }}>
          {/* Header */}
          <div style={{ padding: "16px 18px", background: "linear-gradient(135deg, var(--primary), #6366f1)", display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "38px", height: "38px", borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>🤖</div>
            <div>
              <div style={{ fontWeight: "bold", color: "#fff", fontSize: "15px" }}>EduBot</div>
              <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.8)", display: "flex", alignItems: "center", gap: "5px" }}>
                <div className="success-anim" style={{ width: "7px", height: "7px", background: "#4ade80", borderRadius: "50%" }} /> Online · CS Study Assistant
              </div>
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: "auto", padding: "14px", display: "flex", flexDirection: "column", gap: "12px", maxHeight: "300px" }}>
            {messages.map((msg, i) => (
              <div key={i} style={{ display: "flex", justifyContent: msg.from === "user" ? "flex-end" : "flex-start" }}>
                {msg.from === "bot" && (
                  <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "linear-gradient(135deg, var(--primary), #6366f1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", flexShrink: 0, marginRight: "8px", alignSelf: "flex-end" }}>🤖</div>
                )}
                <div style={{
                  maxWidth: "80%",
                  padding: "10px 14px",
                  borderRadius: msg.from === "user" ? "18px 18px 4px 18px" : "4px 18px 18px 18px",
                  background: msg.from === "user" ? "linear-gradient(135deg, var(--primary), #6366f1)" : "rgba(43,54,116,0.06)",
                  color: msg.from === "user" ? "#fff" : "var(--text-main)",
                  border: msg.from === "bot" ? "1px solid var(--border)" : "none",
                  wordBreak: "break-word"
                }}>
                  {msg.from === "bot" ? <FormatMessage text={msg.text} /> : <p style={{ margin: 0, fontSize: "14px" }}>{msg.text}</p>}
                </div>
              </div>
            ))}

            {typing && (
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "linear-gradient(135deg, var(--primary), #6366f1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px" }}>🤖</div>
                <div style={{ padding: "10px 16px", background: "rgba(43,54,116,0.06)", border: "1px solid var(--border)", borderRadius: "4px 18px 18px 18px", display: "flex", gap: "4px" }}>
                  {[0, 1, 2].map(n => (
                    <div key={n} style={{ width: "7px", height: "7px", borderRadius: "50%", background: "var(--primary)", animation: `typingDot 1.2s ${n * 0.2}s infinite ease-in-out` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* Quick replies */}
          <div style={{ padding: "8px 14px 0", display: "flex", gap: "6px", flexWrap: "wrap" }}>
            {QUICK.map(q => (
              <button key={q} onClick={() => { setInput(q); setTimeout(send, 0); setMessages(m => [...m, { from: "user", text: q }]); setInput(""); setTyping(true); setTimeout(() => { setMessages(m => [...m, { from: "bot", text: getResponse(q) }]); setTyping(false); }, 800); }}
                style={{ padding: "4px 10px", background: "rgba(99,102,241,0.1)", color: "var(--primary)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "14px", fontSize: "12px", cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" }}>
                {q}
              </button>
            ))}
          </div>

          {/* Input */}
          <div style={{ padding: "12px 14px", display: "flex", gap: "8px", borderTop: "1px solid var(--border)", marginTop: "8px" }}>
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask me anything..."
              style={{ flex: 1, padding: "10px 14px", borderRadius: "20px", border: "1px solid var(--border)", outline: "none", fontSize: "14px", background: "rgba(43,54,116,0.04)", color: "var(--text-main)", fontFamily: "inherit" }}
            />
            <button onClick={send} style={{
              width: "40px", height: "40px", borderRadius: "50%",
              background: "linear-gradient(135deg, var(--primary), #6366f1)",
              border: "none", cursor: "pointer", fontSize: "18px",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "transform 0.2s"
            }}>➤</button>
          </div>
        </div>
      )}

      {/* Typing dot animation */}
      <style>{`
        @keyframes typingDot {
          0%, 80%, 100% { transform: scale(0.5); opacity: 0.4; }
          40% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </>
  );
}

export default Chatbot;
