import { useEffect, useState, useCallback } from "react";

import Navbar from "../components/navbar/Navbar";
import TripCard from "../components/cards/TripCard";
import { getTrips, createTrip, joinTrip } from "../api/tripApi";

/* ── Create Trip Modal ────────────────────────────── */
function CreateTripModal({ onClose, onCreated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);
    setError("");
    try {
      await createTrip({ title: title.trim(), description: description.trim() });
      onCreated();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create trip");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mac-modal-backdrop" onClick={onClose}>
      <div className="mac-modal" onClick={(e) => e.stopPropagation()}>
        <div className="mac-modal-title">New Trip Album</div>
        <div className="mac-modal-sub">Give your travel album a name and description.</div>

        <form onSubmit={handleCreate}>
          <input
            id="create-trip-title"
            className="mac-modal-input"
            placeholder="Trip name (e.g. Italy 2025)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
            required
          />
          <input
            id="create-trip-description"
            className="mac-modal-input"
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          {error && (
            <p style={{ color: "var(--apple-red)", fontSize: "12px", marginBottom: "8px" }}>
              {error}
            </p>
          )}

          <div className="mac-modal-actions">
            <button type="button" className="mac-btn" onClick={onClose} id="create-trip-cancel">
              Cancel
            </button>
            <button type="submit" className="mac-btn-primary" disabled={loading} id="create-trip-submit">
              {loading ? "Creating…" : "Create Album"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ── Join Trip Modal ──────────────────────────────── */
function JoinTripModal({ onClose, onJoined }) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleJoin = async (e) => {
    e.preventDefault();
    if (!code.trim()) return;
    setLoading(true);
    setError("");
    try {
      await joinTrip(code.trim());
      onJoined();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Invalid invite code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mac-modal-backdrop" onClick={onClose}>
      <div className="mac-modal" onClick={(e) => e.stopPropagation()}>
        <div className="mac-modal-title">Join a Trip</div>
        <div className="mac-modal-sub">Paste the invite code shared by a trip member.</div>

        <form onSubmit={handleJoin}>
          <input
            id="join-trip-code"
            className="mac-modal-input"
            placeholder="Invite code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            autoFocus
            required
            style={{ fontFamily: "'SF Mono', 'Menlo', monospace", letterSpacing: "0.08em" }}
          />

          {error && (
            <p style={{ color: "var(--apple-red)", fontSize: "12px", marginBottom: "8px" }}>
              {error}
            </p>
          )}

          <div className="mac-modal-actions">
            <button type="button" className="mac-btn" onClick={onClose} id="join-trip-cancel">
              Cancel
            </button>
            <button type="submit" className="mac-btn-primary" disabled={loading} id="join-trip-submit">
              {loading ? "Joining…" : "Join Album"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ── Dashboard Page ───────────────────────────────── */
function DashboardPage() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [showJoin, setShowJoin] = useState(false);
  const [search, setSearch] = useState("");
  const [activeSection, setActiveSection] = useState("all");

  const fetchTrips = useCallback(async () => {
    try {
      const data = await getTrips();
      setTrips(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTrips();
  }, [fetchTrips]);

  const filtered = trips.filter((t) =>
    t.title.toLowerCase().includes(search.toLowerCase())
  );

  const rightActions = (
    <>
      {/* Search */}
      <div className="mac-search" style={{ minWidth: "180px" }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          id="dashboard-search"
          placeholder="Search albums"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* New trip */}
      <button
        id="new-trip-btn"
        className="mac-btn-primary"
        onClick={() => setShowCreate(true)}
        style={{ fontSize: "13px" }}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"/>
          <line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        New Album
      </button>
    </>
  );

  return (
    <div className="app-shell">
      {/* macOS Toolbar */}
      <Navbar title="My Albums" rightActions={rightActions} />

      <div className="app-content">
        {/* Sidebar */}
        <aside className="mac-sidebar">
          <div className="sidebar-section">
            <div className="sidebar-section-label">Library</div>

            <button
              id="sidebar-all"
              className={`sidebar-item ${activeSection === "all" ? "active" : ""}`}
              onClick={() => setActiveSection("all")}
            >
              <span className="sidebar-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7" rx="1"/>
                  <rect x="14" y="3" width="7" height="7" rx="1"/>
                  <rect x="3" y="14" width="7" height="7" rx="1"/>
                  <rect x="14" y="14" width="7" height="7" rx="1"/>
                </svg>
              </span>
              All Albums
              {trips.length > 0 && (
                <span
                  style={{
                    marginLeft: "auto",
                    fontSize: "11px",
                    background: "rgba(255,255,255,0.25)",
                    borderRadius: "99px",
                    padding: "1px 6px",
                    fontWeight: "600",
                    color: activeSection === "all" ? "white" : "var(--gray-4)",
                  }}
                >
                  {trips.length}
                </span>
              )}
            </button>
          </div>

          <div className="sidebar-divider" />

          <div className="sidebar-section">
            <div className="sidebar-section-label">Actions</div>

            <button
              id="sidebar-create"
              className="sidebar-item"
              onClick={() => setShowCreate(true)}
            >
              <span className="sidebar-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"/>
                  <line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
              </span>
              New Album
            </button>

            <button
              id="sidebar-join"
              className="sidebar-item"
              onClick={() => setShowJoin(true)}
            >
              <span className="sidebar-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                  <polyline points="10 17 15 12 10 7"/>
                  <line x1="15" y1="12" x2="3" y2="12"/>
                </svg>
              </span>
              Join with Code
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="mac-main">
          {/* Section Header */}
          <div className="section-header">
            <div>
              <div className="section-title">
                {search ? `Results for "${search}"` : "All Albums"}
              </div>
              <div className="section-subtitle">
                {filtered.length} {filtered.length === 1 ? "album" : "albums"}
              </div>
            </div>
          </div>

          {/* Loading Skeleton */}
          {loading && (
            <div className="album-grid">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="album-card" style={{ cursor: "default" }}>
                  <div className="skeleton" style={{ width: "100%", aspectRatio: "1" }} />
                  <div className="album-info">
                    <div className="skeleton" style={{ height: "14px", width: "70%", marginBottom: "6px" }} />
                    <div className="skeleton" style={{ height: "11px", width: "45%" }} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && filtered.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">📂</div>
              <div className="empty-title">
                {search ? "No albums found" : "No albums yet"}
              </div>
              <div className="empty-sub">
                {search
                  ? `No albums match "${search}". Try a different name.`
                  : "Create your first trip album or join one with an invite code."}
              </div>
              {!search && (
                <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
                  <button
                    className="mac-btn-primary"
                    onClick={() => setShowCreate(true)}
                    id="empty-create-btn"
                  >
                    New Album
                  </button>
                  <button
                    className="mac-btn"
                    onClick={() => setShowJoin(true)}
                    id="empty-join-btn"
                  >
                    Join with Code
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Album Grid */}
          {!loading && filtered.length > 0 && (
            <div className="album-grid">
              {filtered.map((trip) => (
                <TripCard key={trip._id} trip={trip} />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Modals */}
      {showCreate && (
        <CreateTripModal
          onClose={() => setShowCreate(false)}
          onCreated={fetchTrips}
        />
      )}
      {showJoin && (
        <JoinTripModal
          onClose={() => setShowJoin(false)}
          onJoined={fetchTrips}
        />
      )}
    </div>
  );
}

export default DashboardPage;