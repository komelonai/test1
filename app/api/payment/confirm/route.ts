import { NextRequest, NextResponse } from "next/server";
import { confirmPayment } from "@/lib/payment";

export async function POST(req: NextRequest) {
  try {
    const { paymentKey, orderId, amount } = await req.json();

    if (!paymentKey || !orderId || !amount) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await confirmPayment(paymentKey, orderId, Number(amount));
    return NextResponse.json({ result: "success" });
  } catch (err) {
    console.error("[payment/confirm]", err);
    const message = err instanceof Error ? err.message : "결제 오류가 발생했습니다.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
