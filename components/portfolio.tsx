"use client";

import {
  ArrowRight, Atom, Award, BookOpen, BriefcaseBusiness, Code2, Cpu, ExternalLink,
  Github, GraduationCap, Layers3, Linkedin, Mail, MapPin, Menu, MessageCircle,
  Send, Sparkles, Trophy, X,
} from "lucide-react";
import { Fragment, type ReactNode, useEffect, useState } from "react";
import type { LinkableItem, PortfolioData, PortfolioLinks, PortfolioProject } from "@/lib/portfolio-data";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import ContactForm from "@/components/contact-form";

const navItems = ["About", "Education", "Experience", "Projects", "Awards", "Certificates", "Contact"];
const sectionIcons = { About: MessageCircle, Education: GraduationCap, Experience: BriefcaseBusiness, Projects: Code2, Awards: Trophy };

function SectionTitle({ title, children }: { title: keyof typeof sectionIcons; children?: ReactNode }) {
  const Icon = sectionIcons[title];
  return <div className="section-heading"><span className="icon-tile"><Icon size={25} strokeWidth={2.35} /></span><h2>{title}</h2><span className="heading-line" />{children}</div>;
}

function LinkedText({ href, children }: { href: string | null; children: ReactNode }) {
  return href ? <a className="content-link" href={href} target="_blank" rel="noreferrer">{children}<ExternalLink size={13} /></a> : <>{children}</>;
}

function ProjectVisual({ kind }: { kind: "home" | "space" }) {
  return <div className={`project-visual ${kind}`} aria-hidden="true">
    {kind === "home" ? <><div className="roof" /><div className="house-body" /><div className="signal signal-a" /><div className="signal signal-b" /><div className="signal signal-c" /><div className="hand">☝</div></> : <><div className="planet" /><div className="star s1" /><div className="star s2" /><div className="star s3" /><div className="orbit" /></>}
  </div>;
}

function toLinkableItem(record: { slug: string; title: string; organization: string; date_label: string; description: string | null; link_url: string | null }): LinkableItem {
  return { slug: record.slug, title: record.title, organization: record.organization, dateLabel: record.date_label, description: record.description || undefined, linkUrl: record.link_url };
}

