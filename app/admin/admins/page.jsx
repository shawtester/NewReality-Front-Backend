"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useAdmin } from "@/lib/firestore/admins/read";
import Form from "./components/Form";
import ListView from "./components/ListView";

export default function Page() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const { data: adminData, isLoading: adminLoading } = useAdmin({ email: user?.email });

  const isSuperAdmin = adminData?.role === "superadmin";

  useEffect(() => {
    if (!isLoading && !adminLoading && !isSuperAdmin) {
      router.replace("/admin");
    }
  }, [isLoading, adminLoading, isSuperAdmin, router]);

  if (isLoading || adminLoading || !isSuperAdmin) {
    return null;
  }

  return (
    <main className="p-5 flex flex-col md:flex-row gap-5">
      <Form />
      <ListView />
    </main>
  );
}
