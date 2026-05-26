"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { KeyRound, LockKeyhole, ShieldCheck } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useAdmin } from "@/lib/firestore/admins/read";

const SensitiveAccessContext = createContext(null);

export function AdminSensitiveFieldsProvider({ children }) {
  const { user } = useAuth();
  const { data: admin } = useAdmin({ email: user?.email });
  const [key, setKey] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [newKey, setNewKey] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);
  const [error, setError] = useState("");
  const [changeError, setChangeError] = useState("");
  const [changeSuccess, setChangeSuccess] = useState("");

  useEffect(() => {
    setUnlocked(false);
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

  const changePassword = async (event) => {
    event.preventDefault();
    setChangeError("");
    setChangeSuccess("");

    const passwordToSave = newKey.trim();

    if (passwordToSave.length < 6) {
      setChangeError("Password must be at least 6 characters.");
      return;
    }

    setChangingPassword(true);

    try {
      const token = await user?.getIdToken();

      if (!token) {
        setChangeError("Please login again before changing the password.");
        return;
      }

      const res = await fetch("/api/admin-sensitive-access", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ newKey: passwordToSave }),
      });
      const data = await res.json();

      if (!res.ok || !data?.updated) {
        setChangeError(data?.message || "Password change failed");
        return;
      }

      const verifyRes = await fetch("/api/admin-sensitive-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: passwordToSave }),
      });
      const verifyData = await verifyRes.json();

      if (!verifyRes.ok || !verifyData?.unlocked) {
        setChangeError("Password saved, but the new password could not unlock. Please try saving again.");
        return;
      }

      setNewKey("");
      setUnlocked(false);
      setError("");
      setChangeSuccess("Password updated and verified. Use the new password to unlock.");
    } catch (err) {
      setChangeError("Unable to change password right now.");
    } finally {
      setChangingPassword(false);
    }
  };

  const canManagePassword = admin?.role === "superadmin";

  return (
    <SensitiveAccessContext.Provider
      value={{
        key,
        setKey,
        unlocked,
        checking: false,
        submitting,
        newKey,
        setNewKey,
        changingPassword,
        canManagePassword,
        error,
        changeError,
        changeSuccess,
        unlock,
        changePassword,
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
  const {
    key,
    setKey,
    unlocked,
    checking,
    submitting,
    newKey,
    setNewKey,
    changingPassword,
    canManagePassword,
    error,
    changeError,
    changeSuccess,
    unlock,
    changePassword,
  } = useSensitiveAccess();

  if (checking) {
    return <p className="text-sm text-gray-500">Checking protected fields...</p>;
  }

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {unlocked ? (
        <div className="inline-flex items-center gap-2 rounded-xl bg-green-50 px-3 py-2 text-sm font-medium text-green-700">
          <ShieldCheck size={16} />
          Phone and email unlocked
        </div>
      ) : (
        <form
          onSubmit={unlock}
          className="flex flex-col gap-2 rounded-2xl border border-gray-200 bg-white p-3 shadow-sm sm:flex-row sm:items-center"
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
      )}

      {canManagePassword && (
        <form
          onSubmit={changePassword}
          className="flex flex-col gap-2 rounded-2xl border border-gray-200 bg-white p-3 shadow-sm sm:flex-row sm:items-center"
        >
          <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <KeyRound size={16} className="text-[#DBA40D]" />
            Change password
          </div>
          <input
            type="password"
            value={newKey}
            onChange={(event) => setNewKey(event.target.value)}
            className="min-w-0 rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#DBA40D] focus:ring-2 focus:ring-[#DBA40D]/20"
            placeholder="New password"
            autoComplete="new-password"
          />
          <button
            type="submit"
            disabled={changingPassword || !newKey.trim()}
            className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {changingPassword ? "Saving..." : "Save"}
          </button>
          {changeError && (
            <p className="text-sm text-red-600 sm:w-full">{changeError}</p>
          )}
          {changeSuccess && (
            <p className="text-sm text-green-700 sm:w-full">{changeSuccess}</p>
          )}
        </form>
      )}
    </div>
  );
}
