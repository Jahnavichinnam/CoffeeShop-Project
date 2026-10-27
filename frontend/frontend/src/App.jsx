import { useCallback, useEffect, useMemo, useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/coffeeshop";

const emptyForm = {
  shopName: "",
  location: "",
  averagePrice: "",
  open: "true",
};

export default function App() {
  const [shops, setShops] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [search, setSearch] = useState("");

  const loadShops = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_BASE}/displayall`);
      if (!response.ok) throw new Error(`Could not load coffee shops (HTTP ${response.status}).`);
      const data = await response.json();
      setShops(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(`${err.message} Make sure the Spring Boot backend is running and the API URL is correct.`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadShops();
  }, [loadShops]);

  const filteredShops = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return shops;
    return shops.filter((shop) =>
      [shop.shopName, shop.location].some((value) => String(value ?? "").toLowerCase().includes(term))
    );
  }, [shops, search]);

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");
    const payload = {
      shopName: form.shopName.trim(),
      location: form.location.trim(),
      averagePrice: Number(form.averagePrice),
      open: form.open === "true",
    };

    try {
      const url = editingId === null
        ? `${API_BASE}/add`
        : `${API_BASE}/update/${editingId}`;
      const response = await fetch(url, {
        method: editingId === null ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        let message = `Request failed (HTTP ${response.status}).`;
        try {
          const body = await response.json();
          message = body.message || Object.values(body).join(" ") || message;
        } catch {
          // Keep the HTTP status message if the response isn't JSON.
        }
        throw new Error(message);
      }
      setNotice(editingId === null ? "Coffee shop added successfully." : "Coffee shop updated successfully.");
      resetForm();
      await loadShops();
    } catch (err) {
      setError(`${err.message} Check that the backend is running at ${API_BASE}.`);
    } finally {
      setSaving(false);
    }
  }

  function beginEdit(shop) {
    setEditingId(shop.id);
    setForm({
      shopName: shop.shopName ?? "",
      location: shop.location ?? "",
      averagePrice: String(shop.averagePrice ?? ""),
      open: String(Boolean(shop.open)),
    });
    setError("");
    setNotice("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function deleteShop(shop) {
    if (!window.confirm(`Delete "${shop.shopName}"?`)) return;
    setError("");
    setNotice("");
    try {
      const response = await fetch(`${API_BASE}/delete/${shop.id}`, { method: "DELETE" });
      if (!response.ok) throw new Error(`Delete failed (HTTP ${response.status}).`);
      setNotice(`${shop.shopName} was deleted.`);
      await loadShops();
    } catch (err) {
      setError(`${err.message} Check that the backend is running at ${API_BASE}.`);
    }
  }

  const openCount = shops.filter((shop) => shop.open).length;

  return (
    <div className="app-shell">
      <nav className="navbar navbar-expand-lg navbar-dark coffee-navbar">
        <div className="container">
          <a className="navbar-brand d-flex align-items-center gap-2" href="#">
            <span className="brand-mark">☕</span>
            <span>Bean & Bloom</span>
          </a>
          <span className="navbar-text d-none d-sm-inline">Coffee Shop Manager</span>
        </div>
      </nav>

      <header className="hero-section">
        <div className="container hero-content">
          <div className="hero-copy">
            <span className="eyebrow">YOUR COFFEE DIRECTORY</span>
            <h1>Every great cup<br /><em>starts somewhere.</em></h1>
            <p>Keep your favourite coffee spots organized in one warm, simple dashboard.</p>
            <a href="#shop-form" className="btn btn-light hero-button">Manage coffee shops <span aria-hidden="true">↓</span></a>
          </div>
          <div className="hero-art" aria-hidden="true">
            <div className="sun-circle"></div>
            <div className="steam steam-one"></div>
            <div className="steam steam-two"></div>
            <div className="cup"><div className="coffee"></div><div className="cup-handle"></div></div>
            <div className="saucer"></div>
            <div className="bean bean-one"></div><div className="bean bean-two"></div><div className="bean bean-three"></div>
          </div>
        </div>
      </header>

      <main className="container main-content">
        <section className="stats-grid" aria-label="Coffee shop statistics">
          <article className="stat-card">
            <span className="stat-icon">⌂</span>
            <div><p className="stat-label">TOTAL SHOPS</p><p className="stat-value">{shops.length}</p></div>
          </article>
          <article className="stat-card">
            <span className="stat-icon open-icon">●</span>
            <div><p className="stat-label">CURRENTLY OPEN</p><p className="stat-value">{openCount}</p></div>
          </article>
          <article className="stat-card">
            <span className="stat-icon">₹</span>
            <div><p className="stat-label">AVERAGE PRICE</p><p className="stat-value">{shops.length ? `₹${(shops.reduce((sum, shop) => sum + Number(shop.averagePrice || 0), 0) / shops.length).toFixed(0)}` : "—"}</p></div>
          </article>
        </section>

        {error && <div className="alert alert-danger alert-dismissible" role="alert">{error}<button className="btn-close" onClick={() => setError("")} aria-label="Close"></button></div>}
        {notice && <div className="alert alert-success alert-dismissible" role="status">{notice}<button className="btn-close" onClick={() => setNotice("")} aria-label="Close"></button></div>}

        <section className="form-panel" id="shop-form">
          <div className="section-heading">
            <div><span className="eyebrow">SHOP DETAILS</span><h2>{editingId === null ? "Add a coffee shop" : "Update coffee shop"}</h2></div>
            {editingId !== null && <button className="btn btn-outline-secondary btn-sm" type="button" onClick={resetForm}>Cancel edit</button>}
          </div>
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label" htmlFor="shopName">Shop name</label>
                <input id="shopName" className="form-control" name="shopName" value={form.shopName} onChange={updateField} placeholder="e.g. The Daily Grind" required maxLength={100} />
              </div>
              <div className="col-md-6">
                <label className="form-label" htmlFor="location">Location</label>
                <input id="location" className="form-control" name="location" value={form.location} onChange={updateField} placeholder="e.g. Mangalagiri" required maxLength={150} />
              </div>
              <div className="col-md-6">
                <label className="form-label" htmlFor="averagePrice">Average price (₹)</label>
                <input id="averagePrice" className="form-control" name="averagePrice" type="number" min="0" step="0.01" value={form.averagePrice} onChange={updateField} placeholder="e.g. 180" required />
              </div>
              <div className="col-md-6">
                <label className="form-label" htmlFor="open">Current status</label>
                <select id="open" className="form-select" name="open" value={form.open} onChange={updateField} required>
                  <option value="true">Open now</option>
                  <option value="false">Currently closed</option>
                </select>
              </div>
            </div>
            <div className="form-actions">
              <button className="btn btn-coffee" type="submit" disabled={saving}>
                {saving ? "Saving..." : editingId === null ? "+ Add coffee shop" : "Save changes"}
              </button>
              <button className="btn btn-outline-coffee" type="button" onClick={resetForm}>Clear form</button>
            </div>
          </form>
        </section>

        <section className="directory-section">
          <div className="section-heading directory-heading">
            <div><span className="eyebrow">THE DIRECTORY</span><h2>Your coffee spots</h2></div>
            <div className="search-wrap">
              <span aria-hidden="true">⌕</span>
              <input className="form-control" aria-label="Search coffee shops" placeholder="Search name or location..." value={search} onChange={(event) => setSearch(event.target.value)} />
            </div>
          </div>

          {loading ? (
            <div className="empty-state"><div className="spinner-border text-secondary" role="status"><span className="visually-hidden">Loading...</span></div><p>Finding your coffee spots...</p></div>
          ) : filteredShops.length === 0 ? (
            <div className="empty-state">
              <div className="empty-cup">☕</div>
              <h3>{search ? "No matching shops" : "Your directory is waiting"}</h3>
              <p>{search ? "Try another shop name or location." : "Add your first coffee shop using the form above."}</p>
            </div>
          ) : (
            <div className="row g-3">
              {filteredShops.map((shop) => (
                <div className="col-md-6 col-xl-4" key={shop.id}>
                  <article className="shop-card h-100">
                    <div className="shop-card-top">
                      <div className="shop-avatar">☕</div>
                      <span className={`status-pill ${shop.open ? "status-open" : "status-closed"}`}><span></span>{shop.open ? "Open now" : "Closed"}</span>
                    </div>
                    <h3>{shop.shopName}</h3>
                    <p className="shop-location"><span aria-hidden="true">⌖</span> {shop.location}</p>
                    <div className="shop-card-footer">
                      <div><span className="price-caption">AVERAGE PRICE</span><strong>₹{Number(shop.averagePrice || 0).toFixed(2)}</strong></div>
                      <div className="d-flex gap-2">
                        <button className="btn btn-sm btn-edit" onClick={() => beginEdit(shop)} type="button">Edit</button>
                        <button className="btn btn-sm btn-delete" onClick={() => deleteShop(shop)} type="button">Delete</button>
                      </div>
                    </div>
                  </article>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="site-footer">
        <div className="container d-flex flex-column flex-sm-row justify-content-between gap-2">
          <span>☕ Bean & Bloom <span className="footer-muted">· Coffee Shop Manager</span></span>
          <span className="footer-muted">Made for coffee people.</span>
        </div>
      </footer>
    </div>
  );
}
