/**
 * Convert PNGs (and unused JPGs) to sharp WebP for faster load times.
 * Run: node scripts/convert-images.mjs
 */
import sharp from "sharp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.resolve(__dirname, "../public");

// Files to convert to WebP (input -> output)
const toConvert = [
  { src: "canceltrap-logo.png", dest: "canceltrap-logo.webp" },
  { src: "newhero.png",         dest: "newhero.webp" },
];

// Files that are completely unused → delete
const toDelete = [
  "canceltrap-hero.png",
  "canceltrap-hero-water.jpg",
  "water-glass-hero.jpg",
];

async function main() {
  for (const { src, dest } of toConvert) {
    const srcPath  = path.join(publicDir, src);
    const destPath = path.join(publicDir, dest);
    if (!fs.existsSync(srcPath)) { console.warn(`SKIP (not found): ${src}`); continue; }
    const before = fs.statSync(srcPath).size;
    await sharp(srcPath)
      .webp({ quality: 85, effort: 6 })
      .toFile(destPath);
    const after = fs.statSync(destPath).size;
    console.log(`✅ ${src} → ${dest}  (${Math.round(before/1024)}KB → ${Math.round(after/1024)}KB, -${Math.round((1-after/before)*100)}%)`);
  }

  for (const file of toDelete) {
    const fp = path.join(publicDir, file);
    if (fs.existsSync(fp)) {
      fs.unlinkSync(fp);
      console.log(`🗑️  Deleted unused: ${file}`);
    } else {
      console.warn(`SKIP delete (not found): ${file}`);
    }
  }

  console.log("\nDone! Remember to update source references from .png → .webp");
}

main().catch(console.error);
