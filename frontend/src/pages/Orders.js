import { useEffect, useState } from "react";
import { getOrders, createOrder, deleteOrder, getCustomers, getProducts } from "../api";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [detailModal, setDetailModal] = useState(null);
  const [customerId, setCustomerId] = useState("");
  const [items, setItems] = useState([{ product_id: "", quantity: 1 }]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const load = () =>
    Promise.all([getOrders(), getCustomers(), getProducts()]).then(([o, c, p]) => {
      setOrders(o.data);
      setCustomers(c.data);
      setProducts(p.data);
    }).finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const addItem = () => setItems([...items, { product_id: "", quantity: 1 }]);
  const removeItem = (i) => setItems(items.filter((_, idx) => idx !== i));
  const updateItem = (i, field, val) => {
    const updated = [...items];
    updated[i] = { ...updated[i], [field]: val };
    setItems(updated);
  };

  const handleSubmit = async () => {
    setError("");
    if (!customerId) { setError("Select a customer."); return; }
    if (items.some((it) => !it.product_id || it.quantity < 1)) {
      setError("Fill all product rows properly.");
      return;
    }
    try {
      await createOrder({
        customer_id: parseInt(customerId),
        items: items.map((it) => ({ product_id: parseInt(it.product_id), quantity: parseInt(it.quantity) })),
      });
      setSuccess("Order created.");
      setModal(false);
      setCustomerId("");
      setItems([{ product_id: "", quantity: 1 }]);
      load();
    } catch (e) {
      setError(e.response?.data?.detail || "Something went wrong.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Cancel this order? Stock will be restored.")) return;
    try {
      await deleteOrder(id);
      setSuccess("Order cancelled.");
      load();
    } catch {
      alert("Could not cancel order.");
    }
  };

  if (loading) return <div className="loading">Loading orders…</div>;

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">Orders</h2>
        <button className="btn btn-primary" onClick={() => { setError(""); setModal(true); }}>
          + New Order
        </button>
      </div>

      {success && <div className="alert alert-success">{success}</div>}

      <div className="card">
        {orders.length === 0 ? (
          <div className="empty"><div className="empty-icon">🧾</div><p>No orders yet.</p></div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Order #</th><th>Customer</th><th>Items</th><th>Total</th><th>Date</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id}>
                    <td><span className="badge badge-purple">#{o.id}</span></td>
                    <td style={{ fontWeight: 500 }}>{o.customer.full_name}</td>
                    <td style={{ color: "var(--text-muted)" }}>{o.items.length} item(s)</td>
                    <td style={{ fontWeight: 600 }}>₹{o.total_amount.toFixed(2)}</td>
                    <td style={{ color: "var(--text-muted)", fontSize: 13 }}>
                      {new Date(o.created_at).toLocaleDateString()}
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button className="btn btn-ghost btn-sm" onClick={() => setDetailModal(o)}>View</button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(o.id)}>Cancel</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Order Modal */}
      {modal && (
        <div className="modal-overlay" onClick={() => setModal(false)}>
          <div className="modal" style={{ maxWidth: 540 }} onClick={(e) => e.stopPropagation()}>
            <h2>New Order</h2>
            {error && <div className="alert alert-error">{error}</div>}

            <div className="form-group">
              <label>Customer</label>
              <select value={customerId} onChange={(e) => setCustomerId(e.target.value)}>
                <option value="">— Select customer —</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>{c.full_name} ({c.email})</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Products</label>
              <div className="order-items-builder">
                {items.map((item, i) => (
                  <div className="order-item-row" key={i}>
                    <select value={item.product_id} onChange={(e) => updateItem(i, "product_id", e.target.value)}>
                      <option value="">— Select product —</option>
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>{p.name} (₹{p.price} | stock: {p.quantity})</option>
                      ))}
                    </select>
                    <input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) => updateItem(i, "quantity", e.target.value)}
                    />
                    <button className="btn-icon" onClick={() => removeItem(i)} disabled={items.length === 1}>×</button>
                  </div>
                ))}
                <button className="btn btn-ghost btn-sm" style={{ alignSelf: "flex-start" }} onClick={addItem}>
                  + Add item
                </button>
              </div>
            </div>

            <div className="form-actions">
              <button className="btn btn-ghost" onClick={() => setModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSubmit}>Place Order</button>
            </div>
          </div>
        </div>
      )}

      {/* Order Detail Modal */}
      {detailModal && (
        <div className="modal-overlay" onClick={() => setDetailModal(null)}>
          <div className="modal" style={{ maxWidth: 500 }} onClick={(e) => e.stopPropagation()}>
            <h2>Order #{detailModal.id}</h2>
            <div style={{ marginBottom: 16 }}>
              <p style={{ color: "var(--text-muted)", fontSize: 13 }}>Customer</p>
              <p style={{ fontWeight: 500 }}>{detailModal.customer.full_name}</p>
              <p style={{ fontSize: 13, color: "var(--text-muted)" }}>{detailModal.customer.email}</p>
            </div>
            <div style={{ marginBottom: 16 }}>
              <p style={{ color: "var(--text-muted)", fontSize: 13, marginBottom: 8 }}>Items</p>
              {detailModal.items.map((item) => (
                <div key={item.id} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--border)", fontSize: 14 }}>
                  <span>{item.product.name} × {item.quantity}</span>
                  <span style={{ fontWeight: 500 }}>₹{(item.unit_price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: 16, padding: "12px 0" }}>
              <span>Total</span>
              <span style={{ color: "var(--accent3)" }}>₹{detailModal.total_amount.toFixed(2)}</span>
            </div>
            <div className="form-actions">
              <button className="btn btn-primary" onClick={() => setDetailModal(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
