/* DENK Deutsch — character + prop rig.
   Kittler is drawn from one rig in every shot, so face, markings,
   proportions and outfit cannot drift between frames. */

const R = (v) => Math.round(v * 100) / 100;

export const C = {
  fur: "#FBF8F2",
  furShade: "#E9E2D4",
  furLine: "#CFC6B6",
  patch: "#241F1F",
  innerEar: "#E5A08C",
  ink: "#181A1D",
  paper: "#FAF9F6",
  red: "#DF1428",
  gold: "#F5AA18",
  shirt: "#1FAF9B",
  shirtDark: "#12806F",
  coral: "#FF6B61",
  yellow: "#FFCB4D",
  blue: "#4FA8FF",
  denim: "#2E6BB0",
  denimLight: "#7FB3E8",
  pink: "#FF3F86",
  pinkLight: "#FF9CC2",
  pinkDark: "#B71E5C",
  navy: "#232936",
  navyLight: "#333D50",
  skin: "#C98B63",
  boot: "#15171C",
};

const n = R;

/* ---------------------------------------------------------------- helpers */

function flower(cx, cy, r, color, spin = 0) {
  let petals = "";
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2 + spin;
    petals += `<ellipse cx="${n(cx + Math.cos(a) * r * 0.62)}" cy="${n(cy + Math.sin(a) * r * 0.62)}" rx="${n(r * 0.42)}" ry="${n(r * 0.3)}" fill="${color}" transform="rotate(${n((a * 180) / Math.PI)} ${n(cx + Math.cos(a) * r * 0.62)} ${n(cy + Math.sin(a) * r * 0.62)})"/>`;
  }
  return `<g>${petals}<circle cx="${n(cx)}" cy="${n(cy)}" r="${n(r * 0.2)}" fill="#FFE27A"/></g>`;
}

function leaf(cx, cy, rot, len, color) {
  return `<path d="M0 0 C ${len * 0.35} ${-len * 0.34} ${len * 0.8} ${-len * 0.2} ${len} 0 C ${len * 0.8} ${len * 0.2} ${len * 0.35} ${len * 0.34} 0 0 Z" fill="${color}" transform="translate(${n(cx)} ${n(cy)}) rotate(${rot})"/>`;
}

function armGeom(sx, sy, a1, a2, l1 = 48, l2 = 44) {
  const ex = sx + Math.sin(a1) * l1;
  const ey = sy + Math.cos(a1) * l1;
  const hx = ex + Math.sin(a1 + a2) * l2;
  const hy = ey + Math.cos(a1 + a2) * l2;
  return { ex, ey, hx, hy };
}

function legGeom(hx, hy, a1, a2, l1 = 54, l2 = 46) {
  const kx = hx + Math.sin(a1) * l1;
  const ky = hy + Math.cos(a1) * l1;
  const fx = kx + Math.sin(a1 + a2) * l2;
  const fy = ky + Math.cos(a1 + a2) * l2;
  return { kx, ky, fx, fy };
}

/* ---------------------------------------------------------------- Kittler */
/* (x, y) = hip joint. Feet sit near y+112 when standing. */

