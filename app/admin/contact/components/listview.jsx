"use client";

import { useContacts } from "@/lib/firestore/contacts/read";
import { CircularProgress } from "@nextui-org/react";

export default function ContactListView() {
  const { data: contacts, error, isLoading } = useContacts();

  if (isLoading) return <div className="flex justify-center py-10"><CircularProgress /></div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="flex-1 flex flex-col gap-3 px-5 rounded-xl">
      <table className="border-separate border-spacing-y-3 w-full">
        <thead>
          <tr>
            <th className="font-semibold border-y bg-white px-3 py-2 border-l rounded-l-lg">SN</th>
            <th className="font-semibold border-y bg-white px-3 py-2 text-left">Name</th>
            <th className="font-semibold border-y bg-white px-3 py-2 text-left">Email</th>
            <th className="font-semibold border-y bg-white px-3 py-2 text-left">Phone</th>
            <th className="font-semibold border-y bg-white px-3 py-2 text-left">Message</th>
            <th className="font-semibold border-y bg-white px-3 py-2 text-left rounded-r-lg">Source</th>
          </tr>
        </thead>
        <tbody>
          {contacts?.map((item, index) => (
            <tr key={item.id}>
              <td className="border-y bg-white px-3 py-2 border-l rounded-l-lg text-center">{index + 1}</td>
              <td className="border-y bg-white px-3 py-2">{item?.name}</td>
              <td className="border-y bg-white px-3 py-2">{item?.email}</td>
              <td className="border-y bg-white px-3 py-2">{item?.phone}</td>
              <td className="border-y bg-white px-3 py-2">{item?.message}</td>
              <td className="border-y bg-white px-3 py-2 rounded-r-lg">{item?.source || "contact"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
