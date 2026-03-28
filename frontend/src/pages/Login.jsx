import { useState } from "react";
import axios from "axios";

export default function Login({ setPage }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);

  const login = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setPage("dashboard");
    } catch (err) {
      setError(err?.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-bg">
        <div className="login-orb" style={{ width: 500, height: 500, background: "#6366f1", top: -200, left: -100 }} />
        <div className="login-orb" style={{ width: 400, height: 400, background: "#8b5cf6", bottom: -150, right: -100 }} />
        <div className="login-orb" style={{ width: 300, height: 300, background: "#f59e0b", bottom: 100, left: "40%" }} />
      </div>

      {/* Grid pattern */}
      <div style={{
        position: "absolute", inset: 0, opacity: 0.03,
        backgroundImage: "linear-gradient(rgba(99,102,241,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.5) 1px, transparent 1px)",
        backgroundSize: "40px 40px",
        pointerEvents: "none"
      }} />

      <div className="login-card">
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{
            width: 64, height: 64,
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            borderRadius: 18,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "1.8rem", margin: "0 auto 20px",
            boxShadow: "0 8px 32px rgba(99,102,241,0.4)"
          }}>🎓</div>
          <h1 style={{ fontSize: "1.6rem", fontWeight: 800, color: "var(--text)", letterSpacing: "-0.5px" }}>
            Campus ERP
          </h1>
          <p style={{ color: "var(--text3)", fontSize: "0.875rem", marginTop: 6 }}>
            Your centralized academic portal
          </p>
        </div>

        <form onSubmit={login}>
          <div className="form-group" style={{ marginBottom: 14 }}>
            <label>Email Address</label>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: "0.9rem" }}>📧</span>
              <input
                type="email"
                placeholder="you@college.edu"
                required
                style={{ paddingLeft: 36 }}
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 24 }}>
            <label>Password</label>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: "0.9rem" }}>🔒</span>
              <input
                type={showPass ? "text" : "password"}
                placeholder="••••••••"
                required
                style={{ paddingLeft: 36, paddingRight: 40 }}
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
              />
              <button type="button" onClick={() => setShowPass(!showPass)}
                style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--text3)", fontSize: "0.85rem" }}>
                {showPass ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {error && (
            <div style={{
              background: "rgba(239,68,68,0.1)", color: "#f87171",
              border: "1px solid rgba(239,68,68,0.2)",
              padding: "10px 14px", borderRadius: 10, fontSize: "0.875rem", marginBottom: 16
            }}>
              ⚠️ {error}
            </div>
          )}

          <button className="btn btn-primary"
            style={{ width: "100%", justifyContent: "center", padding: "12px", fontSize: "0.95rem" }}
            type="submit" disabled={loading}>
            {loading ? (
              <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ animation: "pulse 1s infinite" }}>⏳</span> Signing in...
              </span>
            ) : "Sign In →"}
          </button>
        </form>

        <div style={{ marginTop: 28, padding: "16px", background: "var(--bg2)", borderRadius: 12, border: "1px solid var(--border)" }}>
          <p style={{ fontSize: "0.72rem", color: "var(--text3)", marginBottom: 8, fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px" }}>Demo Accounts</p>
          {[
            { role: "Student", email: "student@college.edu", password: "student123", icon: "S" },
            { role: "Teacher", email: "teacher@college.edu", password: "teacher123", icon: "T" },
            { role: "Admin", email: "admin@college.edu", password: "admin123", icon: "A" },
          ].map(d => (
            <div key={d.role}
              onClick={() => setForm({ email: d.email, password: d.password })}
              style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 8px", borderRadius: 8, cursor: "pointer", transition: "background 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.background = "var(--surface)"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
              <span>{d.icon}</span>
              <span style={{ fontSize: "0.78rem", color: "var(--text3)" }}>{d.role}:</span>
              <span style={{ fontSize: "0.78rem", color: "var(--primary-light)", fontFamily: "JetBrains Mono, monospace" }}>{d.email}</span>
            </div>
          ))}
        </div>

        <p style={{ textAlign: "center", marginTop: 20, fontSize: "0.72rem", color: "var(--text3)" }}>
          Campus ERP System • Secure Portal
        </p>
      </div>
    </div>
  );
}
