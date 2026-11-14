import React from "react";
import { AbsoluteFill } from "remotion";
import { DEF } from "../defaults";
import { Base, Clip, Skel, glassA, INK, GRAY, GREEN, RED, ORANGE, SF, MONO, p, lerp, outBack, outQuart, useT, has, fit } from "../lib";

/* LİSTE — göğüs hizasında buzlu cam checklist; maddeler sırayla tik alır, sıradaki maddede halka döner.
   Kesim gerekmez. Madde verilmezse 4 boş iskelet satır görünür ve yine sırayla işaretlenir. */
export type ListeItem = { metin?: string; etiket?: string; zaman?: number; kotu?: boolean };
export type ListeContent = { baslik?: string; maddeler?: ListeItem[] };
export type ListeProps = Base & { content: ListeContent };

const Spark: React.FC<{ t: number }> = ({ t }) => (
  <svg width={34} height={34} viewBox="0 0 34 34" style={{ transform: `rotate(${t * 40}deg)` }}>{[0, 45, 90, 135].map((r) => <rect key={r} x={15} y={1} width={4} height={32} rx={2} fill={ORANGE} transform={`rotate(${r} 17 17)`} />)}</svg>
);

export const Liste: React.FC<ListeProps> = ({ content: u = {}, ...b }) => {
  const c = { ...DEF.liste, ...u };
  const t = useT();
  const given = (c.maddeler || []).slice(0, 5);
  const items: ListeItem[] = given.length ? given : [{}, {}, {}, {}];
  const n = items.length;
  /* zaman verilmeyen maddeler 0.6 sn ile (süre − 1.4 sn) arasına eşit dağılır */
  const span = Math.max(1, b.dur - 2.0);
  const at = items.map((it, i) => (has(it.zaman) ? it.zaman! : 0.6 + (span * i) / Math.max(1, n - 1)));
  const card = p(t, 0.15, 0.5, outQuart);
  const done = at.filter((a) => t >= a).length;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Clip b={b} />
      <div style={{ position: "absolute", left: 56, width: 968, top: 1090, opacity: card, transform: `translateY(${(1 - card) * 40}px) scale(${lerp(0.96, 1, card)})`, transformOrigin: "50% 100%" }}>
        <div style={{ ...glassA, borderRadius: 40, padding: "30px 38px 14px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingBottom: 22, borderBottom: "2px solid rgba(255,255,255,0.22)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <Spark t={t} />
              {has(c.baslik) ? <span style={{ fontFamily: SF, fontWeight: 800, fontSize: 44, color: INK, letterSpacing: "-0.02em", whiteSpace: "nowrap" }}>{fit(c.baslik, 26)}</span> : <Skel w={360} h={30} t={t} />}
            </div>
            <span style={{ fontFamily: SF, fontWeight: 600, fontSize: 32, color: GRAY }}>{done}/{n}</span>
          </div>
          {items.map((it, i) => {
            const on = t >= at[i];
            const active = !on && (i === 0 || t >= at[i - 1]) && t > 0.3;
            const k = p(t, at[i], 0.3, outBack);
            const bad = !!it.kotu;
            const col = bad ? RED : GREEN;
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 24, padding: "24px 0" }}>
                <div style={{ position: "relative", width: 48, height: 48, flex: "none" }}>
                  {on ? (
                    <div style={{ width: 48, height: 48, borderRadius: "50%", background: col, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${lerp(0.5, 1, Math.min(1.1, k))})` }}>
                      <svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={3.4} strokeLinecap="round" strokeLinejoin="round">{bad ? <path d="M7 7l10 10M17 7L7 17" /> : <path d="M5 12.5l4.5 4.5L19 7.5" />}</svg>
                    </div>
                  ) : (
                    <svg width={48} height={48} viewBox="0 0 48 48">
                      <circle cx={24} cy={24} r={21} fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth={3} />
                      {active && <circle cx={24} cy={24} r={21} fill="none" stroke={ORANGE} strokeWidth={3.4} strokeLinecap="round" pathLength={1} strokeDasharray="0.28 1" transform={`rotate(${t * 420} 24 24)`} />}
                    </svg>
                  )}
                </div>
                {has(it.metin)
                  ? <span style={{ flex: 1, fontFamily: SF, fontWeight: 700, fontSize: 42, letterSpacing: "-0.01em", color: on || active ? INK : "rgba(255,255,255,0.5)", whiteSpace: "nowrap", overflow: "hidden" }}>{fit(it.metin, 24)}</span>
                  : <div style={{ flex: 1 }}><Skel w={`${[62, 48, 56, 40, 52][i % 5]}%`} h={24} t={t} /></div>}
                {has(it.etiket) ? <span style={{ fontFamily: MONO, fontWeight: 500, fontSize: 30, color: on ? (bad ? "#FF6B61" : "#4CE07A") : "rgba(255,255,255,0.5)", whiteSpace: "nowrap" }}>{fit(it.etiket, 12)}</span> : null}
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
