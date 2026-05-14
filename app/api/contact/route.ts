import { NextResponse } from "next/server";
import { Resend } from "resend";

function escapeHtml(str = "") {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const resend = new Resend(process.env.RESEND_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();

    if (!process.env.RESEND_API_KEY || !process.env.RESEND_TO_EMAIL) {
      return NextResponse.json(
        { ok: false, error: "Missing RESEND_* environment variables" },
        { status: 500 },
      );
    }

    const html = `
      <p><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p>${escapeHtml(message).replace(/\n/g, "<br/>")}</p>
    `;

    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: process.env.RESEND_TO_EMAIL!,
      subject: `New contact from ${name}`,
      html,
    });

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ ok: false, error: errorMessage }, { status: 500 });
  }
}
