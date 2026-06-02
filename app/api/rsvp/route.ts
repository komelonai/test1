import { NextRequest, NextResponse } from "next/server";
import { db, initDb, type RsvpData } from "@/lib/db";
import { calcAmount } from "@/lib/payment";

export async function POST(req: NextRequest) {
  try {
    const data: RsvpData = await req.json();

    const required = ["name", "org", "jobtitle", "phone", "email", "attendance"] as const;
    for (const field of required) {
      if (!data[field]?.trim()) {
        return NextResponse.json({ error: `${field} is required` }, { status: 400 });
      }
    }

    await initDb();

    const orderId = crypto.randomUUID();
    const requiresPayment = data.attendance === "참석";
    const companions = parseInt(data.companions) || 0;
    const paymentAmount = requiresPayment ? calcAmount(companions) : 0;
    const paymentStatus = requiresPayment ? "PENDING" : "NOT_REQUIRED";

    await db()`
      INSERT INTO rsvps
        (order_id, name, org, jobtitle, phone, email, attendance,
         companions, dietary, message, payment_amount, payment_status)
      VALUES
        (${orderId},
         ${data.name}, ${data.org}, ${data.jobtitle}, ${data.phone},
         ${data.email}, ${data.attendance},
         ${companions},
         ${data.dietary || null}, ${data.message || null},
         ${paymentAmount}, ${paymentStatus})
    `;

    return NextResponse.json({ orderId, requiresPayment, amount: paymentAmount });
  } catch (err) {
    console.error("[rsvp]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
