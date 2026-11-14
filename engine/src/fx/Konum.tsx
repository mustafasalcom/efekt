import React from "react";
import { AbsoluteFill } from "remotion";
import { DEF } from "../defaults";
import { Base, Clip, Skel, glassB, PINK as INK, DIM, GOLD, GOLD2, SF, SERIF, MONO, p, lerp, inOut, outBack, outQuart, useT, has, fit } from "../lib";

/* KONUM — üstte cam arama çubuğu yazılır, göğüs hizasında cam harita kartı yükselir, altın pin düşer, rota çizilir, "Yol tarifi al" basılır.
   Kesim gerekmez. Harita temsili (gerçek harita verisi kullanılmaz). İşletme bilgisi verilmezse iskelet satırlar görünür. */
export type KonumContent = { arama?: string; ad?: string; vurgu?: string; semt?: string; puan?: number; yorum?: number; durum?: string; sure?: string; buton?: string };
export type KonumProps = Base & { content: KonumContent };

const BLUE = "#4C8DFF", GREEN = "#3DDC84";
const MW = 960, MH = 400;
const ROUTE = "M 150 330 L 150 262 Q 150 250 162 250 L 420 250 Q 432 250 432 238 L 432 150 Q 432 138 444 138 L 700 138 Q 712 138 712 150 L 712 176";
const PIN = { x: 712, y: 176 };

