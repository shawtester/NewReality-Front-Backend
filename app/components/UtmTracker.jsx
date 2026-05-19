"use client";

import { useEffect } from "react";

export default function UtmTracker() {
  useEffect(() => {
    try {
      if (typeof window === "undefined") return;

      const params = new URLSearchParams(window.location.search);
      const utmKeys = [
        "utm_source",
        "utm_medium",
        "utm_campaign",
        "utm_term",
        "utm_content",
        "gclid",
        "fbclid"
      ];

      // Retrieve existing UTM data from sessionStorage to keep prior tags if not updated
      let currentUtm = {};
      try {
        const stored = window.sessionStorage.getItem("neev_utm");
        if (stored) {
          currentUtm = JSON.parse(stored);
        }
      } catch (err) {
        console.error("Error reading existing UTM storage:", err);
      }

      // Check if there are any new UTM tags in the URL
      let updated = false;
      utmKeys.forEach((key) => {
        const value = params.get(key);
        if (value) {
          currentUtm[key] = value;
          updated = true;
        }
      });

      // Save if we updated the UTM dictionary
      if (updated) {
        window.sessionStorage.setItem("neev_utm", JSON.stringify(currentUtm));
        console.log("[UtmTracker] Captured UTM parameters:", currentUtm);
      }
    } catch (e) {
      console.error("[UtmTracker] Capture error:", e);
    }
  }, []);

  return null;
}
