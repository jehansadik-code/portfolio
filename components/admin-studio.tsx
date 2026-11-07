"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { Check, ChevronLeft, FileText, KeyRound, Loader2, LogOut, Mail, Pencil, Plus, Save, Trash2, UserRound } from "lucide-react";
import { createBrowserSupabaseClient, getSupabasePublicConfig, isSupabaseConfigured } from "@/lib/supabase/client";

type Row = Record<string, unknown>;
type Field = { name: string; label: string; type?: "text" | "textarea" | "url" | "email" | "number" | "checkbox" | "tags" | "select" | "image"; required?: boolean; options?: string[] };
type Collection = { id: string; label: string; description: string; fields: Field[]; singleton?: boolean; readOnly?: boolean };

const collections: Collection[] = [
  { id: "portfolio_profile", label: "Profile & links", description: "Hero, about, contact, social links, skills, and tools.", singleton: true, fields: [
    { name: "full_name", label: "Full name", required: true }, { name: "role", label: "Role", required: true }, { name: "headline", label: "Headline", required: true }, { name: "bio", label: "Short bio", type: "textarea", required: true }, { name: "about_text", label: "About text", type: "textarea", required: true }, { name: "location", label: "Location", required: true }, { name: "email", label: "Contact email", type: "email", required: true }, { name: "avatar_url", label: "Display picture", type: "image" }, { name: "linkedin_url", label: "LinkedIn URL", type: "url" }, { name: "github_url", label: "GitHub URL", type: "url" }, { name: "resume_url", label: "Resume URL", type: "url" }, { name: "skills", label: "Skills (comma separated)", type: "tags" }, { name: "tools", label: "Technical tools (comma separated)", type: "tags" },
  ] },
  { id: "projects", label: "Projects", description: "Cards shown on the public portfolio.", fields: [
    { name: "slug", label: "Slug", required: true }, { name: "title", label: "Project title", required: true }, { name: "subtitle", label: "Subtitle" }, { name: "description", label: "Description", type: "textarea", required: true }, { name: "tags", label: "Tags (comma separated)", type: "tags" }, { name: "visual_type", label: "Visual style", type: "select", options: ["home", "space"] }, { name: "image_url", label: "Project output image", type: "image" }, { name: "project_url", label: "Project / repository URL", type: "url" }, { name: "sort_order", label: "Display order", type: "number" }, { name: "published", label: "Visible on website", type: "checkbox" },
  ] },
  ...["education", "experience", "certificates", "awards"].map((id): Collection => ({ id, label: id[0].toUpperCase() + id.slice(1), description: `Edit public ${id} entries and their links.`, fields: [
    { name: "slug", label: "Slug", required: true }, { name: "title", label: "Title", required: true }, { name: "organization", label: id === "education" ? "School / university" : "Organization / issuer", required: true }, { name: "date_label", label: "Date" }, { name: "description", label: "Description", type: "textarea" }, { name: "image_url", label: `${id.slice(0, -1)} image`, type: "image" }, { name: "link_url", label: "Official / proof URL", type: "url" }, { name: "sort_order", label: "Display order", type: "number" }, { name: "published", label: "Visible on website", type: "checkbox" },
  ] })),
  { id: "contact_messages", label: "Contact inbox", description: "Messages sent from the public contact form.", readOnly: true, fields: [
    { name: "name", label: "Name" }, { name: "email", label: "Email" }, { name: "message", label: "Message", type: "textarea" }, { name: "created_at", label: "Received" },
  ] },
];

function pretty(value: unknown, type?: Field["type"]) {
  if (type === "tags" && Array.isArray(value)) return value.join(", ");
  if (value === null || value === undefined) return "";
  return String(value);
}

function blankDraft(collection: Collection) {
  return Object.fromEntries(collection.fields.map((field) => [field.name, field.type === "checkbox" ? true : field.type === "number" ? 0 : field.type === "tags" ? [] : field.type === "select" ? field.options?.[0] || "" : ""]));
}

