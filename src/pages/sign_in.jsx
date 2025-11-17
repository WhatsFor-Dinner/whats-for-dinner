import React, { useState } from "react";
import "./SignIn.css";

export default function SignIn() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [serverMsg, setServerMsg] = useState(null);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setError("");
    setServerMsg(null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);

    try {
      // 👇 You’re not handling backend, but this can stay for integration later
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Invalid credentials or server error.");

      setServerMsg({ type: "success", text: "Signed in successfully!" });
      setForm({ email: "", password: "" });
    } catch (err) {
      setServerMsg({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="signin-shell">
      <form className="signin-card" onSubmit={handleSubmit}>
        <h2 className="brand">Welcome back</h2>
        <p className="subtitle">Sign in to continue</p>

        <label className="field">
          <span className="label-text">Email</span>
          <input
            name="email"
            type="email"
            placeholder="you@example.com"
            value={form.email}
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
          <div className={`server-msg ${serverMsg.type === "error" ? "err" : "ok"}`}>
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
