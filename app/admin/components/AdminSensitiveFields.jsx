"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { LockKeyhole, ShieldCheck } from "lucide-react";

const SensitiveAccessContext = createContext(null);

export function AdminSensitiveFieldsProvider({ children }) {
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

  const unlock = async (event) => {
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
      setError("Unable to unlock sensitive fields right now.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SensitiveAccessContext.Provider
      value={{
        key,
        setKey,
        unlocked,
        checking,
        submitting,
        error,
        unlock,
      }}
    >
      {children}
    </SensitiveAccessContext.Provider>
  );
}

function useSensitiveAccess() {
  const context = useContext(SensitiveAccessContext);

  if (!context) {
    throw new Error(
      "Sensitive fields must be used inside AdminSensitiveFieldsProvider"
    );
  }

  return context;
}

export function SensitiveValue({ value, fallback = "Locked" }) {
  const { unlocked, checking } = useSensitiveAccess();

  if (checking) return <span className="text-gray-400">Checking...</span>;
  if (unlocked) return <>{value || "-"}</>;

  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-500">
      <LockKeyhole size={12} />
      {fallback}
    </span>
  );
}

export function SensitiveFieldsUnlock({ className = "" }) {
  const { key, setKey, unlocked, checking, submitting, error, unlock } =
    useSensitiveAccess();

  if (checking) {
    return <p className="text-sm text-gray-500">Checking protected fields...</p>;
  }

  if (unlocked) {
    return (
      <div
        className={`inline-flex items-center gap-2 rounded-xl bg-green-50 px-3 py-2 text-sm font-medium text-green-700 ${className}`}
      >
        <ShieldCheck size={16} />
        Phone and email unlocked
      </div>
    );
  }

  return (
    <form
      onSubmit={unlock}
      className={`flex flex-col gap-2 rounded-2xl border border-gray-200 bg-white p-3 shadow-sm sm:flex-row sm:items-center ${className}`}
    >
      <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
        <LockKeyhole size={16} className="text-[#DBA40D]" />
        Unlock phone/email
      </div>
      <input
        type="password"
        value={key}
        onChange={(event) => setKey(event.target.value)}
        className="min-w-0 rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#DBA40D] focus:ring-2 focus:ring-[#DBA40D]/20"
        placeholder="Access key"
        autoComplete="current-password"
      />
      <button
        type="submit"
        disabled={submitting || !key.trim()}
        className="rounded-xl bg-[#DBA40D] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#c8950b] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? "Unlocking..." : "Unlock"}
      </button>
      {error && <p className="text-sm text-red-600 sm:w-full">{error}</p>}
    </form>
  );
}
