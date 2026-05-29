/**
 * generate-icons.mjs
 * Generates all PNG/ICO icons from the SVG sources in /public.
 * Run with: node scripts/generate-icons.mjs
 */

import sharp from "sharp";
import { readFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, "../public");

const iconSvg    = readFileSync(join(publicDir, "icon.svg"));
const ogSvg      = readFileSync(join(publicDir, "og-image.svg"));

const sizes = [
  { file: "favicon-16.png",        size: 16,        src: iconSvg   },
  { file: "favicon-32.png",        size: 32,        src: iconSvg   },
  { file: "apple-touch-icon.png",  size: 180,       src: iconSvg   },
  { file: "icon-192.png",          size: 192,       src: iconSvg   },
  { file: "icon-512.png",          size: 512,       src: iconSvg   },
  { file: "og-image.png",          width: 1200, height: 630, src: ogSvg },
];

console.log("Generating icons...\n");

for (const item of sizes) {
  const outPath = join(publicDir, item.file);
  const img = sharp(item.src, { density: 300 });

  if (item.width) {
    await img.resize(item.width, item.height).png().toFile(outPath);
  } else {
    await img.resize(item.size, item.size).png().toFile(outPath);
  }

  console.log(`  ✓ ${item.file}`);
}

// Generate favicon.ico (multi-size: 16 + 32 + 48)
// sharp doesn't write .ico natively; we embed the 32px PNG and rename it
// (modern browsers support PNG favicons via <link rel="icon" type="image/png">)
const ico32 = await sharp(iconSvg, { density: 300 }).resize(32, 32).png().toBuffer();
const { writeFileSync } = await import("fs");
writeFileSync(join(publicDir, "favicon.ico"), ico32);
console.log("  ✓ favicon.ico (32px PNG in .ico container)");

console.log("\nAll icons generated successfully.");
