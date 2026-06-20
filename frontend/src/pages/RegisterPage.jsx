import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import axiosInstance from "../api/axiosInstance";

function RegisterPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await axiosInstance.post("/auth/register", formData);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mac-desktop" style={{ backgroundImage: "url('/bg.jpeg')" }}>
      {/* macOS Floating Window — same as login, Sign Up tab active */}
      <div className="mac-window auth-window">

        {/* Left Panel */}
        <div className="auth-left">
          <img
            src="/connect.jpeg"
            alt="SnapTrip"
            className="auth-left-image"
          />
          <div className="auth-left-overlay" />

          {/* Traffic Lights */}
          <div className="auth-left-chrome">
            <div className="traffic-lights">
              <span className="tl-btn tl-red" />
              <span className="tl-btn tl-yellow" />
              <span className="tl-btn tl-green" />
            </div>
          </div>

          {/* Tabs — Sign Up active */}
          <div className="auth-tabs-vertical">
            <Link to="/login" id="login-tab" className="auth-tab">
              Login
            </Link>
            <Link to="/register" id="signup-tab" className="auth-tab active">
              Sign Up
            </Link>
          </div>
        </div>

        {/* Right Panel */}
        <div className="auth-right auth-register-right">

          {/* Brand */}
          <div className="auth-brand">
            <div className="auth-brand-name">SnapTrip</div>
            <div className="auth-brand-sub">Create your account</div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="auth-form" id="register-form">

            {/* Name */}
            <div className="auth-input-row">
              <span className="auth-input-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </span>
              <input
                id="name-input"
                type="text"
                placeholder="Full Name"
                className="auth-input"
                value={formData.name}
                autoComplete="name"
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            {/* Email */}
            <div className="auth-input-row">
              <span className="auth-input-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
              </span>
              <input
                id="email-input"
                type="email"
                placeholder="Email"
                className="auth-input"
                value={formData.email}
                autoComplete="email"
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            {/* Password */}
            <div className="auth-input-row">
              <span className="auth-input-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </span>
              <input
                id="password-input"
                type="password"
                placeholder="Password"
                className="auth-input"
                value={formData.password}
                autoComplete="new-password"
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>

            {/* Error */}
            {error && <p className="auth-error">{error}</p>}

            {/* Actions */}
            <div className="auth-form-footer">
              <span />
              <button
                id="register-submit-btn"
                type="submit"
                className="auth-login-btn"
                disabled={loading}
              >
                {loading ? "Creating…" : "Sign Up"}
              </button>
            </div>
          </form>

          <div className="auth-or-divider">or</div>

          <div className="auth-signup-link">
            Already have an account?{" "}
            <Link to="/login">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;