"use client";

import { useEffect, useState } from "react";
import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { getAdminJobs } from "@/lib/firestore/jobs/read";
import { deleteJob } from "@/lib/firestore/jobs/write";

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState([]);
  const router = useRouter();

  const fetchJobs = async () => {
    const res = await getAdminJobs();
    setJobs(res);
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const remove = async (id) => {
    if (!confirm("Delete this job?")) return;
    await deleteJob({ id });
    toast.success("Job deleted");
    fetchJobs();
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Jobs</h1>
        <Button className="bg-[#DBA40D]" onClick={() => router.push("/admin/jobs/form")}>
          Add Job
        </Button>
      </div>

      <table className="w-full border-separate border-spacing-y-2">
        <thead>
          <tr>
            <th className="text-left">Title</th>
            <th>Location</th>
            <th>Type</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map(job => (
            <tr key={job.id} className="bg-white">
              <td className="p-3">{job.title}</td>
              <td className="p-3">{job.location}</td>
              <td className="p-3">{job.type}</td>
              <td className="p-3 flex gap-2">
                <Button
                  className="bg-[#DBA40D]"
                  size="sm"
                  onClick={() =>
                    router.push(`/admin/jobs/form?id=${job.id}`)
                  }
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  color="danger"
                  onClick={() => remove(job.id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
