import Link from "next/link";
import { db } from "@/lib/db";

export default async function PaymentFailPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string; message?: string; orderId?: string }>;
}) {
  const { code, message, orderId } = await searchParams;

  if (orderId) {
    await db()`
      UPDATE rsvps
      SET payment_status = 'FAILED'
      WHERE order_id = ${orderId} AND payment_status = 'PENDING'
    `.catch(() => {});
  }

  const reason =
    code === "PAY_PROCESS_CANCELED"
      ? "결제가 취소되었습니다."
      : message ?? "결제 처리 중 오류가 발생했습니다.";

  return (
    <main
      style={{ background: "#111111", minHeight: "100vh" }}
      className="flex items-center justify-center p-8"
    >
      <div
        style={{
          background: "rgba(250,246,238,0.04)",
          border: "1px solid rgba(201,168,76,0.25)",
          borderRadius: 4,
          padding: "56px 48px",
          backdropFilter: "blur(10px)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
          maxWidth: 480,
          width: "100%",
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            border: "2px solid #e07a5f",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 32,
            color: "#e07a5f",
            margin: "0 auto 24px",
          }}
        >
          ✕
        </div>

        <h2
          style={{
            fontFamily: "'Playfair Display', serif",
            color: "#F9A800",
            fontSize: 24,
            marginBottom: 16,
          }}
        >
          결제에 실패했습니다
        </h2>

        <p
          style={{
            color: "rgba(250,246,238,0.6)",
            fontSize: 14,
            lineHeight: 1.8,
            marginBottom: 32,
          }}
        >
          {reason}
          <br />
          다시 시도하거나 문의해 주세요.
        </p>

        <Link
          href="/"
          style={{
            display: "inline-block",
            padding: "12px 32px",
            background: "#F9A800",
            color: "#111111",
            fontWeight: "bold",
            letterSpacing: "0.15em",
            fontSize: 13,
            borderRadius: 2,
            textDecoration: "none",
          }}
        >
          다시 시도하기
        </Link>
      </div>
    </main>
  );
}
