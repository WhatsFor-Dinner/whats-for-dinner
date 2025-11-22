import "./RegisterPages.css";
import { useState } from "react";
import { useAuth } from "../Auth/Auth";

export default function RegisterPage({ onRegister }) {
  const { register } = useAuth();
  const [form, setForm] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    gender: "",
    age: "",
    height: "",
    weight: "",
    bodyType: "",
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverMsg, setServerMsg] = useState(null);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: null }));
    setServerMsg(null);
  }

  function validate() {
    const errs = {};
    if (!form.username || form.username.trim().length < 3)
      errs.username = "Username must be at least 3 characters.";
    if (form.password.length < 8)
      errs.password = "Password must be at least 8 characters.";
    if (form.password !== form.confirmPassword)
      errs.confirmPassword = "Passwords do not match.";
    if (!["male", "female", "other"].includes(form.gender))
      errs.gender = "Please pick a gender option.";
    if (!form.age || Number(form.age) < 13 || Number(form.age) > 120)
      errs.age = "Enter a valid age (13–120).";
    if (!form.height || Number(form.height) <= 0)
      errs.height = "Enter a valid height.";
    if (!form.weight || Number(form.weight) <= 0)
      errs.weight = "Enter a valid weight.";
    if (!["mesomorph", "endomorph", "ectomorph"].includes(form.bodyType))
      errs.bodyType = "Please choose a body type.";
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setSubmitting(true);
    setServerMsg(null);

    const payload = {
      username: form.username,
      password: form.password,
      profile: {
        gender: form.gender,
        age: Number(form.age),
        height: Number(form.height),
        weight: Number(form.weight),
        bodyType: form.bodyType,
      },
    };

    try {
      await register(form.username, form.password);
      // register function will navigate to profile page on success
    } catch (err) {
      setServerMsg({
        type: "error",
        text: err.message || "Registration failed.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  const passwordStrength = (() => {
    const p = form.password;
    if (!p) return { label: "Empty", score: 0 };
    let score = 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    const labels = ["Weak", "Fair", "Good", "Strong", "Excellent"];
    return { label: labels[score], score };
  })();

  return (
    <div className="register-shell">
      <form className="register-card" onSubmit={handleSubmit} noValidate>
        <h2 className="brand">Create your account</h2>

        <label className="field">
          <span className="label-text">Username</span>
          <input
            name="username"
            type="text"
            placeholder="Choose a username"
            value={form.username}
            onChange={handleChange}
            required
            aria-invalid={!!errors.username}
            className={errors.username ? "input error" : "input"}
          />
          {errors.username && (
            <div className="error-text">{errors.username}</div>
          )}
        </label>

        <label className="field two-up">
          <div>
            <span className="label-text">Password</span>
            <input
              name="password"
              type="password"
              placeholder="At least 8 characters"
              value={form.password}
              onChange={handleChange}
              required
              aria-invalid={!!errors.password}
              className={errors.password ? "input error" : "input"}
            />
            {errors.password && (
              <div className="error-text">{errors.password}</div>
            )}
          </div>

          <div>
            <span className="label-text">Confirm password</span>
            <input
              name="confirmPassword"
              type="password"
              placeholder="Re-type password"
              value={form.confirmPassword}
              onChange={handleChange}
              required
              aria-invalid={!!errors.confirmPassword}
              className={errors.confirmPassword ? "input error" : "input"}
            />
            {errors.confirmPassword && (
              <div className="error-text">{errors.confirmPassword}</div>
            )}
          </div>
        </label>

        <div className="pw-strength">
          <div className={`strength-bar s-${passwordStrength.score}`} />
          <div className="strength-label">{passwordStrength.label}</div>
        </div>

        <fieldset className="field gender-field">
          <legend className="label-text">Gender</legend>
          <label className="radio">
            <input
              type="radio"
              name="gender"
              value="male"
              onChange={handleChange}
              checked={form.gender === "male"}
            />
            Male
          </label>
          <label className="radio">
            <input
              type="radio"
              name="gender"
              value="female"
              onChange={handleChange}
              checked={form.gender === "female"}
            />
            Female
          </label>
          <label className="radio">
            <input
              type="radio"
              name="gender"
              value="other"
              onChange={handleChange}
              checked={form.gender === "other"}
            />
            Other
          </label>
          {errors.gender && <div className="error-text">{errors.gender}</div>}
        </fieldset>

        <label className="field three-up">
          <div>
            <span className="label-text">Age</span>
            <input
              name="age"
              type="number"
              min="13"
              max="120"
              placeholder="e.g., 28"
              value={form.age}
              onChange={handleChange}
              className={errors.age ? "input error" : "input"}
            />
            {errors.age && <div className="error-text">{errors.age}</div>}
          </div>

          <div>
            <span className="label-text">Height (ft)</span>
            <input
              name="height"
              type="number"
              min="30"
              placeholder="e.g., 180"
              value={form.height}
              onChange={handleChange}
              className={errors.height ? "input error" : "input"}
            />
            {errors.height && <div className="error-text">{errors.height}</div>}
          </div>

          <div>
            <span className="label-text">Weight (lb)</span>
            <input
              name="weight"
              type="number"
              min="10"
              placeholder="e.g., 80"
              value={form.weight}
              onChange={handleChange}
              className={errors.weight ? "input error" : "input"}
            />
            {errors.weight && <div className="error-text">{errors.weight}</div>}
          </div>
        </label>

        <label className="field">
          <span className="label-text">Body type</span>
          <select
            name="bodyType"
            value={form.bodyType}
            onChange={handleChange}
            className={errors.bodyType ? "input error" : "input"}
          >
            <option value="">Choose body type</option>
            <option value="ectomorph">Ectomorph</option>
            <option value="mesomorph">Mesomorph</option>
            <option value="endomorph">Endomorph</option>
          </select>
          {errors.bodyType && (
            <div className="error-text">{errors.bodyType}</div>
          )}
        </label>

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
          <button type="submit" className="btn primary" disabled={submitting}>
            {submitting ? "Creating account…" : "Create account"}
          </button>

          <button
            type="button"
            className="btn subtle"
            onClick={() =>
              setForm({
                username: "",
                password: "",
                confirmPassword: "",
                gender: "",
                age: "",
                height: "",
                weight: "",
                bodyType: "",
              })
            }
            disabled={submitting}
          >
            Reset
          </button>
        </div>

        <p className="signin-link">
          Already have an account?{" "}
          <a href="/login" className="signin-link-text">
            Sign in
          </a>
        </p>
      </form>
    </div>
  );
}