export function kittler(p = {}) {
  const {
    x = 0, y = 0, s = 1, flip = false, rot = 0,
    head = 0, headShift = 0, lean = 0,
    armL = [0.12, 0.1], armR = [0.12, 0.1],
    legL = [0.04, -0.02], legR = [-0.02, 0.04],
    tail = -0.35, tailCurl = 0,
    eyeOpen = 1, lookX = 0, lookY = 0,
    brow = 0,
    mouth = "smile", mouthOpen = 0,
    glasses = 0,
    outfit = "beach",
    squash = 0,
    wave = 0,
    hold = "none",
  } = p;

  const formal = outfit === "formal";
  const fur = C.fur;
  const bodyColor = formal ? C.navy : fur;
  const tw = R(1 + squash * 0.45);
  const th = R(1 - squash);

  /* ---- tail ---- */
  const tailSwing = Math.sin(wave * 2.1) * 4;
  const tailG = `
    <g transform="rotate(${n((tail * 180) / Math.PI) + tailSwing} 0 -104)">
      <path d="M 2 -104 C 26 -100 44 -88 50 -66 C 56 -44 44 ${-26 + tailCurl * 10} 24 ${-22 + tailCurl * 12}"
            fill="none" stroke="${fur}" stroke-width="23" stroke-linecap="round"/>
      <path d="M 2 -104 C 26 -100 44 -88 50 -66" fill="none" stroke="${C.furLine}" stroke-width="2.4" stroke-linecap="round" opacity="0.45"/>
    </g>`;

  /* ---- legs ---- */
  const hipL = [-30, -100];
  const hipR = [29, -100];
  const gL = legGeom(hipL[0], hipL[1], legL[0], legL[1], 52, 50);
  const gR = legGeom(hipR[0], hipR[1], legR[0], legR[1], 52, 50);

  const legStroke = formal ? C.ink : fur;
  const feetY = 0;
  const legs = `
    <g stroke-linecap="round" stroke-linejoin="round" fill="none">
      <path d="M ${hipL[0]} ${hipL[1]} L ${n(gL.kx)} ${n(gL.ky)} L ${n(gL.fx)} ${n(gL.fy)}" stroke="${legStroke}" stroke-width="${formal ? 32 : 35}"/>
      <path d="M ${hipR[0]} ${hipR[1]} L ${n(gR.kx)} ${n(gR.ky)} L ${n(gR.fx)} ${n(gR.fy)}" stroke="${legStroke}" stroke-width="${formal ? 32 : 35}"/>
    </g>
    ${formal
      ? `<g fill="${C.boot}">
           <ellipse cx="${n(gL.fx + 8)}" cy="${n(gL.fy + 5)}" rx="24" ry="11"/>
           <ellipse cx="${n(gR.fx + 8)}" cy="${n(gR.fy + 5)}" rx="24" ry="11"/>
         </g>`
      : `<g>
           <ellipse cx="${n(gL.fx + 9)}" cy="${n(gL.fy + 4)}" rx="24" ry="13" fill="${C.fur}"/>
           <ellipse cx="${n(gR.fx + 9)}" cy="${n(gR.fy + 4)}" rx="24" ry="13" fill="${C.fur}"/>
           <g stroke="${C.furLine}" stroke-width="1.6" opacity="0.75">
             <path d="M ${n(gL.fx + 24)} ${n(gL.fy - 1)} l 4 4"/>
             <path d="M ${n(gL.fx + 27)} ${n(gL.fy - 7)} l 4 4"/>
             <path d="M ${n(gR.fx + 24)} ${n(gR.fy - 1)} l 4 4"/>
             <path d="M ${n(gR.fx + 27)} ${n(gR.fy - 7)} l 4 4"/>
           </g>
         </g>`}

    ${/* beach shorts */""}
    ${!formal
      ? `<path d="M -48 -130 L 46 -130 L 52 -76 L 10 -76 L 5 -102 L -5 -102 L -12 -76 L -50 -76 Z"
             fill="${C.denim}"/>
         <path d="M -50 -90 L 52 -90 L 51 -76 L 10 -76 L 5 -98 L -5 -98 L -12 -76 L -50 -76 Z"
             fill="${C.denimLight}" opacity="0.95"/>
         <path d="M -48 -130 L 46 -130" stroke="#1E4F8C" stroke-width="3"/>
         <path d="M 20 -128 L 20 -96" stroke="#1E4F8C" stroke-width="2" opacity="0.6"/>`
      : ""}

    ${/* formal trousers */""}
    ${formal
      ? `<path d="M -48 -172 L 46 -172 L 50 -104 L 4 -104 L 0 -130 L -6 -104 L -50 -104 Z" fill="#262C3A"/>
         <path d="M -48 -172 L 46 -172 L 47 -160 L -49 -160 Z" fill="#1B202B"/>`
      : ""}
  `;

  /* ---- torso ---- */
  const torsoPath = "M -46 -198 C -55 -176 -54 -142 -48 -124 L 46 -124 C 53 -142 54 -176 46 -198 Z";

  const torso = `
    <path d="${torsoPath}" fill="${formal ? C.paper : fur}"/>
    <path d="M -46 -198 C -55 -176 -54 -142 -48 -124 L 46 -124 C 53 -142 54 -176 46 -198 Z"
          fill="none" stroke="${C.furLine}" stroke-width="1.4" opacity="0.55"/>`;

  /* vacation shirt */
  const shirt = `
    <g>
      <path d="M -47 -198 C -56 -176 -55 -140 -48 -120 L 48 -120 C 55 -140 56 -176 47 -198 Z" fill="${C.shirt}"/>
      <g clip-path="url(#shirtClip)" opacity="0.98">
        ${leaf(34, -170, 24, 34, "#0F7A6A")}
        ${leaf(-18, -150, 150, 30, "#0F7A6A")}
        ${leaf(10, -128, -40, 26, "#12806F")}
        ${flower(10, -160, 15, C.coral, 0.4)}
        ${flower(-32, -140, 12, C.yellow, 1.1)}
        ${flower(40, -136, 11, C.blue, 0.2)}
        ${flower(-14, -186, 10, C.coral, 0.8)}
        ${flower(34, -190, 9, C.yellow, 0.5)}
      </g>
      <path d="M -12 -198 L 0 -168 L 12 -198" fill="${C.fur}" opacity="0.98"/>
      <path d="M -24 -200 L -4 -176 L -12 -198 Z" fill="${C.shirtDark}"/>
      <path d="M 22 -200 L 4 -176 L 12 -198 Z" fill="${C.shirtDark}"/>
      <path d="M 0 -168 L 0 -120" stroke="${C.shirtDark}" stroke-width="2.4" opacity="0.8"/>
      <circle cx="0" cy="-158" r="2.6" fill="${C.paper}"/>
      <circle cx="0" cy="-140" r="2.6" fill="${C.paper}"/>
      <path d="M -47 -198 C -56 -176 -55 -140 -48 -120 L 48 -120 C 55 -140 56 -176 47 -198 Z"
            fill="none" stroke="#0E6E60" stroke-width="2"/>
    </g>`;

  /* formal jacket */
  const formalWear = `
    <g>
      <path d="M -52 -202 C -62 -178 -60 -138 -52 -116 L 52 -116 C 60 -138 62 -178 52 -202 Z" fill="${C.navy}"/>
      <path d="M -26 -202 L 26 -202 L 12 -146 L -12 -146 Z" fill="${C.paper}"/>
      <path d="M -26 -202 L -8 -152 L -16 -202 Z" fill="#F3EFE6"/>
      <path d="M 26 -202 L 8 -152 L 16 -202 Z" fill="#F3EFE6"/>
      <path d="M -30 -202 L -6 -142 L -18 -204 Z" fill="${C.navyLight}"/>
      <path d="M 30 -202 L 6 -142 L 18 -204 Z" fill="${C.navyLight}"/>
      <path d="M -30 -202 L -6 -142 L -14 -204 Z" fill="none" stroke="#0E1219" stroke-width="2"/>
      <path d="M 30 -202 L 6 -142 L 14 -204 Z" fill="none" stroke="#0E1219" stroke-width="2"/>
      <path d="M -7 -196 L 7 -196 L 8 -186 L -8 -186 Z" fill="${C.red}"/>
      <path d="M -6 -186 L 6 -186 L 8 -148 L 0 -140 L -8 -148 Z" fill="${C.red}"/>
      <path d="M -3 -188 L 3 -188" stroke="#B00E1F" stroke-width="1.6"/>
      <path d="M 26 -182 L 40 -182 L 40 -174 L 26 -174 Z" fill="${C.gold}"/>
      <path d="M -40 -180 L -26 -180 L -33 -170 Z" fill="${C.gold}"/>
      <circle cx="-1" cy="-128" r="2.8" fill="${C.gold}"/>
      <circle cx="-1" cy="-118" r="2.8" fill="${C.gold}" opacity="0.8"/>
      <path d="M 14 -160 L 30 -160" stroke="#3E4A5E" stroke-width="2" opacity="0.9"/>
      <circle cx="24" cy="-152" r="4.6" fill="none" stroke="${C.gold}" stroke-width="1.8"/>
      <path d="M -52 -202 C -62 -178 -60 -138 -52 -116 L 52 -116 C 60 -138 62 -178 52 -202 Z"
            fill="none" stroke="#0E1219" stroke-width="2.5"/>
    </g>`;

  /* ---- arms ---- */
  function drawArm(side) {
    const sx = side === "L" ? -44 : 44;
    const sy = -190;
    const a = side === "L" ? armL : armR;
    const g = armGeom(sx, sy, a[0], a[1]);
    const sleeveColor = formal ? C.navy : C.shirt;
    const sleeveW = formal ? 27 : 30;
    const furW = 25;
    const tilt = ((a[0] + a[1]) * 180) / Math.PI;
    const propSvg = side === "R" && hold === "drink"
      ? `<g transform="translate(${n(g.hx + 4)} ${n(g.hy - 6)}) rotate(${n(-tilt * 0.5)})">
           <path d="M -13 -6 L -9 -52 L 9 -52 L 13 -6 Z" fill="#FFE2C2" opacity="0.94" stroke="#E0B183" stroke-width="2"/>
           <path d="M -11.5 -34 L -10 -10 L 10 -10 L 11.5 -34 Z" fill="#FF7A59"/>
           <path d="M -10 -40 L -9 -26 L 9 -26 L 10 -40 Z" fill="#FFB347"/>
           <rect x="6" y="-74" width="4.4" height="30" rx="2.2" fill="#E8552F" transform="rotate(11 8 -60)"/>
           <circle cx="11" cy="-62" r="7.5" fill="#FFCB4D" stroke="#E9A93A" stroke-width="2"/>
           <ellipse cx="0" cy="-52" rx="10.4" ry="3.4" fill="#FFF3E2"/>
         </g>`
      : side === "R" && hold === "folder"
        ? `<g transform="translate(${n(g.hx + 4)} ${n(g.hy - 4)}) rotate(-8)">
             <rect x="-28" y="-38" width="56" height="42" rx="4" fill="${C.pink}" stroke="${C.pinkDark}" stroke-width="2.4"/>
             <rect x="-28" y="-38" width="56" height="9" rx="2" fill="${C.pinkLight}"/>
             <rect x="-8" y="-22" width="16" height="4" rx="2" fill="${C.gold}"/>
           </g>`
        : "";
    return `
      <g stroke-linecap="round" stroke-linejoin="round" fill="none">
        <path d="M ${sx} ${sy} L ${n(g.ex)} ${n(g.ey)} L ${n(g.hx)} ${n(g.hy)}" stroke="${formal ? C.navy : fur}" stroke-width="${furW}"/>
        <path d="M ${sx} ${sy} L ${n(g.ex)} ${n(g.ey)}" stroke="${sleeveColor}" stroke-width="${sleeveW}"/>
      </g>
      <circle cx="${n(g.hx)}" cy="${n(g.hy)}" r="${formal ? 14 : 16}" fill="${C.fur}"/>
      <path d="M ${n(g.hx - 8)} ${n(g.hy + 4)} q 8 6 16 0" fill="none" stroke="${C.furLine}" stroke-width="1.8" opacity="0.8"/>
      ${propSvg}
    `;
  }

  const armBack = drawArm("L");
  const armFront = drawArm("R");

  /* ---- head ---- */
  const skull = "M -46 -56 C -50 -80 -34 -98 -6 -101 C 24 -104 46 -88 50 -64 C 53 -44 46 -22 26 -12 C 8 -3 -14 -6 -30 -18 C -42 -28 -45 -42 -46 -56 Z";

  const eyeR = 7.2 + eyeOpen * 4.6;
  const pupil = 4.4 + eyeOpen * 1.2;

  function eye(cx, cy) {
    return `
      <ellipse cx="${cx}" cy="${cy}" rx="${n(eyeR)}" ry="${n(eyeR * 1.15)}" fill="#FFFDF8"/>
      <circle cx="${n(cx + lookX)}" cy="${n(cy + lookY)}" r="${n(pupil)}" fill="#241F1F"/>
      <circle cx="${n(cx + lookX - 2)}" cy="${n(cy + lookY - 2.4)}" r="${n(pupil * 0.32)}" fill="#FFFFFF" opacity="0.9"/>
      <path d="M ${n(cx - eyeR - 0.5)} ${n(cy - eyeR * 1.15)} q ${n(eyeR)} ${n(-2 - brow * 4)} ${n(eyeR * 2 + 1)} 0"
            fill="none" stroke="${C.patch}" stroke-width="2.2" stroke-linecap="round" opacity="0.75"/>
    `;
  }

  const eyes = eye(-15, -58) + eye(21, -58);

  const mouthShapes = {
    smile: `<path d="M -8 -26 Q 2 -18 12 -26" fill="none" stroke="${C.patch}" stroke-width="2.6" stroke-linecap="round"/>`,
    flat: `<path d="M -7 -24 L 11 -24" fill="none" stroke="${C.patch}" stroke-width="2.6" stroke-linecap="round"/>`,
    o: `<ellipse cx="2" cy="-22" rx="5.5" ry="7" fill="#3A2626"/>`,
    open: `<ellipse cx="2" cy="-21" rx="8" ry="${n(4 + mouthOpen * 12)}" fill="#3A2626"/>
           <ellipse cx="2" cy="${n(-24 + mouthOpen * 4)}" rx="4.5" ry="2.4" fill="#E28C8C"/>`,
    grin: `<path d="M -12 -28 Q 2 -12 16 -28 Q 2 -22 -12 -28 Z" fill="#3A2626"/>
           <path d="M -9 -27 Q 2 -24 13 -27" fill="none" stroke="#FFFDF8" stroke-width="2.4"/>`,
    grit: `<path d="M -11 -28 Q 2 -22 15 -28 L 13 -20 Q 2 -16 -9 -20 Z" fill="#FFFDF8" stroke="${C.patch}" stroke-width="1.8"/>`,
  };
  const mouthSvg = mouthShapes[mouth] || mouthShapes.smile;

  const glassesSvg = `
    <g transform="translate(0 ${n(glasses)}) rotate(${n(head * -0.35)})">
      <g fill="url(#lensGrad)" stroke="#E8C27A" stroke-width="2.6">
        <rect x="-33" y="-71" width="36" height="27" rx="10"/>
        <rect x="3" y="-71" width="36" height="27" rx="10"/>
      </g>
      <path d="M 3 -60 L -0.6 -60" stroke="#E8C27A" stroke-width="3"/>
      <path d="M -33 -62 L -46 -64" stroke="#E8C27A" stroke-width="3"/>
      <path d="M 39 -62 L 50 -64" stroke="#E8C27A" stroke-width="3"/>
      <path d="M -30 -68 L -6 -68" stroke="#FFFFFF" stroke-width="3.4" opacity="0.35" stroke-linecap="round"/>
      <path d="M 6 -68 L 26 -68" stroke="#FFFFFF" stroke-width="3.4" opacity="0.28" stroke-linecap="round"/>
    </g>`;

  const headSvg = `
    <g transform="translate(${n(headShift)} -196) rotate(${n(head)}) scale(1.1)">
      <path d="M -28 6 L -28 -18 L 28 -18 L 28 6 Z" fill="${C.fur}"/>
      <!-- ears -->
      <g>
        <path d="M -40 -72 L -54 -122 L -12 -88 Z" fill="${C.fur}" stroke="${C.furLine}" stroke-width="2"/>
        <path d="M -37 -78 L -46 -108 L -18 -86 Z" fill="${C.innerEar}"/>
        <path d="M 16 -90 L 42 -130 L 58 -68 Z" fill="${C.patch}" stroke="${C.patch}" stroke-width="2"/>
        <path d="M 25 -86 L 41 -114 L 50 -74 Z" fill="#8C5A4E"/>
      </g>
      <!-- skull -->
      <path d="${skull}" fill="${C.fur}"/>
      <!-- fur tufts -->
      <path d="M -46 -60 l -12 -3 l 10 -6 l -11 -5 l 12 -2" fill="${C.fur}" stroke="${C.furLine}" stroke-width="1.6"/>
      <path d="M 49 -58 l 12 -4 l -10 -6 l 11 -4 l -12 -3" fill="${C.fur}" stroke="${C.furLine}" stroke-width="1.6"/>
      <!-- black patch, clipped to skull -->
      <g clip-path="url(#headClip)">
        <path d="M -3 -108 L 60 -100 L 60 -46 C 52 -34 42 -36 32 -44 C 20 -53 8 -72 -3 -108 Z" fill="${C.patch}"/>
        <path d="M 16 -62 C 26 -60 34 -54 36 -46 C 30 -38 22 -42 18 -48 Z" fill="${C.patch}"/>
      </g>
      <path d="${skull}" fill="none" stroke="${C.furLine}" stroke-width="2"/>
      <!-- muzzle -->
      <ellipse cx="3" cy="-30" rx="27" ry="16" fill="#FFFDF8"/>
      <ellipse cx="3" cy="-24" rx="18" ry="9" fill="#F3ECE0" opacity="0.65"/>
      <!-- whiskers -->
      <g stroke="${C.furLine}" stroke-width="1.7" stroke-linecap="round" opacity="0.95">
        <path d="M -12 -32 L -66 -40"/>
        <path d="M -12 -28 L -68 -26"/>
        <path d="M -10 -24 L -62 -14"/>
        <path d="M 18 -32 L 70 -40"/>
        <path d="M 18 -28 L 72 -26"/>
        <path d="M 16 -24 L 66 -14"/>
      </g>
      <!-- eyes -->
      <g>${eyes}</g>
      <!-- nose + mouth -->
      <path d="M -3 -38 L 8 -38 L 2.5 -31 Z" fill="${C.patch}"/>
      <path d="M 2 -31 L 2 -27" stroke="${C.patch}" stroke-width="2.2" stroke-linecap="round"/>
      <g>${mouthSvg}</g>
      ${glassesSvg}
    </g>`;

  return `
  <g transform="translate(${n(x)} ${n(y)}) scale(${flip ? -s : s} ${s})">
    <g transform="rotate(${n(rot)} 0 -100) scale(${tw} ${th})">
      ${tailG}
      ${legs}
      ${torso}
      ${formal ? formalWear : shirt}
      ${armBack}
      ${armFront}
      ${headSvg}
    </g>
  </g>`;
}

