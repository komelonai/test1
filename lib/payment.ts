import { db } from "@/lib/db";

export const PRICE_PER_PERSON = 1000;

export function calcAmount(companions: number): number {
  return (1 + companions) * PRICE_PER_PERSON;
}

export async function confirmPayment(
  paymentKey: string,
  orderId: string,
  amount: number,
) {
  const [row] = await db()`SELECT payment_amount FROM rsvps WHERE order_id = ${orderId}`;
  if (!row || Number(row.payment_amount) !== amount) {
    throw new Error("결제 금액이 일치하지 않습니다.");
  }

  const secretKey = process.env.TOSS_SECRET_KEY!;
  const encoded = Buffer.from(`${secretKey}:`).toString("base64");

  const tossRes = await fetch("https://api.tosspayments.com/v1/payments/confirm", {
    method: "POST",
    headers: {
      Authorization: `Basic ${encoded}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ paymentKey, orderId, amount }),
  });

  if (!tossRes.ok) {
    const err = await tossRes.json().catch(() => ({})) as { message?: string };
    await db()`UPDATE rsvps SET payment_status = 'FAILED' WHERE order_id = ${orderId}`;
    throw new Error(err.message ?? "결제 승인에 실패했습니다.");
  }

  await db()`
    UPDATE rsvps
    SET payment_key    = ${paymentKey},
        payment_status = 'DONE',
        paid_at        = NOW()
    WHERE order_id = ${orderId}
  `;
}
