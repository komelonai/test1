import { NextRequest, NextResponse } from "next/server";
import { db, type RsvpData } from "@/lib/db";
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

    const orderId = crypto.randomUUID();
    const requiresPayment = data.attendance === "참석";
    const companions = parseInt(data.companions) || 0;
    const paymentAmount = requiresPayment ? calcAmount(companions) : 0;
    const paymentStatus = requiresPayment ? "PENDING" : "NOT_REQUIRED";

    const { error } = await db().from("rsvps").insert({
      order_id: orderId,
      name: data.name,
      org: data.org,
      jobtitle: data.jobtitle,
      phone: data.phone,
      email: data.email,
      attendance: data.attendance,
      companions,
      dietary: data.dietary || null,
      message: data.message || null,
      payment_amount: paymentAmount,
      payment_status: paymentStatus,
    });

    if (error) throw new Error(error.message);

    return NextResponse.json({ orderId, requiresPayment, amount: paymentAmount });
  } catch (err) {
    console.error("[rsvp]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
