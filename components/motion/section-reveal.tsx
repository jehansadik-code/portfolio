"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { sectionReveal } from "@/components/motion/presets";

export function SectionReveal({ children, className, id }: { children: ReactNode; className?: string; id?: string }) {
  const reduced = useReducedMotion();
  return <motion.section id={id} className={className} initial={reduced ? false : "hidden"} whileInView="visible" viewport={{ once: true, amount: .16 }} variants={reduced ? undefined : sectionReveal}>{children}</motion.section>;
}
