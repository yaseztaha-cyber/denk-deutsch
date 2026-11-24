/* The Commander — original design: tall, rigid, quietly absurd.
   (x, y) = hip joint. Feet sit at y + 180. */

import { C } from "./rig.js";

const n = (v) => Math.round(v * 100) / 100;

function armGeom(sx, sy, a1, a2, l1 = 64, l2 = 58) {
  const ex = sx + Math.sin(a1) * l1;
  const ey = sy + Math.cos(a1) * l1;
  const hx = ex + Math.sin(a1 + a2) * l2;
  const hy = ey + Math.cos(a1 + a2) * l2;
  return { ex, ey, hx, hy };
}

function legGeom(hx, hy, a1, a2, l1 = 82, l2 = 76) {
  const kx = hx + Math.sin(a1) * l1;
  const ky = hy + Math.cos(a1) * l1;
  const fx = kx + Math.sin(a1 + a2) * l2;
  const fy = ky + Math.cos(a1 + a2) * l2;
  return { kx, ky, fx, fy };
}

export function commander(p = {}) {
  const {
    x = 0, y = 0, s = 1, flip = false,
    head = 0, lean = 0,
    armL = [0.3, 0.08], armR = [-0.3, 0.08],
    legL = [0.17, -0.02], legR = [-0.17, 0.02],
    brow = 1, mouth = "flat", blink = 0,
    hold = "none",
    watch = 0,
  } = p;

  const gLleg = legGeom(-22, -14, legL[0], legL[1]);
  const gRleg = legGeom(22, -14, legR[0], legR[1]);

  const legs = `
    <g stroke-linecap="round" stroke-linejoin="round" fill="none">
      <path d="M -22 -14 L ${n(gLleg.kx)} ${n(gLleg.ky)} L ${n(gLleg.fx)} ${n(gLleg.fy)}" stroke="${C.ink}" stroke-width="34"/>
      <path d="M 22 -14 L ${n(gRleg.kx)} ${n(gRleg.ky)} L ${n(gRleg.fx)} ${n(gRleg.fy)}" stroke="${C.ink}" stroke-width="34"/>
    </g>
    <g fill="${C.boot}">
      <ellipse cx="${n(gLleg.fx + 9)}" cy="${n(gLleg.fy + 7)}" rx="28" ry="13"/>
      <ellipse cx="${n(gRleg.fx + 9)}" cy="${n(gRleg.fy + 7)}" rx="28" ry="13"/>
    </g>
    <g fill="${C.gold}" opacity="0.85">
      <rect x="${n(gLleg.fx - 14)}" y="${n(gLleg.fy + 12)}" width="42" height="4" rx="2"/>
      <rect x="${n(gRleg.fx - 14)}" y="${n(gRleg.fy + 12)}" width="42" height="4" rx="2"/>
    </g>`;

  const armSvg = (side) => {
    const sx = side === "L" ? -54 : 54;
    const sy = -142;
    const a = side === "L" ? armL : armR;
    const g = armGeom(sx, sy, a[0], a[1]);
    return {
      g,
      svg: `
        <g stroke-linecap="round" stroke-linejoin="round" fill="none">
          <path d="M ${sx} ${sy} L ${n(g.ex)} ${n(g.ey)} L ${n(g.hx)} ${n(g.hy)}" stroke="${C.navyLight}" stroke-width="33"/>
          <path d="M ${sx} ${sy} L ${n(g.ex)} ${n(g.ey)}" stroke="${C.navy}" stroke-width="35"/>
          <path d="M ${n(g.ex - 4)} ${n(g.ey - 4)} L ${n(g.hx)} ${n(g.hy)}" stroke="${C.navy}" stroke-width="28"/>
        </g>
        <circle cx="${n(g.hx)}" cy="${n(g.hy)}" r="14" fill="#2C3444" stroke="#12161F" stroke-width="2"/>
        <path d="M ${n(g.hx - 8)} ${n(g.hy + 2)} q 8 5 16 0" fill="none" stroke="#5B6578" stroke-width="2"/>
      `,
    };
  };

  const armA = armSvg("L");
  const armB = armSvg("R");

  const brows = `
    <g stroke="#5B5348" stroke-width="6" stroke-linecap="round">
      <path d="M -27 ${n(-226 + brow * 2)} L -6 ${n(-222 - brow * 5)}"/>
      <path d="M 27 ${n(-226 + brow * 2)} L 6 ${n(-222 - brow * 5)}"/>
    </g>`;

  const eyes = `
    <g>
      <ellipse cx="-13" cy="-209" rx="8.4" ry="${n(7.6 * (1 - blink * 0.92))}" fill="#FBF7EF"/>
      <ellipse cx="13" cy="-209" rx="8.4" ry="${n(7.6 * (1 - blink * 0.92))}" fill="#FBF7EF"/>
      <g fill="#241F1F">
        <circle cx="-11" cy="-208" r="3.9"/>
        <circle cx="11" cy="-208" r="3.9"/>
      </g>
      <g fill="none" stroke="#8E5D42" stroke-width="2.2" stroke-linecap="round">
        <path d="M -22 -216 q 9 -5 18 0"/>
        <path d="M 4 -216 q 9 -5 18 0"/>
      </g>
    </g>`;

  const mouths = {
    flat: `<path d="M -13 -188 L 13 -188" stroke="#5C3A2C" stroke-width="3.4" stroke-linecap="round"/>`,
    talk: `<ellipse cx="0" cy="-186" rx="10" ry="7" fill="#4A2B21"/>`,
    frown: `<path d="M -13 -184 Q 0 -192 13 -184" fill="none" stroke="#5C3A2C" stroke-width="3.4" stroke-linecap="round"/>`,
  };

  let prop = "";
  if (hold === "folder") {
    prop = `
      <g transform="translate(${n(armB.g.hx)} ${n(armB.g.hy)}) rotate(-12)">
        <rect x="-30" y="-40" width="60" height="44" rx="4" fill="${C.pink}" stroke="${C.pinkDark}" stroke-width="2.5"/>
        <rect x="-30" y="-40" width="60" height="10" rx="3" fill="${C.pinkLight}"/>
        <rect x="-6" y="-24" width="14" height="4" rx="2" fill="${C.gold}"/>
        <rect x="-18" y="-16" width="36" height="3" rx="1.5" fill="#fff" opacity="0.8"/>
      </g>`;
  }
  if (hold === "watch") {
    prop = `
      <g transform="translate(${n(armA.g.hx)} ${n(armA.g.hy)}) rotate(${n(-30 + watch * 10)})">
        <circle r="13" fill="${C.gold}" stroke="#B57A0C" stroke-width="3"/>
        <circle r="8.5" fill="${C.paper}"/>
        <path d="M 0 0 L 0 -5.5 M 0 0 L 4 2" stroke="${C.ink}" stroke-width="1.6" stroke-linecap="round"/>
      </g>`;
  }

  return `
  <g transform="translate(${n(x)} ${n(y)}) scale(${flip ? -s : s} ${s})">
    ${legs}
    <g transform="rotate(${n(lean)} 0 0)">
      ${armA.svg}
      <path d="M -56 -150 C -64 -118 -56 -62 -48 -8 L 48 -8 C 56 -62 64 -118 56 -150 Z" fill="${C.navy}"/>
      <path d="M -56 -150 C -64 -118 -56 -62 -48 -8 L -13 -8 L -18 -150 Z" fill="${C.navyLight}" opacity="0.35"/>
      <rect x="-50" y="-46" width="100" height="18" fill="${C.ink}"/>
      <rect x="-13" y="-46" width="26" height="18" fill="${C.gold}"/>
      <rect x="-5" y="-42" width="10" height="10" rx="2" fill="${C.ink}"/>
      <path d="M -44 -150 L 44 -150" stroke="${C.ink}" stroke-width="5" opacity="0.5"/>
      <g fill="${C.navyLight}">
        <rect x="-40" y="-124" width="26" height="34" rx="3"/>
        <rect x="14" y="-124" width="26" height="34" rx="3"/>
      </g>
      <g fill="${C.gold}">
        <circle cx="-27" cy="-116" r="2.6"/>
        <circle cx="27" cy="-116" r="2.6"/>
        <path d="M -60 -144 L -34 -144 L -34 -138 L -60 -138 Z"/>
        <path d="M 60 -144 L 34 -144 L 34 -138 L 60 -138 Z"/>
        <path d="M -8 -170 L 0 -180 L 8 -170" fill="none" stroke="${C.gold}" stroke-width="3"/>
      </g>
      <path d="M -30 -152 C -22 -136 -14 -132 0 -132 C 14 -132 22 -136 30 -152" fill="${C.ink}" opacity="0.9"/>
      <rect x="-7" y="-186" width="14" height="14" fill="${C.skin}"/>
      ${prop}
      ${armB.svg}
      <g transform="rotate(${n(head)} 0 -186)">
        <path d="M -31 -246 L 31 -246 L 35 -206 C 35 -180 21 -166 0 -164 C -21 -166 -35 -180 -35 -206 Z" fill="${C.skin}"/>
        <path d="M -35 -196 C -34 -180 -20 -166 0 -164 C 20 -166 34 -180 35 -196 C 26 -184 12 -180 0 -180 C -12 -180 -26 -184 -35 -196 Z" fill="#B27C58" opacity="0.22"/>
        <path d="M -34 -214 L -40 -208 L -34 -198" fill="${C.skin}"/>
        <path d="M 34 -214 L 40 -208 L 34 -198" fill="${C.skin}"/>
        <path d="M -30 -240 L 30 -240 L 30 -228 L -30 -228 Z" fill="#AE7752" opacity="0.3"/>
        <path d="M 0 -176 L 0 -166" stroke="#B27C58" stroke-width="2" opacity="0.5"/>
        ${brows}
        ${eyes}
        <path d="M -4 -197 L 4 -197 L 3 -190 L -3 -190 Z" fill="#B27C58"/>
        <path d="M -22 -186 L 22 -186" stroke="#B27C58" stroke-width="2" opacity="0.28"/>
        ${mouths[mouth] || mouths.flat}
        <!-- cap -->
        <path d="M -44 -242 L -40 -282 Q -6 -292 0 -292 Q 6 -292 40 -282 L 44 -242 Z" fill="${C.navy}"/>
        <path d="M -44 -254 L 44 -254 L 44 -242 L -44 -242 Z" fill="${C.ink}"/>
        <path d="M -44 -254 L 44 -254" stroke="${C.gold}" stroke-width="4.5"/>
        <path d="M -22 -276 L 22 -276" stroke="${C.navyLight}" stroke-width="3" opacity="0.6"/>
        <path d="M 8 -248 Q 52 -250 64 -236 Q 40 -238 8 -238 Z" fill="${C.ink}"/>
        <path d="M 8 -246 Q 46 -246 58 -236" fill="none" stroke="#3A4250" stroke-width="2" opacity="0.8"/>
        <path d="M -2 -242 L 8 -242 L 8 -232 L 3 -228 L -2 -232 Z" fill="${C.gold}"/>
        <path d="M -44 -242 L -52 -240 L -46 -232 Z" fill="${C.ink}"/>
        <path d="M 44 -242 L 52 -240 L 46 -232 Z" fill="${C.ink}"/>
      </g>
    </g>
  </g>`;
}

/* small pedestal / rail the drawer sits on */
export function drawerRail(p = {}) {
  const { x = 0, y = 0, s = 1, k = 0 } = p;
  return `
  <g transform="translate(${n(x)} ${n(y)}) scale(${s})">
    <ellipse cx="0" cy="10" rx="${n(210 * k)}" ry="${n(26 * k)}" fill="#8A5A34" opacity="${0.22 * k}"/>
    <rect x="${n(-150 * k)}" y="-18" width="${n(300 * k)}" height="20" rx="8" fill="${C.pinkDark}" opacity="${0.9 * k}"/>
    <rect x="${n(-150 * k)}" y="-20" width="${n(300 * k)}" height="8" rx="4" fill="${C.pinkLight}" opacity="${k}"/>
  </g>`;
}
