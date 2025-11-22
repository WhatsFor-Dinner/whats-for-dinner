import React, { useState } from "react";
import "./SignIn.css";
import { useAuth } from "../Auth/Auth";

export default function SignIn() {
  const { login, loading, error: authError } = useAuth();
  const [form, setForm] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [serverMsg, setServerMsg] = useState(null);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError("");
    setServerMsg(null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.username || !form.password) {
      setError("Please enter your username and password.");
      return;
    }

    try {
      await login(form.username, form.password);
      // login function will navigate to profile page on success
    } catch (err) {
      setServerMsg({ type: "error", text: err.message });
    }
  }

  return (
    <div className="signin-shell">
      <form className="signin-card" onSubmit={handleSubmit}>
        <h2 className="brand">Welcome back</h2>
        <p className="subtitle">Sign in to continue</p>

        <label className="field">
          <span className="label-text">Username</span>
          <input
            name="username"
            type="text"
            placeholder="Enter your username"
            value={form.username}
            onChange={handleChange}
            className="input"
            required
          />
        </label>

        <label className="field">
          <span className="label-text">Password</span>
          <input
            name="password"
            type="password"
            placeholder="Enter your password"
            value={form.password}
            onChange={handleChange}
            className="input"
            required
          />
        </label>

        {error && <div className="error-text">{error}</div>}
        {serverMsg && (
          <div
            className={`server-msg ${
              serverMsg.type === "error" ? "err" : "ok"
            }`}
          >
            {serverMsg.text}
          </div>
        )}

        <div className="actions">
          <button type="submit" className="btn primary" disabled={loading}>
            {loading ? "Signing in…" : "Sign in"}
          </button>

          <a href="/register" className="btn subtle">
            Create account
          </a>
        </div>
      </form>
    </div>
  );
}
