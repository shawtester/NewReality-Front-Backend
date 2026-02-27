import Link from "next/link";
import Header from "@/app/components/Header";

export default function NotFound() {
  return (
    <>
      <Header />

      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center px-4">
        <h1 className="text-7xl font-bold text-[#DBA40D]">404</h1>

        <h2 className="mt-4 text-2xl font-semibold text-gray-800">
          Oops! Something went wrong.
        </h2>

        <p className="mt-2 text-gray-500">
          The page you are looking for does not exist.
        </p>

        <Link
          href="/"
          className="mt-6 inline-block bg-[#DBA40D] text-white px-6 py-3 rounded-lg shadow hover:opacity-90 transition"
        >
          Back To Home
        </Link>
      </div>
    </>
  );
}