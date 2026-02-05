"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { getJobs } from "@/lib/firestore/jobs/read";

export default function Career() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    getJobs().then(setJobs);
  }, []);

  return (
    <>
      {/* HERO */}
      <section className="w-full bg-[#F8FBFF] ">
        <div className="max-w-[1240px] mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 items-center gap-10">
          <div className="text-center lg:text-left">
            <h1 className="text-4xl font-bold">
              Reshape the{" "}
              <span className="text-[#DBA40D]">Real Estate</span>{" "}
              Industry With Us
            </h1>

            <button
              onClick={() =>
                document.getElementById("jobs").scrollIntoView({ behavior: "smooth" })
              }
              className="mt-8 rounded-lg bg-[#DBA40D] px-8 py-3 text-white"
            >
              View Open Positions
            </button>
          </div>

          <div className="flex justify-center lg:justify-end">
            <Image
              src="/images/career/img1.png"
              alt="Careers"
              width={394}
              height={423}
              priority
            />
          </div>
        </div>
      </section>

      {/* JOB LIST */}
      <section id="jobs" className="max-w-[1240px] mx-auto px-4 py-16">
        <h2 className="text-3xl font-semibold mb-8 text-center">
          Open Positions
        </h2>

        {jobs.length === 0 && (
          <p className="text-center text-gray-500">
            No openings right now
          </p>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {jobs.map(job => (
            <div key={job.id} className="border rounded-lg p-5">
              <h3 className="text-xl font-semibold">{job.title}</h3>
              <p className="text-sm text-gray-600">
                {job.location} • {job.type}
              </p>
              <p className="text-sm mt-2">
                Experience: {job.experience}
              </p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
