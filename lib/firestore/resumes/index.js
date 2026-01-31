"use client";

import { useState, useEffect } from "react";
import { getResumes } from "./read";

export function useResumes() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log("🔄 Client calling getResumes...");
    getResumes()
      .then(({ data: serverData, error: serverError }) => {
        console.log("📥 Client received:", serverData?.length || 0, "resumes");
        setIsLoading(false);
        if (serverError) {
          setError(serverError);
        } else {
          setData(serverData || []);
        }
      })
      .catch((err) => {
        console.error("💥 Client error:", err);
        setError(err.message);
        setIsLoading(false);
      });
  }, []);

  return { data, error, isLoading };
}
    