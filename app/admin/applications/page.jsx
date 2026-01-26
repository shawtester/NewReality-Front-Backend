"use client";

import { useEffect, useState } from "react";
import { getDocs, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function Applications() {
  const [apps, setApps] = useState([]);

  useEffect(() => {
    getDocs(collection(db, "job_applications")).then((snap) =>
      setApps(snap.docs.map(d => d.data()))
    );
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Job Applications</h1>

      {apps.map(app => (
        <div key={app.id} className="border p-4 mb-3 rounded">
          <h3>{app.name}</h3>
          <p>{app.email} • {app.phone}</p>
          <a href={app.resumeUrl} target="_blank">View Resume</a>
        </div>
      ))}
    </div>
  );
}
