import Link from "next/link";
import { confirmPayment } from "@/lib/payment";

export default async function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ paymentKey?: string; orderId?: string; amount?: string }>;
}) {
  const { paymentKey, orderId, amount } = await searchParams;

  if (!paymentKey || !orderId || !amount) {
    return <ResultUI success={false} message="잘못된 접근입니다." />;
  }

  try {
    await confirmPayment(paymentKey, orderId, Number(amount));
    return <ResultUI success={true} />;
  } catch (err) {
    const message = err instanceof Error ? err.message : "결제 확인 중 오류가 발생했습니다.";
    return <ResultUI success={false} message={message} />;
  }
}

function ResultUI({ success, message }: { success: boolean; message?: string }) {
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
            border: `2px solid ${success ? "#F9A800" : "#e07a5f"}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 32,
            color: success ? "#F9A800" : "#e07a5f",
            margin: "0 auto 24px",
          }}
        >
          {success ? "✓" : "✕"}
        </div>

        <h2
          style={{
            fontFamily: "'Playfair Display', serif",
            color: "#F9A800",
            fontSize: 24,
            marginBottom: 16,
          }}
        >
          {success ? "신청이 완료되었습니다" : "결제에 실패했습니다"}
        </h2>

        <p
          style={{
            color: "rgba(250,246,238,0.6)",
            fontSize: 14,
            lineHeight: 1.8,
            marginBottom: 32,
          }}
        >
          {success ? (
            <>
              참석 신청 및 결제가 정상적으로 처리되었습니다.<br />
              확인 후 별도로 연락드리겠습니다.<br /><br />
              <em>코메론 만찬회 사무국</em>
            </>
          ) : (
            message ?? "결제 처리 중 문제가 발생했습니다."
          )}
        </p>

        {!success && (
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
        )}
      </div>
    </main>
  );
}
