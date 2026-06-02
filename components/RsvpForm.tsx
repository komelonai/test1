"use client";

import { useState } from "react";
import { loadTossPayments } from "@tosspayments/tosspayments-sdk";

type FormData = {
  name: string;
  org: string;
  jobtitle: string;
  phone: string;
  email: string;
  attendance: "참석" | "불참" | "";
  companions: string;
  dietary: string;
  message: string;
};

type Errors = Partial<Record<keyof FormData, string>>;

const INIT: FormData = {
  name: "", org: "", jobtitle: "", phone: "", email: "",
  attendance: "", companions: "0", dietary: "", message: "",
};

const TOSS_CLIENT_KEY = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY!;

export default function RsvpForm() {
  const [form, setForm]     = useState<FormData>(INIT);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "saving" | "paying" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const set = (field: keyof FormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm(prev => ({ ...prev, [field]: e.target.value }));

  function validate(): Errors {
    const e: Errors = {};
    if (!form.name.trim())                               e.name     = "성명을 입력해 주세요.";
    if (!form.org.trim())                                e.org      = "소속 기관을 입력해 주세요.";
    if (!form.jobtitle.trim())                           e.jobtitle = "직함을 입력해 주세요.";
    if (!/^[\d\-\s+]{7,}$/.test(form.phone.trim()))     e.phone    = "올바른 연락처를 입력해 주세요.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email    = "올바른 이메일을 입력해 주세요.";
    if (!form.attendance)                                e.attendance = "참석 여부를 선택해 주세요.";
    return e;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setStatus("saving");
    setErrorMsg("");

    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          companions: form.attendance === "참석" ? form.companions : "0",
        }),
      });

      if (!res.ok) throw new Error("서버 오류가 발생했습니다.");
      const { orderId, requiresPayment, amount } = await res.json() as {
        orderId: string;
        requiresPayment: boolean;
        amount: number;
      };

      if (!requiresPayment) {
        setStatus("success");
        return;
      }

      setStatus("paying");

      const tossPayments = await loadTossPayments(TOSS_CLIENT_KEY);
      const payment = tossPayments.payment({ customerKey: orderId });

      await payment.requestPayment({
        method: "CARD",
        amount: { currency: "KRW", value: amount },
        orderId,
        orderName: "코메론 만찬회 100주년 참석비",
        successUrl: `${window.location.origin}/payment/success`,
        failUrl: `${window.location.origin}/payment/fail`,
        customerName: form.name,
        customerEmail: form.email,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "오류가 발생했습니다.";
      setErrorMsg(msg);
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="form-card flex flex-col items-center justify-center gap-5 py-16 text-center animate-fade-in-up">
        <div className="w-18 h-18 rounded-full border-2 border-gold flex items-center justify-center text-gold text-3xl">
          ✓
        </div>
        <h3 className="font-display text-gold text-2xl">신청이 완료되었습니다</h3>
        <p className="text-cream/60 text-sm leading-loose">
          참석 신청해 주셔서 감사합니다.<br />
          확인 후 별도로 연락드리겠습니다.<br /><br />
          <em>코메론 만찬회 사무국</em>
        </p>
      </div>
    );
  }

  const isLoading = status === "saving" || status === "paying";

  return (
    <div className="form-card">
      <style>{`
        .form-card {
          background: rgba(245,240,232,0.04);
          border: 1px solid rgba(249,168,0,0.18);
          border-radius: 2px;
          padding: 44px 40px;
          backdrop-filter: blur(12px);
          box-shadow: 0 24px 80px rgba(0,0,0,0.4);
        }
        .field input, .field textarea {
          width: 100%;
          background: rgba(245,240,232,0.05);
          border: 1px solid rgba(249,168,0,0.2);
          border-radius: 1px;
          padding: 12px 14px;
          font-family: 'Noto Sans KR', sans-serif;
          font-weight: 300;
          font-size: 13px;
          color: #f5f0e8;
          outline: none;
          transition: border-color 0.2s, background 0.2s;
        }
        .field input:focus, .field textarea:focus {
          border-color: #F9A800;
          background: rgba(249,168,0,0.06);
        }
        .field input::placeholder, .field textarea::placeholder {
          color: rgba(245,240,232,0.25);
          font-size: 12px;
        }
        .field input.err { border-color: #e07a5f; }
        .field textarea { resize: vertical; min-height: 88px; }
      `}</style>

      <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, fontSize: 26, color: "#F9A800", marginBottom: 4 }}>참석 신청</h3>
      <p style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 300, fontSize: 10, letterSpacing: "5px", color: "rgba(245,240,232,0.35)", textTransform: "uppercase", marginBottom: 28 }}>RSVP · 아래 정보를 입력해 주세요</p>

      <form onSubmit={handleSubmit} noValidate className="grid gap-5">

        <Field label="성명" required error={errors.name}>
          <input type="text" placeholder="홍길동" value={form.name} onChange={set("name")}
            className={errors.name ? "err" : ""} />
        </Field>

        <Field label="소속 기관 / 단체" required error={errors.org}>
          <input type="text" placeholder="(주)코메론" value={form.org} onChange={set("org")}
            className={errors.org ? "err" : ""} />
        </Field>

        <Field label="직함 / 직위" required error={errors.jobtitle}>
          <input type="text" placeholder="이사" value={form.jobtitle} onChange={set("jobtitle")}
            className={errors.jobtitle ? "err" : ""} />
        </Field>

        <Field label="연락처 (휴대폰)" required error={errors.phone}>
          <input type="tel" placeholder="010-0000-0000" value={form.phone} onChange={set("phone")}
            className={errors.phone ? "err" : ""} />
        </Field>

        <Field label="이메일" required error={errors.email}>
          <input type="email" placeholder="example@cameron.kr" value={form.email} onChange={set("email")}
            className={errors.email ? "err" : ""} />
        </Field>

        {/* 참석 여부 */}
        <div>
          <Label required>참석 여부</Label>
          <div className="flex gap-3 mt-2">
            {(["참석", "불참"] as const).map(opt => (
              <label key={opt}
                className={`flex-1 text-center py-3 border rounded-sm cursor-pointer text-sm transition-all
                  ${form.attendance === opt
                    ? "bg-gold border-gold text-navy font-bold"
                    : "border-gold/25 text-cream/60 hover:border-gold hover:text-cream"}`}>
                <input type="radio" name="attendance" value={opt} checked={form.attendance === opt}
                  onChange={() => setForm(p => ({ ...p, attendance: opt }))} className="sr-only" />
                {opt}
              </label>
            ))}
          </div>
          {errors.attendance && <p className="text-[#e07a5f] text-[11px] mt-1">{errors.attendance}</p>}
        </div>

        {/* 동반 인원 (참석 시만) */}
        {form.attendance === "참석" && (
          <Field label="동반 인원 수">
            <input type="number" min={0} max={5} value={form.companions}
              onChange={set("companions")} placeholder="0" />
          </Field>
        )}

        <Field label="식이 제한 / 알레르기">
          <input type="text" placeholder="채식, 견과류 알레르기 등 (없으면 공란)"
            value={form.dietary} onChange={set("dietary")} />
        </Field>

        <Field label="축하 메시지">
          <textarea placeholder="100주년을 진심으로 축하드립니다…"
            value={form.message} onChange={set("message")} />
        </Field>

        {/* 참석 시 결제 안내 */}
        {form.attendance === "참석" && (() => {
          const companions = parseInt(form.companions) || 0;
          const total = (1 + companions) * 1000;
          return (
            <div className="text-center space-y-1">
              <p className="text-gold/60 text-[11px] tracking-wide">
                본인 1명{companions > 0 ? ` + 동반 ${companions}명` : ""} = 총 {1 + companions}명
              </p>
              <p className="text-gold text-[13px] font-semibold tracking-wide">
                참석비 {total.toLocaleString()}원 결제가 진행됩니다
              </p>
            </div>
          );
        })()}

        {status === "error" && (
          <p className="text-[#e07a5f] text-xs text-center">
            {errorMsg || "제출 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요."}
          </p>
        )}

        <button type="submit" disabled={isLoading}
          className="w-full py-4 bg-gold text-navy font-bold tracking-[3px] rounded-sm text-sm
            transition-all hover:bg-gold-light hover:shadow-lg hover:-translate-y-0.5
            active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0">
          {status === "saving"
            ? <><span className="spinner" />신청 저장 중...</>
            : status === "paying"
            ? <><span className="spinner" />결제 페이지 이동 중...</>
            : form.attendance === "참석"
            ? "참석 신청 및 결제하기"
            : "참석 신청하기"}
        </button>
      </form>
    </div>
  );
}

function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <p style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500, fontSize: 10, letterSpacing: "3px", color: "rgba(249,168,0,0.85)", textTransform: "uppercase", marginBottom: 8 }}>
      {children}{required && <span style={{ color: "#e07a5f", marginLeft: 2 }}>*</span>}
    </p>
  );
}

function Field({
  label, required, error, children,
}: {
  label: string; required?: boolean; error?: string; children: React.ReactNode;
}) {
  return (
    <div className="field">
      <Label required={required}>{label}</Label>
      {children}
      {error && <p className="text-[#e07a5f] text-[11px] mt-1">{error}</p>}
    </div>
  );
}
