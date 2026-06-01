import { NavLink } from "react-router-dom";

const links = [
  { to: "/", icon: "⬡", label: "Dashboard" },
  { to: "/products", icon: "📦", label: "Products" },
  { to: "/customers", icon: "👤", label: "Customers" },
  { to: "/orders", icon: "🧾", label: "Orders" },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h1>Stock<span>Flow</span></h1>
        <p>Inventory System</p>
      </div>
      <nav className="sidebar-nav">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.to === "/"}
            className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
          >
            <span className="nav-icon">{l.icon}</span>
            <span>{l.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
