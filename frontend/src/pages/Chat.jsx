import { useState, useEffect, useRef } from "react";
import API from "../api";

const DEMO_USERS = [
  { id: "u1", name: "Dr. Priya Sharma", role: "teacher", subject: "Mathematics", avatar: "PS", online: true },
  { id: "u2", name: "Prof. Rahul Verma", role: "teacher", subject: "Computer Science", avatar: "RV", online: true },
  { id: "u3", name: "Anjali Nair", role: "student", avatar: "AN", online: false },
  { id: "u4", name: "Vikram Singh", role: "student", avatar: "VS", online: true },
  { id: "u5", name: "Admin Office", role: "admin", avatar: "AO", online: true },
];

const DEMO_MESSAGES = {
  u1: [
    { id: 1, from: "u1", text: "Hello! Please check the assignment I posted for Chapter 5.", time: "10:30 AM", own: false },
    { id: 2, from: "me", text: "Yes sir, I saw it. I have a doubt on question 3.", time: "10:32 AM", own: true },
    { id: 3, from: "u1", text: "Sure! The key is to apply the chain rule. Would you like a hint?", time: "10:33 AM", own: false },
    { id: 4, from: "me", text: "Yes please, that would be helpful!", time: "10:34 AM", own: true },
    { id: 5, from: "u1", text: "Try differentiating the outer function first, then multiply by the derivative of the inner function.", time: "10:35 AM", own: false },
  ],
  u2: [
    { id: 1, from: "u2", text: "Lab session tomorrow is moved to Block C, Room 301.", time: "9:00 AM", own: false },
    { id: 2, from: "me", text: "Thank you for the update!", time: "9:05 AM", own: true },
  ],
  u4: [
    { id: 1, from: "u4", text: "Did you get the notes from yesterday's lecture?", time: "Yesterday", own: false },
    { id: 2, from: "me", text: "Yes, I'll share them on the group.", time: "Yesterday", own: true },
  ],
};

const QUICK_REPLIES = [
  "Thank you!",
  "I understand",
  "Can you explain more?",
  "Got it, will do.",
  "When is the deadline?",
];

