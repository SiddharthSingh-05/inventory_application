import { useEffect, useState } from "react";
import { getDashboard } from "../api";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getDashboard()
      .then((r) => setStats(r.data))
      .catch(() => setError("Could not load dashboard data."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading">Loading dashboard…</div>;
  if (error) return <div className="alert alert-error">{error}</div>;

  const statCards = [
    { label: "Products", value: stats.total_products, icon: "📦", color: "purple" },
    { label: "Customers", value: stats.total_customers, icon: "👤", color: "red" },
    { label: "Orders", value: stats.total_orders, icon: "🧾", color: "green" },
    { label: "Low Stock", value: stats.low_stock_products.length, icon: "⚠️", color: "orange" },
  ];

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">Dashboard</h2>
      </div>

      <div className="stats-grid">
        {statCards.map((s) => (
          <div key={s.label} className={`stat-card ${s.color}`}>
            <div className="stat-icon">{s.icon}</div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <h3 style={{ marginBottom: 16, fontSize: 16, fontWeight: 700 }}>
          ⚠️ Low Stock Products
          <span style={{ marginLeft: 8, fontSize: 12, color: "var(--text-muted)", fontWeight: 400 }}>
            (≤ 10 units)
          </span>
        </h3>
        {stats.low_stock_products.length === 0 ? (
          <p style={{ color: "var(--text-muted)", fontSize: 14 }}>All products are well stocked ✅</p>
        ) : (
          <div className="low-stock-list">
            {stats.low_stock_products.map((p) => (
              <div key={p.id} className="low-stock-item">
                <span className="low-stock-name">{p.name}</span>
                <span style={{ color: "var(--text-muted)", fontSize: 12 }}>SKU: {p.sku}</span>
                <span className="low-stock-qty">{p.quantity} left</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
