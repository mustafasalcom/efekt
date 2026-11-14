import React from "react";
import { AbsoluteFill } from "remotion";
import { DEF } from "../defaults";
import { Base, Clip, Skel, glassA, INK, GRAY, GREEN, BLUE, ORANGE, SF, p, lerp, inOut, outBack, useT, has, fit } from "../lib";

/* BİLDİRİM — Telefon bildirimleri yüzün altına ve üst banda düşer, sonra tek bir cam kartta toplanır.
   Kesim gerekmez. İçerik verilmezse bildirimler ve kart satırları iskelet olarak görünür. */
export type Bildirim1 = { uygulama?: string; mesaj?: string; renk?: string };
export type BildirimContent = { bildirimler?: Bildirim1[]; kart?: { baslik?: string; rozet?: string; satirlar?: { ad?: string; durum?: string }[] } };
export type BildirimProps = Base & { content: BildirimContent };

const POS: [number, number][] = [[20, 1110], [600, 1235], [20, 1360], [600, 1485], [310, 50]];
const APP_COL = ["#34C759", "#E1306C", "#007AFF", "#34C759", "#E1306C"];
const PILL = [ORANGE, BLUE, GREEN];

export const Bildirim: React.FC<BildirimProps> = ({ content: u = {}, ...b }) => {
  const c = { ...DEF.bildirim, ...u };
  const t = useT();
  const nots: Bildirim1[] = (c.bildirimler && c.bildirimler.length ? c.bildirimler : [{}, {}, {}, {}, {}]).slice(0, 5);
  const kart = c.kart || {};
  const rows = (kart.satirlar && kart.satirlar.length ? kart.satirlar : [{}, {}, {}]).slice(0, 3);
  const g0 = Math.min(2.2, b.dur * 0.38);
  const gather = p(t, g0, 0.7, inOut);
  const crm = p(t, g0 + 0.4, 0.5, outBack);
  const last = p(t, Math.min(b.dur - 1.3, g0 + 2.2), 0.4, outBack);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Clip b={b} />
      {nots.map((nt, i) => {
        const at = 0.15 + i * 0.34;
        if (t < at) return null;
        const k = p(t, at, 0.45, outBack);
        const [x, y] = POS[i];
        const tx = lerp(x, 310, gather), ty = lerp(y, 1150 + i * 8, gather);
        return (
          <div key={i} style={{ position: "absolute", left: tx, top: ty, width: 460, opacity: Math.min(1, k * 1.4) * (1 - p(t, g0 + 0.55, 0.2)), transform: `translateY(${(1 - Math.min(1, k)) * -50}px) scale(${lerp(1, 0.8, gather)})` }}>
            <div style={{ ...glassA, borderRadius: 26, padding: "14px 18px", display: "flex", gap: 14, alignItems: "center" }}>
              <div style={{ width: 52, height: 52, borderRadius: 13, background: nt.renk || APP_COL[i], flex: "none", opacity: has(nt.uygulama) ? 1 : 0.35 }} />
              <div style={{ minWidth: 0, flex: 1 }}>
                {has(nt.uygulama) ? <div style={{ fontFamily: SF, fontWeight: 700, fontSize: 22, color: INK }}>{fit(nt.uygulama, 14)} <span style={{ fontWeight: 500, color: GRAY }}>· şimdi</span></div> : <Skel w={150} h={14} t={t} style={{ marginBottom: 10 }} />}
                {has(nt.mesaj) ? <div style={{ fontFamily: SF, fontWeight: 500, fontSize: 25, color: INK, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{nt.mesaj}</div> : <Skel w="88%" h={18} t={t} />}
              </div>
            </div>
          </div>
        );
      })}
      {crm > 0 && (
        <div style={{ position: "absolute", left: 90, width: 900, top: 1120, transformOrigin: "50% 0", transform: `scale(${Math.max(0.01, Math.min(1, crm))})`, opacity: Math.min(1, crm * 1.4) }}>
          <div style={{ ...glassA, borderRadius: 34, padding: "22px 26px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              {has(kart.baslik) ? <span style={{ fontFamily: SF, fontWeight: 800, fontSize: 34, color: INK }}>{fit(kart.baslik, 28)}</span> : <Skel w={300} h={26} t={t} />}
              <span style={{ padding: "6px 16px", borderRadius: 999, background: BLUE, fontFamily: SF, fontWeight: 700, fontSize: 24, color: "#fff", minWidth: 40, textAlign: "center" }}>{has(kart.rozet) ? fit(kart.rozet, 10) : nots.length}</span>
            </div>
            {rows.map((r, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderTop: "1.5px solid rgba(255,255,255,0.10)", marginTop: i ? 0 : 12 }}>
                {has(r.ad) ? <span style={{ fontFamily: SF, fontWeight: 600, fontSize: 28, color: INK }}>{fit(r.ad, 24)}</span> : <Skel w={[260, 200, 230][i]} h={20} t={t} />}
                {has(r.durum)
                  ? <span style={{ padding: "6px 14px", borderRadius: 999, background: PILL[i], fontFamily: SF, fontWeight: 700, fontSize: 21, color: "#fff", transform: i === rows.length - 1 ? `scale(${lerp(1, 1.12, Math.min(1, last) * (1 - p(t, b.dur - 0.8, 0.3)))})` : undefined }}>{fit(r.durum, 18)}</span>
                  : <Skel w={150} h={34} r={17} t={t} />}
              </div>
            ))}
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};
