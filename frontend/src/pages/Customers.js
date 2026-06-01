import { useEffect, useState } from "react";
import { getCustomers, createCustomer, deleteCustomer } from "../api";

const empty = { full_name: "", email: "", phone: "" };

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(empty);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const load = () => getCustomers().then((r) => setCustomers(r.data)).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    setError("");
    if (!form.full_name || !form.email || !form.phone) {
      setError("All fields are required.");
      return;
    }
    try {
      await createCustomer(form);
      setSuccess("Customer added.");
      setModal(false);
      setForm(empty);
      load();
    } catch (e) {
      setError(e.response?.data?.detail || "Something went wrong.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this customer?")) return;
    try {
      await deleteCustomer(id);
      setSuccess("Customer deleted.");
      load();
    } catch {
      alert("Could not delete customer.");
    }
  };

  if (loading) return <div className="loading">Loading customers…</div>;

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">Customers</h2>
        <button className="btn btn-primary" onClick={() => { setForm(empty); setError(""); setModal(true); }}>
          + Add Customer
        </button>
      </div>

      {success && <div className="alert alert-success">{success}</div>}

      <div className="card">
        {customers.length === 0 ? (
          <div className="empty"><div className="empty-icon">👤</div><p>No customers yet.</p></div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Name</th><th>Email</th><th>Phone</th><th>Joined</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {customers.map((c) => (
                  <tr key={c.id}>
                    <td style={{ fontWeight: 500 }}>{c.full_name}</td>
                    <td style={{ color: "var(--text-muted)" }}>{c.email}</td>
                    <td>{c.phone}</td>
                    <td style={{ color: "var(--text-muted)", fontSize: 13 }}>
                      {new Date(c.created_at).toLocaleDateString()}
                    </td>
                    <td>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(c.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modal && (
        <div className="modal-overlay" onClick={() => setModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Add Customer</h2>
            {error && <div className="alert alert-error">{error}</div>}
            {[
              { name: "full_name", label: "Full Name" },
              { name: "email", label: "Email" },
              { name: "phone", label: "Phone" },
            ].map((f) => (
              <div className="form-group" key={f.name}>
                <label>{f.label}</label>
                <input
                  name={f.name}
                  type={f.name === "email" ? "email" : "text"}
                  value={form[f.name]}
                  onChange={handleChange}
                />
              </div>
            ))}
            <div className="form-actions">
              <button className="btn btn-ghost" onClick={() => setModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSubmit}>Create</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
