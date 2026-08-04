"use client";

import { useState } from "react";
import { sendEvent } from "./Analytics";

export default function ContactForm({ copy }) {
  const [state, setState] = useState({ status: "idle", message: "" });
  async function submit(event) {
    event.preventDefault();
    const formElement = event.currentTarget;
    setState({ status: "sending", message: copy.sending });
    const form = new FormData(formElement);
    try {
      const response = await fetch("/api/contact", { method:"POST", headers:{"content-type":"application/json"}, body:JSON.stringify(Object.fromEntries(form)) });
      const payload = await response.json().catch(() => null);
      if (!response.ok) throw new Error(payload?.error?.message || copy.error);
      formElement.reset();
      setState({ status:"success", message:copy.success });
      sendEvent("contact_submit", { subject_type:"contact" });
    } catch (error) { setState({ status:"error", message:error.message || copy.error }); }
  }
  return <form className="contact-form" onSubmit={submit} noValidate><div className="form-grid"><label>{copy.name_label}<input name="name" minLength="2" maxLength="100" required autoComplete="name"/></label><label>{copy.email_label}<input name="email" type="email" maxLength="254" required autoComplete="email"/></label></div><label>{copy.message_label}<textarea name="message" minLength="10" maxLength="5000" rows="8" required/></label><label className="honeypot" aria-hidden="true">{copy.honeypot_label}<input name="website" tabIndex="-1" autoComplete="off"/></label><div className="form-submit"><button className="button primary" disabled={state.status === "sending"}>{copy.submit_label}</button><p className={`form-state ${state.status}`} role="status" aria-live="polite">{state.message}</p></div></form>;
}
