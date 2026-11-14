import React from "react";
import { AbsoluteFill } from "remotion";
import { DEF } from "../defaults";
import { Base, Clip, Person, Skel, glassA, INK, GRAY, GREEN, RED, ORANGE, SF, MONO, p, lerp, inOut, outBack, outQuart, useT, has, fit } from "../lib";

/* GRAFİK — başın etrafında 7 cam widget, kişinin ARKASINDA (kesim gerekir).
   Sol: büyük sayı · mini rapor (çubuk grafik) · tarih kartı. Sağ: ilerleme · puan · oynatıcı · halka.
   İçerik verilmeyen widget boş iskelet olarak görünür. */
export type GrafikContent = {
  sayi?: { etiket?: string; deger?: number; birim?: string; alt?: string };            // 30 + "x" + "ROAS ilk hafta"
  rapor?: { dosya?: string; baslik?: string; deger?: string; cubuklar?: number[] };     // cubuklar 0–1 arası, en fazla 7
  tarih?: { gun?: string; saat?: string; etiket?: string };
  ilerleme?: { baslik?: string; alt?: string; yuzde?: number };                        // yuzde 0–100
  puan?: { baslik?: string; deger?: number; alt?: string };                            // deger 0–5
  oynatici?: { ust?: string; baslik?: string; alt?: string };
  halka?: { deger?: number; toplam?: number; etiket?: string };
};
export type GrafikProps = Base & { content: GrafikContent };

const W: React.FC<{ t: number; at: number; x: number; y: number; w: number; h: number; children: React.ReactNode; pad?: string }> = ({ t, at, x, y, w, h, children, pad = "22px 26px" }) => {
  const k = p(t, at, 0.55, outBack);
  const fl = Math.sin(t * 1.3 + x * 0.013 + y * 0.007) * 5;
  const blur = (1 - Math.min(1, p(t, at, 0.35))) * 14;
  return (
    <div style={{ position: "absolute", left: x, top: y + fl, width: w, height: h, transform: `scale(${lerp(0.7, 1, Math.min(1.04, k))})`, opacity: Math.min(1, p(t, at, 0.3)), filter: blur > 0.2 ? `blur(${blur}px)` : undefined }}>
      <div style={{ ...glassA, borderRadius: 38, width: "100%", height: "100%", padding: pad, boxSizing: "border-box", overflow: "hidden" }}>{children}</div>
    </div>
  );
};
const Lbl: React.FC<{ children: React.ReactNode; c?: string; s?: number }> = ({ children, c = GRAY, s = 26 }) => <div style={{ fontFamily: SF, fontWeight: 600, fontSize: s, color: c, lineHeight: 1.15 }}>{children}</div>;
const Dot: React.FC<{ c: string }> = ({ c }) => <span style={{ display: "inline-block", width: 16, height: 16, borderRadius: 8, background: c, marginRight: 10, verticalAlign: "middle" }} />;
const Star: React.FC<{ s?: number }> = ({ s = 44 }) => <svg width={s} height={s} viewBox="0 0 34 34">{[0, 45, 90, 135].map((r) => <rect key={r} x={15} y={1} width={4} height={32} rx={2} fill="#fff" transform={`rotate(${r} 17 17)`} />)}</svg>;

