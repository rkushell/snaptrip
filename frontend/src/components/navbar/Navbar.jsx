import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/authContext";

function Navbar({ title = "SnapTrip", showBack = false, onBack, rightActions }) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="mac-toolbar">
      {/* Left — decorative traffic lights + optional back button */}
      <div className="toolbar-section" style={{ gap: "12px" }}>
        {/* Traffic lights are purely decorative in the toolbar — no hidden actions */}
        <div className="traffic-lights">
          <span className="tl-btn tl-red" title="Close" />
          <span className="tl-btn tl-yellow" title="Minimize" />
          <span className="tl-btn tl-green" title="Fullscreen" />
        </div>

        {showBack && (
          <button
            id="back-btn"
            className="mac-btn"
            onClick={onBack || (() => navigate(-1))}
            style={{ padding: "4px 10px", fontSize: "13px", gap: "4px" }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Back
          </button>
        )}
      </div>

      {/* Center — Title */}
      <div className="toolbar-section center">
        <span className="toolbar-title">{title}</span>
      </div>

      {/* Right — Contextual Actions + Sign Out */}
      <div className="toolbar-section right" style={{ gap: "8px" }}>
        {rightActions}

        {/* Dashboard shortcut when inside a trip */}
        {location.pathname.startsWith("/trip/") && (
          <Link
            to="/dashboard"
            id="dashboard-link"
            className="mac-btn"
            style={{ fontSize: "12px" }}
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
            Albums
          </Link>
        )}

        {/* Explicit Sign Out button — not hidden in a traffic light */}
        <button
          id="logout-btn"
          className="mac-btn"
          onClick={handleLogout}
          style={{
            fontSize: "12px",
            color: "var(--apple-red)",
            borderColor: "rgba(255,59,48,0.25)",
          }}
        >
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Sign Out
        </button>
      </div>
    </div>
  );
}

export default Navbar;