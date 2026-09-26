// lib/email/emailjs.ts
// NOTE: @emailjs/browser is a CLIENT-SIDE ONLY package (per TRD.md 8.8).
// This file will be imported directly by the Contact section component
// in Phase 4 — it does not run on the server and is not called from any
// API route. It exists now only as a typed, ready-to-use wrapper.
"use client";

import emailjs from "@emailjs/browser";

export interface ContactFormPayload {
  name: string;
  email: string;
  message: string;
}

export async function sendContactEmail(payload: ContactFormPayload): Promise<void> {
  try {
    await emailjs.send(
      process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID as string,
      process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID as string,
      { ...payload },
      { publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY as string }
    );
  } catch (error) {
    console.error("[EmailJS sendContactEmail]", error);
    throw new Error("Failed to send message. Please try again.");
  }
}