/* ------------------------------------------------------- pink drawer prop */

export function drawer(p = {}) {
  const { x = 0, y = 0, s = 1, open = 0, shake = 0, glow = 0 } = p;
  const wob = Math.sin(shake * 34) * 4.5 * Math.min(1, shake);
  const W = 280, H = 360;
  const iw = W - 34;
  const portalY = -H + 44;
  const portalH = 150;

  return `
  <g transform="translate(${n(x + wob)} ${n(y)}) scale(${s})">
    <ellipse cx="0" cy="8" rx="${W * 0.64}" ry="22" fill="#7A4A28" opacity="0.24"/>
    <g>
      <!-- feet -->
      <g fill="${C.gold}">
        <rect x="${-W / 2 + 6}" y="-4" width="34" height="16" rx="5"/>
        <rect x="${W / 2 - 40}" y="-4" width="34" height="16" rx="5"/>
      </g>
      <rect x="${-W / 2}" y="${-H}" width="${W}" height="${H}" rx="14" fill="${C.pink}"/>
      <rect x="${-W / 2}" y="${-H}" width="${W}" height="20" rx="12" fill="${C.pinkLight}"/>
      <rect x="${-W / 2 + 9}" y="${-H + 14}" width="${W - 18}" height="${H - 26}" rx="9" fill="${C.pinkDark}" opacity="0.28"/>

      <!-- portal cavity -->
      <rect x="${-iw / 2}" y="${portalY}" width="${iw}" height="${portalH}" rx="7" fill="#3B0619"/>
      <rect x="${-iw / 2}" y="${portalY}" width="${iw}" height="${portalH}" rx="7" fill="url(#drawerGlow)" opacity="${0.28 + glow * 0.72}"/>
      <g opacity="${0.55 + glow * 0.45}">
        <rect x="${-iw / 2}" y="${portalY}" width="${iw}" height="5" fill="${C.pinkLight}"/>
        <rect x="${-iw / 2}" y="${portalY + portalH - 5}" width="${iw}" height="5" fill="${C.pinkLight}"/>
        <rect x="${-iw / 2}" y="${portalY}" width="5" height="${portalH}" fill="${C.pinkLight}"/>
        <rect x="${iw / 2 - 5}" y="${portalY}" width="5" height="${portalH}" fill="${C.pinkLight}"/>
      </g>

      <!-- sliding pink door (rises out of frame) -->
      <g clip-path="url(#drawerClip)">
        <g transform="translate(0 ${n(-open * 172)})">
          <rect x="${-iw / 2}" y="${portalY}" width="${iw}" height="${portalH}" rx="7" fill="url(#pinkGrad)" stroke="${C.pinkDark}" stroke-width="4"/>
          <rect x="${-iw / 2 + 22}" y="${portalY + 58}" width="${iw - 44}" height="16" rx="8" fill="${C.gold}"/>
          <rect x="${-iw / 2 + 22}" y="${portalY + 52}" width="${iw - 44}" height="5" rx="2.5" fill="#FFE7A8" opacity="0.85"/>
          <circle cx="0" cy="${portalY + 30}" r="7" fill="${C.gold}"/>
          <path d="M ${-iw / 2 + 10} ${portalY + 12} L ${iw / 2 - 10} ${portalY + 12}" stroke="#FFC2D8" stroke-width="4" opacity="0.7"/>
        </g>
      </g>

      <!-- lower drawer -->
      <rect x="${-iw / 2}" y="${-H + 214}" width="${iw}" height="118" rx="7" fill="url(#pinkGrad)" stroke="${C.pinkDark}" stroke-width="4"/>
      <rect x="${-iw / 2 + 26}" y="${-H + 272}" width="${iw - 52}" height="14" rx="7" fill="${C.gold}"/>
      <rect x="${-iw / 2 + 26}" y="${-H + 266}" width="${iw - 52}" height="5" rx="2.5" fill="#FFE7A8" opacity="0.85"/>
      <path d="M ${-W / 2} ${-H + 16} L ${W / 2} ${-H + 16}" stroke="#FFC2D8" stroke-width="3" opacity="0.6"/>
      <rect x="${-W / 2 + 4}" y="${-H + 4}" width="10" height="${H - 14}" rx="5" fill="#FFC2D8" opacity="0.45"/>
    </g>
  </g>`;
}

