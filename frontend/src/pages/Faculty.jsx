import { useEffect, useState } from "react";
import API from "../api";

const DEPARTMENTS = ["All", "Computer Science", "Mathematics", "Physics", "Chemistry", "English"];

export default function Faculty({ user }) {
  const [faculty, setFaculty] = useState([]);
  const [search, setSearch] = useState("");
  const [dept, setDept] = useState("All");

  useEffect(() => { API.get("/users/faculty").then(r => setFaculty(r.data)).catch(() => {}); }, []);

  const filtered = faculty.filter(f =>
    (dept === "All" || f.subject?.toLowerCase().includes(dept.toLowerCase())) &&
    (f.name?.toLowerCase().includes(search.toLowerCase()) ||
     f.subject?.toLowerCase().includes(search.toLowerCase()) ||
     f.email?.toLowerCase().includes(search.toLowerCase()))
  );

  const initials = (name) => name?.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "?";
  const gradients = [
    "linear-gradient(135deg, #6366f1, #8b5cf6)",
    "linear-gradient(135deg, #2563eb, #3b82f6)",
    "linear-gradient(135deg, #059669, #34d399)",
    "linear-gradient(135deg, #dc2626, #f87171)",
    "linear-gradient(135deg, #d97706, #fbbf24)",
    "linear-gradient(135deg, #0891b2, #22d3ee)",
  ];

  return (
    <div className="page">
      <div className="section-header">
        <h2 className="section-title">👨‍🏫 Faculty Directory <span>{faculty.length} members</span></h2>
      </div>

      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--surface)", border: "1px solid var(--border2)", borderRadius: 10, padding: "8px 14px", flex: 1, minWidth: 220 }}>
          <span style={{ color: "var(--text3)" }}>🔍</span>
          <input
            placeholder="Search by name, subject, email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ border: "none", background: "transparent", outline: "none", fontSize: "0.875rem", flex: 1 }}
          />
        </div>
        <div className="tabs" style={{ marginBottom: 0 }}>
          {DEPARTMENTS.map(d => (
            <button key={d} className={`tab ${dept === d ? "active" : ""}`} onClick={() => setDept(d)}>{d}</button>
          ))}
        </div>
      </div>

      {filtered.length === 0 && <div className="card empty"><div className="empty-icon">👨‍🏫</div><p>No faculty found</p></div>}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
        {filtered.map((f, i) => (
          <div key={f._id} className="card" style={{ display: "flex", gap: 16, alignItems: "flex-start", transition: "all 0.2s" }}>
            <div style={{
              width: 54, height: 54, borderRadius: 14, flexShrink: 0,
              background: gradients[i % gradients.length],
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff", fontWeight: 800, fontSize: "1.1rem",
              boxShadow: "0 4px 14px rgba(0,0,0,0.3)",
            }}>
              {initials(f.name)}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--text)" }}>{f.name}</p>
              <p style={{ color: "var(--text3)", fontSize: "0.8rem", marginTop: 3 }}>
                {f.subject ? `📖 ${f.subject}` : "No subject assigned"}
              </p>
              <p style={{ color: "var(--text3)", fontSize: "0.78rem", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                ✉️ {f.email}
              </p>
              <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
                <span className="badge badge-purple">Faculty</span>
                <button className="btn btn-outline btn-xs" onClick={() => {}}>Message</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