export const Grafik: React.FC<GrafikProps> = ({ content: u = {}, ...b }) => {
  const c = { ...DEF.grafik, ...u };
  const t = useT();
  const sayi = c.sayi || {}, rapor = c.rapor || {}, tarih = c.tarih || {}, ilr = c.ilerleme || {}, puan = c.puan || {}, oyn = c.oynatici || {}, hal = c.halka || {};
  const grow = p(t, 0.9, 2.4, inOut);
  const cnt = p(t, 1.2, 2.6, outQuart);
  const bars = (rapor.cubuklar && rapor.cubuklar.length ? rapor.cubuklar : [0.18, 0.27, 0.36, 0.5, 0.62, 0.8, 1]).slice(0, 7);
  const barsReal = !!(rapor.cubuklar && rapor.cubuklar.length);
  const ilrK = has(ilr.yuzde) ? lerp(0, Math.max(0, Math.min(100, ilr.yuzde!)) / 100, p(t, 0.5, 4.5, inOut)) : 0;
  const ring = p(t, 0.6, 3.2, inOut);
  const play = p(t, 0.8, Math.max(1, b.dur - 0.8), (x) => x);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Clip b={b} />
      {/* SOL */}
      <W t={t} at={0.15} x={50} y={120} w={300} h={290}>
        {has(sayi.etiket) ? <Lbl><Dot c={RED} />{fit(sayi.etiket, 16)}</Lbl> : <Skel w={150} t={t} />}
        {has(sayi.deger) ? (
          <div style={{ fontFamily: SF, fontWeight: 800, fontSize: 132, lineHeight: 1, letterSpacing: "-0.05em", color: INK, marginTop: 12, whiteSpace: "nowrap" }}>{Math.round(sayi.deger! * p(t, 2.6, 1.2, outQuart))}{sayi.birim || ""}</div>
        ) : <Skel w={190} h={104} r={20} t={t} style={{ margin: "16px 0 12px" }} />}
        {has(sayi.alt) ? <Lbl c="rgba(255,255,255,0.85)" s={28}>{fit(sayi.alt, 30)}</Lbl> : <Skel w={120} t={t} />}
      </W>
      <W t={t} at={0.35} x={50} y={450} w={330} h={330} pad="16px 16px">
        <div style={{ fontFamily: MONO, fontSize: 19, color: GRAY, margin: "2px 6px 12px", whiteSpace: "nowrap" }}>{has(rapor.dosya) ? fit(rapor.dosya, 24) : "rapor.html"}</div>
        <div style={{ background: "rgba(255,255,255,0.94)", borderRadius: 22, padding: "16px 18px", height: 246, boxSizing: "border-box" }}>
          <div style={{ display: "flex", gap: 7, marginBottom: 10 }}>{["#FF5F57", "#FEBC2E", "#28C840"].map((x) => <span key={x} style={{ width: 12, height: 12, borderRadius: 6, background: x }} />)}</div>
          {has(rapor.baslik) ? <div style={{ fontFamily: SF, fontWeight: 700, fontSize: 26, color: "#1D1D1F", whiteSpace: "nowrap" }}>{fit(rapor.baslik, 18)}</div> : <Skel w={170} dark t={t} />}
          {has(rapor.deger) ? <div style={{ fontFamily: SF, fontWeight: 800, fontSize: 40, color: "#E0452B", letterSpacing: "-0.03em" }}>{fit(rapor.deger, 10)}</div> : <Skel w={110} h={30} dark t={t} style={{ margin: "10px 0 6px" }} />}
          <div style={{ display: "flex", alignItems: "flex-end", gap: 9, height: 92, marginTop: 6 }}>
            {bars.map((h, i) => { const k = Math.min(1, Math.max(0, grow * bars.length - i)); return <div key={i} style={{ flex: 1, height: `${Math.max(0, Math.min(1, h)) * 100 * outQuart(k)}%`, borderRadius: 4, background: barsReal ? (i === bars.length - 1 ? "#F2B33D" : "#E0452B") : "rgba(20,17,12,0.12)" }} />; })}
          </div>
        </div>
      </W>
      <W t={t} at={0.55} x={50} y={815} w={250} h={170}>
        {has(tarih.gun) ? <Lbl c={RED} s={22}>{fit(tarih.gun, 12).toLocaleUpperCase("tr")}</Lbl> : <Skel w={90} h={14} t={t} />}
        {has(tarih.saat) ? <div style={{ fontFamily: SF, fontWeight: 800, fontSize: 64, lineHeight: 1, color: INK, margin: "4px 0 10px" }}>{fit(tarih.saat, 7)}</div> : <Skel w={150} h={52} r={12} t={t} style={{ margin: "10px 0 12px" }} />}
        {has(tarih.etiket) ? <span style={{ padding: "5px 14px", borderRadius: 10, background: RED, fontFamily: SF, fontWeight: 700, fontSize: 21, color: "#fff", whiteSpace: "nowrap" }}>{fit(tarih.etiket, 16)}</span> : <Skel w={130} h={30} r={10} t={t} />}
      </W>
      {/* SAĞ — başın sağ kenarından taşan dar sütun, içerik sağa yaslı */}
      <W t={t} at={0.25} x={630} y={60} w={410} h={150}>
        {has(ilr.baslik) ? <Lbl c={INK} s={30}><Dot c={GREEN} />{fit(ilr.baslik, 20)}</Lbl> : <Skel w={240} h={22} t={t} />}
        <div style={{ height: 14, borderRadius: 7, background: "rgba(255,255,255,0.25)", margin: "22px 0 12px" }}><div style={{ width: `${ilrK * 100}%`, height: "100%", borderRadius: 7, background: "#fff" }} /></div>
        {has(ilr.alt) ? <Lbl s={22}>{fit(ilr.alt, 32)}{has(ilr.yuzde) ? ` · %${Math.round(ilrK * 100)}` : ""}</Lbl> : <Skel w={200} h={14} t={t} />}
      </W>
      <W t={t} at={0.45} x={800} y={245} w={240} h={220} pad="20px 22px">
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", textAlign: "right" }}>
          {has(puan.baslik) ? <Lbl s={20}>{fit(puan.baslik, 16)}</Lbl> : <Skel w={110} h={14} t={t} />}
          {has(puan.deger) ? <div style={{ fontFamily: SF, fontWeight: 800, fontSize: 72, lineHeight: 1, letterSpacing: "-0.04em", color: INK, marginTop: 8 }}>{lerp(Math.max(0, puan.deger! - 1.7), puan.deger!, cnt).toFixed(1).replace(".", ",")}</div> : <Skel w={110} h={60} r={14} t={t} style={{ marginTop: 12 }} />}
          <div style={{ fontSize: 28, letterSpacing: 2, color: has(puan.deger) ? "#FFCC00" : "rgba(255,255,255,0.2)", margin: "6px 0 4px" }}>★★★★★</div>
          {has(puan.alt) ? <Lbl s={20}>{fit(puan.alt, 18)}</Lbl> : <Skel w={140} h={14} t={t} />}
        </div>
      </W>
      <W t={t} at={0.65} x={800} y={495} w={240} h={230} pad="18px 20px">
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", textAlign: "right" }}>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            {has(oyn.ust) ? <div style={{ fontFamily: MONO, fontSize: 15, color: GRAY, lineHeight: 1.2, maxWidth: 110 }}>{fit(oyn.ust, 16).toLocaleUpperCase("tr")}</div> : <Skel w={70} h={12} t={t} />}
            <div style={{ width: 54, height: 54, borderRadius: 14, background: ORANGE, display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}><Star s={32} /></div>
          </div>
          {has(oyn.baslik) ? <div style={{ fontFamily: SF, fontWeight: 700, fontSize: 30, color: INK, marginTop: 12, whiteSpace: "nowrap" }}>{fit(oyn.baslik, 11)}</div> : <Skel w={150} h={24} t={t} style={{ marginTop: 16 }} />}
          {has(oyn.alt) ? <Lbl s={20}>{fit(oyn.alt, 16)}</Lbl> : <Skel w={100} h={14} t={t} style={{ marginTop: 8 }} />}
        </div>
        <div style={{ height: 6, borderRadius: 3, background: "rgba(255,255,255,0.25)", margin: "14px 0 8px" }}><div style={{ width: `${play * 100}%`, height: "100%", borderRadius: 3, background: "#fff" }} /></div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, color: INK, padding: "0 10px" }}><span>◀◀</span><span>▶</span><span>▶▶</span></div>
      </W>
      <W t={t} at={0.85} x={800} y={755} w={240} h={250} pad="16px">
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
          <svg width={170} height={170} viewBox="0 0 170 170">
            <circle cx={85} cy={85} r={68} stroke="rgba(255,255,255,0.18)" strokeWidth={16} fill="none" />
            {has(hal.deger) && <circle cx={85} cy={85} r={68} stroke={GREEN} strokeWidth={16} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={`${ring * Math.min(1, hal.deger! / (hal.toplam || hal.deger || 1))} 1`} transform="rotate(-90 85 85)" />}
            {has(hal.deger) && <text x={85} y={100} textAnchor="middle" fontFamily={SF} fontWeight={800} fontSize={hal.toplam ? 46 : 52} fill="#fff">{Math.round(hal.deger! * ring)}{hal.toplam ? `/${hal.toplam}` : ""}</text>}
          </svg>
          {has(hal.etiket) ? <Lbl s={22}>{fit(hal.etiket, 16)}</Lbl> : <Skel w={120} h={14} t={t} />}
        </div>
      </W>
      <Person b={b} t={t} />
    </AbsoluteFill>
  );
};
