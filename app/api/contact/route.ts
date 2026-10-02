import { NextRequest, NextResponse } from "next/server";
import { successResponse, errorResponse } from "@/lib/utils/apiResponse";
import { checkRateLimit } from "@/lib/utils/rateLimit";
import { contactSchema } from "@/lib/utils/validators";
import { sanitize } from "@/lib/utils/sanitize";

async function sendContactEmailServerSide(payload: {
  name: string;
  email: string;
  message: string;
}): Promise<void> {
  const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
  const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
  const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

  if (!serviceId || !templateId || !publicKey) {
    console.error("[EmailJS REST] Missing EmailJS configuration environment variables");
    throw new Error("Email service unconfigured");
  }

  const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      service_id: serviceId,
      template_id: templateId,
      user_id: publicKey,
      template_params: payload,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("[EmailJS REST send failed]", response.status, errorText);
    throw new Error("Email send failed");
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const rateLimitResult = await checkRateLimit(request, "contact");
    if (!rateLimitResult.success) return errorResponse("Too many requests", 429);

    const body: unknown = await request.json();
    const result = contactSchema.safeParse(body);
    if (!result.success) {
      return errorResponse(`Validation failed: ${result.error.errors[0].message}`, 400);
    }
    const { name, email, message, website, submittedAt } = result.data;

    // Honeypot — bots fill every field, humans never see this one
    if (website.length > 0) {
      return successResponse({ success: true }); // silent success, per API.md
    }

    // Timestamp check — under 3 seconds means bot speed
    const elapsed = Date.now() - submittedAt;
    if (elapsed < 3000) {
      return successResponse({ success: true }); // silent success, per API.md
    }

    const sanitizedName = sanitize(name);
    const sanitizedMessage = sanitize(message);
    // email is not sanitized — it's .email()-validated already (Decision #4)

    await sendContactEmailServerSide({ name: sanitizedName, email, message: sanitizedMessage });

    return successResponse({ success: true });
  } catch (error) {
    console.error("[POST /api/contact]", error);
    return errorResponse("Failed to send message. Please try again.", 500);
  }
}

