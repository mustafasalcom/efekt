import React from "react";
import { AbsoluteFill } from "remotion";
import { DEF } from "../defaults";
import { Base, Clip, SF, p, lerp, inOut, outBack, useT, has } from "../lib";

/* SPOT — oda kararır, yüz ve omuzlar aydınlık kalır, tepeden ışık huzmesi iner; göğüs hizasında neon kelimeler sırayla yanar.
   Kesim gerekmez. Kelime verilmezse yalnızca ışık efekti oynar. */
export type SpotContent = { kelimeler?: { metin?: string; renk?: string }[] };
export type SpotProps = Base & { content: SpotContent };
const NEON = ["#FF4FA3", "#5AC8FA", "#FFD60A"];

export const Spot: React.FC<SpotProps> = ({ content: u = {}, ...b }) => {
  const c = { ...DEF.spot, ...u };
  const t = useT();
  const dark = p(t, 0.05, 0.5, inOut);
  const words = (c.kelimeler || []).filter((w) => has(w.metin)).slice(0, 3);
  const slot = (b.dur - 0.5) / Math.max(1, words.length);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Clip b={b} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 44% 30% at 50% 34%, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.9) 100%)", opacity: dark }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: -40, height: 1300, background: "linear-gradient(180deg, rgba(255,244,225,0.30), rgba(255,244,225,0.06) 70%, transparent)", clipPath: "polygon(43% 0, 57% 0, 86% 100%, 14% 100%)", filter: "blur(24px)", opacity: dark, mixBlendMode: "screen" }} />
      {words.map((w, i) => {
        const a0 = 0.4 + i * slot;
        const isLast = i === words.length - 1;
        const k = p(t, a0, 0.5, outBack) * (isLast ? 1 : 1 - p(t, a0 + slot - 0.35, 0.25));
        if (k <= 0.001) return null;
        const col = w.renk || NEON[i % NEON.length];
        const txt = w.metin!.toLocaleUpperCase("tr");
        return (
          <div key={i} style={{ position: "absolute", left: 0, right: 0, top: 1240, textAlign: "center", fontFamily: SF, fontWeight: 900, fontSize: txt.length > 9 ? 150 : txt.length > 7 ? 180 : 230, fontStyle: "italic", letterSpacing: "-0.03em", color: "rgba(255,255,255,0.95)", opacity: Math.min(1, k * 1.3) * (0.85 + 0.15 * Math.sin(t * 22)), transform: `scale(${lerp(1.3, 1, Math.min(1, k))})`, textShadow: `0 0 6px ${col}, 0 0 18px ${col}, 0 0 42px ${col}, 0 0 90px ${col}`, whiteSpace: "nowrap" }}>{txt}</div>
        );
      })}
    </AbsoluteFill>
  );
};
