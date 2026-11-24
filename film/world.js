/* DENK Deutsch — sets. One beach, drawn once, used by every beach shot. */

import { C } from "./rig.js";

const n = (v) => Math.round(v * 100) / 100;

function palm(x, y, s, lean, t, phase) {
  const sway = Math.sin(t * 0.7 + phase) * 2.2;
  const fronds = [];
  for (let i = 0; i < 7; i++) {
    const a = -160 + i * 26 + sway * 1.4;
    const len = 120 + (i % 3) * 16;
    fronds.push(
      `<path d="M 0 0 C ${len * 0.4} ${-len * 0.5} ${len * 0.8} ${-len * 0.42} ${len} ${-len * 0.1}"
             fill="none" stroke="${i % 2 ? "#2F7A5E" : "#3E9A73"}" stroke-width="15"
             stroke-linecap="round" transform="rotate(${n(a + lean * 0.2)})"/>`,
    );
  }
  return `
  <g transform="translate(${x} ${y}) scale(${s})">
    <path d="M 0 0 C ${-6 + lean * 0.2} -90 ${-14 + lean} -170 ${lean * 2.4} -250"
          fill="none" stroke="#7C5138" stroke-width="19" stroke-linecap="round"/>
    <path d="M ${-2 + lean * 0.3} -18 q 4 -8 8 -2 M ${-4 + lean * 0.6} -48 q 5 -8 9 -2
             M ${-6 + lean} -78 q 5 -8 9 -2 M ${-8 + lean * 1.4} -108 q 5 -8 9 -2
             M ${-10 + lean * 1.8} -138 q 5 -8 9 -2"
          stroke="#94633F" stroke-width="4" fill="none" opacity="0.7"/>
    <g transform="translate(${lean * 2.4} -250)">
      ${fronds.join("")}
      <circle cx="0" cy="0" r="9" fill="#5C8B4E"/>
    </g>
  </g>`;
}

function umbrella(t) {
  const sway = Math.sin(t * 1.1) * 1.6;
  const cx = 985;
  const cy = 520;
  const rx = 300;
  const dome = 96;
  const stripes = [];
  const N = 8;
  for (let i = 0; i < N; i++) {
    if (i % 2 === 0) continue;
    const a0 = Math.PI * (i / N);
    const a1 = Math.PI * (i + 1) / N;
    stripes.push(
      `<path d="M ${cx} ${cy + dome * 0.15} L ${n(cx + Math.cos(a0) * rx)} ${n(cy)} L ${n(cx + Math.cos(a1) * rx)} ${n(cy)} Z" fill="#F8EFDC" opacity="0.94"/>`,
    );
  }
  return `
  <g transform="rotate(${n(sway)} ${cx} ${cy})">
    <path d="M 1230 838 L ${cx + 20} ${cy + 6}" stroke="#8A5A3B" stroke-width="14" stroke-linecap="round"/>
    <path d="M ${cx - rx} ${cy} Q ${cx} ${cy - dome * 2.1} ${cx + rx} ${cy}
             Q ${cx + rx * 0.72} ${cy + 16} ${cx + rx * 0.5} ${cy}
             Q ${cx + rx * 0.25} ${cy + 16} ${cx} ${cy}
             Q ${cx - rx * 0.25} ${cy + 16} ${cx - rx * 0.5} ${cy}
             Q ${cx - rx * 0.72} ${cy + 16} ${cx - rx} ${cy} Z"
          fill="#F2594F"/>
    <g clip-path="url(#canopyClip)">
      ${stripes.join("")}
      <path d="M ${cx - rx} ${cy - 4} Q ${cx} ${cy - dome * 2.1} ${cx + rx} ${cy - 4}"
            fill="none" stroke="#FFFFFF" stroke-width="7" opacity="0.5"/>
    </g>
    <path d="M ${cx - rx} ${cy} Q ${cx} ${cy - dome * 2.1} ${cx + rx} ${cy}"
          fill="none" stroke="#C33F3B" stroke-width="3" opacity="0.55"/>
    <circle cx="${cx}" cy="${n(cy - dome * 1.02)}" r="10" fill="#F5AA18"/>
  </g>`;
}

