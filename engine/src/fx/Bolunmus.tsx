import React from "react";
import { AbsoluteFill } from "remotion";
import { DEF } from "../defaults";
import { Base, Clip, Skel, PINK as INK, GOLD, GOLD2, SF, SERIF, MONO, p, lerp, inOut, outBack, outQuart, useT, has, fit, FPS } from "../lib";
import { OffthreadVideo, staticFile } from "remotion";

/* BÖLÜNMÜŞ — üstte siyah-altın editoryal grafik, altta yuvarlak köşeli video kartı; başın üstü kartın üst kenarından grafiğe taşar (kesim gerekir).
   Çubuk verilmezse 7 iskelet çubuk büyür, sayı yazılmaz. */
export type BolunmusContent = { ust?: string; baslik?: string; vurgu?: string; cubuklar?: { ad?: string; deger?: number }[]; birim?: string; ortalama?: number };
export type BolunmusProps = Base & { content: BolunmusContent };

const AXIS = "rgba(245,243,239,0.38)";
const CARD = { x: 30, y: 900, w: 1020, h: 990, r: 44 };
const VS = 0.95, VX = 27, VY = 545;
const CH = { x: 140, base: 680, h: 380, w: 880 };
const SKEL_H = [0.85, 0.62, 0.5, 0.38, 0.27, 0.18, 0.1];

const niceMax = (v: number) => { const e = Math.pow(10, Math.floor(Math.log10(v))); const m = v / e; return (m <= 1 ? 1 : m <= 2 ? 2 : m <= 2.5 ? 2.5 : m <= 5 ? 5 : 10) * e; };
const fmt = (v: number) => (Number.isInteger(v) ? v.toLocaleString("tr-TR") : v.toFixed(1).replace(".", ","));

