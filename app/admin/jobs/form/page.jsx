"use client";

import { useEffect, useState } from "react";
import { Button } from "@nextui-org/react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import {
  createJob,
  updateJob,
} from "@/lib/firestore/jobs/write";
import { getJobById } from "@/lib/firestore/jobs/read";

export default function JobForm() {
  const [data, setData] = useState({
    title: "",
    location: "",
    type: "Full Time",
    experience: "",
    description: "",
    isActive: true,
  });

  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  useEffect(() => {
    if (!id) return;
    getJobById({ id }).then(res => res && setData(res));
  }, [id]);

  const submit = async () => {
    if (!data.title) return toast.error("Title required");

    try {
      id
        ? await updateJob({ data: { ...data, id } })
        : await createJob({ data });

      toast.success(id ? "Job updated" : "Job created");
      router.push("/admin/jobs");
    } catch (e) {
      toast.error(e.message);
    }
  };

  return (
    <div className="p-6 max-w-xl">
      <h1 className="text-lg font-semibold mb-4">
        {id ? "Update Job" : "Create Job"}
      </h1>

      <input
        placeholder="Job Title"
        value={data.title}
        onChange={e => setData({ ...data, title: e.target.value })}
        className="border p-2 w-full mb-3"
      />

      <input
        placeholder="Location"
        value={data.location}
        onChange={e => setData({ ...data, location: e.target.value })}
        className="border p-2 w-full mb-3"
      />

      <select
        value={data.type}
        onChange={e => setData({ ...data, type: e.target.value })}
        className="border p-2 w-full mb-3"
      >
        <option>Full Time</option>
        <option>Part Time</option>
        <option>Internship</option>
        <option>Contract</option>
      </select>

      <input
        placeholder="Experience (e.g. 2+ Years)"
        value={data.experience}
        onChange={e => setData({ ...data, experience: e.target.value })}
        className="border p-2 w-full mb-3"
      />

      <textarea
        rows={4}
        placeholder="Job Description"
        value={data.description}
        onChange={e => setData({ ...data, description: e.target.value })}
        className="border p-2 w-full mb-3"
      />

      <Button className="bg-[#DBA40D] mt-4" onClick={submit}>
        {id ? "Update Job" : "Create Job"}
      </Button>
    </div>
  );
}
