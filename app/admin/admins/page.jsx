"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Form from "./components/Form";
import ListView from "./components/ListView";

const ADMIN_SECTION_EMAILS = [
  "vivek.malik@neevrealty.com",
  "shubhamsamchaudhary143@gmail.com",
];

export default function Page() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const canViewAdminsSection = ADMIN_SECTION_EMAILS.includes(
    user?.email?.toLowerCase()
  );

  useEffect(() => {
    if (!isLoading && !canViewAdminsSection) {
      router.replace("/admin");
    }
  }, [isLoading, canViewAdminsSection, router]);

  if (isLoading || !canViewAdminsSection) {
    return null;
  }

  return (
    <main className="p-5 flex flex-col md:flex-row gap-5">
      <Form />
      <ListView />
    </main>
  );
}
