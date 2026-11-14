import React from "react";
import { AbsoluteFill } from "remotion";
import { DEF } from "../defaults";
import { Base, Clip, Skel, glassB, goldFill, PINK as INK, DIM, GOLD, SF, SERIF, MONO, p, lerp, inOut, outBack, outQuart, useT, has, fit } from "../lib";

/* TAKVİM — göğüs hizasında siyah cam hafta görünümü; etkinlikler günlere yaylanarak düşer, altın "şimdi" çizgisi tarar, üstte bildirim iner.
   Kesim gerekmez. Etkinlik verilmezse ızgaraya boş cam bloklar düşer; tarih/ay verilmezse iskelet görünür. */
export type Etkinlik = { gun: number; saat: number | string; sure?: number; baslik?: string; alt?: string; vurgulu?: boolean };
export type TakvimContent = { ay?: string; yil?: string; tarihler?: number[]; bugun?: number; bildirim?: string; etkinlikler?: Etkinlik[] };
export type TakvimProps = Base & { content: TakvimContent };

const DAYS = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];
const FAINT = "rgba(255,255,255,0.07)";
const CW = 1000, PAD = 24, TL = 64, COLW = (CW - PAD * 2 - TL) / 7;
const H0 = 9, H1 = 18, HH = 52;
const EMPTY: Etkinlik[] = [[0, 9.5, 2], [1, 13, 1.7], [2, 10.5, 1.7], [3, 14.5, 1.8], [4, 9, 1.6], [5, 12, 1.8], [6, 15, 1.6]].map(([gun, saat, sure]) => ({ gun, saat, sure }));
const hour = (s: number | string) => (typeof s === "number" ? s : (() => { const [h, m] = String(s).split(":").map(Number); return (h || 0) + (m || 0) / 60; })());

