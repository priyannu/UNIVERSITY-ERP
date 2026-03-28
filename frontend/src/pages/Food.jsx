import { useEffect, useState } from "react";
import API from "../api";

const MENU = [
  { name: "Idli Sambar", price: 30, category: "breakfast" },
  { name: "Poha", price: 25, category: "breakfast" },
  { name: "Masala Dosa", price: 45, category: "breakfast" },
  { name: "Dal Rice", price: 60, category: "lunch" },
  { name: "Rajma Chawal", price: 70, category: "lunch" },
  { name: "Veg Thali", price: 90, category: "lunch" },
  { name: "Roti Sabzi", price: 55, category: "dinner" },
  { name: "Paneer Curry", price: 80, category: "dinner" },
  { name: "Samosa", price: 15, category: "snack" },
  { name: "Tea", price: 10, category: "snack" },
  { name: "Cold Coffee", price: 35, category: "snack" },
];

export default function Food({ user }) {
  const [orders, setOrders] = useState([]);
  const [cart, setCart] = useState({});
  const [mealType, setMealType] = useState("lunch");
  const [tab, setTab] = useState("order");

  useEffect(() => { API.get("/food").then(r => setOrders(r.data)).catch(() => {}); }, []);

  const addToCart = (item) => setCart(c => ({ ...c, [item.name]: { ...item, qty: (c[item.name]?.qty || 0) + 1 } }));
  const removeFromCart = (name) => {
    const updated = { ...cart };
    if (updated[name]?.qty > 1) updated[name].qty--;
    else delete updated[name];
    setCart(updated);
  };

  const cartItems = Object.values(cart).filter(i => i.qty > 0);
  const total = cartItems.reduce((s, i) => s + i.price * i.qty, 0);

  const placeOrder = async () => {
    if (!cartItems.length) return alert("Cart is empty");
    try {
      const res = await API.post("/food", {
        items: cartItems.map(i => ({ name: i.name, price: i.price, qty: i.qty })),
        totalAmount: total, mealType, studentName: user.name,
      });
      setOrders([res.data, ...orders]);
      setCart({}); setTab("orders");
      alert("Order placed successfully!");
    } catch (err) { alert(err?.response?.data?.message || "Failed to place order"); }
  };

  const filteredMenu = MENU.filter(m => m.category === mealType);
  const statusBadge = (s) => s === "delivered" ? "badge-success" : s === "ready" ? "badge-info" : "badge-warning";

  return (
    <div className="page">
      <div className="section-header">
        <h2 className="section-title">🍽️ Canteen & Food</h2>
        <div className="tabs" style={{ margin: 0 }}>
          <button className={`tab ${tab === "order" ? "active" : ""}`} onClick={() => setTab("order")}>Order Food</button>
          <button className={`tab ${tab === "orders" ? "active" : ""}`} onClick={() => setTab("orders")}>My Orders</button>
          {user.role !== "student" && (
            <button className={`tab ${tab === "manage" ? "active" : ""}`} onClick={() => setTab("manage")}>Manage</button>
          )}
        </div>
      </div>

      {tab === "order" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 20 }}>
          <div>
            <div className="tabs">
              {["breakfast", "lunch", "dinner", "snack"].map(m => (
                <button key={m} className={`tab ${mealType === m ? "active" : ""}`}
                  onClick={() => setMealType(m)} style={{ textTransform: "capitalize" }}>{m}</button>
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12 }}>
              {filteredMenu.map(item => (
                <div key={item.name} className="card" style={{ textAlign: "center", padding: 16 }}>
                  <div style={{ fontSize: "2rem", marginBottom: 8 }}>
                    {item.category === "breakfast" ? "🌅" : item.category === "lunch" ? "🍱" : item.category === "dinner" ? "🌙" : "☕"}
                  </div>
                  <p style={{ fontWeight: 600, fontSize: "0.875rem" }}>{item.name}</p>
                  <p style={{ color: "var(--text3)", fontSize: "0.8rem", margin: "4px 0 10px" }}>₹{item.price}</p>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                    <button className="btn btn-outline btn-sm" onClick={() => removeFromCart(item.name)}>−</button>
                    <span style={{ fontWeight: 600, minWidth: 20, textAlign: "center" }}>{cart[item.name]?.qty || 0}</span>
                    <button className="btn btn-primary btn-sm" onClick={() => addToCart(item)}>+</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card" style={{ height: "fit-content", position: "sticky", top: 80 }}>
            <h3 style={{ marginBottom: 16, fontSize: "0.95rem" }}>🛒 Cart</h3>
            {cartItems.length === 0 ? (
              <p style={{ color: "var(--text3)", fontSize: "0.875rem", textAlign: "center", padding: "20px 0" }}>Cart is empty</p>
            ) : (
              <>
                {cartItems.map(i => (
                  <div key={i.name} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: "0.875rem" }}>
                    <span>{i.name} × {i.qty}</span>
                    <span style={{ fontWeight: 600 }}>₹{i.price * i.qty}</span>
                  </div>
                ))}
                <div style={{ borderTop: "1px solid #e5e7eb", marginTop: 12, paddingTop: 12, display: "flex", justifyContent: "space-between", fontWeight: 700 }}>
                  <span>Total</span><span>₹{total}</span>
                </div>
                <button className="btn btn-success" style={{ width: "100%", justifyContent: "center", marginTop: 14 }} onClick={placeOrder}>
                  Place Order
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {(tab === "orders" || tab === "manage") && (
        <div className="card">
          <div className="table-wrap">
            <table>
              <thead><tr><th>Student</th><th>Items</th><th>Meal</th><th>Total</th><th>Status</th><th>Date</th>
                {tab === "manage" && <th>Update</th>}
              </tr></thead>
              <tbody>
                {orders.length === 0 && <tr><td colSpan={7} style={{ textAlign: "center", color: "var(--text3)", padding: 32 }}>No orders</td></tr>}
                {orders.map(o => (
                  <tr key={o._id}>
                    <td>{o.studentName}</td>
                    <td>{o.items?.map(i => `${i.name}×${i.qty}`).join(", ")}</td>
                    <td style={{ textTransform: "capitalize" }}>{o.mealType}</td>
                    <td style={{ fontWeight: 600 }}>₹{o.totalAmount}</td>
                    <td><span className={`badge ${statusBadge(o.status)}`}>{o.status}</span></td>
                    <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                    {tab === "manage" && (
                      <td>
                        <select value={o.status} onChange={async e => {
                          const res = await API.put(`/food/${o._id}`, { status: e.target.value });
                          setOrders(orders.map(x => x._id === o._id ? res.data : x));
                        }} style={{ padding: "4px 8px", borderRadius: 6, border: "1px solid var(--border2)", fontSize: "0.8rem" }}>
                          <option value="ordered">Ordered</option>
                          <option value="ready">Ready</option>
                          <option value="delivered">Delivered</option>
                        </select>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