export default function Chat({ user }) {
  const [selectedUser, setSelectedUser] = useState(DEMO_USERS[0]);
  const [messages, setMessages] = useState(DEMO_MESSAGES[DEMO_USERS[0].id] || []);
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    setMessages(DEMO_MESSAGES[selectedUser.id] || []);
  }, [selectedUser]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (text) => {
    if (!text.trim()) return;
    const msg = {
      id: Date.now(),
      from: "me",
      text: text.trim(),
      time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
      own: true,
    };
    setMessages(prev => [...prev, msg]);
    setInput("");

    // Simulate reply
    setTimeout(() => {
      const replies = [
        "Understood! Let me know if you need anything else.",
        "Great! I'll get back to you shortly.",
        "Sure, I'll check and respond.",
        "Thanks for reaching out!",
      ];
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        from: selectedUser.id,
        text: replies[Math.floor(Math.random() * replies.length)],
        time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
        own: false,
      }]);
    }, 1200);
  };

  const filtered = DEMO_USERS.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    (u.subject || "").toLowerCase().includes(search.toLowerCase())
  );

  const initials = (n) => n.split(" ").map(x => x[0]).join("").toUpperCase().slice(0, 2);
  const roleColor = (r) => r === "teacher" ? "#60a5fa" : r === "admin" ? "#f87171" : "#34d399";

  return (
    <div className="page">
      <div className="section-header">
        <h2 className="section-title">💬 Messages</h2>
        <span className="badge badge-success">● {DEMO_USERS.filter(u => u.online).length} Online</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 16, height: "calc(100vh - 200px)", maxHeight: 680 }}>
        {/* Sidebar */}
        <div className="card" style={{ display: "flex", flexDirection: "column", padding: 0, overflow: "hidden" }}>
          <div style={{ padding: 14, borderBottom: "1px solid var(--border)" }}>
            <input
              placeholder="🔍 Search conversations..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width: "100%", padding: "8px 12px", background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 10, fontSize: "0.8rem" }}
            />
          </div>
          <div style={{ flex: 1, overflowY: "auto" }}>
            {filtered.map(u => {
              const lastMsg = DEMO_MESSAGES[u.id]?.slice(-1)[0];
              const isSelected = selectedUser.id === u.id;
              return (
                <div key={u.id}
                  onClick={() => setSelectedUser(u)}
                  style={{
                    display: "flex", gap: 12, padding: "14px 16px",
                    cursor: "pointer",
                    background: isSelected ? "var(--surface2)" : "transparent",
                    borderLeft: isSelected ? "3px solid var(--primary)" : "3px solid transparent",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = "var(--surface)"; }}
                  onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = "transparent"; }}
                >
                  <div style={{ position: "relative" }}>
                    <div style={{
                      width: 42, height: 42, borderRadius: 12,
                      background: "linear-gradient(135deg, var(--primary), #8b5cf6)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "0.85rem", fontWeight: 700, color: "#fff", flexShrink: 0,
                    }}>{initials(u.name)}</div>
                    {u.online && (
                      <div style={{
                        position: "absolute", bottom: 2, right: 2,
                        width: 10, height: 10, borderRadius: "50%",
                        background: "#34d399", border: "2px solid var(--surface)",
                      }} />
                    )}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <p style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--text)" }}>{u.name}</p>
                      <span style={{ fontSize: "0.65rem", color: "var(--text3)" }}>{lastMsg?.time || ""}</span>
                    </div>
                    <p style={{ fontSize: "0.72rem", color: "var(--text3)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginTop: 2 }}>
                      {lastMsg ? (lastMsg.own ? "You: " : "") + lastMsg.text : "No messages yet"}
                    </p>
                    <span style={{ fontSize: "0.65rem", fontWeight: 600, color: roleColor(u.role), textTransform: "capitalize" }}>{u.role}{u.subject ? ` · ${u.subject}` : ""}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chat area */}
        <div className="card" style={{ display: "flex", flexDirection: "column", padding: 0, overflow: "hidden" }}>
          {/* Header */}
          <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 12, background: "var(--bg2)" }}>
            <div style={{ position: "relative" }}>
              <div style={{
                width: 40, height: 40, borderRadius: 12,
                background: "linear-gradient(135deg, var(--primary), #8b5cf6)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "0.85rem", fontWeight: 700, color: "#fff",
              }}>{initials(selectedUser.name)}</div>
              {selectedUser.online && (
                <div style={{ position: "absolute", bottom: 2, right: 2, width: 10, height: 10, borderRadius: "50%", background: "#34d399", border: "2px solid var(--bg2)" }} />
              )}
            </div>
            <div>
              <p style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--text)" }}>{selectedUser.name}</p>
              <p style={{ fontSize: "0.72rem", color: selectedUser.online ? "#34d399" : "var(--text3)" }}>
                {selectedUser.online ? "● Online" : "● Offline"}
                {selectedUser.subject ? ` · ${selectedUser.subject}` : ""}
              </p>
            </div>
            <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
              <div className="icon-btn" title="Video call">📹</div>
              <div className="icon-btn" title="Call">📞</div>
            </div>
          </div>

          {/* Messages */}
          <div className="chat-messages" style={{ flex: 1, overflowY: "auto", padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>
            {messages.map(msg => (
              <div key={msg.id} className={`message ${msg.own ? "own" : "other"}`}
                style={{ display: "flex", gap: 10, flexDirection: msg.own ? "row-reverse" : "row", alignItems: "flex-end" }}>
                {!msg.own && (
                  <div style={{ width: 30, height: 30, borderRadius: 8, background: "var(--surface3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem", fontWeight: 700, color: "var(--text2)", flexShrink: 0 }}>
                    {initials(selectedUser.name)}
                  </div>
                )}
                <div style={{ maxWidth: "70%" }}>
                  <div className={`message-bubble ${msg.own ? "own" : "other"}`}
                    style={{
                      padding: "10px 14px",
                      borderRadius: msg.own ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                      background: msg.own ? "linear-gradient(135deg, var(--primary), #8b5cf6)" : "var(--surface2)",
                      color: msg.own ? "#fff" : "var(--text2)",
                      fontSize: "0.875rem",
                      lineHeight: 1.5,
                      boxShadow: msg.own ? "0 4px 14px rgba(99,102,241,0.3)" : "none",
                    }}>
                    {msg.text}
                  </div>
                  <p style={{ fontSize: "0.65rem", color: "var(--text3)", marginTop: 4, textAlign: msg.own ? "right" : "left" }}>{msg.time}</p>
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Quick Replies */}
          <div style={{ padding: "8px 16px", borderTop: "1px solid var(--border)", display: "flex", gap: 6, flexWrap: "wrap" }}>
            {QUICK_REPLIES.map(r => (
              <button key={r} onClick={() => sendMessage(r)}
                style={{ padding: "4px 10px", background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: 999, fontSize: "0.72rem", color: "var(--text3)", cursor: "pointer", transition: "all 0.2s", fontFamily: "inherit" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--primary)"; e.currentTarget.style.color = "var(--primary-light)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text3)"; }}>
                {r}
              </button>
            ))}
          </div>

          {/* Input */}
          <div style={{ padding: "12px 16px", borderTop: "1px solid var(--border)", display: "flex", gap: 10, alignItems: "center" }}>
            <div className="icon-btn">📎</div>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendMessage(input)}
              placeholder={`Message ${selectedUser.name}...`}
              style={{ flex: 1, padding: "10px 14px", background: "var(--bg2)", border: "1px solid var(--border2)", borderRadius: 12, fontSize: "0.875rem" }}
            />
            <button
              onClick={() => sendMessage(input)}
              className="btn btn-primary btn-sm"
              style={{ padding: "10px 16px" }}>
              Send ↑
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
