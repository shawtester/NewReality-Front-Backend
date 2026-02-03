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
      name: "Developers",
      link: "/admin/developers",
      icon: <User className="h-5 w-5" />,
    },
    {
      name: "Hero Section",
      link: "/admin/hero",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      name: "Blogs",
      link: "/admin/blog",
      icon: <LibraryBig className="h-5 w-5" />,
    },
    
    
    {
      name: "Jobs",
      link: "/admin/jobs",
      icon: <Star className="h-5 w-5" />,
    },
    {
      name: "Brouchure Leads",
      link: "/admin/brochure-leads",
      icon: <Star className="h-5 w-5" />,
    },
    {
      name: "Contact",
      link: "/admin/contact",
      icon: <Star className="h-5 w-5" />,
    },
    {
      name: "Contact FAQs",
      link: "/admin/contactFaqs",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      name: "Resume Details",
      link: "/admin/resume",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      name: "Slug Editor",
      link: "/admin/footer",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      name: "Testimonials",
      link: "/admin/testimonials",
      icon: <Star className="h-5 w-5" />,
    },
    {
      name: "Builders Manager",
      link: "/admin/builders",
      icon: <LibraryBig className="h-5 w-5" />,
    },
    {
      name: "Amenities Manager",
      link: "/admin/amenities",
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
          <img className="h-20" src="/images/neevlogo.png" alt="Logo" />
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
        ${isSelected
            ? "bg-[#DBA40D] text-white"
            : "text-gray-700 hover:bg-gray-100"
          }`}
      >
        {item.icon}
        {item.name}
      </li>
    </Link>
  );
}