/* ---------------------------------------------------------- comic props */

export function drink(p = {}) {
  const { x = 0, y = 0, s = 1, t = 0 } = p;
  const sway = Math.sin(t * 2.2) * 1.5;
  return `
  <g transform="translate(${n(x)} ${n(y)}) scale(${s}) rotate(${n(sway)})">
    <ellipse cx="0" cy="0" rx="26" ry="7" fill="#8A5A34" opacity="0.2"/>
    <path d="M -16 -10 L -11 -62 L 11 -62 L 16 -10 Z" fill="#FFE2C2" opacity="0.92" stroke="#E9BE93" stroke-width="2"/>
    <path d="M -14 -42 L -12 -14 L 12 -14 L 14 -42 Z" fill="#FF7A59"/>
    <path d="M -12 -48 L -10 -30 L 10 -30 L 12 -48 Z" fill="#FFB347"/>
    <rect x="8" y="-88" width="5" height="34" rx="2.5" fill="#E8552F" transform="rotate(12 10 -70)"/>
    <circle cx="14" cy="-74" r="9" fill="#FFCB4D" stroke="#E9A93A" stroke-width="2"/>
    <ellipse cx="0" cy="-62" rx="12.4" ry="4" fill="#FFF3E2"/>
  </g>`;
}

export function folder(p = {}) {
  const { x = 0, y = 0, s = 1, open = 0 } = p;
  return `
  <g transform="translate(${n(x)} ${n(y)}) scale(${s}) rotate(${n(-6 + open * 12)})">
    <rect x="-34" y="-46" width="68" height="50" rx="4" fill="${C.pink}" stroke="${C.pinkDark}" stroke-width="2.5"/>
    <rect x="-34" y="-46" width="68" height="12" rx="3" fill="${C.pinkLight}"/>
    <rect x="-8" y="-30" width="16" height="4" rx="2" fill="${C.gold}"/>
    <rect x="-20" y="-20" width="40" height="3" rx="1.5" fill="#FFFFFF" opacity="0.75"/>
    <rect x="-20" y="-12" width="26" height="3" rx="1.5" fill="#FFFFFF" opacity="0.55"/>
  </g>`;
}
