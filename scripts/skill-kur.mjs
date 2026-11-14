#!/usr/bin/env node
/* efekt — "linki yapıştır, kur" kurulumu.
   8 efekt skill'ini kişisel skill klasörüne (~/.claude/skills) yerleştirir ve motoru kurar.
   Bu yolla kurulan komutlar kısadır: /grafik, /liste, /yorunge, /bildirim, /spot, /bolunmus, /konum, /takvim
   Kullanım: node scripts/skill-kur.mjs [--kesimsiz] [--zorla]
     --kesimsiz : kesim modelini ve Python paketlerini kurmaz (grafik, yörünge, bölünmüş sonradan kurulumla açılır)
     --zorla    : aynı adlı başka bir skill varsa üzerine yazar */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ROOT_FWD = ROOT.split(path.sep).join("/");
const SKILLS = path.join(os.homedir(), ".claude", "skills");
const MARK = "<!-- efekt-skill -->";
const force = process.argv.includes("--zorla");

console.log("▸ Skill'ler yerleştiriliyor → " + SKILLS);
fs.mkdirSync(SKILLS, { recursive: true });
const names = fs.readdirSync(path.join(ROOT, "skills")).filter((n) => fs.existsSync(path.join(ROOT, "skills", n, "SKILL.md")));
const skipped = [];
for (const n of names) {
  const dst = path.join(SKILLS, n, "SKILL.md");
  if (fs.existsSync(dst) && !fs.readFileSync(dst, "utf8").includes(MARK) && !force) { skipped.push(n); continue; }
  const src = fs.readFileSync(path.join(ROOT, "skills", n, "SKILL.md"), "utf8");
  fs.mkdirSync(path.dirname(dst), { recursive: true });
  fs.writeFileSync(dst, src.replaceAll("${CLAUDE_PLUGIN_ROOT}", ROOT_FWD) + "\n" + MARK + "\n");
  console.log("  /" + n);
}
if (skipped.length) console.log(`  Atlandı (aynı adlı başka skill var, üzerine yazmak için --zorla): ${skipped.join(", ")}`);

const args = [path.join(ROOT, "scripts", "kurulum.mjs")];
if (process.argv.includes("--kesimsiz")) args.push("--kesimsiz");
const r = spawnSync(process.execPath, args, { stdio: "inherit" });
if (r.status !== 0) process.exit(r.status || 1);
console.log("\nHazır. Claude Code'da YENİ bir oturum açın ve /grafik, /takvim gibi komutları kullanın.");
