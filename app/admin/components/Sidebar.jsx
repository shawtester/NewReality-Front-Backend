"use client";

import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import {
  Cat,
  Layers2,
  LayoutDashboard,
  LibraryBig,
  LogOut,
  PackageOpen,
  ShieldCheck,
  ShoppingCart,
  Star,
  User,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import toast from "react-hot-toast";

export default function Sidebar() {
  const menuList = [
    {
      name: "Dashboard",
      link: "/admin",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      name: "Properties",
      link: "/admin/properties",
      icon: <PackageOpen className="h-5 w-5" />,
    },
    {
      name: "Property Types",
      link: "/admin/propertiestypes",
      icon: <Layers2 className="h-5 w-5" />,
    },
    {
      name: "Locations",
      link: "/admin/locations",
      icon: <Cat className="h-5 w-5" />,
    },
    {
      name: "Enquiries",
      link: "/admin/enquiries",
      icon: <ShoppingCart className="h-5 w-5" />,
    },
    {
      name: "Clients",
      link: "/admin/clients",
      icon: <User className="h-5 w-5" />,
    },
    {
      name: "Testimonials",
      link: "/admin/testimonials",
      icon: <Star className="h-5 w-5" />,
    },
    {
      name: "Projects / Gallery",
      link: "/admin/projects",
      icon: <LibraryBig className="h-5 w-5" />,
    },
    {
      name: "Admins",
      link: "/admin/admins",
      icon: <ShieldCheck className="h-5 w-5" />,
    },
  ];

  return (
    <section className="sticky top-0 flex flex-col gap-10 bg-white border-r px-5 py-3 h-screen overflow-hidden w-[260px] z-50">
      <div className="flex justify-center py-4">
        <Link href="/">
          <img className="h-8" src="/logo.png" alt="Logo" />
        </Link>
      </div>

      <ul className="flex-1 overflow-y-auto flex flex-col gap-3">
        {menuList.map((item, index) => (
          <Tab key={index} item={item} />
        ))}
      </ul>

      <button
        onClick={async () => {
          try {
            await toast.promise(signOut(auth), {
              loading: "Logging out...",
              success: "Logged out successfully",
              error: (e) => e?.message,
            });
          } catch (err) {
            toast.error(err?.message);
          }
        }}
        className="flex gap-2 items-center px-3 py-2 hover:bg-indigo-100 rounded-xl w-full justify-center transition"
      >
        <LogOut className="h-5 w-5" />
        Logout
      </button>
    </section>
  );
}

function Tab({ item }) {
  const pathname = usePathname();

  // ✅ FIX: nested routes support
  const isSelected =
    pathname === item.link || pathname.startsWith(item.link + "/");

  return (
    <Link href={item.link}>
      <li
        className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all duration-300
        ${
          isSelected
            ? "bg-indigo-500 text-white"
            : "text-gray-700 hover:bg-gray-100"
        }`}
      >
        {item.icon}
        {item.name}
      </li>
    </Link>
  );
}
