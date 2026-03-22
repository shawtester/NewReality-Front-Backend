"use client";

import { useState, useEffect } from "react";
import Career from "./components/section1";
import LifeAtNeev from "./components/section2";
import WhatWeOffer from "./components/section3";
import { getJobs } from "@/lib/firestore/jobs/read";

export default function CareerWrapper() {
  const [showResumePopup, setShowResumePopup] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState("");
  const [jobs, setJobs] = useState([]); // ✅ FIX

  useEffect(() => {
    getJobs().then(setJobs); // ✅ FIX
  }, []);

  return (
    <>
      <Career
        openResume={(position) => {
          setSelectedPosition(position);
          setShowResumePopup(true);
        }}
      />

      <LifeAtNeev />

      <WhatWeOffer
        showResumePopup={showResumePopup}
        setShowResumePopup={setShowResumePopup}
        selectedPosition={selectedPosition}
        jobs={jobs} // ✅ NOW WORKS
      />
    </>
  );
}