import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";

import { api } from "../../api/http.js";
import { PageHeader } from "../../components/layout/PageHeader.jsx";
import { useAuth } from "../../contexts/AuthContext.jsx";

export const ProfilePage = () => {
  const { user, setUser } = useAuth();
  const { user: outletUser } = useOutletContext();
  const activeUser = user || outletUser;
  const [form, setForm] = useState({
    name: activeUser?.name || "",
    headline: activeUser?.headline || "",
    avatarUrl: activeUser?.avatarUrl || "",
    department: activeUser?.department || "",
    program: activeUser?.program || "",
    academicYear: activeUser?.academicYear || "",
    rollNumber: activeUser?.rollNumber || "",
    parentName: activeUser?.parentContact?.name || "",
    parentEmail: activeUser?.parentContact?.email || "",
    parentPhone: activeUser?.parentContact?.phone || ""
  });
  const [status, setStatus] = useState("");

  useEffect(() => {
    setForm({
      name: activeUser?.name || "",
      headline: activeUser?.headline || "",
      avatarUrl: activeUser?.avatarUrl || "",
      department: activeUser?.department || "",
      program: activeUser?.program || "",
      academicYear: activeUser?.academicYear || "",
      rollNumber: activeUser?.rollNumber || "",
      parentName: activeUser?.parentContact?.name || "",
      parentEmail: activeUser?.parentContact?.email || "",
      parentPhone: activeUser?.parentContact?.phone || ""
    });
  }, [activeUser]);

  const saveProfile = async (event) => {
    event.preventDefault();
    const response = await api.patch("/auth/me", {
      name: form.name,
      headline: form.headline,
      avatarUrl: form.avatarUrl,
      department: form.department,
      program: form.program,
      academicYear: form.academicYear,
      rollNumber: form.rollNumber,
      parentContact: {
        name: form.parentName,
        email: form.parentEmail,
        phone: form.parentPhone
      }
    });
    setUser(response.data.user);
    setStatus("Profile updated successfully.");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Profile & Settings"
        title="Manage your portal profile"
        description="Update your name, headline, avatar, and parent/emergency contact details from one settings page."
        breadcrumbs={["Portal", "Profile"]}
      />
      <form onSubmit={saveProfile} className="glass-card rounded-3xl p-6">
        <div className="grid gap-6 xl:grid-cols-2">
          <div className="space-y-4">
            <input className="premium-input w-full rounded-2xl px-4 py-3" placeholder="Full name" value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} />
            <input className="premium-input w-full rounded-2xl px-4 py-3" placeholder="Headline" value={form.headline} onChange={(event) => setForm((current) => ({ ...current, headline: event.target.value }))} />
            <input className="premium-input w-full rounded-2xl px-4 py-3" placeholder="Avatar image URL" value={form.avatarUrl} onChange={(event) => setForm((current) => ({ ...current, avatarUrl: event.target.value }))} />
            <input className="premium-input w-full rounded-2xl px-4 py-3" placeholder="Department" value={form.department} onChange={(event) => setForm((current) => ({ ...current, department: event.target.value }))} />
            <input className="premium-input w-full rounded-2xl px-4 py-3" placeholder="Program" value={form.program} onChange={(event) => setForm((current) => ({ ...current, program: event.target.value }))} />
            <div className="subtle-card rounded-2xl p-4">
              <p className="text-sm text-muted">Role</p>
              <p className="mt-2 font-semibold text-[var(--text-primary)]">{activeUser?.role}</p>
            </div>
          </div>
          <div className="space-y-4">
            <input className="premium-input w-full rounded-2xl px-4 py-3" placeholder="Academic year" value={form.academicYear} onChange={(event) => setForm((current) => ({ ...current, academicYear: event.target.value }))} />
            <input className="premium-input w-full rounded-2xl px-4 py-3" placeholder="Roll number" value={form.rollNumber} onChange={(event) => setForm((current) => ({ ...current, rollNumber: event.target.value }))} />
            <input className="premium-input w-full rounded-2xl px-4 py-3" placeholder="Parent / guardian name" value={form.parentName} onChange={(event) => setForm((current) => ({ ...current, parentName: event.target.value }))} />
            <input className="premium-input w-full rounded-2xl px-4 py-3" placeholder="Parent / guardian email" value={form.parentEmail} onChange={(event) => setForm((current) => ({ ...current, parentEmail: event.target.value }))} />
            <input className="premium-input w-full rounded-2xl px-4 py-3" placeholder="Parent / guardian phone" value={form.parentPhone} onChange={(event) => setForm((current) => ({ ...current, parentPhone: event.target.value }))} />
            <div className="subtle-card rounded-2xl p-4">
              <p className="text-sm text-muted">Current email</p>
              <p className="mt-2 font-semibold text-[var(--text-primary)]">{activeUser?.email}</p>
            </div>
          </div>
        </div>
        <div className="mt-6 flex items-center gap-4">
          <button type="submit" className="gradient-button rounded-2xl px-4 py-3 text-sm font-semibold">
            Save settings
          </button>
          {status ? <p className="text-sm text-emerald-300">{status}</p> : null}
        </div>
      </form>
    </div>
  );
};
