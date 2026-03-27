import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../../contexts/AuthContext.jsx";

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({
    email: "student@bibliotekx.ai",
    password: "Password123!"
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const user = await login(form);
      navigate(user.role === "admin" ? "/admin" : "/");
    } catch (error) {
      setError(error.response?.data?.message || "Login failed. Check your credentials and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="glass w-full max-w-lg rounded-[2rem] p-8">
        <p className="text-xs uppercase tracking-[0.35em] text-sky-300/80">Bibliotek X</p>
        <h1 className="mt-4 text-4xl font-semibold text-white">Sign in to the Learning OS</h1>
        <p className="mt-3 text-sm text-slate-400">
          JWT auth, RBAC, adaptive analytics, and AI learning workflows in one production-ready system.
        </p>
        <form onSubmit={submit} className="mt-8 space-y-4">
          <input
            className="premium-input w-full rounded-2xl px-4 py-3"
            placeholder="Email"
            value={form.email}
            onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
          />
          <input
            type="password"
            className="premium-input w-full rounded-2xl px-4 py-3"
            placeholder="Password"
            value={form.password}
            onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
          />
          {error ? <p className="text-sm text-rose-300">{error}</p> : null}
          <button
            type="submit"
            disabled={submitting}
            className="gradient-button w-full rounded-2xl px-4 py-3 font-semibold disabled:opacity-60"
          >
            {submitting ? "Signing in..." : "Continue"}
          </button>
        </form>
        <p className="mt-5 text-sm text-slate-400">
          New here?{" "}
          <Link to="/register" className="text-sky-300 hover:text-sky-200">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};
