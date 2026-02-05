"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useAdmin } from "@/lib/firestore/admins/read";
import { Avatar } from "@nextui-org/react";
import { Menu } from "lucide-react";

export default function Header({ toggleSidebar }) {
  const { user } = useAuth();
  const { data: admin } = useAdmin({ email: user?.email });

  return (
    <section
      className="
        fixed top-0 
        w-full md:w-[calc(100%-260px)] 
        md:left-[260px] left-0
        h-[64px] z-50
        flex items-center gap-3 
        bg-[#DBA40D] border-b px-4
      "
    >
      {/* Mobile Menu */}
      <div className="flex justify-center items-center md:hidden">
        <button onClick={toggleSidebar}>
          <Menu />
        </button>
      </div>

      <div className="w-full flex justify-between items-center">
        <h1 className="text-xl font-semibold">Dashboard</h1>

        <div className="flex gap-2 items-center">
          <div className="md:flex flex-col items-end hidden">
            <h1 className="text-sm font-semibold">{admin?.name}</h1>
            <h1 className="text-xs text-gray-600">{admin?.email}</h1>
          </div>
          <Avatar size="sm" src={admin?.imageURL} />
        </div>
      </div>
    </section>
  );
}
