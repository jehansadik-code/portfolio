import type { Variants } from "motion/react";

export const sectionReveal: Variants = {
  hidden: { opacity: 0, y: 34, filter: "blur(8px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.72, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
};