function bench() {
  return `
  <g>
    <ellipse cx="905" cy="812" rx="330" ry="46" fill="#9C6A3C" opacity="0.20"/>
    <!-- back rest -->
    <g transform="rotate(-9 700 700)">
      <rect x="600" y="576" width="128" height="196" rx="16" fill="#A9714A"/>
      <rect x="612" y="588" width="104" height="172" rx="10" fill="#C48A5C"/>
      <rect x="628" y="606" width="72" height="14" rx="7" fill="#F8EFDC"/>
      <rect x="628" y="666" width="72" height="14" rx="7" fill="#F8EFDC"/>
    </g>
    <!-- seat -->
    <rect x="672" y="742" width="548" height="40" rx="14" fill="#A9714A"/>
    <rect x="686" y="748" width="520" height="26" rx="10" fill="#C48A5C"/>
    <g fill="#F8EFDC" opacity="0.92">
      <rect x="712" y="748" width="26" height="26" rx="6"/>
      <rect x="790" y="748" width="26" height="26" rx="6"/>
      <rect x="868" y="748" width="26" height="26" rx="6"/>
      <rect x="946" y="748" width="26" height="26" rx="6"/>
      <rect x="1024" y="748" width="26" height="26" rx="6"/>
      <rect x="1102" y="748" width="26" height="26" rx="6"/>
    </g>
    <!-- legs -->
    <g fill="#8A5A34">
      <rect x="700" y="776" width="24" height="66" rx="8"/>
      <rect x="1168" y="776" width="24" height="66" rx="8"/>
      <rect x="760" y="782" width="16" height="58" rx="6" opacity="0.75"/>
      <rect x="1110" y="782" width="16" height="58" rx="6" opacity="0.75"/>
    </g>
  </g>`;
}

function table() {
  return `
  <g>
    <ellipse cx="1196" cy="806" rx="86" ry="18" fill="#9C6A3C" opacity="0.2"/>
    <rect x="1188" y="726" width="16" height="80" rx="6" fill="#8A5A34"/>
    <ellipse cx="1196" cy="726" rx="84" ry="24" fill="#A9714A"/>
    <ellipse cx="1196" cy="722" rx="78" ry="20" fill="#D9A574"/>
    <path d="M 1160 712 q 36 -30 72 0 q -36 16 -72 0 Z" fill="#F2C14E"/>
    <circle cx="1172" cy="704" r="9" fill="#D94F3D"/>
    <circle cx="1196" cy="700" r="9" fill="#D94F3D"/>
    <circle cx="1219" cy="705" r="9" fill="#D94F3D"/>
    <path d="M 1188 700 q -6 -18 4 -26" stroke="#4E8B4A" stroke-width="4" fill="none"/>
  </g>`;
}

