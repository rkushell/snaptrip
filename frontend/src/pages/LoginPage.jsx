import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import axiosInstance from "../api/axiosInstance";
import { useAuth } from "../context/authContext";

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axiosInstance.post("/auth/login", formData);
      login(response.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mac-desktop" style={{ backgroundImage: "url('/bg.jpeg')" }}>
      {/* macOS Floating Window */}
      <div className="mac-window auth-window">

        {/* Left Panel — Travel Image */}
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

          {/* Login / Sign Up Tabs */}
          <div className="auth-tabs-vertical">
            <Link to="/login" id="login-tab" className="auth-tab active">
              Login
            </Link>
            <Link to="/register" id="signup-tab" className="auth-tab">
              Sign Up
            </Link>
          </div>
        </div>

        {/* Right Panel — Form */}
        <div className="auth-right">

          {/* Brand */}
          <div className="auth-brand">
            <div className="auth-brand-name">SnapTrip</div>
            <div className="auth-brand-sub">Your collaborative travel album</div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="auth-form" id="login-form">

            {/* Email */}
            <div className="auth-input-row">
              <span className="auth-input-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
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
                autoComplete="current-password"
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>

            {/* Error */}
            {error && <p className="auth-error">{error}</p>}

            {/* Actions */}
            <div className="auth-form-footer">
              <a href="#" className="auth-forgot">Forgot Password?</a>
              <button
                id="login-submit-btn"
                type="submit"
                className="auth-login-btn"
                disabled={loading}
              >
                {loading ? "Signing in…" : "Login"}
              </button>
            </div>
          </form>

          {/* Divider */}
          <div className="auth-or-divider">or</div>

          {/* Switch to Register */}
          <div className="auth-signup-link">
            Don't have an account?{" "}
            <Link to="/register">Create one</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;