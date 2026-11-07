"use client";

import { FormEvent, useState } from "react";
import { Send } from "lucide-react";
import { createBrowserSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/client";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const supabase = createBrowserSupabaseClient();
    if (!supabase) { setStatus("error"); setMessage("Supabase is not configured yet."); return; }
    setStatus("sending");
    const { error } = await supabase.rpc("submit_contact_message", {
      p_name: String(form.get("name") || ""),
      p_email: String(form.get("email") || ""),
      p_message: String(form.get("message") || ""),
    });
    if (error) { setStatus("error"); setMessage(error.message || "Unable to send your message."); return; }
    event.currentTarget.reset();
    setStatus("sent");
    setMessage("Thanks — your message has been sent.");
  }

  return <form className="contact-form" onSubmit={submit}>
    <div className="form-grid"><label>Name<input name="name" minLength={2} maxLength={100} required /></label><label>Email<input name="email" type="email" maxLength={320} required /></label></div>
    <label>Message<textarea name="message" minLength={10} maxLength={4000} required rows={4} /></label>
    <div className="form-footer"><button className="button button-primary" disabled={status === "sending" || !isSupabaseConfigured} type="submit"><Send size={16} />{status === "sending" ? "Sending…" : "Send message"}</button>{status !== "idle" && <p className={status === "sent" ? "form-success" : "form-error"}>{message}</p>}</div>
  </form>;
}
