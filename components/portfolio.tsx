"use client";

import {
  ArrowRight, Atom, Award, BookOpen, BriefcaseBusiness, ChevronRight, Code2,
  Cpu, ExternalLink, Github, GraduationCap, Instagram, Layers3, Linkedin,
  Mail, MapPin, Menu, MessageCircle, Send, Sparkles, Trophy, X,
} from "lucide-react";
import { useState } from "react";
import type { PortfolioData } from "@/lib/portfolio-data";

const navItems = ["About", "Education", "Experience", "Projects", "Achievements", "Contact"];
const sectionIcons = { About: MessageCircle, Education: GraduationCap, Experience: BriefcaseBusiness, Projects: Code2, Achievements: Trophy };

function SectionTitle({ title, children }: { title: keyof typeof sectionIcons; children?: React.ReactNode }) {
  const Icon = sectionIcons[title];
  return <div className="section-heading"><span className="icon-tile"><Icon size={25} strokeWidth={2.35} /></span><h2>{title}</h2><span className="heading-line" />{children}</div>;
}

function ProjectVisual({ kind }: { kind: "home" | "space" }) {
  return <div className={`project-visual ${kind}`} aria-hidden="true">
    {kind === "home" ? <><div className="roof" /><div className="house-body" /><div className="signal signal-a" /><div className="signal signal-b" /><div className="signal signal-c" /><div className="hand">☝</div></> : <><div className="planet" /><div className="star s1" /><div className="star s2" /><div className="star s3" /><div className="orbit" /></>}
  </div>;
}