export function beach(t) {
  const waves = [];
  for (let i = 0; i < 9; i++) {
    const y = 616 + i * 10;
    const phase = t * (0.55 + i * 0.05) + i;
    const dx = Math.sin(phase) * 26;
    const o = 0.14 + i * 0.03;
    waves.push(
      `<path d="M ${-420 + dx} ${y} q 240 -9 480 0 t 480 0 t 480 0 t 480 0 t 480 0"
             fill="none" stroke="#BDF0E6" stroke-width="${n(2 + i * 0.4)}" opacity="${n(o)}"/>`,
    );
  }

  const foam = [];
  for (let i = 0; i < 5; i++) {
    const x = 120 + i * 420 + Math.sin(t * 0.5 + i) * 18;
    foam.push(
      `<path d="M ${x} 690 q 60 ${-10 - Math.sin(t * 1.6 + i) * 6} 130 0" fill="none"
             stroke="#FFFFFF" stroke-width="7" stroke-linecap="round" opacity="0.55"/>`,
    );
  }

  return `
  <g>
    <rect x="-500" y="-320" width="3000" height="940" fill="url(#skyGrad)"/>
    <circle cx="1470" cy="452" r="230" fill="url(#sunHalo)"/>
    <circle cx="1470" cy="452" r="74" fill="#FFE7B0"/>
    <circle cx="1470" cy="452" r="96" fill="none" stroke="#FFF0C8" stroke-width="10" opacity="0.35"/>

    <g opacity="0.55" fill="#FFF2D8">
      <path d="M 210 300 q 60 -44 128 -16 q 46 -34 108 -10 q 66 -6 76 34 q -120 16 -312 -8 Z"/>
      <path d="M 1420 236 q 54 -38 112 -14 q 44 -28 96 -6 q 58 -4 66 30 q -108 14 -274 -10 Z"/>
      <path d="M 760 168 q 50 -34 102 -12 q 40 -26 88 -6 q 52 -4 60 28 q -100 12 -250 -10 Z" opacity="0.7"/>
    </g>

    <rect x="-500" y="592" width="3000" height="132" fill="url(#seaGrad)"/>
    <rect x="-500" y="592" width="3000" height="9" fill="#8FE0DA" opacity="0.55"/>
    <g>${waves.join("")}</g>
    <g opacity="0.5">
      <rect x="1398" y="600" width="150" height="14" fill="#FFF3D6"/>
      <rect x="1420" y="620" width="108" height="9" fill="#FFF3D6"/>
      <rect x="1438" y="636" width="72" height="7" fill="#FFF3D6"/>
      <rect x="1418" y="652" width="96" height="6" fill="#FFF3D6"/>
    </g>

    <path d="M -500 690 C 100 678 620 702 1120 690 C 1520 680 1900 700 2420 686 L 2420 1200 L -500 1200 Z"
          fill="url(#sandGrad)"/>
    <path d="M -500 690 C 100 678 620 702 1120 690 C 1520 680 1900 700 2420 686"
          fill="none" stroke="#FFF0D2" stroke-width="8" opacity="0.7"/>
    <g>${foam.join("")}</g>

    <g opacity="0.5" fill="#C08C55">
      <circle cx="240" cy="780" r="4"/><circle cx="300" cy="822" r="3"/>
      <circle cx="402" cy="760" r="3.4"/><circle cx="520" cy="856" r="3"/>
      <circle cx="1340" cy="792" r="4"/><circle cx="1420" cy="860" r="3"/>
      <circle cx="1500" cy="742" r="3.4"/><circle cx="1640" cy="812" r="3.6"/>
      <circle cx="1760" cy="900" r="3"/><circle cx="960" cy="880" r="3.4"/>
      <circle cx="690" cy="900" r="3"/><circle cx="1120" cy="906" r="3.6"/>
    </g>

    ${palm(150, 760, 1.05, 26, t, 0.4)}
    ${palm(1880, 800, 1.18, -22, t, 2.1)}
    ${palm(1720, 706, 0.55, -10, t, 1.2)}

    <ellipse cx="980" cy="806" rx="352" ry="92" fill="#B57F44" opacity="0.22"/>
    ${bench()}
    ${table()}
    ${umbrella(t)}
  </g>`;
}

/* -------------------------------------------------------- finale set */

export function brandSet(t, k = 1) {
  const dots = [];
  for (let i = 0; i < 7; i++) {
    for (let j = 0; j < 4; j++) {
      dots.push(`<circle cx="${n(1238 + i * 26)}" cy="${n(120 + j * 26)}" r="4" fill="#FAF9F6" opacity="0.28"/>`);
    }
  }
  return `
  <g opacity="${k}">
    <rect x="0" y="0" width="1920" height="1080" fill="#FAF9F6"/>
    <rect x="1158" y="0" width="762" height="1080" fill="${C.ink}"/>
    <rect x="1146" y="0" width="14" height="1080" fill="${C.red}"/>
    <path d="M 1158 0 L 1920 0 L 1920 1080 L 1360 1080 Z" fill="${C.ink}" opacity="0.55"/>
    <circle cx="1560" cy="600" r="300" fill="${C.red}"/>
    <circle cx="1560" cy="600" r="300" fill="none" stroke="${C.gold}" stroke-width="6" opacity="0.9"/>
    <circle cx="1560" cy="600" r="336" fill="none" stroke="#FAF9F6" stroke-width="2" opacity="0.28"/>
    <g>${dots.join("")}</g>
    <g opacity="0.12" fill="none" stroke="${C.ink}" stroke-width="2">
      <path d="M 150 300 h 860 M 150 360 h 860 M 150 420 h 860 M 150 480 h 860
               M 150 540 h 860 M 150 600 h 860 M 150 660 h 860 M 150 720 h 860
               M 150 780 h 860 M 150 840 h 860"/>
    </g>
    <text x="96" y="880" font-family="'Arial Black',Impact,sans-serif" font-size="470"
          fill="none" stroke="${C.ink}" stroke-width="3" opacity="0.07">G11</text>
    <rect x="0" y="0" width="26" height="1080" fill="${C.red}"/>
    <rect x="0" y="0" width="10" height="1080" fill="${C.ink}"/>
    <rect x="150" y="960" width="860" height="4" fill="${C.ink}" opacity="0.18"/>
    <g transform="translate(1560 986)">
      <rect x="-300" y="0" width="600" height="6" fill="${C.gold}" opacity="0.9"/>
    </g>
  </g>`;
}
