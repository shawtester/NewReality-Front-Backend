"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function BrochureLeadsPage() {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);

    async function loadLeads() {
        try {
            const q = query(
                collection(db, "brochureLeads"),
                orderBy("createdAt", "desc")
            );

            const snapshot = await getDocs(q);

            const data = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            setLeads(data);
        } catch (err) {
            console.error(err);
        }

        setLoading(false);
    }

    async function handleDelete(id) {
        const confirmDelete = confirm("Delete this lead?");
        if (!confirmDelete) return;

        try {
            await deleteDoc(doc(db, "brochureLeads", id));
            setLeads((prev) => prev.filter((l) => l.id !== id));
        } catch (err) {
            console.error(err);
            alert("Delete failed");
        }
    }


    useEffect(() => {
        loadLeads();
    }, []);

    if (loading) return <p className="p-6">Loading leads...</p>;

    return (
        <div className="p-6">
            <h1 className="text-xl font-semibold mb-4">
                Brochure Leads
            </h1>

            <div className="overflow-auto bg-white shadow rounded-lg">
                <table className="w-full text-sm">
                    <thead className="bg-gray-100 text-left">
                        <tr>
                            <th className="p-3">Name</th>
                            <th className="p-3">Email</th>
                            <th className="p-3">Phone</th>
                            <th className="p-3">Property</th>
                            <th className="p-3">Date</th>
                            <th className="p-3">Action</th>

                        </tr>
                    </thead>

                    <tbody>
                        {leads.map((lead) => (
                            <tr key={lead.id} className="border-t">
                                <td className="p-3">{lead.name}</td>
                                <td className="p-3">{lead.email}</td>
                                <td className="p-3">{lead.phone}</td>
                                <td className="p-3">{lead.propertyTitle}</td>
                                <td className="p-3">
                                    {lead.createdAt?.toDate
                                        ? lead.createdAt.toDate().toLocaleString()
                                        : "-"}
                                </td>
                                <td className="p-3">
                                    <button
                                        onClick={() => handleDelete(lead.id)}
                                        className="px-3 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
                                    >
                                        Delete
                                    </button>
                                </td>

                            </tr>
                        ))}
                    </tbody>
                </table>

                {leads.length === 0 && (
                    <p className="p-4 text-gray-500">No leads yet.</p>
                )}
            </div>
        </div>
    );
}