export const Takvim: React.FC<TakvimProps> = ({ content: u = {}, ...b }) => {
  const c = { ...DEF.takvim, ...u };
  const t = useT();
  const given = (c.etkinlikler || []).filter((e) => e && e.gun >= 0 && e.gun <= 6).slice(0, 10);
  const evs = given.length ? given : EMPTY;
  const real = given.length > 0;
  const today = has(c.bugun) ? c.bugun! : -1;
  const card = p(t, 0.15, 0.75, outQuart);
  const cardBlur = (1 - p(t, 0.15, 0.5)) * 18;
  const head = (i: number) => p(t, 0.45 + i * 0.05, 0.4, outQuart);
  const step = Math.min(0.4, (b.dur - 2.8) / Math.max(1, evs.length));
  const nowAt = Math.min(3.75, b.dur - 1.9);
  const now = p(t, nowAt, 1.1, inOut);
  const shimmer = p(t, b.dur - 1.15, 0.8, inOut);
  const toast = has(c.bildirim) ? p(t, Math.min(4.25, b.dur - 1.4), 0.55, outBack) : 0;
  const placed = evs.filter((_, i) => t >= 1.0 + i * step + 0.2).length;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Clip b={b} />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.3) 0%, transparent 12%, transparent 50%, rgba(0,0,0,0.6) 100%)", opacity: card }} />
      {toast > 0.001 && (
        <div style={{ position: "absolute", left: 60, right: 60, top: 64, height: 120, borderRadius: 36, ...glassB, display: "flex", alignItems: "center", gap: 22, padding: "0 28px", boxSizing: "border-box", opacity: Math.min(1, toast * 1.4), transform: `translateY(${(1 - Math.min(1, toast)) * -70}px) scale(${lerp(0.92, 1, Math.min(1, toast))})` }}>
          <div style={{ width: 74, height: 74, borderRadius: 18, background: "#F5F3EF", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flex: "none" }}>
            <div style={{ fontFamily: SF, fontWeight: 700, fontSize: 15, color: "#D9433A", lineHeight: 1 }}>{today >= 0 ? DAYS[today].toLocaleUpperCase("tr") : "TAKVİM"}</div>
            <div style={{ fontFamily: SF, fontWeight: 600, fontSize: 40, color: "#14110C", lineHeight: 1 }}>{today >= 0 && c.tarihler ? c.tarihler[today] : "✓"}</div>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: SF, fontWeight: 700, fontSize: 30, color: INK }}>Takvim <span style={{ fontWeight: 500, color: DIM }}>· şimdi</span></div>
            <div style={{ fontFamily: SF, fontWeight: 500, fontSize: 30, color: INK, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.bildirim}</div>
          </div>
          <div style={{ width: 54, height: 54, borderRadius: 27, background: goldFill, display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
            <svg width={30} height={30} viewBox="0 0 24 24" fill="none" stroke="#14110C" strokeWidth={3.2} strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
          </div>
        </div>
      )}
      <div style={{ position: "absolute", left: 40, width: CW, top: 1075, borderRadius: 46, ...glassB, padding: `26px ${PAD}px 24px`, boxSizing: "border-box", overflow: "hidden", opacity: card, transform: `translateY(${(1 - card) * 130}px) scale(${lerp(0.93, 1, card)})`, transformOrigin: "50% 100%", filter: cardBlur > 0.3 ? `blur(${cardBlur}px)` : undefined }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", padding: "0 6px 18px", minHeight: 58 }}>
          {has(c.ay) ? <div style={{ fontFamily: SF, fontWeight: 800, fontSize: 48, letterSpacing: "-0.035em", color: INK }}>{fit(c.ay, 12)} {has(c.yil) && <span style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 500, color: GOLD }}>{c.yil}</span>}</div> : <Skel w={300} h={38} r={12} t={t} />}
          <div style={{ fontFamily: MONO, fontSize: 22, letterSpacing: "0.14em", color: placed === evs.length ? GOLD : DIM }}>{placed}/{evs.length} PLANLANDI</div>
        </div>
        <div style={{ display: "flex", marginLeft: TL, marginBottom: 12 }}>
          {DAYS.map((d, i) => (
            <div key={d} style={{ width: COLW, display: "flex", flexDirection: "column", alignItems: "center", opacity: head(i), transform: `translateY(${(1 - head(i)) * 14}px)` }}>
              <div style={{ fontFamily: SF, fontWeight: 600, fontSize: 21, color: i === today ? GOLD : DIM }}>{d}</div>
              {c.tarihler && has(c.tarihler[i])
                ? <div style={{ marginTop: 6, width: 52, height: 52, borderRadius: 26, display: "flex", alignItems: "center", justifyContent: "center", background: i === today ? goldFill : "transparent", fontFamily: SF, fontWeight: 700, fontSize: 28, color: i === today ? "#14110C" : INK, boxShadow: i === today ? "0 0 30px rgba(230,196,135,0.45)" : undefined }}>{c.tarihler[i]}</div>
                : <Skel w={40} h={40} r={20} t={t} style={{ marginTop: 12 }} />}
            </div>
          ))}
        </div>
        <div style={{ position: "relative", height: (H1 - H0) * HH + 6 }}>
          {Array.from({ length: H1 - H0 + 1 }, (_, i) => H0 + i).map((h, i) => (
            <React.Fragment key={h}>
              <div style={{ position: "absolute", left: 0, width: TL - 12, top: i * HH - 11, textAlign: "right", fontFamily: MONO, fontSize: 17, color: "rgba(245,243,239,0.38)" }}>{i % 2 === 0 ? `${String(h).padStart(2, "0")}:00` : ""}</div>
              <div style={{ position: "absolute", left: TL, right: 0, top: i * HH, height: 1.5, background: FAINT }} />
            </React.Fragment>
          ))}
          {DAYS.map((_, i) => <div key={i} style={{ position: "absolute", top: 0, bottom: 0, left: TL + i * COLW, width: 1.5, background: FAINT }} />)}
          {today >= 0 && <div style={{ position: "absolute", top: 0, bottom: 0, left: TL + today * COLW, width: COLW, background: "linear-gradient(180deg, rgba(230,196,135,0.10), rgba(230,196,135,0.02))" }} />}
          {evs.map((e, i) => {
            const at = 1.0 + i * step;
            if (t < at) return null;
            const k = p(t, at, 0.6, outBack);
            const st = Math.max(H0, Math.min(H1 - 0.8, hour(e.saat)));
            const du = Math.max(0.8, Math.min(H1 - st, e.sure || 1.6));
            const gold = real && !!e.vurgulu;
            const ttl = e.baslik || "";
            return (
              <div key={i} style={{ position: "absolute", left: TL + e.gun * COLW + 5, top: (st - H0) * HH + 3, width: COLW - 10, height: du * HH - 6, borderRadius: 14, overflow: "hidden", padding: "12px 6px 0 13px", boxSizing: "border-box",
                background: gold ? `linear-gradient(170deg, #FFF1CF, ${GOLD} 45%, #B8873E)` : real ? "linear-gradient(170deg, rgba(255,255,255,0.26), rgba(255,255,255,0.10))" : "linear-gradient(170deg, rgba(255,255,255,0.12), rgba(255,255,255,0.04))",
                border: gold ? "none" : `1.5px ${real ? "solid" : "dashed"} rgba(255,255,255,${real ? 0.28 : 0.22})`, boxShadow: gold ? "0 10px 30px rgba(230,196,135,0.35)" : "0 10px 24px rgba(0,0,0,0.3)",
                opacity: Math.min(1, p(t, at, 0.25)), transform: `translateY(${(1 - Math.min(1, k)) * -90}px) scale(${lerp(0.8, 1, Math.min(1.06, k))})` }}>
                {real && <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 5, background: gold ? "#14110C" : GOLD, opacity: gold ? 0.25 : 0.9 }} />}
                {has(ttl) ? <div style={{ fontFamily: SF, fontWeight: 700, fontSize: ttl.length > 7 ? 19 : 23, lineHeight: 1.1, letterSpacing: "-0.02em", whiteSpace: "nowrap", color: gold ? "#14110C" : INK }}>{fit(ttl, 10)}</div> : <Skel w="70%" h={14} t={t} dark={gold} />}
                {has(e.alt) ? <div style={{ fontFamily: SF, fontWeight: 500, fontSize: 18, marginTop: 4, whiteSpace: "nowrap", color: gold ? "rgba(20,17,12,0.72)" : DIM }}>{fit(e.alt, 10)}</div> : real ? null : <Skel w="45%" h={10} t={t} style={{ marginTop: 8 }} />}
              </div>
            );
          })}
          {now > 0 && now < 1 && (
            <div style={{ position: "absolute", top: -4, bottom: -4, left: TL + now * (COLW * 7), width: 3, background: GOLD, boxShadow: "0 0 18px rgba(230,196,135,0.9)" }}>
              <div style={{ position: "absolute", top: -7, left: -6, width: 15, height: 15, borderRadius: 8, background: GOLD }} />
            </div>
          )}
        </div>
        {shimmer > 0 && shimmer < 1 && <div style={{ position: "absolute", top: 0, bottom: 0, left: lerp(-300, CW + 100, shimmer), width: 220, background: "linear-gradient(100deg, transparent, rgba(255,241,207,0.16), transparent)", transform: "skewX(-18deg)" }} />}
      </div>
    </AbsoluteFill>
  );
};