const MapView: React.FC<{ t: number; sure?: string }> = ({ t, sure }) => {
  const route = p(t, 2.35, 1.0, inOut);
  const pin = p(t, 2.0, 0.6, outBack);
  const zoom = lerp(1.12, 1, p(t, 1.6, 3.6, outQuart));
  const pulse = (t * 0.9) % 1;
  return (
    <div style={{ width: MW, height: MH, borderRadius: 30, overflow: "hidden", position: "relative", background: "#101114" }}>
      <svg width={MW} height={MH} viewBox={`0 0 ${MW} ${MH}`} style={{ transform: `scale(${zoom})`, transformOrigin: `${PIN.x}px ${PIN.y}px` }}>
        <defs>
          <linearGradient id="rt" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stopColor={GOLD2} /><stop offset="1" stopColor="#FFF1CF" /></linearGradient>
          <filter id="gl"><feGaussianBlur stdDeviation="7" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        </defs>
        <path d="M 0 0 L 90 0 Q 60 120 96 220 Q 128 320 70 400 L 0 400 Z" fill="#0E1A2A" />
        <rect x={510} y={230} width={150} height={120} rx={18} fill="#16241C" />
        <rect x={250} y={40} width={120} height={80} rx={16} fill="#16241C" />
        {[60, 138, 250, 330].map((y) => <line key={"h" + y} x1={90} y1={y} x2={MW} y2={y} stroke="rgba(255,255,255,0.07)" strokeWidth={y === 138 || y === 250 ? 18 : 8} />)}
        {[150, 432, 712, 860].map((x) => <line key={"v" + x} x1={x} y1={0} x2={x} y2={MH} stroke="rgba(255,255,255,0.07)" strokeWidth={x === 432 || x === 712 ? 18 : 8} />)}
        {[230, 300, 560, 790].map((x) => <line key={"m" + x} x1={x} y1={0} x2={x} y2={MH} stroke="rgba(255,255,255,0.035)" strokeWidth={4} />)}
        {[[170, 76, 70, 50], [460, 70, 100, 52], [740, 72, 100, 50], [180, 270, 60, 44], [460, 270, 30, 60], [740, 270, 100, 44], [880, 160, 70, 70]].map(([x, y, w, h], i) => <rect key={i} x={x} y={y} width={w} height={h} rx={8} fill="rgba(255,255,255,0.045)" />)}
        <path d={ROUTE} fill="none" stroke="rgba(230,196,135,0.18)" strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" />
        <path d={ROUTE} fill="none" stroke="url(#rt)" strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={`${route} 1`} filter="url(#gl)" />
        <circle cx={150} cy={330} r={30 + pulse * 26} fill={BLUE} opacity={0.22 * (1 - pulse)} />
        <circle cx={150} cy={330} r={15} fill={BLUE} stroke="#fff" strokeWidth={5} />
        {pin > 0.6 && [0, 0.5].map((o) => { const q = (t * 0.8 + o) % 1; return <ellipse key={o} cx={PIN.x} cy={PIN.y} rx={14 + q * 60} ry={(14 + q * 60) * 0.42} fill="none" stroke={GOLD} strokeWidth={3} opacity={0.6 * (1 - q)} />; })}
      </svg>
      {pin > 0.001 && (
        <div style={{ position: "absolute", left: PIN.x - 34, top: PIN.y - 92 - (1 - Math.min(1, pin)) * 140, width: 68, height: 92, opacity: Math.min(1, pin * 2) }}>
          <svg width={68} height={92} viewBox="0 0 68 92">
            <defs><linearGradient id="pg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FFF1CF" /><stop offset="0.45" stopColor={GOLD} /><stop offset="1" stopColor={GOLD2} /></linearGradient></defs>
            <path d="M34 90 C 34 90 4 54 4 33 A 30 30 0 1 1 64 33 C 64 54 34 90 34 90 Z" fill="url(#pg)" stroke="rgba(255,255,255,0.7)" strokeWidth={2} />
            <circle cx={34} cy={33} r={12} fill="#14110C" />
          </svg>
        </div>
      )}
      {has(sure) && route > 0.55 && (
        <div style={{ position: "absolute", left: 300, top: 196, padding: "8px 18px", borderRadius: 999, background: "rgba(16,16,19,0.9)", border: `1.5px solid ${GOLD}`, fontFamily: SF, fontWeight: 700, fontSize: 24, color: GOLD, opacity: p(t, 2.9, 0.3), transform: `scale(${lerp(0.7, 1, p(t, 2.9, 0.4, outBack))})` }}>{fit(sure, 12)}</div>
      )}
      <div style={{ position: "absolute", inset: 0, borderRadius: 30, boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.08), inset 0 -60px 80px rgba(0,0,0,0.35)" }} />
    </div>
  );
};

export const Konum: React.FC<KonumProps> = ({ content: u = {}, ...b }) => {
  const c = { ...DEF.konum, ...u };
  const t = useT();
  const bar = p(t, 0.15, 0.55, outQuart);
  const q = c.arama || "";
  const typed = q.slice(0, Math.floor(Math.max(0, Math.min(1, (t - 0.45) / 1.05)) * q.length));
  const caret = t < 1.7 ? (Math.floor(t * 3) % 2 === 0 ? 1 : 0) : 0;
  const card = p(t, 1.55, 0.7, outQuart);
  const row = (at: number) => ({ opacity: p(t, at, 0.4), transform: `translateY(${(1 - p(t, at, 0.5, outQuart)) * 18}px)` });
  const tapAt = Math.min(4.25, b.dur - 1.4);
  const tap = p(t, tapAt, 0.18) * (1 - p(t, tapAt + 0.2, 0.25));
  const ripple = p(t, tapAt + 0.05, 0.7, outQuart);
  const go = t >= tapAt + 0.2;
  const btn = c.buton || "Yol tarifi al";
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Clip b={b} />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.35) 0%, transparent 14%, transparent 52%, rgba(0,0,0,0.55) 100%)", opacity: bar }} />
      <div style={{ position: "absolute", left: 60, right: 60, top: 70, height: 112, borderRadius: 999, ...glassB, display: "flex", alignItems: "center", gap: 22, padding: "0 34px", boxSizing: "border-box", opacity: bar, transform: `translateY(${(1 - bar) * -40}px)` }}>
        <svg width={40} height={40} viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth={2.4} strokeLinecap="round"><circle cx={11} cy={11} r={7} /><path d="M20 20l-4-4" /></svg>
        {has(q) ? <span style={{ fontFamily: SF, fontWeight: 600, fontSize: 40, color: typed ? INK : DIM, letterSpacing: "-0.01em", whiteSpace: "nowrap", overflow: "hidden" }}>{typed || "Haritalarda ara"}<span style={{ opacity: caret, color: GOLD }}>|</span></span> : <Skel w={420} h={26} t={t} />}
      </div>
      <div style={{ position: "absolute", left: 40, width: 1000, top: 1085, borderRadius: 46, ...glassB, padding: 20, boxSizing: "border-box", opacity: card, transform: `translateY(${(1 - card) * 120}px) scale(${lerp(0.94, 1, card)})`, transformOrigin: "50% 100%" }}>
        <MapView t={t} sure={c.sure} />
        <div style={{ padding: "26px 18px 8px" }}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", ...row(2.6) }}>
            {has(c.ad) ? <div style={{ fontFamily: SF, fontWeight: 800, fontSize: 50, letterSpacing: "-0.035em", color: INK, whiteSpace: "nowrap" }}>{fit(c.ad, 18)}{has(c.vurgu) && <> <span style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 500, color: GOLD }}>{fit(c.vurgu, 12)}</span></>}</div> : <Skel w={380} h={40} r={12} t={t} />}
            {has(c.semt) ? <div style={{ fontFamily: MONO, fontSize: 22, letterSpacing: "0.12em", color: DIM, whiteSpace: "nowrap" }}>{fit(c.semt, 20).toLocaleUpperCase("tr")}</div> : <Skel w={170} h={14} t={t} />}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 12, fontFamily: SF, fontWeight: 600, fontSize: 28, color: DIM, minHeight: 36, ...row(2.85) }}>
            {has(c.puan) ? <><span style={{ color: INK }}>{c.puan!.toFixed(1).replace(".", ",")}</span><span style={{ color: GOLD, letterSpacing: 2 }}>★★★★★</span>{has(c.yorum) && <span>({c.yorum})</span>}</> : <Skel w={260} h={20} t={t} />}
            <span style={{ width: 6, height: 6, borderRadius: 3, background: DIM }} />
            {has(c.durum) ? <span style={{ color: GREEN }}>{fit(c.durum, 24)}</span> : <Skel w={200} h={20} t={t} />}
          </div>
          <div style={{ display: "flex", gap: 16, marginTop: 26, ...row(3.15) }}>
            <div style={{ position: "relative", flex: 1, height: 100, borderRadius: 999, overflow: "hidden", background: go ? `linear-gradient(180deg, #FFF1CF, ${GOLD} 50%, ${GOLD2})` : "linear-gradient(180deg, #FFFFFF, #E9E6E0)", display: "flex", alignItems: "center", justifyContent: "center", gap: 14, transform: `scale(${1 - tap * 0.05})`, boxShadow: go ? "0 0 50px rgba(230,196,135,0.45)" : "0 10px 30px rgba(0,0,0,0.35)" }}>
              {ripple > 0 && ripple < 1 && <div style={{ position: "absolute", left: "50%", top: "50%", width: 900 * ripple, height: 900 * ripple, marginLeft: -450 * ripple, marginTop: -450 * ripple, borderRadius: "50%", background: "rgba(230,196,135,0.45)", opacity: 1 - ripple }} />}
              <svg width={36} height={36} viewBox="0 0 24 24" fill="#14110C" style={{ position: "relative" }}><path d="M12 2 L21 21 L12 16.5 L3 21 Z" transform="rotate(45 12 12)" /></svg>
              <span style={{ position: "relative", fontFamily: SF, fontWeight: 800, fontSize: 38, color: "#14110C", letterSpacing: "-0.02em" }}>{go ? "Rota başladı" : fit(btn, 18)}</span>
            </div>
            {["M6.6 10.8a15.1 15.1 0 006.6 6.6l2.2-2.2a1 1 0 011-.25 11.4 11.4 0 003.6.6 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1 11.4 11.4 0 00.6 3.6 1 1 0 01-.25 1z", "M4 12v7a1 1 0 001 1h14a1 1 0 001-1v-7M16 6l-4-4-4 4M12 2v13"].map((d) => (
              <div key={d} style={{ width: 100, height: 100, borderRadius: 50, border: "1.5px solid rgba(255,255,255,0.2)", background: "rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width={38} height={38} viewBox="0 0 24 24" fill="none" stroke={INK} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d={d} /></svg>
              </div>
            ))}
          </div>
        </div>
      </div>
      {t > tapAt - 0.3 && t < tapAt + 0.65 && (
        <div style={{ position: "absolute", left: 330, top: 1690 + (1 - p(t, tapAt - 0.3, 0.3, outQuart)) * 60, width: 64, height: 64, borderRadius: 32, background: "rgba(255,255,255,0.55)", border: "2px solid rgba(255,255,255,0.9)", opacity: p(t, tapAt - 0.3, 0.2) * (1 - p(t, tapAt + 0.4, 0.25)), transform: `scale(${1 - tap * 0.25})`, boxShadow: "0 8px 24px rgba(0,0,0,0.4)" }} />
      )}
    </AbsoluteFill>
  );
};
