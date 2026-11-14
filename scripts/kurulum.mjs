#!/usr/bin/env node
/* efekt kurulumu — bir kez çalıştırılır.
   1) ffmpeg kontrolü  2) motor paketleri (npm)  3) kesim için Python paketleri  4) kesim modeli (~224 MB, MIT, BiRefNet-lite)
   Kullanım: node scripts/kurulum.mjs [--kesimsiz]   (--kesimsiz: grafik/yörünge/bölünmüş için gereken kesim kurulumunu atlar) */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ENGINE = path.join(ROOT, "engine");
const DIR = path.join(os.homedir(), ".efekt");
const MODEL = path.join(DIR, "birefnet_lite.onnx");
const MODEL_URL = "https://github.com/danielgatis/rembg/releases/download/v0.0.0/BiRefNet-general-bb_swin_v1_tiny-epoch_232.onnx";
const MODEL_SIZE = 224005088;
const isWin = process.platform === "win32";
const skipCut = process.argv.includes("--kesimsiz");

const ok = (cmd, args) => spawnSync(cmd, args, { stdio: "ignore", shell: isWin }).status === 0;
const step = (m) => console.log("\n▸ " + m);

step("ffmpeg kontrol ediliyor");
if (!ok("ffmpeg", ["-version"])) {
  console.log("  ffmpeg bulunamadı. Kurup tekrar çalıştırın:\n  Windows: winget install ffmpeg\n  Mac:     brew install ffmpeg\n  Linux:   sudo apt install ffmpeg");
  process.exit(1);
}
console.log("  tamam");

step("Motor paketleri kuruluyor (ilk seferde birkaç dakika)");
const npm = spawnSync("npm", ["install", "--no-audit", "--no-fund"], { cwd: ENGINE, stdio: "inherit", shell: isWin });
if (npm.status !== 0) { console.log("  npm install başarısız oldu. Node.js 18+ kurulu mu?"); process.exit(1); }

if (skipCut) { console.log("\nKesim kurulumu atlandı. liste, bildirim, spot, konum, takvim kullanılabilir."); process.exit(0); }

step("Kesim için Python paketleri (onnxruntime, numpy, pillow)");
const py = ["python3", "python", "py"].find((c) => ok(c, ["--version"]));
if (!py) { console.log("  Python bulunamadı (3.9+). Kurulduktan sonra tekrar çalıştırın ya da --kesimsiz kullanın."); process.exit(1); }
if (!ok(py, ["-c", "import onnxruntime, numpy, PIL"])) {
  const pip = spawnSync(py, ["-m", "pip", "install", "--user", "onnxruntime", "numpy", "pillow"], { stdio: "inherit", shell: isWin });
  if (pip.status !== 0) { console.log("  pip kurulumu başarısız oldu."); process.exit(1); }
}
console.log("  tamam");

step("Kesim modeli indiriliyor (~224 MB, bir kez)");
fs.mkdirSync(DIR, { recursive: true });
if (fs.existsSync(MODEL) && fs.statSync(MODEL).size === MODEL_SIZE) console.log("  zaten var");
else {
  const res = await fetch(MODEL_URL);
  if (!res.ok) { console.log("  indirilemedi: HTTP " + res.status); process.exit(1); }
  const tmp = MODEL + ".part";
  const ws = fs.createWriteStream(tmp);
  let got = 0, last = 0;
  for await (const chunk of res.body) {
    ws.write(chunk); got += chunk.length;
    const pct = Math.floor((got / MODEL_SIZE) * 100);
    if (pct >= last + 10) { process.stdout.write(`  %${pct}\n`); last = pct; }
  }
  await new Promise((r) => ws.end(r));
  if (fs.statSync(tmp).size !== MODEL_SIZE) { fs.rmSync(tmp); console.log("  indirme eksik kaldı, tekrar deneyin."); process.exit(1); }
  fs.renameSync(tmp, MODEL);
}
console.log("\nKurulum tamam. 8 efektin hepsi kullanılabilir.");
