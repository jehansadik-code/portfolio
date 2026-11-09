"use client";

import { ArrowUpRight, X } from "lucide-react";
import { type ElementType, type HTMLAttributes, type ReactNode, useEffect, useRef } from "react";
import { motion } from "motion/react";
import type { PortfolioProject } from "@/lib/portfolio-data";
import { HeroWebGL } from "@/components/hero-webgl";

type GlassSurfaceProps = { children: ReactNode; className?: string; as?: ElementType } & HTMLAttributes<HTMLElement>;

export function GlassSurface({ children, className = "", as: Tag = "div", ...props }: GlassSurfaceProps) {
  const sceneAnchor = className.includes("float-one");
  return <Tag className={`liquid-surface ${className}`.trim()} {...props}>{sceneAnchor && <HeroWebGL />}{children}<span className="surface-reflection" aria-hidden="true" /></Tag>;
}

export function MagneticButton({ children, className = "", onClick, type = "button" }: { children: ReactNode; className?: string; onClick?: () => void; type?: "button" | "submit" }) {
  const button = useRef<HTMLButtonElement>(null);
  function move(event: React.PointerEvent<HTMLButtonElement>) {
    if (event.pointerType === "touch" || !button.current) return;
    const bounds = button.current.getBoundingClientRect();
    button.current.style.setProperty("--magnet-x", `${((event.clientX - bounds.left) / bounds.width - .5) * 7}px`);
    button.current.style.setProperty("--magnet-y", `${((event.clientY - bounds.top) / bounds.height - .5) * 7}px`);
  }
  function reset() { button.current?.style.setProperty("--magnet-x", "0px"); button.current?.style.setProperty("--magnet-y", "0px"); }
  return <button ref={button} type={type} onClick={onClick} onPointerMove={move} onPointerLeave={reset} className={`magnetic-button ${className}`.trim()}>{children}</button>;
}

export function ProjectDetailDialog({ project, onClose }: { project: PortfolioProject | null; onClose: () => void }) {
  useEffect(() => {
    if (!project) return;
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [project, onClose]);
  if (!project) return null;
  return <motion.div className="project-dialog-backdrop" role="presentation" onMouseDown={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: .22 }}>
    <GlassSurface as="section" className="project-dialog" role="dialog" aria-modal="true" aria-labelledby="project-dialog-title" onMouseDown={(event: React.MouseEvent) => event.stopPropagation()}>
      <button className="dialog-close" type="button" onClick={onClose} aria-label="Close project details" autoFocus><X size={18} /></button>
      <p className="section-kicker">Selected project</p><h2 id="project-dialog-title">{project.title}</h2><p className="dialog-subtitle">{project.subtitle}</p><p className="dialog-copy">{project.copy}</p>
      <div className="dialog-tags">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
      {project.linkUrl && <a className="dialog-link" href={project.linkUrl} target="_blank" rel="noreferrer">Open project <ArrowUpRight size={17} /></a>}
    </GlassSurface>
  </motion.div>;
}
