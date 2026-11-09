"use client";

import { useEffect, useState } from "react";

export function useVisualQuality() {
  const [quality, setQuality] = useState<"high" | "low">("high");
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const compact = window.matchMedia("(max-width: 720px)");
    const deviceMemory = "deviceMemory" in navigator ? Number((navigator as Navigator & { deviceMemory?: number }).deviceMemory) : 8;
    const refresh = () => setQuality(reduce.matches || compact.matches || deviceMemory <= 4 || navigator.hardwareConcurrency <= 4 ? "low" : "high");
    refresh(); reduce.addEventListener("change", refresh); compact.addEventListener("change", refresh);
    return () => { reduce.removeEventListener("change", refresh); compact.removeEventListener("change", refresh); };
  }, []);
  return quality;
}
