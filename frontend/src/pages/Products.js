import { useEffect, useState } from "react";
import { getProducts, createProduct, updateProduct, deleteProduct } from "../api";

const empty = { name: "", sku: "", price: "", quantity: "" };

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const load = () => getProducts().then((r) => setProducts(r.data)).finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const openAdd = () => { setForm(empty); setEditing(null); setError(""); setModal(true); };
  const openEdit = (p) => {
    setForm({ name: p.name, sku: p.sku, price: p.price, quantity: p.quantity });
    setEditing(p.id);
    setError("");
    setModal(true);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    setError("");
    if (!form.name || !form.sku || form.price === "" || form.quantity === "") {
      setError("All fields are required.");
      return;
    }
    const payload = { ...form, price: parseFloat(form.price), quantity: parseInt(form.quantity) };
    try {
      if (editing) {
        await updateProduct(editing, payload);
        setSuccess("Product updated.");
      } else {
        await createProduct(payload);
        setSuccess("Product created.");
      }
      setModal(false);
      load();
    } catch (e) {
      setError(e.response?.data?.detail || "Something went wrong.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await deleteProduct(id);
      setSuccess("Product deleted.");
      load();
    } catch (e) {
      setSuccess("");
      alert(e.response?.data?.detail || "Could not delete.");
    }
  };

  if (loading) return <div className="loading">Loading products…</div>;

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">Products</h2>
        <button className="btn btn-primary" onClick={openAdd}>+ Add Product</button>
      </div>

      {success && <div className="alert alert-success">{success}</div>}

      <div className="card">
        {products.length === 0 ? (
          <div className="empty"><div className="empty-icon">📦</div><p>No products yet. Add your first one.</p></div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Name</th><th>SKU</th><th>Price</th><th>Stock</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id}>
                    <td style={{ fontWeight: 500 }}>{p.name}</td>
                    <td><span className="badge badge-purple">{p.sku}</span></td>
                    <td>₹{p.price.toFixed(2)}</td>
                    <td>
                      <span className={`badge ${p.quantity > 10 ? "badge-green" : p.quantity > 0 ? "badge-orange" : "badge-red"}`}>
                        {p.quantity}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button className="btn btn-ghost btn-sm" onClick={() => openEdit(p)}>Edit</button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p.id)}>Delete</button>
                      </div>
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
            <h2>{editing ? "Edit Product" : "Add Product"}</h2>
            {error && <div className="alert alert-error">{error}</div>}
            {["name", "sku", "price", "quantity"].map((field) => (
              <div className="form-group" key={field}>
                <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                <input
                  name={field}
                  type={field === "price" || field === "quantity" ? "number" : "text"}
                  value={form[field]}
                  onChange={handleChange}
                  placeholder={field === "price" ? "0.00" : field === "quantity" ? "0" : ""}
                  min={0}
                />
              </div>
            ))}
            <div className="form-actions">
              <button className="btn btn-ghost" onClick={() => setModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSubmit}>
                {editing ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
