import React from "react";
import { AbsoluteFill, OffthreadVideo, Img, staticFile } from "remotion";
import { Base, Clip, Person, glassA, p, lerp, outBack, useT } from "../lib";

/* YÖRÜNGE — 7 cam kart kişinin etrafında elips çizer: üst yarıda başın ARKASINDAN, alt yarıda göğsün ÖNÜNDEN geçer (kesim gerekir).
   Kartlara kullanıcının kendi videoları/görselleri girer (CLI public/ altına kopyalar). Verilmezse boş cam çerçeve döner. */
export type YorungeContent = { medya?: string[] }; // public/ altındaki yollar (.mp4 ya da görsel)
export type YorungeProps = Base & { content: YorungeContent };

const N = 7;
const cards = (t: number) => Array.from({ length: N }, (_, i) => {
  const a = t * 0.9 + (i / N) * Math.PI * 2;
  const x = 540 + Math.cos(a) * 460, y = 800 + Math.sin(a) * 430;
  const depth = Math.sin(a); // < 0 → arkada (üst yarı)
  return { i, x, y, depth, s: lerp(0.62, 1, (depth + 1) / 2) };
});

const Card: React.FC<{ c: ReturnType<typeof cards>[number]; t: number; src?: string }> = ({ c, t, src }) => {
  const k = p(t, 0.1 + c.i * 0.08, 0.5, outBack);
  const isVid = !!src && /\.(mp4|mov|webm|m4v)$/i.test(src);
  return (
    <div style={{ position: "absolute", left: c.x - 105, top: c.y - 178, width: 210, height: 356, transform: `scale(${c.s * Math.max(0.01, k)})`, opacity: Math.min(1, k * 1.4) * lerp(0.8, 1, (c.depth + 1) / 2), ...glassA, borderRadius: 32, padding: 10, boxSizing: "border-box" }}>
      <div style={{ width: 190, height: 336, borderRadius: 23, overflow: "hidden", background: src ? "#000" : "linear-gradient(160deg, rgba(255,255,255,0.10), rgba(255,255,255,0.03))", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {src ? (isVid
          ? <OffthreadVideo src={staticFile(src)} muted style={{ width: 190, height: 336, objectFit: "cover" }} />
          : <Img src={staticFile(src)} style={{ width: 190, height: 336, objectFit: "cover" }} />)
          : <svg width={46} height={46} viewBox="0 0 24 24" fill="rgba(255,255,255,0.28)"><path d="M8 5.5v13l10.5-6.5z" /></svg>}
      </div>
    </div>
  );
};

export const Yorunge: React.FC<YorungeProps> = ({ content: c = {}, ...b }) => {
  const t = useT();
  const m = ((c as YorungeContent).medya || []).filter(Boolean);
  const src = (i: number) => (m.length ? m[i % m.length] : undefined);
  const all = cards(t);
  const back = all.filter((x) => x.depth < 0).sort((a, z) => a.depth - z.depth);
  const front = all.filter((x) => x.depth >= 0).sort((a, z) => a.depth - z.depth);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Clip b={b} />
      <AbsoluteFill>{back.map((x) => <Card key={x.i} c={x} t={t} src={src(x.i)} />)}</AbsoluteFill>
      <Person b={b} t={t} />
      <AbsoluteFill>{front.map((x) => <Card key={x.i} c={x} t={t} src={src(x.i)} />)}</AbsoluteFill>
    </AbsoluteFill>
  );
};