export default function Portfolio({ data }: { data: PortfolioData }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [projects, setProjects] = useState<PortfolioProject[]>(data.projects);
  const [education, setEducation] = useState<LinkableItem[]>(data.education);
  const [experience, setExperience] = useState<LinkableItem[]>(data.experience);
  const [certificates, setCertificates] = useState<LinkableItem[]>(data.certificates);
  const [awards, setAwards] = useState<LinkableItem[]>(data.awards);
  const [links, setLinks] = useState<PortfolioLinks>(data.links);
  const [profile, setProfile] = useState({ name: data.name, role: data.role, headline: data.headline, bio: data.bio, about: data.bio, location: data.location, email: data.email, avatar: "", skills: data.skills, tools: data.tools });
  const scrollTo = (id: string) => { document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); setMenuOpen(false); };

  useEffect(() => {
    const supabase = createBrowserSupabaseClient();
    if (!supabase) return;
    let active = true;
    void Promise.all([
      supabase.from("projects").select("title, subtitle, description, tags, visual_type, project_url").eq("published", true).order("sort_order"),
      supabase.from("education").select("slug, title, organization, date_label, description, link_url").eq("published", true).order("sort_order"),
      supabase.from("experience").select("slug, title, organization, date_label, description, link_url").eq("published", true).order("sort_order"),
      supabase.from("certificates").select("slug, title, organization, date_label, description, link_url").eq("published", true).order("sort_order"),
      supabase.from("awards").select("slug, title, organization, date_label, description, link_url").eq("published", true).order("sort_order"),
      supabase.from("portfolio_profile").select("full_name, role, headline, bio, about_text, location, email, avatar_url, skills, tools, linkedin_url, github_url, resume_url").eq("handle", "jehan-sadik").maybeSingle(),
    ]).then(([projectResponse, educationResponse, experienceResponse, certificateResponse, awardResponse, profileResponse]) => {
      if (!active) return;
      if (projectResponse.data?.length) setProjects(projectResponse.data.map((project) => ({ title: project.title, subtitle: project.subtitle, copy: project.description, tags: project.tags, kind: project.visual_type === "space" ? "space" : "home", linkUrl: project.project_url })));
      if (educationResponse.data?.length) setEducation(educationResponse.data.map(toLinkableItem));
      if (experienceResponse.data?.length) setExperience(experienceResponse.data.map(toLinkableItem));
      if (certificateResponse.data?.length) setCertificates(certificateResponse.data.map(toLinkableItem));
      if (awardResponse.data?.length) setAwards(awardResponse.data.map(toLinkableItem));
      if (profileResponse.data) { setLinks({ linkedin: profileResponse.data.linkedin_url, github: profileResponse.data.github_url, resume: profileResponse.data.resume_url }); setProfile({ name: profileResponse.data.full_name, role: profileResponse.data.role, headline: profileResponse.data.headline, bio: profileResponse.data.bio, about: profileResponse.data.about_text, location: profileResponse.data.location, email: profileResponse.data.email, avatar: profileResponse.data.avatar_url || "", skills: profileResponse.data.skills, tools: profileResponse.data.tools }); }
    });
    return () => { active = false; };
  }, []);

  return <main>
    <header className="nav-shell"><nav className="nav wrap" aria-label="Primary navigation">
      <button className="brand" onClick={() => scrollTo("home")} aria-label="Back to top"><span className="brand-mark"><Code2 size={20} /></span><span>{profile.name}</span></button>
      <div className={`nav-links ${menuOpen ? "open" : ""}`}><button className="active" onClick={() => scrollTo("home")}>Home</button>{navItems.map((item) => <button key={item} onClick={() => scrollTo(item.toLowerCase())}>{item}</button>)}</div>
      <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation">{menuOpen ? <X /> : <Menu />}</button>
    </nav></header>

    <section className="hero" id="home"><div className="hero-glow glow-left" /><div className="hero-glow glow-right" />
      <div className="wrap hero-content"><div className="portrait-wrap"><div className="portrait"><img src={profile.avatar || "https://images.unsplash.com/photo-1615109398623-88346a601842?auto=format&fit=crop&w=640&q=84"} alt={`Portrait of ${profile.name}`} /></div><span className="portrait-orbit orbit-one" /><span className="portrait-orbit orbit-two" /></div>
        <div className="hero-copy"><p className="eyebrow"><Sparkles size={15} /> Welcome to my portfolio</p><h1>{profile.name}</h1><span className="accent-line" /><h2>{profile.role}</h2><p className="hero-role">{profile.headline}</p><p className="hero-bio">{profile.bio}</p><div className="hero-actions"><button className="button button-primary" onClick={() => scrollTo("projects")}><Code2 size={19} /> View projects</button><button className="button button-ghost" onClick={() => scrollTo("contact")}><Send size={18} /> Contact me</button></div></div>
        <div className="hero-city" aria-hidden="true"><div className="monument"><span /><span /><span /><span /><span /></div><div className="city-label">DHAKA · BANGLADESH</div></div>
      </div><div className="wrap expertise-row">{profile.skills.map((skill, index) => <div className="expertise" key={skill}>{index === 0 ? <Code2 /> : index === 1 ? <Cpu /> : index === 2 ? <Layers3 /> : index === 3 ? <Atom /> : <Sparkles />}<span>{skill}</span></div>)}</div>
    </section>

    <div className="wrap content">
      <section id="about" className="about-card"><div className="about-title"><span className="icon-tile"><MessageCircle /></span><h2>About me</h2></div><p>{profile.about}</p></section>

      <div className="split-grid" id="education"><section><SectionTitle title="Education" /><div className="timeline-card">{education.map((item) => <div className="timeline-item" key={item.slug}><span className="timeline-dot" /><div className="timeline-content"><div className="small-icon"><BookOpen size={22} /></div><div><h3><LinkedText href={item.linkUrl}>{item.title}</LinkedText></h3><p><LinkedText href={item.linkUrl}>{item.organization}</LinkedText></p><em>{item.dateLabel}</em></div></div></div>)}</div></section>
        <section id="experience"><SectionTitle title="Experience" /><div className="timeline-card experience-card">{experience.map((item) => <div className="timeline-item" key={item.slug}><span className="timeline-dot" /><div className="timeline-content"><div className="small-icon"><BriefcaseBusiness size={22} /></div><div><h3><LinkedText href={item.linkUrl}>{item.title}</LinkedText></h3><p><LinkedText href={item.linkUrl}>{item.organization}</LinkedText></p><em>{item.dateLabel}</em>{item.description && <small>{item.description}</small>}</div></div></div>)}</div></section>
      </div>

      <section id="projects" className="projects-section"><SectionTitle title="Projects"><button className="text-link" onClick={() => scrollTo("contact")}>See all projects <ArrowRight size={16} /></button></SectionTitle><div className="projects-grid">{projects.map((project) => <article className="project-card" key={project.title}><ProjectVisual kind={project.kind} /><div className="project-copy"><div className="project-heading"><h3>{project.title}</h3><span>{project.subtitle}</span></div><p>{project.copy}</p><div className="tags">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div></div><a href={project.linkUrl || "#contact"} target={project.linkUrl ? "_blank" : undefined} rel={project.linkUrl ? "noreferrer" : undefined} aria-label={project.linkUrl ? `Open ${project.title}` : `Ask about ${project.title}`}><ExternalLink size={17} /></a></article>)}</div></section>

      <div className="split-grid skills-grid"><section id="awards"><div className="panel"><SectionTitle title="Awards" /><ul className="achievement-list">{awards.map((award) => <li key={award.slug}><LinkedText href={award.linkUrl}>{award.title}</LinkedText></li>)}</ul></div></section><section><div className="panel"><div className="section-heading"><span className="icon-tile"><Award size={25} /></span><h2>Technical skills</h2><span className="heading-line" /></div><div className="skill-list">{profile.tools.map((skill, i) => <div key={skill}><span>{["▥", "⌘", "⚛", "◇"][i]}</span>{skill}</div>)}</div></div></section></div>

      <section id="certificates" className="cert-section"><div className="panel"><div className="section-heading"><span className="icon-tile"><Award size={25} /></span><h2>Certificates</h2><span className="heading-line" /></div><div className="cert-list">{certificates.map((certificate, index) => <Fragment key={certificate.slug}><div className={`cert-logo ${index === 0 ? "nasa" : "coursera"}`}>{index === 0 ? "NASA" : "C"}</div><div><h3><LinkedText href={certificate.linkUrl}>{certificate.title}</LinkedText></h3><p>{certificate.organization}</p></div></Fragment>)}</div></div></section>

      <section id="contact" className="contact-section"><div className="contact-intro"><div className="section-heading"><span className="icon-tile"><Mail size={25} /></span><h2>Get in touch</h2></div><span className="accent-line" /><p>I’m always open to discussing new opportunities, collaborations, research, or interesting ideas. Feel free to reach out!</p></div><div className="contact-card"><a href={`mailto:${profile.email}`}><Mail />{profile.email}</a><span><MapPin />{profile.location}</span>{links.linkedin && <a href={links.linkedin} target="_blank" rel="noreferrer"><Linkedin />LinkedIn profile</a>}{links.github && <a href={links.github} target="_blank" rel="noreferrer"><Github />GitHub profile</a>}{links.resume && <a href={links.resume} target="_blank" rel="noreferrer"><ExternalLink />Download resume</a>}</div><ContactForm /></section>
    </div>
    <footer><div className="wrap footer-content"><div className="footer-brand"><Code2 /> <b>{profile.name}</b><span /> <small>{profile.role}</small></div><div className="socials">{links.linkedin && <a href={links.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn"><Linkedin /></a>}{links.github && <a href={links.github} target="_blank" rel="noreferrer" aria-label="GitHub"><Github /></a>}<a href={`mailto:${profile.email}`} aria-label="Email"><Mail /></a></div></div></footer>
  </main>;
}
