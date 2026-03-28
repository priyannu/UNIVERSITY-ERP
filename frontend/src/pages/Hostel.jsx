import { useEffect, useState } from "react";
import API from "../api";

export default function Hostel({ user }) {
  const [requests, setRequests] = useState([]);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({});

  useEffect(() => { API.get("/hostel").then(r => setRequests(r.data)).catch(() => {}); }, []);

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/hostel", { ...form, studentName: user.name });
      setRequests([res.data, ...requests]);
      setModal(false); setForm({});
    } catch (err) { alert(err?.response?.data?.message || "Failed to submit"); }
  };

  const updateStatus = async (id, status) => {
    try {
      const res = await API.put(`/hostel/${id}`, { status });
      setRequests(requests.map(r => r._id === id ? res.data : r));
    } catch (err) { alert(err?.response?.data?.message || "Failed to update"); }
  };

  const statusBadge = (s) => s === "resolved" ? "badge-success" : s === "in-progress" ? "badge-info" : "badge-warning";

  return (
    <div className="page">
      <div className="section-header">
        <h2 className="section-title">🏠 Hostel Room Maintenance</h2>
        {user.role === "student" && (
          <button className="btn btn-primary btn-sm" onClick={() => setModal(true)}>+ Raise Request</button>
        )}
      </div>

      <div className="stat-grid" style={{ marginBottom: 20 }}>
        {[["Open", "open", "orange"], ["In Progress", "in-progress", "blue"], ["Resolved", "resolved", "green"]].map(([label, val, color]) => (
          <div key={val} className="stat-card">
            <div className={`stat-icon ${color}`}>
              {val === "open" ? "🔴" : val === "in-progress" ? "🔵" : "✅"}
            </div>
            <div className="stat-info">
              <p>{label}</p>
              <h3>{requests.filter(r => r.status === val).length}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Student</th><th>Room</th><th>Block</th><th>Issue Type</th><th>Description</th><th>Status</th><th>Date</th>
                {user.role !== "student" && <th>Action</th>}
              </tr>
            </thead>
            <tbody>
              {requests.length === 0 && <tr><td colSpan={8} style={{ textAlign: "center", color: "var(--text3)", padding: 32 }}>No maintenance requests</td></tr>}
              {requests.map(r => (
                <tr key={r._id}>
                  <td>{r.studentName}</td>
                  <td>{r.roomNo}</td>
                  <td>{r.block}</td>
                  <td style={{ textTransform: "capitalize" }}>{r.issueType}</td>
                  <td style={{ maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.description}</td>
                  <td><span className={`badge ${statusBadge(r.status)}`}>{r.status}</span></td>
                  <td>{new Date(r.createdAt).toLocaleDateString()}</td>
                  {user.role !== "student" && (
                    <td>
                      <select value={r.status} onChange={e => updateStatus(r._id, e.target.value)}
                        style={{ padding: "4px 8px", borderRadius: 6, border: "1px solid var(--border2)", fontSize: "0.8rem" }}>
                        <option value="open">Open</option>
                        <option value="in-progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                      </select>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <div className="modal-overlay" onClick={() => setModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Raise Maintenance Request</h3>
              <button className="modal-close" onClick={() => setModal(false)}>✕</button>
            </div>
            <form onSubmit={submit}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Room Number</label>
                  <input required placeholder="e.g. 204" onChange={e => setForm({ ...form, roomNo: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Block</label>
                  <input required placeholder="e.g. Block A" onChange={e => setForm({ ...form, block: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Issue Type</label>
                  <select required onChange={e => setForm({ ...form, issueType: e.target.value })}>
                    <option value="">Select issue</option>
                    <option value="electrical">Electrical</option>
                    <option value="plumbing">Plumbing</option>
                    <option value="furniture">Furniture</option>
                    <option value="cleaning">Cleaning</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              <div className="form-group" style={{ marginTop: 12 }}>
                <label>Description</label>
                <textarea required placeholder="Describe the issue in detail..." onChange={e => setForm({ ...form, description: e.target.value })} />
              </div>
              <button className="btn btn-primary" style={{ marginTop: 14, width: "100%", justifyContent: "center" }} type="submit">
                Submit Request
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
