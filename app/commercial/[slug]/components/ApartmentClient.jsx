"use client";

import Header from "@/app/components/Header";

export default function ApartmentClient({ children }) {
  return (
    <>
      {/* NAVBAR */}
      <Header />

      {/* PAGE CONTENT */}
      <div className="pt-[1px]">
        {children}
      </div>
    </>
  );
}
