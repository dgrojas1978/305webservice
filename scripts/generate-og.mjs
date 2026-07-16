// Generates public/og-image.png (1200x630) from an inline SVG.
// Run: node scripts/generate-og.mjs
import sharp from "sharp";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const out = path.join(__dirname, "..", "public", "og-image.png");

const svg = `
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="#FFFFFF"/>
  <!-- dot texture -->
  <defs>
    <pattern id="dots" width="28" height="28" patternUnits="userSpaceOnUse">
      <circle cx="2" cy="2" r="1.6" fill="#0F172A" opacity="0.06"/>
    </pattern>
  </defs>
  <rect width="1200" height="630" fill="url(#dots)"/>
  <!-- navy band at bottom -->
  <rect y="562" width="1200" height="68" fill="#0B1D3A"/>
  <text x="80" y="605" font-family="Segoe UI, Arial, sans-serif" font-size="24" fill="#CBD5E1">www.305webservice.com</text>
  <text x="1120" y="605" text-anchor="end" font-family="Segoe UI, Arial, sans-serif" font-size="24" fill="#CBD5E1">Miami, FL · English &amp; Spanish</text>

  <!-- wordmark -->
  <text x="80" y="150" font-family="Segoe UI, Arial, sans-serif" font-size="52" font-weight="800">
    <tspan fill="#2563EB">305</tspan><tspan fill="#0F172A" dx="14">Web Service</tspan>
  </text>

  <!-- headline -->
  <text x="80" y="266" font-family="Segoe UI, Arial, sans-serif" font-size="64" font-weight="800" fill="#0F172A">Web Design, Custom Software</text>
  <text x="80" y="348" font-family="Segoe UI, Arial, sans-serif" font-size="64" font-weight="800" fill="#0F172A">&amp; IT Solutions in Miami</text>

  <!-- price pill -->
  <rect x="80" y="412" rx="34" width="640" height="68" fill="#EFF6FF" stroke="#BFDBFE" stroke-width="2"/>
  <text x="400" y="457" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="32" font-weight="700" fill="#1D4ED8">Professional Websites Starting at $499</text>
</svg>
`;

await sharp(Buffer.from(svg)).png().toFile(out);
console.log("Wrote", out);
