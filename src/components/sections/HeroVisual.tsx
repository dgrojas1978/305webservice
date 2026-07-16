/**
 * Original, lightweight hero illustration: a website window, a mobile app,
 * an automation flow and server/cloud infrastructure, connected as one system.
 * Pure inline SVG — no images, no external requests. Decorative only.
 */
export default function HeroVisual() {
  return (
    <svg
      viewBox="0 0 560 440"
      role="img"
      aria-hidden="true"
      class="h-auto w-full max-w-xl"
    >
      <defs>
        <linearGradient id="hv-accent" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#2563EB" />
          <stop offset="1" stop-color="#1D4ED8" />
        </linearGradient>
      </defs>

      {/* connection lines drawn first, behind the nodes */}
      <g stroke="#CBD5E1" stroke-width="1.5" fill="none" stroke-dasharray="4 5">
        <path d="M258 150 C 300 150, 310 118, 352 112" />
        <path d="M180 236 C 180 268, 208 286, 244 292" />
        <path d="M414 190 C 414 226, 400 258, 356 288" />
        <path d="M300 322 L 300 352" />
      </g>

      {/* Browser window — website */}
      <g>
        <rect x="42" y="60" width="216" height="176" rx="14" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1.5" />
        <rect x="42" y="60" width="216" height="34" rx="14" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="1.5" />
        <rect x="42" y="80" width="216" height="14" fill="#F8FAFC" />
        <circle cx="62" cy="77" r="4" fill="#E2E8F0" />
        <circle cx="76" cy="77" r="4" fill="#E2E8F0" />
        <circle cx="90" cy="77" r="4" fill="#E2E8F0" />
        <rect x="112" y="71" width="126" height="12" rx="6" fill="#EFF6FF" />
        {/* page content */}
        <rect x="62" y="112" width="96" height="12" rx="6" fill="#0F172A" opacity="0.85" />
        <rect x="62" y="132" width="140" height="8" rx="4" fill="#CBD5E1" />
        <rect x="62" y="146" width="118" height="8" rx="4" fill="#CBD5E1" />
        <rect x="62" y="166" width="74" height="22" rx="11" fill="url(#hv-accent)" />
        <rect x="144" y="166" width="60" height="22" rx="11" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="1.5" />
        <rect x="62" y="202" width="176" height="18" rx="6" fill="#F1F5F9" />
      </g>

      {/* Mobile app */}
      <g>
        <rect x="352" y="52" width="92" height="150" rx="16" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1.5" />
        <rect x="384" y="62" width="28" height="5" rx="2.5" fill="#E2E8F0" />
        <rect x="366" y="80" width="64" height="30" rx="8" fill="#EFF6FF" />
        <rect x="366" y="118" width="64" height="8" rx="4" fill="#CBD5E1" />
        <rect x="366" y="132" width="46" height="8" rx="4" fill="#CBD5E1" />
        <rect x="366" y="152" width="64" height="20" rx="10" fill="url(#hv-accent)" />
        <circle cx="398" cy="188" r="7" stroke="#CBD5E1" stroke-width="1.5" fill="none" />
      </g>

      {/* Automation flow */}
      <g>
        <rect x="244" y="262" width="112" height="60" rx="12" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1.5" />
        <circle cx="270" cy="292" r="9" fill="#EFF6FF" stroke="#2563EB" stroke-width="1.5" />
        <path d="M266.5 292 l2.5 2.5 l5 -5" stroke="#2563EB" stroke-width="1.8" fill="none" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M284 292 h20" stroke="#94A3B8" stroke-width="1.5" stroke-linecap="round" />
        <path d="M300 288 l5 4 -5 4" stroke="#94A3B8" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />
        <circle cx="322" cy="292" r="9" fill="#EFF6FF" stroke="#2563EB" stroke-width="1.5" />
        <path d="M322 287 v10 M317 292 h10" stroke="#2563EB" stroke-width="1.8" stroke-linecap="round" />
      </g>

      {/* Gear — custom software */}
      <g transform="translate(150, 296)">
        <circle cx="30" cy="30" r="26" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1.5" />
        <path
          d="M30 18 v6 M30 36 v6 M18 30 h6 M36 30 h6 M21.5 21.5 l4.2 4.2 M34.3 34.3 l4.2 4.2 M38.5 21.5 l-4.2 4.2 M25.7 34.3 l-4.2 4.2"
          stroke="#2563EB"
          stroke-width="2"
          stroke-linecap="round"
        />
        <circle cx="30" cy="30" r="6" fill="none" stroke="#2563EB" stroke-width="2" />
      </g>

      {/* Server stack + cloud */}
      <g>
        <rect x="392" y="252" width="120" height="26" rx="8" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1.5" />
        <rect x="392" y="284" width="120" height="26" rx="8" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1.5" />
        <rect x="392" y="316" width="120" height="26" rx="8" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1.5" />
        <circle cx="406" cy="265" r="3.5" fill="#15803D" />
        <circle cx="406" cy="297" r="3.5" fill="#15803D" />
        <circle cx="406" cy="329" r="3.5" fill="#15803D" />
        <rect x="418" y="261" width="60" height="7" rx="3.5" fill="#E2E8F0" />
        <rect x="418" y="293" width="60" height="7" rx="3.5" fill="#E2E8F0" />
        <rect x="418" y="325" width="60" height="7" rx="3.5" fill="#E2E8F0" />
        {/* cloud */}
        <path
          d="M468 236 a14 14 0 0 1 1 -28 a18 18 0 0 1 34 -5 a13 13 0 0 1 2 26 z"
          fill="#EFF6FF"
          stroke="#2563EB"
          stroke-width="1.5"
        />
      </g>

      {/* Backup / shield */}
      <g transform="translate(272, 352)">
        <path
          d="M28 6 l20 8 v14 c0 14 -9 22 -20 27 c-11 -5 -20 -13 -20 -27 v-14 z"
          fill="#FFFFFF"
          stroke="#15803D"
          stroke-width="1.8"
        />
        <path d="M19 28 l6 6 l12 -12" stroke="#15803D" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round" />
      </g>
    </svg>
  );
}