export const Bolunmus: React.FC<BolunmusProps> = ({ content: u = {}, ...b }) => {
  const c = { ...DEF.bolunmus, ...u };
  const t = useT();
  const real = (c.cubuklar || []).filter((x) => has(x.deger)).slice(0, 7);
  const bars = real.length ? real : SKEL_H.map(() => ({} as { ad?: string; deger?: number }));
  const MAX = real.length ? niceMax(Math.max(...real.map((x) => x.deger!), c.ortalama || 0) * 1.1) : 1;
  const unit = c.birim || "";
  const k = p(t, 0.2, 0.7, inOut);
  const s = lerp(1, VS, k), tx = lerp(0, VX, k), ty = lerp(0, VY, k);
  const top = lerp(0, CARD.y, k), side = lerp(0, CARD.x, k), bot = lerp(0, 1920 - CARD.y - CARD.h, k), rad = lerp(0, CARD.r, k);
  const move: React.CSSProperties = { transformOrigin: "0 0", transform: `translate(${tx}px, ${ty}px) scale(${s})` };
  const title = p(t, 0.75, 0.5, outQuart);
  const avg = has(c.ortalama) && real.length ? p(t, Math.min(b.dur - 1.6, 3.9), 0.6, outQuart) : 0;
  const n = b.matteCount ? Math.min(b.matteCount, Math.max(1, Math.floor(t * 15) + 1)) : 0;
  const url = b.matte ? staticFile(`${b.matte}/${String(n).padStart(4, "0")}.png`) : "";
  const vid = <OffthreadVideo src={staticFile(b.clip)} style={{ width: 1080, height: 1920 }} />;
  const vidM = <OffthreadVideo src={staticFile(b.clip)} muted style={{ width: 1080, height: 1920 }} />;
  const step = (b.dur - 2.4) / Math.max(1, bars.length);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ opacity: Math.min(1, k * 1.6), background: "radial-gradient(ellipse 34% 12% at 50% 46%, rgba(230,196,135,0.30), transparent 75%), radial-gradient(ellipse 80% 45% at 30% 18%, rgba(230,196,135,0.13), transparent 70%), radial-gradient(ellipse 70% 50% at 90% 60%, rgba(120,110,255,0.08), transparent 70%), #0B0B0D" }}>
        <AbsoluteFill style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)", backgroundSize: "60px 60px", maskImage: "linear-gradient(180deg, #000 0%, #000 45%, transparent 80%)", WebkitMaskImage: "linear-gradient(180deg, #000 0%, #000 45%, transparent 80%)" }} />
        <div style={{ position: "absolute", left: CH.x - 60, top: 50, opacity: title, transform: `translateY(${(1 - title) * 24}px)` }}>
          {has(c.ust) ? <div style={{ fontFamily: MONO, fontSize: 22, letterSpacing: "0.22em", color: GOLD, marginBottom: 18 }}>{fit(c.ust, 30).toLocaleUpperCase("tr")}</div> : <Skel w={180} h={14} t={t} style={{ marginBottom: 24 }} />}
          {has(c.baslik) ? <div style={{ fontFamily: SF, fontWeight: 800, fontSize: 64, color: INK, letterSpacing: "-0.035em", whiteSpace: "nowrap" }}>{fit(c.baslik, 24)}</div> : <Skel w={620} h={50} r={14} t={t} />}
          {has(c.vurgu) ? <div style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 500, fontSize: 66, color: GOLD, marginTop: 4, whiteSpace: "nowrap" }}>{fit(c.vurgu, 26)}</div> : <Skel w={420} h={44} r={14} t={t} style={{ marginTop: 16 }} />}
        </div>
        {[0, 0.25, 0.5, 0.75, 1].map((f) => {
          const y = CH.base - f * CH.h;
          return (
            <React.Fragment key={f}>
              <div style={{ position: "absolute", left: CH.x, width: CH.w, top: y, height: 2, background: "rgba(255,255,255,0.08)", opacity: title }} />
              {real.length > 0 && <div style={{ position: "absolute", left: CH.x - 120, width: 102, top: y - 16, textAlign: "right", fontFamily: MONO, fontSize: 22, color: AXIS, opacity: title }}>{f ? `${fmt(MAX * f)}${unit}` : "0"}</div>}
            </React.Fragment>
          );
        })}
        {bars.map((bar, i) => {
          const a0 = 1.0 + i * step;
          if (t < a0) return null;
          const g = p(t, a0, 0.6, outBack);
          const bw = 84, gap = (CH.w - bars.length * bw) / bars.length;
          const x = CH.x + gap / 2 + i * (bw + gap);
          const frac = real.length ? bar.deger! / MAX : SKEL_H[i];
          const h = frac * CH.h * Math.max(0, g);
          const first = i === 0 && real.length > 0;
          return (
            <React.Fragment key={i}>
              <div style={{ position: "absolute", left: x, width: bw, top: CH.base - h, height: h, borderRadius: "16px 16px 4px 4px", boxSizing: "border-box",
                background: !real.length ? "linear-gradient(180deg, rgba(255,255,255,0.16), rgba(255,255,255,0.05))" : first ? `linear-gradient(180deg, #FFF1CF 0%, ${GOLD} 35%, ${GOLD2} 100%)` : "linear-gradient(180deg, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.55) 45%, rgba(255,255,255,0.14) 100%)",
                boxShadow: first ? "0 0 40px rgba(230,196,135,0.45), inset 0 1px 0 rgba(255,255,255,0.8)" : real.length ? "inset 0 1px 0 rgba(255,255,255,0.9)" : undefined,
                border: first ? "none" : "1px solid rgba(255,255,255,0.25)" }} />
              {real.length > 0 && <div style={{ position: "absolute", left: x - 50, width: bw + 100, top: CH.base - h - 58, textAlign: "center", fontFamily: SF, fontWeight: 800, fontSize: first ? 44 : 34, letterSpacing: "-0.03em", color: first ? GOLD : INK, whiteSpace: "nowrap" }}>{fmt(Math.round(bar.deger! * Math.min(1, p(t, a0, 0.6, outQuart)) * 10) / 10)}{unit}</div>}
              {has(bar.ad) ? <div style={{ position: "absolute", left: x - 40, width: bw + 80, top: CH.base + 12, textAlign: "center", fontFamily: SF, fontWeight: 600, fontSize: 23, color: "rgba(245,243,239,0.6)", whiteSpace: "nowrap" }}>{fit(bar.ad, 9)}</div>
                : <Skel w={56} h={12} t={t} style={{ position: "absolute", left: x + 14, top: CH.base + 20 }} />}
            </React.Fragment>
          );
        })}
        {avg > 0 && (
          <>
            <div style={{ position: "absolute", left: CH.x, width: CH.w * avg, top: CH.base - (c.ortalama! / MAX) * CH.h, borderTop: `2px dashed ${GOLD}`, opacity: 0.8 }} />
            <div style={{ position: "absolute", left: CH.x + CH.w - 190, width: 190, textAlign: "right", top: CH.base - (c.ortalama! / MAX) * CH.h - 40, fontFamily: MONO, fontSize: 22, color: GOLD, opacity: avg }}>ort. {fmt(c.ortalama!)}{unit}</div>
          </>
        )}
      </AbsoluteFill>
      <div style={{ position: "absolute", left: side, top, right: side, bottom: bot, borderRadius: rad, boxShadow: `0 40px 90px rgba(0,0,0,${0.6 * k}), 0 0 0 1.5px rgba(255,255,255,${0.22 * k}), 0 -20px 80px rgba(230,196,135,${0.12 * k})` }} />
      <AbsoluteFill style={{ clipPath: `inset(${top}px ${side}px ${bot}px ${side}px round ${rad}px)` }}>
        <AbsoluteFill style={move}>{vid}</AbsoluteFill>
      </AbsoluteFill>
      {url && (
        <AbsoluteFill style={{ clipPath: `inset(0px ${side}px ${bot}px ${side}px)` }}>
          <AbsoluteFill style={move}>
            <AbsoluteFill style={{ WebkitMaskImage: `url("${url}")`, maskImage: `url("${url}")`, WebkitMaskSize: "1080px 1920px", maskSize: "1080px 1920px" }}>{vidM}</AbsoluteFill>
          </AbsoluteFill>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
export const _fps = FPS;
