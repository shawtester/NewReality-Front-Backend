"use client";

import { useEffect, useState } from "react";
import GetInTouchModal from "./GetInTouchModal";

export default function AutoPopup({ propertyTitle, notifyTimerDone }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setOpen(true);
      if (notifyTimerDone) notifyTimerDone();
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <GetInTouchModal
      open={open}
      onClose={() => setOpen(false)}
      propertyTitle={propertyTitle}
    />
  );
}
