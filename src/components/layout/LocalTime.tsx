"use client";

import { useEffect, useState } from "react";

/** Faouzi's local clock (Africa/Casablanca), client-only to avoid hydration drift. */
export function LocalTime() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const tick = () =>
      setTime(
        new Intl.DateTimeFormat("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "Africa/Casablanca",
        }).format(new Date()),
      );
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  return <span suppressHydrationWarning>{time ?? "--:--"} GMT+1</span>;
}
