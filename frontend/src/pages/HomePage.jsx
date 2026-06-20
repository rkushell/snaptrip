import { Link } from "react-router-dom";

function HomePage() {
  return (
    /* bg.jpeg as the desktop background */
    <div
      className="mac-desktop"
      style={{ backgroundImage: "url('/bg.jpeg')" }}
    >
      {/* macOS split-panel window — same structure as Login */}
      <div className="mac-window auth-window">

        {/* Left Panel — connect.jpeg */}
        <div className="auth-left">
          <img
            src="/connect.jpeg"
            alt="SnapTrip"
            className="auth-left-image"
          />
          <div className="auth-left-overlay" />

          {/* Traffic Lights — decorative */}
          <div className="auth-left-chrome">
            <div className="traffic-lights">
              <span className="tl-btn tl-red" />
              <span className="tl-btn tl-yellow" />
              <span className="tl-btn tl-green" />
            </div>
          </div>
        </div>

        {/* Right Panel — Branding + CTAs */}
        <div className="auth-right">

          {/* App Icon */}
          <div
            style={{
              width: "56px",
              height: "56px",
              background: "var(--apple-blue)",
              borderRadius: "14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "20px",
              boxShadow: "0 6px 20px rgba(0,122,255,0.25)",
            }}
          >
            <svg
              width="30"
              height="30"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
          </div>

          {/* Brand Name */}
          <div className="auth-brand" style={{ marginBottom: "12px" }}>
            <div className="auth-brand-name">SnapTrip</div>
            <div className="auth-brand-sub">
              Capture memories. Relive journeys.
            </div>
          </div>

          {/* Description */}
          <p
            style={{
              fontSize: "13px",
              color: "var(--gray-4)",
              textAlign: "center",
              maxWidth: "280px",
              lineHeight: "1.6",
              marginBottom: "28px",
            }}
          >
            Build collaborative travel albums with your friends and
            preserve every moment forever.
          </p>

          {/* CTA Buttons */}
          <div style={{ display: "flex", gap: "10px" }}>
            <Link
              to="/register"
              id="get-started-btn"
              className="mac-btn-primary"
              style={{ padding: "10px 28px", fontSize: "14px" }}
            >
              Get Started
            </Link>
            <Link
              to="/login"
              id="sign-in-btn"
              className="mac-btn"
              style={{ padding: "10px 28px", fontSize: "14px" }}
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;