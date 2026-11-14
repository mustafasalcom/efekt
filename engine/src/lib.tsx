import React from "react";
import { AbsoluteFill, Easing, OffthreadVideo, interpolate, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadPlayfair } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";

/* Ortak parçalar: zamanlama, yazı tipleri, cam yüzeyler, boş durum iskeletleri, kişi maskesi. */
export const FPS = 30;
export const SF = loadInter("normal", { weights: ["500", "600", "700", "800", "900"], subsets: ["latin", "latin-ext"] }).fontFamily;
export const SERIF = loadPlayfair("italic", { weights: ["500", "600"], subsets: ["latin", "latin-ext"] }).fontFamily;
export const MONO = loadMono("normal", { weights: ["500"], subsets: ["latin", "latin-ext"] }).fontFamily;

export const useT = () => useCurrentFrame() / FPS;
export const outExpo = Easing.bezier(0.16, 1, 0.3, 1);
export const outQuart = Easing.bezier(0.25, 1, 0.5, 1);
export const inOut = Easing.bezier(0.65, 0, 0.35, 1);
export const outBack = Easing.bezier(0.34, 1.56, 0.64, 1);
/** t anında, start'tan başlayıp dur süren 0→1 ilerleme */
export const p = (t: number, start: number, dur: number, ease = outExpo) =>
  interpolate(t, [start, start + dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });
export const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
export const has = (v: unknown) => v !== undefined && v !== null && !(typeof v === "string" && v.trim() === "");

/** Her efektin ortak girdileri (CLI doldurur) */
export type Base = {
  clip: string;        // public/ altındaki kesilmiş klip, ör. "job/abc/clip.mp4"
  dur: number;         // saniye
  matte?: string;      // public/ altındaki kesim karesi klasörü (15 fps)
  matteCount?: number;
};

/* Palet A — karanlık buzlu cam (grafik, liste, yörünge, bildirim, spot) */
export const INK = "#FFFFFF", GRAY = "rgba(255,255,255,0.62)", BLUE = "#007AFF", GREEN = "#34C759", RED = "#FF3B30", ORANGE = "#FF9500";
export const glassA: React.CSSProperties = {
  background: "linear-gradient(160deg, rgba(255,255,255,0.20), rgba(255,255,255,0.07))",
  backdropFilter: "blur(30px) saturate(170%)", WebkitBackdropFilter: "blur(30px) saturate(170%)",
  border: "1.5px solid rgba(255,255,255,0.28)", boxShadow: "0 24px 60px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.35)",
};
/* Palet B — "Gece Editoryal": siyah cam + şampanya altını (bölünmüş, konum, takvim) */
export const PINK = "#F5F3EF", DIM = "rgba(245,243,239,0.55)", GOLD = "#E6C487", GOLD2 = "#B8873E";
export const glassB: React.CSSProperties = {
  background: "linear-gradient(160deg, rgba(28,28,32,0.80), rgba(13,13,16,0.74))",
  backdropFilter: "blur(34px) saturate(160%)", WebkitBackdropFilter: "blur(34px) saturate(160%)",
  border: "1.5px solid rgba(255,255,255,0.16)", boxShadow: "0 40px 90px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.14)",
};
export const goldFill = `linear-gradient(180deg, #FFF1CF, ${GOLD} 50%, ${GOLD2})`;

/** Boş durum: içerik verilmediğinde yazı yerine hafif parlayan iskelet çizgi */
export const Skel: React.FC<{ w: number | string; h?: number; t?: number; r?: number; style?: React.CSSProperties; dark?: boolean }> = ({ w, h = 18, t = 0, r, style, dark }) => {
  const sh = (Math.sin(t * 2.4) + 1) / 2;
  return <div style={{ width: w, height: h, borderRadius: r ?? h / 2, background: dark ? `rgba(20,17,12,${0.14 + sh * 0.08})` : `rgba(255,255,255,${0.13 + sh * 0.09})`, ...style }} />;
};

/** Temel klip */
export const Clip: React.FC<{ b: Base; muted?: boolean }> = ({ b, muted }) => <OffthreadVideo src={staticFile(b.clip)} muted={!!muted} style={{ width: 1080, height: 1920 }} />;

/** Kişi katmanı: aynı klip, kesim PNG'si maske (15 fps). Kesim yoksa hiçbir şey çizmez. */
export const Person: React.FC<{ b: Base; t: number; style?: React.CSSProperties }> = ({ b, t, style }) => {
  if (!b.matte || !b.matteCount) return null;
  const n = Math.min(b.matteCount, Math.max(1, Math.floor(t * 15) + 1));
  const url = staticFile(`${b.matte}/${String(n).padStart(4, "0")}.png`);
  return (
    <AbsoluteFill style={{ WebkitMaskImage: `url("${url}")`, maskImage: `url("${url}")`, WebkitMaskSize: "1080px 1920px", maskSize: "1080px 1920px", ...style }}>
      <Clip b={b} muted />
    </AbsoluteFill>
  );
};

/** Kısaltma: karta sığmayan metni keser */
export const fit = (s: string | undefined, n: number) => (!s ? "" : s.length > n ? s.slice(0, n - 1).trimEnd() + "…" : s);
