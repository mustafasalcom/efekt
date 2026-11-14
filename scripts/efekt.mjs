#!/usr/bin/env node
/* efekt — kendi klibine premium cam efekt uygular.
   Kullanım:
     node efekt.mjs <efekt> --klip <video> [--bas 0] [--sure 5.7] [--icerik icerik.json] [--medya klasör] [--cikti çıktı.mp4] [--sessiz]
   efekt: grafik | liste | yorunge | bildirim | spot | bolunmus | konum | takvim
   - İçerik verilmezse yörünge dışındaki efektler örnek içerikle gelir; verilen anahtarlar örneğin yerine geçer.
   - grafik, yorunge ve bolunmus kişiyi arka plandan keser (ilk seferde birkaç dakika sürebilir). */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ENGINE = path.join(ROOT, "engine");
const MODEL = path.join(os.homedir(), ".efekt", "birefnet_lite.onnx");
const FX = ["grafik", "liste", "yorunge", "bildirim", "spot", "bolunmus", "konum", "takvim"];
const NEEDS_CUT = new Set(["grafik", "yorunge", "bolunmus"]);
const isWin = process.platform === "win32";

const die = (m) => { console.error("HATA: " + m); process.exit(1); };
const run = (cmd, args, opt = {}) => {
  const r = spawnSync(cmd, args, { stdio: opt.quiet ? "pipe" : "inherit", cwd: opt.cwd, encoding: "utf8" });
  if (r.status !== 0) die(`${cmd} başarısız oldu${r.stderr ? ":\n" + r.stderr.slice(-800) : ""}`);
  return r;
};
const has = (cmd) => spawnSync(cmd, ["-version"], { stdio: "ignore", shell: false }).status === 0 || spawnSync(cmd, ["--version"], { stdio: "ignore" }).status === 0;
const python = () => ["python3", "python", "py"].find((c) => spawnSync(c, ["-c", "import onnxruntime, numpy, PIL"], { stdio: "ignore" }).status === 0);

/* argümanlar */
const argv = process.argv.slice(2);
const fx = (argv[0] || "").toLowerCase().replace("ö", "o").replace("ü", "u");
if (!FX.includes(fx)) die(`efekt adı şunlardan biri olmalı: ${FX.join(", ")}`);
const opt = {};
for (let i = 1; i < argv.length; i++) {
  const a = argv[i];
  if (a === "--sessiz") opt.sessiz = true;
  else if (a.startsWith("--")) opt[a.slice(2)] = argv[++i];
}
if (!opt.klip || !fs.existsSync(opt.klip)) die("--klip ile var olan bir video dosyası verin.");
const bas = Number(opt.bas || 0), sure = Number(opt.sure || 5.7);
if (!(sure >= 2 && sure <= 15)) die("--sure 2 ile 15 saniye arasında olmalı.");
let content = {};
if (opt.icerik) {
  try { content = JSON.parse(fs.readFileSync(opt.icerik, "utf8")); } catch (e) { die("içerik dosyası okunamadı (geçerli JSON olmalı): " + e.message); }
}

/* gereksinimler */
if (!has("ffmpeg")) die("ffmpeg bulunamadı. Kurulum: Windows 'winget install ffmpeg', Mac 'brew install ffmpeg'.");
if (!fs.existsSync(path.join(ENGINE, "node_modules", "remotion"))) die("Motor kurulu değil. Önce: node scripts/kurulum.mjs");

/* iş klasörü (engine/public/job/<id>) */
const id = Date.now().toString(36);
const rel = `job/${id}`;
const job = path.join(ENGINE, "public", "job", id);
fs.mkdirSync(job, { recursive: true });
const cleanup = () => fs.rmSync(job, { recursive: true, force: true });
process.on("exit", cleanup);

console.log(`1/4 klip hazırlanıyor (${bas}–${bas + sure} sn)…`);
run("ffmpeg", ["-nostdin", "-y", "-loglevel", "error", "-ss", String(bas), "-t", String(sure), "-i", opt.klip,
  "-vf", "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,fps=30,setsar=1",
  "-c:v", "libx264", "-crf", "16", "-pix_fmt", "yuv420p", ...(opt.sessiz ? ["-an"] : ["-c:a", "aac", "-b:a", "192k"]), path.join(job, "clip.mp4")]);

const props = { clip: `${rel}/clip.mp4`, dur: sure, content };

if (NEEDS_CUT.has(fx)) {
  const py = python();
  if (!py) die("Kesim için Python paketleri eksik. Önce: node scripts/kurulum.mjs");
  if (!fs.existsSync(MODEL)) die("Kesim modeli yok. Önce: node scripts/kurulum.mjs");
  console.log("2/4 kişi arka plandan kesiliyor (kare başına birkaç saniye; bilgisayar kullanılabilir kalır)…");
  run(py, [path.join(ROOT, "scripts", "matte.py"), path.join(job, "clip.mp4"), path.join(job, "matte"), MODEL]);
  props.matte = `${rel}/matte`;
  props.matteCount = fs.readdirSync(path.join(job, "matte")).filter((f) => f.endsWith(".png")).length;
} else console.log("2/4 kesim gerekmiyor.");

if (fx === "yorunge" && opt.medya) {
  if (!fs.existsSync(opt.medya)) die("--medya klasörü bulunamadı.");
  const files = fs.readdirSync(opt.medya).filter((f) => /\.(mp4|mov|m4v|webm|jpe?g|png|webp)$/i.test(f)).sort().slice(0, 7);
  const medya = [];
  files.forEach((f, i) => {
    const src = path.join(opt.medya, f);
    if (/\.(mp4|mov|m4v|webm)$/i.test(f)) {
      run("ffmpeg", ["-nostdin", "-y", "-loglevel", "error", "-i", src, "-t", String(sure + 1), "-an", "-vf", "scale=270:480:force_original_aspect_ratio=increase,crop=270:480,fps=30", "-c:v", "libx264", "-crf", "22", path.join(job, `m${i}.mp4`)]);
      medya.push(`${rel}/m${i}.mp4`);
    } else {
      const ext = path.extname(f).toLowerCase();
      fs.copyFileSync(src, path.join(job, `m${i}${ext}`));
      medya.push(`${rel}/m${i}${ext}`);
    }
  });
  props.content = { ...content, medya };
  console.log(`   yörüngeye ${medya.length} medya eklendi.`);
}

/* çıktı yolu: üzerine yazmaz */
let out = opt.cikti || path.join(path.dirname(path.resolve(opt.klip)), `${path.parse(opt.klip).name}-${fx}.mp4`);
if (!opt.cikti) { let n = 2; while (fs.existsSync(out)) out = out.replace(/(-\d+)?\.mp4$/, `-${n++}.mp4`); }
fs.writeFileSync(path.join(job, "props.json"), JSON.stringify(props));

console.log("3/4 efekt çiziliyor…");
run(process.execPath, [path.join(ENGINE, "node_modules", "@remotion", "cli", "remotion-cli.js"), "render", "src/index.ts", fx, path.resolve(out), `--props=${path.join("public", "job", id, "props.json")}`, "--codec=h264", "--crf=18", "--log=error", ...(opt.sessiz ? ["--muted"] : [])], { cwd: ENGINE });
console.log(`4/4 hazır: ${path.resolve(out)}`);