export default function Portfolio({ data }: { data: PortfolioData }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const scrollTo = (id: string) => { document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); setMenuOpen(false); };

  return <main>
    <header className="nav-shell">
      <nav className="nav wrap" aria-label="Primary navigation">
        <button className="brand" onClick={() => scrollTo("home")} aria-label="Back to top"><span className="brand-mark"><Code2 size={20} /></span><span>{data.name}</span></button>
        <div className={`nav-links ${menuOpen ? "open" : ""}`}>
          <button className="active" onClick={() => scrollTo("home")}>Home</button>
          {navItems.map((item) => <button key={item} onClick={() => scrollTo(item.toLowerCase())}>{item}</button>)}
        </div>
        <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation">{menuOpen ? <X /> : <Menu />}</button>
      </nav>
    </header>

    <section className="hero" id="home">
      <div className="hero-glow glow-left" /><div className="hero-glow glow-right" />
      <div className="wrap hero-content">
        <div className="portrait-wrap"><div className="portrait"><img src="https://images.unsplash.com/photo-1615109398623-88346a601842?auto=format&fit=crop&w=640&q=84" alt="Portrait of Jehan Sadik" /></div><span className="portrait-orbit orbit-one" /><span className="portrait-orbit orbit-two" /></div>
        <div className="hero-copy">
          <p className="eyebrow"><Sparkles size={15} /> Welcome to my portfolio</p>
          <h1>{data.name}</h1><span className="accent-line" />
          <h2>{data.role}</h2><p className="hero-role">Full-stack developer <i /> AI & computer vision <i /> Blockchain & IoT</p>
          <p className="hero-bio">{data.bio}</p>
          <div className="hero-actions"><button className="button button-primary" onClick={() => scrollTo("projects")}><Code2 size={19} /> View projects</button><button className="button button-ghost" onClick={() => scrollTo("contact")}><Send size={18} /> Contact me</button></div>
        </div>
        <div className="hero-city" aria-hidden="true"><div className="monument"><span /><span /><span /><span /><span /></div><div className="city-label">DHAKA · BANGLADESH</div></div>
      </div>
      <div className="wrap expertise-row">{data.skills.map((skill, index) => <div className="expertise" key={skill}>{index === 0 ? <Code2 /> : index === 1 ? <Cpu /> : index === 2 ? <Layers3 /> : index === 3 ? <Atom /> : <Sparkles />}<span>{skill}</span></div>)}</div>
    </section>

    <div className="wrap content">
      <section id="about" className="about-card"><div className="about-title"><span className="icon-tile"><MessageCircle /></span><h2>About me</h2></div><p>A computer science undergraduate who enjoys building impactful solutions that combine <b>software, intelligence, and real-world usability.</b> I’m especially interested in full-stack web development, AI, computer vision, blockchain, IoT, and research.</p></section>

      <div className="split-grid" id="education">
        <section><SectionTitle title="Education" /><div className="timeline-card">{data.education.map(([degree, school, date]) => <div className="timeline-item" key={degree}><span className="timeline-dot" /><div className="timeline-content"><div className="small-icon"><BookOpen size={22} /></div><div><h3>{degree}</h3><p>{school}</p><em>{date}</em></div></div></div>)}</div></section>
        <section id="experience"><SectionTitle title="Experience" /><div className="timeline-card experience-card">{data.experience.map(([role, company, date, detail]) => <div className="timeline-item" key={role}><span className="timeline-dot" /><div className="timeline-content"><div className="small-icon"><BriefcaseBusiness size={22} /></div><div><h3>{role}</h3><p>{company}</p><em>{date}</em><small>{detail}</small></div></div></div>)}</div></section>
      </div>

      <section id="projects" className="projects-section"><SectionTitle title="Projects"><button className="text-link">See all projects <ArrowRight size={16} /></button></SectionTitle><div className="projects-grid">{data.projects.map((project) => <article className="project-card" key={project.title}><ProjectVisual kind={project.kind} /><div className="project-copy"><div className="project-heading"><h3>{project.title}</h3><span>{project.subtitle}</span></div><p>{project.copy}</p><div className="tags">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div></div><a href="#contact" aria-label={`Ask about ${project.title}`}><ExternalLink size={17} /></a></article>)}</div></section>

      <div className="split-grid skills-grid"><section><div className="panel"><SectionTitle title="Achievements" /><ul className="achievement-list"><li>Former CEO of Aurelius E-sports.</li><li>Assistant Secretary in Technology, Notre Dame University Computer Club.</li><li>NASA Space Apps Challenge participant with ExoSky.</li><li>Strong academic performance with GPA 5.00 in SSC and HSC.</li></ul></div></section><section><div className="panel"><div className="section-heading"><span className="icon-tile"><Award size={25} /></span><h2>Technical skills</h2><span className="heading-line" /></div><div className="skill-list">{data.tools.map((skill, i) => <div key={skill}><span>{["▥", "⌘", "⚛", "◇"][i]}</span>{skill}</div>)}</div></div></section></div>

      <section className="cert-section"><div className="panel"><div className="section-heading"><span className="icon-tile"><Award size={25} /></span><h2>Certificates</h2><span className="heading-line" /></div><div className="cert-list"><div className="cert-logo nasa">NASA</div><div><h3>NASA Space Apps Challenge</h3><p>ExoSky project showcase</p></div><div className="cert-logo coursera">C</div><div><h3>Blockchain Theory and Applications II</h3><p>POSTECH / Coursera</p></div></div></div></section>

      <section id="contact" className="contact-section"><div className="contact-intro"><div className="section-heading"><span className="icon-tile"><Mail size={25} /></span><h2>Get in touch</h2></div><span className="accent-line" /><p>I’m always open to discussing new opportunities, collaborations, research, or interesting ideas. Feel free to reach out!</p></div><div className="contact-card"><a href={`mailto:${data.email}`}><Mail />{data.email}</a><span><MapPin />{data.location}</span><a href="https://linkedin.com" target="_blank" rel="noreferrer"><Linkedin />linkedin.com/in/jehan-sadik</a></div></section>
    </div>

    <footer><div className="wrap footer-content"><div className="footer-brand"><Code2 /> <b>{data.name}</b><span /> <small>Computer Science Undergraduate</small></div><div className="socials"><a href="https://linkedin.com" aria-label="LinkedIn"><Linkedin /></a><a href="https://github.com" aria-label="GitHub"><Github /></a><a href={`mailto:${data.email}`} aria-label="Email"><Mail /></a></div></div></footer>
  </main>;
}