function validateDraft(collection: Collection, draft: Row) {
  const text = (name: string) => String(draft[name] || "").trim();
  for (const field of collection.fields) if (field.required && !text(field.name)) return `${field.label} is required.`;
  if (collection.id === "projects") {
    if (!/^[a-z0-9-]{3,100}$/.test(text("slug"))) return "Slug must use 3–100 lowercase letters, numbers, and hyphens only.";
    if (text("title").length < 2) return "Project title must contain at least 2 characters.";
    if (text("description").length < 10) return "Project description must contain at least 10 characters.";
    if (text("description").length > 2000) return "Project description must be under 2,000 characters.";
    if (Array.isArray(draft.tags) && draft.tags.length > 8) return "Add no more than 8 project tags.";
  }
  return null;
}

async function adminRequest(path: string, method = "GET", body?: Row) {
  const config = getSupabasePublicConfig();
  const client = createBrowserSupabaseClient();
  const session = client ? (await client.auth.getSession()).data.session : null;
  if (!config || !session) throw new Error("Your admin session has expired. Please sign in again.");
  const response = await fetch(`${config.url}/rest/v1/${path}`, { method, headers: { apikey: config.anonKey, Authorization: `Bearer ${session.access_token}`, "Content-Type": "application/json", Prefer: "return=representation" }, body: body ? JSON.stringify(body) : undefined });
  if (!response.ok) { const problem = await response.json().catch(() => null) as { message?: string; details?: string; hint?: string; code?: string } | null; const message = [problem?.message, problem?.details, problem?.hint, problem?.code && `Code: ${problem.code}`].filter(Boolean).join(" — "); throw new Error(message || "Supabase request failed."); }
  return response.status === 204 ? null : await response.json() as Row[];
}

