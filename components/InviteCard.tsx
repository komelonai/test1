export default function InviteCard() {
  return (
    <div
      className="relative rounded-sm overflow-hidden"
      style={{
        background: "#faf7f2",
        boxShadow: "0 24px 80px rgba(0,0,0,0.5)",
        padding: "48px 44px",
      }}
    >
      {/* 상단 KOMELON Yellow 라인 */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "#F9A800" }} />

      {/* 모서리 장식 */}
      <Corner pos="top-5 left-5"    border="border-t border-l" />
      <Corner pos="top-5 right-5"   border="border-t border-r" />
      <Corner pos="bottom-5 left-5" border="border-b border-l" />
      <Corner pos="bottom-5 right-5"border="border-b border-r" />

      {/* 섹션 레이블 */}
      <p style={{
        fontFamily: "'Montserrat', sans-serif",
        fontWeight: 400,
        fontSize: 10,
        letterSpacing: "6px",
        color: "#F9A800",
        textTransform: "uppercase",
        marginBottom: 20,
      }}>
        Invitation · 초대장
      </p>

      {/* 메인 헤딩 */}
      <h2 style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontWeight: 400,
        fontSize: "clamp(26px, 3.5vw, 34px)",
        lineHeight: 1.3,
        color: "#111111",
        marginBottom: 28,
      }}>
        창립 100주년을<br />
        함께 기념하실<br />
        귀빈을 모십니다
      </h2>

      {/* 초대 문구 */}
      <p style={{
        fontFamily: "'Noto Sans KR', sans-serif",
        fontWeight: 300,
        fontSize: 14,
        lineHeight: 2,
        color: "#3a3530",
        marginBottom: 36,
      }}>
        코메론이 창립 100주년을 맞이하여<br />
        그 뜻깊은 자리에 귀하를 정중히 초대합니다.<br /><br />
        지난 한 세기 동안 보내주신 변함없는 신뢰와<br />
        성원에 깊은 감사를 드리며, 함께하는 이 자리가<br />
        새로운 백 년을 열어가는 뜻깊은 시간이<br />
        되기를 바랍니다.
      </p>

      {/* 디테일 */}
      <div style={{ borderTop: "1px solid rgba(249,168,0,0.2)", paddingTop: 24 }} className="grid gap-4">
        <DetailRow label="일시" value="2026년 6월 26일 (금) 오후 6시 30분" />
        <DetailRow
          label="장소"
          value={<>그랜드 볼룸, 코메론 센터<br />서울특별시 중구 세종대로 110</>}
        />
        <DetailRow label="복장" value="Black Tie Optional (정장)" />
        <DetailRow label="접수" value={<>2026년 6월 10일까지<br />우측 양식을 작성해 주십시오</>} />
      </div>
    </div>
  );
}

function Corner({ pos, border }: { pos: string; border: string }) {
  return (
    <div className={`absolute w-10 h-10 border-gold/30 ${pos} ${border}`} />
  );
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-baseline gap-4">
      <span style={{
        fontFamily: "'Montserrat', sans-serif",
        fontWeight: 500,
        fontSize: 10,
        letterSpacing: "3px",
        color: "#F9A800",
        textTransform: "uppercase",
        minWidth: 40,
        flexShrink: 0,
      }}>
        {label}
      </span>
      <span style={{
        fontFamily: "'Noto Sans KR', sans-serif",
        fontWeight: 400,
        fontSize: 13,
        lineHeight: 1.7,
        color: "#1a1a1a",
      }}>
        {value}
      </span>
    </div>
  );
}
