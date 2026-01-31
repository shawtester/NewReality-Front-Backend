"use client";

export default function Page() {
  return (
    <main className="flex flex-col gap-6 p-5">
      <h1 className="text-2xl font-semibold">
        Admin Dashboard
      </h1>

      <p className="text-gray-500">
        Welcome to the admin panel.
      </p>

      {/* 
        Orders, CountMeter, Charts etc. 
        intentionally removed to avoid build issues
      */}
    </main>
  );
}
