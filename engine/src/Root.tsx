import React from "react";
import { Composition, CalculateMetadataFunction } from "remotion";
import { FPS } from "./lib";
import { Grafik } from "./fx/Grafik";
import { Liste } from "./fx/Liste";
import { Yorunge } from "./fx/Yorunge";
import { Bildirim } from "./fx/Bildirim";
import { Spot } from "./fx/Spot";
import { Bolunmus } from "./fx/Bolunmus";
import { Konum } from "./fx/Konum";
import { Takvim } from "./fx/Takvim";

/* Her efekt bir kompozisyon. Süre, CLI'nin verdiği "dur" girdisinden hesaplanır. */
const meta: CalculateMetadataFunction<any> = ({ props }) => ({ durationInFrames: Math.max(30, Math.round((props.dur || 5.7) * FPS)) });
const base = { clip: "sample/clip.mp4", dur: 5.7, content: {} };
const FX: [string, React.FC<any>][] = [
  ["grafik", Grafik], ["liste", Liste], ["yorunge", Yorunge], ["bildirim", Bildirim],
  ["spot", Spot], ["bolunmus", Bolunmus], ["konum", Konum], ["takvim", Takvim],
];

export const RemotionRoot: React.FC = () => (
  <>
    {FX.map(([id, C]) => (
      <React.Fragment key={id}><Composition id={id} component={C} durationInFrames={171} fps={FPS} width={1080} height={1920} defaultProps={base} calculateMetadata={meta} /></React.Fragment>
    ))}
  </>
);
