import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../../contexts/AuthContext.jsx";

const ROLES = [
  { value: "student", label: "Student" },
  { value: "teacher", label: "Teacher" }
];

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student"
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const user = await register(form);
      navigate(user.role === "admin" ? "/admin" : "/");
    } catch (error) {
      setError(error.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="glass w-full max-w-xl rounded-[2rem] p-8">
        <p className="text-xs uppercase tracking-[0.35em] text-emerald-300/80">Bibliotek X</p>
        <h1 className="mt-4 text-4xl font-semibold text-white">Create your learning workspace</h1>
        <p className="mt-3 text-sm text-slate-400">
          Register as a student or teacher to access live auth, adaptive learning, and collaboration workflows.
        </p>
        <form onSubmit={submit} className="mt-8 space-y-4">
          <input
            className="premium-input w-full rounded-2xl px-4 py-3"
            placeholder="Full name"
            value={form.name}
            onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
          />
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
          <div className="grid gap-3 sm:grid-cols-2">
            {ROLES.map((role) => (
              <button
                key={role.value}
                type="button"
                onClick={() => setForm((current) => ({ ...current, role: role.value }))}
                className={`rounded-2xl border px-4 py-3 text-left ${
                  form.role === role.value
                    ? "border-emerald-400 bg-emerald-400/10 text-white"
                    : "border-slate-800 bg-slate-950/60 text-slate-300"
                }`}
              >
                {role.label}
              </button>
            ))}
          </div>
          {error ? <p className="text-sm text-rose-300">{error}</p> : null}
          <button
            type="submit"
            disabled={submitting}
            className="gradient-button w-full rounded-2xl px-4 py-3 font-semibold disabled:opacity-60"
          >
            {submitting ? "Creating account..." : "Create account"}
          </button>
        </form>
        <p className="mt-5 text-sm text-slate-400">
          Already have an account?{" "}
          <Link to="/login" className="text-sky-300 hover:text-sky-200">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};
