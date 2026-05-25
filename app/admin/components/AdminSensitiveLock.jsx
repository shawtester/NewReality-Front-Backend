"use client";

import { useEffect, useState } from "react";
import { LockKeyhole, ShieldCheck } from "lucide-react";

export default function AdminSensitiveLock({
  title = "Protected admin data",
  description = "Enter the access key to view sensitive records.",
  children,
}) {
  const [key, setKey] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [checking, setChecking] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function checkAccess() {
      try {
        const res = await fetch("/api/admin-sensitive-access", {
          cache: "no-store",
        });
        const data = await res.json();

        if (active) setUnlocked(Boolean(data?.unlocked));
      } catch (err) {
        if (active) setError("Unable to verify access right now.");
      } finally {
        if (active) setChecking(false);
      }
    }

    checkAccess();

    return () => {
      active = false;
    };
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/admin-sensitive-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key }),
      });
      const data = await res.json();

      if (!res.ok || !data?.unlocked) {
        setError(data?.message || "Invalid access key");
        return;
      }

      setUnlocked(true);
      setKey("");
    } catch (err) {
      setError("Unable to unlock this page right now.");
    } finally {
      setSubmitting(false);
    }
  };

  if (checking) {
    return (
      <div className="p-6 text-sm text-gray-500">
        Checking protected access...
      </div>
    );
  }

  if (unlocked) {
    return children;
  }

  return (
    <div className="flex min-h-[calc(100vh-80px)] items-center justify-center p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
      >
        <div className="mb-5 flex items-start gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-[#DBA40D]">
            <LockKeyhole size={22} />
          </span>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
            <p className="mt-1 text-sm text-gray-500">{description}</p>
          </div>
        </div>

        <label className="text-sm font-medium text-gray-700" htmlFor="access-key">
          Access key
        </label>
        <input
          id="access-key"
          type="password"
          value={key}
          onChange={(event) => setKey(event.target.value)}
          className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#DBA40D] focus:ring-2 focus:ring-[#DBA40D]/20"
          placeholder="Enter key"
          autoComplete="current-password"
        />

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={submitting || !key.trim()}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#DBA40D] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#c8950b] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <ShieldCheck size={16} />
          {submitting ? "Unlocking..." : "Unlock"}
        </button>
      </form>
    </div>
  );
}
