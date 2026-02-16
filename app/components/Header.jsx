"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  // Search,
  // ShoppingCart,
  // UserCircle2,
  Phone,
  Menu,
} from "lucide-react";

/* 🔐 AUTH */
import AuthContextProvider from "@/contexts/AuthContext";
import AdminButton from "./AdminButton";
import HeaderClientButtons from "./HeaderClientButtons";
import LogoutButton from "./LogoutButton";

/* ================= DATA ================= */
const navLinks = [
  { label: "Home", href: "/" },
  { label: "About us", href: "/about-us" },
  { label: "Our Services", href: "/our-services" },

  {
    label: "Residential",
    href: "/residential",
    hasDropdown: true,
    children: [
      {
        label: "Apartments",
        href: "/residential?type=apartment",
      },
      {
        label: "Builder Floor",
        href: "/residential?type=builder-floor",
      },
    ],
  },

  {
    label: "Commercial",
    href: "/commercial",
    hasDropdown: true,
    children: [
      {
        label: "Retail",
        href: "/commercial?type=retail-shops",
      },
      {
        label: "SCO",
        href: "/commercial?type=sco-plots",
      },
    ],
  },

  { label: "Blog", href: "/blog" },
  // { label: "Contact", href: "/contact-us" },
];


export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  /* BODY SCROLL LOCK */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [menuOpen]);

  return (
    <header className="fixed  top-0 z-50 bg-white w-full">
      <nav className="mx-auto flex items-center justify-between px-4 sm:px-6 py-3 min-[800px]:h-[102px] h-[70px] max-w-[1212px]">
       
        {/* LOGO */}
        <Link href="/" className="flex items-center">
          <Image
            src="/images/neevlogo.png"
            alt="Neev Realty"
            width={80}
            height={80}
            priority
          />
        </Link>

        {/* ================= DESKTOP MENU ================= */}
        <ul className="hidden min-[800px]:flex items-center gap-8 text-sm">
          {navLinks.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));

            return (
              <li key={item.label} className="relative group">
                <Link
                  href={item.href}
                  className={`flex items-center gap-1 pb-2 transition-all
                    ${isActive
                      ? "text-[#DBA40D] border-b-2 border-[#DBA40D]"
                      : "text-gray-700 hover:text-[#DBA40D]"
                    }`}
                >
                  {item.label}
                  {item.hasDropdown && <span className="text-xs">▾</span>}
                </Link>

                {item.children && (
                  <ul className="absolute left-0 top-full mt-3 min-w-[220px] bg-white rounded-lg border shadow opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    {item.children.map((child) => (
                      <li key={child.label}>
                        <Link
                          href={child.href}
                          className={`block px-4 py-3 text-sm transition
                            ${pathname === child.href
                              ? "text-[#DBA40D] bg-[#DBA40D]/10"
                              : "hover:bg-gray-50"
                            }`}
                        >
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>

        {/* ================= RIGHT ACTIONS (DESKTOP) ================= */}
        <div className="hidden min-[800px]:flex items-center gap-2">

          <AuthContextProvider>
            <AdminButton />
          </AuthContextProvider>

          {/* <Link href="/search">
            <button className="h-9 w-9 flex items-center justify-center rounded-full hover:bg-gray-100">
              <Search size={16} />
            </button>
          </Link> */}

          {/* <AuthContextProvider>
            <HeaderClientButtons />
          </AuthContextProvider> */}

          {/* <Link href="/account">
            <button className="h-9 w-9 flex items-center justify-center rounded-full hover:bg-gray-100">
              <UserCircle2 size={16} />
            </button>
          </Link> */}

          <AuthContextProvider>
            <LogoutButton />
          </AuthContextProvider>

          <div className="ml-3 text-sm rounded-full bg-[#F5F5F5] px-4 py-1.5 font-medium text-[#DBA40D]">
            <a href="tel:+918824966966">+91 8824966966</a>
          </div>
        </div>

        {/* ================= MOBILE ================= */}
        <div className="flex items-center gap-4 min-[800px]:hidden">
          <a href="tel:+918824966966">
            <Phone size={20} />
          </a>

          <button onClick={() => setMenuOpen(true)}>
            <Menu size={26} />
          </button>
        </div>
      </nav>

      {/* ================= MOBILE MENU ================= */}
      {menuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/30 z-40"
            onClick={() => setMenuOpen(false)}
          />

          <div className="fixed top-[102px] left-0 right-0 z-50 bg-white shadow-md min-[800px]:hidden">
            <ul className="flex flex-col px-6 py-4 gap-4 text-sm">
              {navLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className={`font-medium ${pathname.startsWith(item.href)
                        ? "text-[#DBA40D]"
                        : "text-gray-800"
                      }`}
                  >
                    {item.label}
                  </Link>

                  {item.children && (
                    <ul className="ml-4 mt-2 space-y-2">
                      {item.children.map((child) => (
                        <li key={child.label}>
                          <Link
                            href={child.href}
                            onClick={() => setMenuOpen(false)}
                            className={
                              pathname === child.href
                                ? "text-[#DBA40D]"
                                : "text-gray-600"
                            }
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}

              <li className="pt-4 border-t text-[#DBA40D] font-medium">
                <a href="tel:+918824966966">+91 8824966966</a>
              </li>
            </ul>
          </div>
        </>
      )}
    </header>
  );
}