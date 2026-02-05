"use client";

import { useState, useMemo } from "react";
import { useContacts } from "@/lib/firestore/contacts/read";
import { deleteContact } from "@/lib/firestore/contacts/write"; // ✅ ADD THIS
import { CircularProgress, Button } from "@nextui-org/react";
import { Trash2 } from "lucide-react";

/* ================= DATE FORMATTER ================= */
const formatDateTime = (timestamp) => {
  if (!timestamp) return "-";
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return date.toLocaleString();
};

export default function ContactListView() {
  const { data: contacts, error, isLoading } = useContacts();
  const [openRow, setOpenRow] = useState(null);

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    const confirmDelete = confirm("Delete this contact?");
    if (!confirmDelete) return;

    try {
      await deleteContact(id);
      alert("Contact deleted");
    } catch (err) {
      alert(err.message || "Delete failed");
    }
  };

  // ✅ SORT RECENT FIRST
  const sortedContacts = useMemo(() => {
    if (!contacts) return [];
    return [...contacts].sort((a, b) => {
      const aTime = a?.createdAt?.seconds || 0;
      const bTime = b?.createdAt?.seconds || 0;
      return bTime - aTime;
    });
  }, [contacts]);

  if (isLoading)
    return (
      <div className="flex justify-center py-10">
        <CircularProgress />
      </div>
    );

  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="flex-1 px-5">
      <table className="w-full border-separate border-spacing-y-3">
        <thead>
          <tr>
            <th className="bg-white px-3 py-2 rounded-l-lg text-center">SN</th>
            <th className="bg-white px-3 py-2 text-left">Name</th>
            <th className="bg-white px-3 py-2 text-left">Phone</th>
            <th className="bg-white px-3 py-2 text-left">Property</th>
            <th className="bg-white px-3 py-2 text-left">Source</th>
            <th className="bg-white px-3 py-2 rounded-r-lg text-center">Action</th>
          </tr>
        </thead>

        <tbody>
          {sortedContacts.map((item, index) => {
            const isOpen = openRow === item.id;

            return (
              <>
                {/* ================= MAIN ROW ================= */}
                <tr
                  key={item.id}
                  onClick={() => setOpenRow(isOpen ? null : item.id)}
                  className="cursor-pointer hover:bg-gray-50"
                >
                  <td className="bg-white px-3 py-2 rounded-l-lg text-center">
                    {index + 1}
                  </td>

                  <td className="bg-white px-3 py-2">
                    {item?.name ||
                      `${item?.firstName || ""} ${item?.lastName || ""}`}
                  </td>

                  <td className="bg-white px-3 py-2">
                    {item?.phone || "-"}
                  </td>

                  <td className="bg-white px-3 py-2">
                    {item?.propertyTitle || "-"}
                  </td>

                  <td className="bg-white px-3 py-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs text-white ${
                        item?.source === "property"
                          ? "bg-yellow-500"
                          : item?.source === "contact-page"
                          ? "bg-blue-500"
                          : item?.source === "get-in-touch-modal"
                          ? "bg-green-500"
                          : item?.source === "EMI Calculator Popup"
                          ? "bg-orange-500"
                          : "bg-gray-400"
                      }`}
                    >
                      {item?.source || "contact"}
                    </span>
                  </td>

                  {/* ✅ ACTION DELETE BUTTON */}
                  <td
                    className="bg-white px-3 py-2 rounded-r-lg text-center"
                    onClick={(e) => e.stopPropagation()} // 🔥 row open prevent
                  >
                    <Button
                      isIconOnly
                      size="sm"
                      className="bg-red-500 text-white"
                      onClick={() => handleDelete(item.id)}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </td>
                </tr>

                {/* ================= EXPANDED DETAILS ================= */}
                {isOpen && (
                  <tr>
                    <td colSpan={6} className="bg-gray-50 px-6 py-4 rounded-lg">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div><b>Email:</b> {item?.email || "-"}</div>
                        <div><b>Phone:</b> {item?.phone || "-"}</div>
                        <div><b>Type:</b> {item?.type || "-"}</div>
                        <div>
                          <b>Date & Time:</b>{" "}
                          {formatDateTime(item?.createdAt)}
                        </div>
                        <div className="col-span-2">
                          <b>Message:</b> {item?.message || "-"}
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