export default function AdminStudio() {
  const [email, setEmail] = useState(""); const [password, setPassword] = useState(""); const [signedIn, setSignedIn] = useState(false); const [allowed, setAllowed] = useState(false); const [busy, setBusy] = useState(true); const [notice, setNotice] = useState("");
  const [activeId, setActiveId] = useState("portfolio_profile"); const [rows, setRows] = useState<Row[]>([]); const [draft, setDraft] = useState<Row | null>(null); const [saving, setSaving] = useState(false);
  const active = useMemo(() => collections.find((collection) => collection.id === activeId) || collections[0], [activeId]);

  async function verifySession() {
    const client = createBrowserSupabaseClient();
    if (!client) { setBusy(false); return; }
    const { data: { user } } = await client.auth.getUser();
    if (!user) { setSignedIn(false); setAllowed(false); setBusy(false); return; }
    setSignedIn(true);
    try { const adminRows = await adminRequest(`portfolio_admins?user_id=eq.${encodeURIComponent(user.id)}&select=user_id`); setAllowed(Boolean(adminRows?.length)); } catch { setAllowed(false); }
    setBusy(false);
  }

  useEffect(() => { void verifySession(); }, []);

  async function loadCollection() {
    if (!allowed) return;
    setBusy(true); setNotice(""); setRows([]);
    try {
      const select = active.fields.map((field) => field.name).concat(["id"].filter((field) => !active.fields.some((item) => item.name === field))).join(",");
      const order = active.id === "contact_messages" ? "created_at.desc" : active.singleton ? "created_at.asc" : "sort_order.asc";
      setRows((await adminRequest(`${active.id}?select=${select}&order=${order}`)) || []);
    } catch (error) { setNotice(error instanceof Error ? error.message : "Could not load this section."); }
    setBusy(false);
  }
  useEffect(() => { if (allowed) void loadCollection(); }, [activeId, allowed]);

  async function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); const client = createBrowserSupabaseClient(); if (!client) return;
    setBusy(true); setNotice(""); const { error } = await client.auth.signInWithPassword({ email, password });
    if (error) { setNotice(error.message); setBusy(false); return; }
    await verifySession();
  }
  async function signOut() { const client = createBrowserSupabaseClient(); await client?.auth.signOut(); setSignedIn(false); setAllowed(false); setRows([]); setDraft(null); }
  function updateDraft(field: Field, value: string | boolean) { setDraft((previous) => ({ ...(previous || {}), [field.name]: field.type === "number" ? Number(value) : field.type === "tags" && typeof value === "string" ? value.split(",").map((item) => item.trim()).filter(Boolean) : value })); }
  async function uploadImage(field: Field, file?: File) {
    if (!file) return;
    if (!file.type.startsWith("image/") || file.size > 5 * 1024 * 1024) { setNotice("Choose a JPG, PNG, WebP, or GIF image under 5 MB."); return; }
    const client = createBrowserSupabaseClient();
    if (!client) return;
    setSaving(true); setNotice("");
    const safeName = file.name.toLowerCase().replace(/[^a-z0-9._-]/g, "-");
    const randomId = globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const path = `content/${active.id}/${randomId}-${safeName}`;
    const { error } = await client.storage.from("portfolio-media").upload(path, file, { contentType: file.type, upsert: false });
    if (error) { setNotice(error.message); setSaving(false); return; }
    const { data: publicUrl } = client.storage.from("portfolio-media").getPublicUrl(path);
    updateDraft(field, publicUrl.publicUrl);
    setNotice("Image uploaded. Save changes to publish it on the website."); setSaving(false);
  }

  async function saveDraft(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (!draft || active.readOnly) return; setSaving(true); setNotice("");
    const payload = { ...draft }; delete payload.id; delete payload.created_at; delete payload.updated_at;
    active.fields.filter((field) => field.type === "tags").forEach((field) => { payload[field.name] = Array.isArray(payload[field.name]) ? [...new Set((payload[field.name] as unknown[]).map((tag) => String(tag).trim()).filter(Boolean))] : []; });
    active.fields.filter((field) => field.type !== "tags" && field.type !== "checkbox" && field.type !== "number").forEach((field) => { const value = payload[field.name]; if (typeof value === "string") payload[field.name] = value.trim(); });
    const validationError = validateDraft(active, payload);
    if (validationError) { setNotice(validationError); setSaving(false); return; }
    try {
      const existing = typeof draft.id === "string";
      const result = await adminRequest(existing ? `${active.id}?id=eq.${encodeURIComponent(draft.id as string)}` : active.id, existing ? "PATCH" : "POST", payload);
      setNotice("Saved successfully."); setDraft(null); if (result) await loadCollection();
    } catch (error) { setNotice(error instanceof Error ? error.message : "Could not save this entry."); }
    setSaving(false);
  }
  async function removeRow(row: Row) {
    if (!row.id || !window.confirm("Delete this entry? This cannot be undone.")) return;
    try { await adminRequest(`${active.id}?id=eq.${encodeURIComponent(String(row.id))}`, "DELETE"); setNotice("Deleted."); await loadCollection(); } catch (error) { setNotice(error instanceof Error ? error.message : "Could not delete this entry."); }
  }

  if (!isSupabaseConfigured) return <main className="admin-screen"><section className="admin-auth"><KeyRound /><h1>Supabase setup required</h1><p>Add the public Supabase URL and anon key to `.env.local` locally and Vercel Environment Variables for production.</p></section></main>;
  if (busy && !signedIn) return <main className="admin-screen"><Loader2 className="spin" /> Loading secure studio…</main>;
  if (!signedIn) return <main className="admin-screen"><form className="admin-auth" onSubmit={signIn}><KeyRound /><p className="admin-kicker">Portfolio control center</p><h1>Admin sign in</h1><label>Email<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></label><label>Password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required /></label>{notice && <p className="admin-notice error">{notice}</p>}<button className="admin-primary" disabled={busy}><KeyRound size={17} />Sign in</button><p className="admin-help">Your Supabase Auth administrator credentials are required.</p></form></main>;
  if (!allowed) return <main className="admin-screen"><section className="admin-auth"><UserRound /><h1>Access not granted</h1><p>This account is signed in but is not yet a portfolio administrator. Add its Auth user ID to `portfolio_admins` using the bootstrap instruction in migration 003.</p><button className="admin-secondary" onClick={signOut}>Sign out</button></section></main>;

  return <main className="admin-shell"><aside className="admin-sidebar"><a className="admin-back" href="/"><ChevronLeft size={17} />View website</a><h1>Portfolio Studio</h1><p>Update website content without editing code.</p><nav>{collections.map((collection) => <button className={activeId === collection.id ? "selected" : ""} onClick={() => { setActiveId(collection.id); setDraft(null); }} key={collection.id}>{collection.id === "contact_messages" ? <Mail size={16} /> : <FileText size={16} />}{collection.label}</button>)}</nav><button className="admin-signout" onClick={signOut}><LogOut size={16} />Sign out</button></aside>
    <section className="admin-workspace"><header><div><p className="admin-kicker">No-code editor</p><h2>{active.label}</h2><p>{active.description}</p></div>{!active.readOnly && !active.singleton && <button className="admin-primary" onClick={() => setDraft(blankDraft(active))}><Plus size={17} />Add entry</button>}</header>{notice && <p className={`admin-notice ${notice.includes("success") || notice === "Deleted." ? "success" : "error"}`}>{notice}</p>}
      <div className="admin-grid"><section className="admin-list"><h3>{active.readOnly ? "Messages" : "Entries"}</h3>{busy ? <Loader2 className="spin" /> : rows.length ? rows.map((row) => <article key={String(row.id)}><div><strong>{String(row.title || row.full_name || row.name || "Untitled")}</strong><small>{String(row.organization || row.email || row.subtitle || row.created_at || "")}</small></div>{active.readOnly ? <button className="icon-button danger" onClick={() => void removeRow(row)} aria-label="Delete message"><Trash2 size={16} /></button> : <button className="icon-button" onClick={() => setDraft(row)} aria-label="Edit entry"><Pencil size={16} /></button>}</article>) : <p className="admin-empty">No entries yet.</p>}</section>
        <section className="admin-editor">{draft ? <form onSubmit={saveDraft}><div className="editor-title"><h3>{draft.id ? "Edit entry" : "New entry"}</h3><button type="button" className="admin-secondary" onClick={() => setDraft(null)}>Cancel</button></div>{active.fields.map((field) => <label key={field.name} className={field.type === "textarea" || field.type === "image" ? "wide" : ""}>{field.label}{field.type === "image" ? <div className="image-control">{pretty(draft[field.name]) && <img src={pretty(draft[field.name])} alt="Current upload preview" />}<input type="url" placeholder="Image URL or upload a file below" value={pretty(draft[field.name])} onChange={(event) => updateDraft(field, event.target.value)} /><input className="image-file-input" type="file" accept="image/jpeg,image/png,image/webp,image/gif" disabled={saving} onChange={(event) => void uploadImage(field, event.target.files?.[0])} /></div> : field.type === "textarea" ? <textarea required={field.required} value={pretty(draft[field.name], field.type)} onChange={(event) => updateDraft(field, event.target.value)} /> : field.type === "checkbox" ? <input className="admin-check" type="checkbox" checked={Boolean(draft[field.name])} onChange={(event) => updateDraft(field, event.target.checked)} /> : field.type === "select" ? <select value={pretty(draft[field.name])} onChange={(event) => updateDraft(field, event.target.value)}>{field.options?.map((option) => <option key={option}>{option}</option>)}</select> : <input type={field.type === "number" ? "number" : field.type === "url" ? "url" : field.type === "email" ? "email" : "text"} required={field.required} value={pretty(draft[field.name], field.type)} onChange={(event) => updateDraft(field, event.target.value)} />}</label>)}<div className="editor-actions"><button className="admin-primary" disabled={saving}><Save size={17} />{saving ? "Saving…" : "Save changes"}</button>{Boolean(draft.id) && <button type="button" className="admin-danger" onClick={() => void removeRow(draft)}><Trash2 size={16} />Delete</button>}</div></form> : <div className="editor-placeholder"><Check size={24} /><h3>Select an entry</h3><p>Choose an entry to edit it, or add a new one.</p></div>}</section></div>
    </section></main>;
}
