import Image from "next/image";
import InviteCard from "@/components/InviteCard";
import RsvpForm from "@/components/RsvpForm";

export default function Home() {
  return (
    <main className="min-h-screen px-5 py-12 md:py-20 max-w-6xl mx-auto animate-fade-in-up">

      <header className="text-center mb-14">

        {/* KOMELON 로고 */}
        <div className="mb-2 flex justify-center">
          <Image
            src="/komelon-logo.png"
            alt="KOMELON"
            width={320}
            height={75}
            priority
            style={{ objectFit: "contain" }}
          />
        </div>

        {/* 얇은 구분선 */}
        <div style={{ width: 48, height: 1, background: "#F9A800", margin: "14px auto 18px", opacity: 0.6 }} />

        {/* 연도 배지 */}
        <p style={{
          fontFamily: "'Montserrat', sans-serif",
          fontWeight: 200,
          fontSize: 11,
          letterSpacing: "8px",
          color: "rgba(249,168,0,0.65)",
          textTransform: "uppercase",
          marginBottom: 20,
        }}>
          1926 — 2026 · Centennial
        </p>

        {/* 메인 타이틀 */}
        <h1 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontWeight: 300,
          fontSize: "clamp(36px, 6vw, 58px)",
          color: "#f5f0e8",
          letterSpacing: "2px",
          lineHeight: 1.15,
          marginBottom: 10,
        }}>
          코메론 만찬회
        </h1>

        {/* 영문 서브타이틀 */}
        <p style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontStyle: "italic",
          fontWeight: 300,
          fontSize: 18,
          color: "rgba(245,240,232,0.45)",
          letterSpacing: "1px",
        }}>
          Dinner Gala · Centennial Celebration
        </p>

        {/* 구분선 */}
        <div className="flex items-center gap-4 max-w-xs mx-auto mt-7">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
          <div className="w-1.5 h-1.5 bg-gold rotate-45" />
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <InviteCard />
        <RsvpForm />
      </div>

      <footer className="text-center mt-14 pt-6 border-t border-gold/10" style={{
        fontFamily: "'Montserrat', sans-serif",
        fontWeight: 300,
        fontSize: 10,
        letterSpacing: "5px",
        color: "rgba(249,168,0,0.25)",
        textTransform: "uppercase",
      }}>
        Komelon Dinner Gala · Since 1926
      </footer>
    </main>
  );
}
