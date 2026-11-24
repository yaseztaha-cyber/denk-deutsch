/* DENK Deutsch — G11 Mid Revision
   A 44.5 s animated short, frame-accurate: every visual value is a pure
   function of time, so the exported film is exactly what is inspected. */

import { kittler, drawer } from "./rig.js";
import { commander } from "./commander.js";
import { beach, brandSet } from "./world.js";

const W = 1920;
const H = 1080;

const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const lerp = (a, b, t) => a + (b - a) * t;
const seg = (t, a, b) => clamp((t - a) / (b - a));
const eOut = (t) => 1 - Math.pow(1 - t, 3);
const eIn = (t) => t * t * t;
const eInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const eBack = (t) => {
  const c = 1.55;
  return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2);
};
const tw = (t, a, b, from, to, e = eOut) => lerp(from, to, e(seg(t, a, b)));
const kf = (t, keys, e = eInOut) => {
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    if (t <= keys[i][0]) {
      const [t0, v0] = keys[i - 1];
      const [t1, v1] = keys[i];
      return lerp(v0, v1, e(seg(t, t0, t1)));
    }
  }
  return keys[keys.length - 1][1];
};
const stepAt = (t, keys) => {
  let v = keys[0][1];
  for (const [tt, vv] of keys) if (t >= tt) v = vv;
  return v;
};

let cues = null;

/* ------------------------------------------------------------------ camera */

function camera(t) {
  if (t < 6) return [170, 92, 1580, 888.75];
  if (t < 10) {
    const k = seg(t, 6, 10);
    return [520 - 26 * k, 330 + 10 * k, 1000 - 44 * k, (1000 - 44 * k) * (9 / 16)];
  }
  if (t < 14) return [520, 286, 1300, 731.25];
  if (t < 16.9) return [740, 330, 1180, 663.75];
  if (t < 18) {
    const k = seg(t, 16.9, 18);
    return [600 + 12 * k, 296 + 8 * k, 860 - 30 * k, (860 - 30 * k) * (9 / 16)];
  }
  if (t < 25) return [520, 282, 1340, 753.75];
  if (t < 29) {
    const k = seg(t, 25, 29);
    return [930 + 14 * k, 336 + 5 * k, 1120 - 26 * k, (1120 - 26 * k) * (9 / 16)];
  }
  if (t < 32) return [1000, 348, 1080, 607.5];
  return [0, 0, W, H];
}

/* ------------------------------------------------------------ Kittler state */

function kittlerState(t) {
  const s = {
    x: 800, y: 722, s: 1, rot: -14, head: -5, headShift: 0,
    armL: [-2.55, -0.55], armR: [0.45, 1.2], legL: [1.28, -0.5], legR: [1.2, -0.44],
    tail: -0.18, tailCurl: 0.2, hold: "drink", outfit: "beach",
    mouth: "smile", mouthOpen: 0, eyeOpen: 1, lookX: 0, lookY: 0, glasses: 0, squash: 0,
    wave: t,
  };

  /* --- scene 1: perfect vacation (0–6) --- */
  if (t < 6) {
    const br = Math.sin(t * 1.35) * 0.012;
    s.y = 722 + br * 26;
    s.head = -5 + Math.sin(t * 0.85) * 1.6;
    s.tail = -0.18 + Math.sin(t * 0.8) * 0.06;
    if (t > 4.15 && t < 5.35) {
      s.armR = [tw(t, 4.15, 4.45, 0.45, 0.3), tw(t, 4.15, 4.55, 1.2, 2.45)];
      s.head = tw(t, 4.2, 4.5, -5, 5);
      s.mouth = "flat";
    }
    if (t > 3.0 && t < 3.9) s.head = kf(t, [[3.0, -5], [3.35, -9], [3.9, -6]]);
    return s;
  }

  /* --- scene 2: absolute relaxation (6–10) --- */
  if (t < 10) {
    s.y = 722 + Math.sin(t * 1.35) * 0.3;
    s.head = -5;
    if (t < 6.45) {
      s.armR = [tw(t, 6.0, 6.35, 0.45, 2.95), tw(t, 6.0, 6.4, 1.2, 1.15)];
      s.head = -5;
    } else if (t < 7.05) {
      s.armR = [2.95, 1.15];
      s.glasses = tw(t, 6.5, 6.95, 0, 7);
      s.head = -7;
      s.mouth = "grin";
    } else if (t < 7.6) {
      s.armR = [tw(t, 7.05, 7.45, 2.95, 0.45), tw(t, 7.05, 7.5, 1.15, 1.2)];
      s.glasses = tw(t, 7.05, 7.5, 7, 0);
      s.rot = tw(t, 7.1, 7.7, -14, -19);
      s.mouth = "smile";
    } else if (t < 8.55) {
      s.armR = [tw(t, 7.6, 7.85, 0.45, 0.28), tw(t, 7.6, 7.9, 1.2, 2.5)];
      s.head = tw(t, 7.65, 7.95, -5, 7);
      s.rot = -19;
      s.mouth = "flat";
      s.eyeOpen = 0.5;
    } else if (t < 9.15) {
      s.armR = [tw(t, 8.55, 8.85, 0.28, 0.45), tw(t, 8.55, 8.95, 2.5, 1.2)];
      s.head = tw(t, 8.55, 8.9, 7, -3);
      s.rot = tw(t, 8.6, 9.2, -19, -14);
      s.mouth = "grin";
      s.eyeOpen = 1;
    } else {
      s.armR = [0.45, 1.2];
      s.head = tw(t, 9.2, 9.7, -3, 2);
      s.lookX = 2;
      s.mouth = "smile";
      s.tail = -0.18 + Math.sin(t * 0.9) * 0.1;
    }
    return s;
  }

  /* --- scene 3: the commander arrives (10–14) --- */
  if (t < 14) {
    s.y = 722;
    s.armR = [0.45, 1.2];
    if (t < 11.85) {
      s.head = -4;
      s.rot = -14;
      s.mouth = "smile";
      s.eyeOpen = 0.15;
    } else if (t < 12.55) {
      s.head = tw(t, 11.85, 12.35, -4, 11);
      s.rot = -14;
      s.mouth = "flat";
      s.eyeOpen = 1;
      s.lookX = 3;
    } else if (t < 13.15) {
      s.head = 11;
      s.rot = tw(t, 12.55, 13.05, -14, -8);
      s.armR = [tw(t, 12.5, 12.9, 0.45, 0.62), tw(t, 12.5, 12.95, 1.2, 0.55)];
      s.mouth = "o";
      s.glasses = tw(t, 12.6, 13.1, 0, 10);
      s.eyeOpen = 1.6;
      s.lookX = 4;
    } else {
      s.head = 9;
      s.rot = -8;
      s.armR = [0.62, 0.5];
      s.mouth = "o";
      s.glasses = 10;
      s.eyeOpen = 1.6;
      s.lookX = 4;
      s.squash = t > 13.5 ? 0.02 : 0;
    }
    return s;
  }

  /* --- scene 4: "We have a mission." (14–18) --- */
  if (t < 18) {
    s.y = 722;
    if (t < 16.9) {
      s.rot = -8;
      s.head = 9;
      s.armR = [0.62, 0.5];
      s.mouth = "o";
      s.glasses = 10;
      s.eyeOpen = 1.6;
      s.lookX = 4;
      s.headShift = kf(t, [[14, 0], [15.4, -3], [16.6, 2], [16.9, 0]]);
      return s;
    }
    /* reaction */
    s.rot = tw(t, 16.9, 17.5, -8, -1);
    s.glasses = tw(t, 17.0, 17.6, 10, 34, eBack);
    s.eyeOpen = tw(t, 17.0, 17.4, 1.6, 2.35);
    s.mouth = "o";
    s.head = tw(t, 16.9, 17.5, 9, 14);
    s.armR = [tw(t, 17.0, 17.5, 0.62, 1.05), 0.35];
    s.armL = [tw(t, 17.05, 17.5, -2.55, -1.15), 0.2];
    s.y = 722 + tw(t, 17.6, 17.95, 0, 14, eIn);
    s.squash = tw(t, 17.6, 17.95, 0, 0.18, eIn);
    s.legL = [1.28, -0.5];
    s.legR = [1.2, -0.44];
    if (t > 17.35 && t < 17.7) {
      s.lookX = 5; s.lookY = 7; s.head = 6;
    }
    if (t > 17.75) {
      s.lookX = 0; s.lookY = -2; s.head = 12;
    }
    s.tail = -0.18 + (t > 17.2 ? Math.sin((t - 17.2) * 26) * 0.22 : 0);
    return s;
  }

  /* --- scene 5: the pink drawer (18–25) --- */
  if (t < 25) {
    s.outfit = "beach";
    s.y = 810;
    s.x = 880;
    s.rot = 0;
    s.head = 0;
    s.squash = 0;
    s.glasses = 34;
    s.eyeOpen = 2.1;
    s.mouth = "o";
    s.legL = [0.12, -0.06];
    s.legR = [-0.12, 0.06];
    s.tail = -0.1;

    if (t < 18.45) {
      /* airborne, then land */
      const fall = seg(t, 18.0, 18.4);
      s.x = lerp(856, 880, fall);
      s.y = lerp(690, 810, eIn(fall));
      s.rot = lerp(-14, 0, fall);
      s.legL = [lerp(1.28, 0.12, fall), lerp(-0.5, -0.06, fall)];
      s.legR = [lerp(1.2, -0.12, fall), lerp(-0.44, 0.06, fall)];
      s.armL = [lerp(-2.55, -2.2, fall), -0.4];
      s.armR = [lerp(1.05, 2.0, fall), 0.2];
      s.squash = t > 18.38 ? tw(t, 18.4, 18.55, 0.14, 0) : 0;
      s.mouth = "open";
      s.mouthOpen = 0.6;
    } else if (t < 19.0) {
      s.y = 810 + Math.sin((t - 18.45) * 22) * Math.max(0, 3 - (t - 18.45) * 20);
      s.armL = [-2.0, -0.3];
      s.armR = [1.9, 0.2];
      s.squash = tw(t, 18.45, 18.65, 0.14, 0);
      s.head = 4;
    } else if (t < 19.35) {
      s.armL = [tw(t, 19.0, 19.3, -2.0, 0.2), 0.15];
      s.armR = [tw(t, 19.0, 19.3, 1.9, 0.35), 0.15];
      s.head = tw(t, 19.0, 19.3, 4, 0);
      s.eyeOpen = tw(t, 19.0, 19.3, 2.1, 1.1);
      s.mouth = "flat";
      s.glasses = 26;
      s.tail = -0.1 + Math.sin(t * 2) * 0.05;
    } else if (t < 20.35) {
      const look = kf(t, [[19.35, 0], [19.7, 10], [20.0, 16], [20.3, 13]]);
      s.head = look;
      s.lookX = 5;
      s.armL = [0.2, 0.15];
      s.armR = [0.35, 0.15];
      s.mouth = "flat";
      s.eyeOpen = 1.1;
      s.glasses = 22;
      s.x = 880 - (t > 20.0 ? 4 : 0);
    } else if (t < 21.1) {
      /* are you serious? */
      s.head = kf(t, [[20.35, 6], [20.6, -6], [21.05, -4]]);
      s.armL = [tw(t, 20.35, 20.65, 0.2, -1.15), tw(t, 20.35, 20.7, 0.1, -0.45)];
      s.armR = [tw(t, 20.35, 20.65, 0.35, 1.15), tw(t, 20.35, 20.7, 0.1, -0.45)];
      s.mouth = "grit";
      s.eyeOpen = 1.8;
      s.lookX = 3;
      s.rot = -3;
      s.tail = -0.1 + Math.sin(t * 9) * 0.12;
    } else if (t < 21.65) {
      /* slump */
      s.head = tw(t, 21.1, 21.45, -4, 15);
      s.armL = [tw(t, 21.1, 21.5, -1.15, 0.1), tw(t, 21.1, 21.5, -0.45, 0.1)];
      s.armR = [tw(t, 21.1, 21.5, 1.15, 0.1), tw(t, 21.1, 21.5, -0.45, 0.1)];
      s.mouth = "flat";
      s.eyeOpen = 0.5;
      s.rot = tw(t, 21.1, 21.5, -3, 4);
      s.squash = tw(t, 21.1, 21.5, 0, 0.05);
    } else if (t < 22.2) {
      /* anticipation crouch */
      s.squash = tw(t, 21.65, 22.0, 0.05, 0.2, eOut);
      s.y = 810 + tw(t, 21.65, 22.05, 0, 12, eOut);
      s.head = tw(t, 21.65, 22.0, 15, 4);
      s.armL = [tw(t, 21.65, 22.0, 0.1, -0.35), 0.1];
      s.armR = [tw(t, 21.65, 22.0, 0.1, 0.35), 0.1];
      s.mouth = "grit";
      s.eyeOpen = 2;
      s.rot = 0;
    } else if (t < 23.05) {
      /* leap */
      const p = seg(t, 22.2, 23.02);
      s.x = lerp(880, 1500, eInOut(p));
      s.y = lerp(810, 764, p) - Math.sin(p * Math.PI) * 235;
      s.s = 1 - Math.sin(p * Math.PI) * 0.05;
      s.rot = lerp(0, -34, p);
      s.squash = -0.1;
      s.armL = [-2.5, -0.3];
      s.armR = [-2.7, 0.4];
      s.legL = [-0.55, 1.0];
      s.legR = [-0.35, 1.15];
      s.mouth = "open";
      s.mouthOpen = 1;
      s.eyeOpen = 2;
      s.glasses = 20;
      s.tail = 0.5;
      if (p > 0.82) {
        const q = seg(p, 0.82, 1);
        s.y = lerp(s.y, 790, q);
        s.s = lerp(1, 0.62, q);
      }
    } else if (t < 24.55) {
      /* inside */
      s.x = 1500; s.y = 790; s.s = 0.6; s.rot = -34;
      s.legL = [-0.55, 1.0];
      s.legR = [-0.35, 1.15];
      s.mouth = "open";
    } else {
      /* emerge in formal outfit */
      const p = seg(t, 24.55, 25.0);
      s.x = 1500;
      s.y = lerp(884, 810, eOut(p));
      s.s = 1;
      s.rot = 0;
      s.outfit = "formal";
      s.glasses = -900;
      s.hold = "none";
      s.head = 0;
      s.eyeOpen = 1;
      s.mouth = "smile";
      s.armL = [0.35, 0.25];
      s.armR = [0.35, 0.25];
      s.legL = [0.1, -0.05];
      s.legR = [-0.1, 0.05];
      s.squash = tw(t, 24.55, 25.0, 0.12, 0);
    }
    return s;
  }

  /* --- scenes 6 & 7 --- */
  if (t < 32) {
    s.outfit = "formal";
    s.glasses = -900;
    s.hold = "none";
    s.y = 810;
    s.rot = 0;
    s.mouth = "smile";
    s.eyeOpen = 1;
    s.legL = [0.1, -0.05];
    s.legR = [-0.1, 0.05];
    s.x = 1500;
    if (t < 25.85) {
      s.x = lerp(1500, 1360, eInOut(seg(t, 25.15, 25.85)));
      s.armL = [tw(t, 25.15, 25.7, 0.35, -0.5), 0.4];
      s.armR = [0.35, 0.25];
      s.head = tw(t, 25.3, 25.8, 0, -4);
      s.legL = [0.35, -0.1];
      s.legR = [-0.3, 0.12];
    } else if (t < 26.5) {
      s.x = 1360;
      s.head = -4;
      s.armL = [tw(t, 25.85, 26.15, -0.5, -0.75), tw(t, 25.85, 26.2, 0.4, 1.9)];
      s.armR = [tw(t, 25.9, 26.2, 0.35, -0.75), tw(t, 25.9, 26.25, 0.25, 1.9)];
      s.mouth = "flat";
      s.eyeOpen = 0.6;
    } else if (t < 27.4) {
      s.x = 1360;
      s.head = tw(t, 26.5, 26.9, -4, 8);
      s.armL = [tw(t, 26.5, 26.9, -0.75, 0.22), tw(t, 26.5, 26.9, 1.9, 0.25)];
      s.armR = [tw(t, 26.5, 26.9, -0.75, 0.22), tw(t, 26.5, 26.9, 1.9, 0.25)];
      s.mouth = "smile";
      s.eyeOpen = 1;
      s.lookX = 4;
    } else if (t < 28.35) {
      s.head = 8;
      s.lookX = 5;
      s.armL = [0.22, 0.25];
      s.armR = [0.22, 0.25];
      s.mouth = "smile";
      s.eyeOpen = 1;
    } else if (t < 32) {
      /* presenter mode, then the nod exchange */
      s.x = 1360;
      s.head = tw(t, 28.35, 28.9, 8, -2);
      s.armL = [tw(t, 28.35, 28.9, 0.22, -0.55), 0.5];
      s.armR = [tw(t, 28.35, 28.9, 0.22, 0.5), 0.35];
      s.mouth = "grin";
      s.lookX = 0;
      if (t > 30.4 && t < 31.1) {
        s.head = kf(t, [[30.4, -2], [30.7, 6], [31.1, -2]]);
        s.eyeOpen = 0.15;
      }
      s.tail = -0.15 + Math.sin(t * 1.2) * 0.08;
    }
    return s;
  }

  /* --- finale --- */
  s.outfit = "formal";
  s.glasses = -900;
  s.hold = "none";
  s.x = 1540;
  s.y = 840;
  s.rot = 0;
  s.head = -6;
  s.lookX = -3;
  s.mouth = "grin";
  s.eyeOpen = 1;
  s.legL = [0.12, -0.05];
  s.legR = [-0.12, 0.05];
  s.tail = -0.28;
  s.armR = [0.35, 0.35];
  s.armL = [tw(t, 32.7, 33.35, 0.3, -1.75), tw(t, 32.7, 33.4, 0.3, 0.35)];
  s.head = kf(t, [[32, -6], [33.4, -9], [36.5, -4], [38, -7]]);
  s.y = 840 + Math.sin(t * 1.4) * 0.6;
  if (t > 40.2 && t < 40.5) s.eyeOpen = 0.1;
  if (t > 43.1 && t < 43.35) s.eyeOpen = 0.1;
  s.headShift = kf(t, [[39.2, 0], [39.7, 2], [40.4, 0]]);
  return s;
}

/* --------------------------------------------------------- commander state */

function commanderState(t) {
  const s = {
    x: 2050, y: 690, s: 0.9, flip: true, head: 6, brow: 1, mouth: "flat",
    armL: [0.3, 0.08], armR: [-0.3, 0.08], legL: [0.17, -0.02], legR: [-0.17, 0.02],
    hold: "none", blink: 0, watch: 0, lean: 0,
  };
  if (t < 10.1) { s.x = 2400; return s; }

  if (t < 11.5) {
    /* three deliberate steps, landing exactly on the cue times */
    const p = seg(t, 10.1, 11.5);
    s.x = lerp(2060, 1300, eOut(p));
    const cyc = p * 3.0;
    const sw = Math.sin(cyc * Math.PI) * 0.34;
    s.legL = [0.17 + sw, -0.02];
    s.legR = [-0.17 - sw, 0.02];
    s.armL = [0.3 - sw * 0.7, 0.1];
    s.armR = [-0.3 + sw * 0.7, 0.1];
    s.bob = -Math.abs(Math.sin(cyc * Math.PI)) * 10;
    s.head = 7;
    return s;
  }

  s.x = 1300;
  s.head = 9;
  s.armL = [0.32, 0.1];
  s.armR = [-0.32, 0.1];

  if (t > 12.7 && t < 12.86) s.blink = 1;

  if (t < 19.15) {
    /* speaks, then reveals the pink mission folder */
    if (t > 14.8) {
      const talking =
        (t > 14.86 && t < 15.33) || (t > 15.45 && t < 16.4);
      s.mouth = talking ? "talk" : "flat";
      s.brow = 1;
    }
    if (t > 16.0) {
      s.armR = [tw(t, 16.0, 16.4, -0.32, 1.12), tw(t, 16.0, 16.4, 0.1, 0.62)];
      s.hold = "folder";
      s.head = 12;
    }
    if (t > 18.3) {
      s.head = 14;
      s.brow = 0.4;
    }
    return s;
  }

  if (t < 19.9) {
    /* two crisp steps to the left to clear the drawer */
    const p = seg(t, 19.15, 19.85);
    s.x = lerp(1300, 1180, eOut(p));
    const sw = Math.sin(p * 2 * Math.PI) * 0.3;
    s.legL = [0.17 + sw, -0.02];
    s.legR = [-0.17 - sw, 0.02];
    s.hold = "folder";
    s.head = 12;
    return s;
  }

  s.x = 1180;
  s.hold = "folder";
  s.head = 12;

  if (t > 19.95 && t < 20.75) {
    /* firm gesture toward the pink drawer */
    s.armR = [tw(t, 19.95, 20.3, 0.1, 1.35), tw(t, 19.95, 20.3, 0.6, 0.1)];
    s.head = 15;
  } else if (t < 21.9) {
    s.armR = [1.35, 0.1];
    s.head = 15;
  } else {
    s.armR = [tw(t, 21.9, 22.3, 1.35, 0.1), 0.1];
    s.head = 14;
  }
  if (t > 21.3 && t < 21.46) s.blink = 1;

  if (t < 27.0) return s;

  /* final check */
  s.head = 8;
  s.armL = [tw(t, 29.2, 29.6, 0.32, -0.75), tw(t, 29.2, 29.65, 0.1, 1.95)];
  s.hold = t > 29.55 ? "watch" : "folder";
  s.watch = t;
  if (t > 29.55) s.mouth = "flat";
  if (t > 30.05) {
    s.head = tw(t, 30.05, 30.4, 8, 3);
    s.armL = [tw(t, 30.05, 30.5, -0.75, 0.32), tw(t, 30.05, 30.5, 1.95, 0.1)];
    s.hold = "none";
  }
  if (t > 30.55 && t < 31.15) s.head = kf(t, [[30.55, 3], [30.8, 11], [31.15, 3]]);
  if (t > 31.9) s.head = tw(t, 31.9, 32.4, 3, 0);
  return s;
}

/* --------------------------------------------------------------- props */

function drawerState(t) {
  const d = { x: 1500, y: 3000, s: 1, open: 0, glow: 0, shake: 0 };
  if (t < 18.35) return d;

  d.y = lerp(1500, 900, eOut(seg(t, 18.35, 18.9)));
  if (t > 18.9) {
    const b = seg(t, 18.9, 19.18);
    d.y = 900 + Math.sin(b * Math.PI) * 12;
    d.shake = 1 - b;
  }
  d.glow = t > 18.9 ? 0.55 : 0.15;
  d.open = t > 19.0 ? tw(t, 19.0, 19.45, 0, 1) : 0;

  if (t > 23.02) d.open = tw(t, 23.02, 23.3, 1, 0);
  if (t > 23.3 && t < 23.95) {
    d.glow = 1;
    d.shake = Math.max(0, 1 - seg(t, 23.5, 23.95));
  }
  if (t > 24.05) {
    d.open = tw(t, 24.05, 24.45, 0, 1);
    d.glow = t < 25.6 ? 1 : 0.7;
  }

  /* mission complete: the station withdraws, clearing the frame */
  if (t > 26.15) {
    d.y = lerp(900, 2950, eIn(seg(t, 26.15, 26.95)));
    d.open = tw(t, 26.15, 26.5, 1, 0);
    d.glow = 0.4;
  }
  return d;
}

/* ------------------------------------------------------------------ type */

function typeLayer(t) {
  let html = "";

  /* the one line of dialogue, as a designed caption */
  if (t > 14.75 && t < 17.0) {
    const k = Math.min(seg(t, 14.75, 15.05), 1 - seg(t, 16.7, 17.0));
    html += `
      <div style="position:absolute;left:118px;bottom:104px;opacity:${k};transform:translateY(${(1 - k) * 10}px);display:flex;align-items:center;gap:16px">
        <span style="width:6px;height:44px;background:#DF1428"></span>
        <span style="background:rgba(250,249,246,0.94);padding:12px 20px 13px;font-family:'Segoe UI Semibold',Arial,sans-serif;font-weight:600;font-size:23px;letter-spacing:0.16em;color:#181A1D;text-transform:uppercase">Kittler. We have a mission.</span>
      </div>`;
  }

  if (t < 32.6) return html;

  const T = cues.title;
  const line = (i, inner, extra = "") => {
    const k = eOut(seg(t, T[i], T[i] + 0.5));
    return `<div style="position:absolute;left:0;top:0;width:1920px;height:1080px;opacity:${k};transform:translateY(${(1 - k) * 26}px);${extra}">${inner}</div>`;
  };

  const mark = (k) => `<div style="position:absolute;left:150px;top:96px;display:flex;align-items:flex-start;opacity:0;transform:translateY(${(1-k)*30}px) scale(${0.96+k*0.04});opacity:${k}">
      <span class="txt" style="font-size:198px;line-height:0.8;letter-spacing:0.005em;color:#181A1D">DENK</span>
      <span style="width:40px;height:40px;background:#DF1428;margin:18px 0 0 16px;display:block"></span>
    </div>`;

  const k0 = eOut(seg(t, T[0], T[0] + 0.55));
  html += mark(k0);
  html += line(0, `<span class="lbl" style="left:154px;top:284px;font-size:46px;letter-spacing:0.5em;color:#181A1D">DEUTSCH</span>`);
  html += `<div style="position:absolute;left:150px;top:356px;width:${320 * k0}px;height:8px;background:#F5AA18"></div>`;

  html += line(1, `<span class="lbl" style="left:150px;top:392px;font-size:29px;letter-spacing:0.42em;color:#DF1428">■ INTRODUCE</span>`);
  html += line(2, `<span class="txt" style="left:146px;top:436px;font-size:178px;line-height:0.8;color:#181A1D">G11</span>`);
  html += line(3, `<span class="txt" style="left:150px;top:620px;font-size:92px;line-height:0.85;color:#181A1D;letter-spacing:0.005em">MID REVISION</span>`);
  html += line(4, `<span class="lbl" style="left:152px;top:748px;font-size:40px;font-weight:600;letter-spacing:0.1em;color:#181A1D">MONDAY 11/2/2026</span>`);
  html += line(5, `<span class="txt" style="left:148px;top:792px;font-size:78px;line-height:0.9;color:#F5AA18">9:30 PM</span>`);
  html += line(
    6,
    `<div style="position:absolute;left:150px;top:900px;background:#DF1428;padding:14px 30px 16px;display:inline-flex;align-items:center">
       <span class="lbl" style="position:static;font-size:31px;font-weight:600;letter-spacing:0.22em;color:#FAF9F6">WE ARE WAITING YOU</span>
     </div>`,
  );

  return html;
}

/* ---------------------------------------------------------------- render */

function render(t) {
  const st = kittlerState(t);
  const cs = commanderState(t);
  const dr = drawerState(t);

  let art = "";
  let shake = 0;

  if (t < 32) {
    art += beach(t);
    art += `<ellipse cx="905" cy="812" rx="250" ry="40" fill="#9C6A3C" opacity="0.18"/>`;

    const showCom = t >= 10.1;
    const drawerBehind = t >= 22.7 && t <= 24.52;

    const kitSvg = kittler(st);
    const comSvg = showCom ? commander({ ...cs, y: cs.y + (cs.bob || 0) }) : "";

    /* contact shadows keep both characters planted on the sand */
    const kFeet = Math.min(922, st.y + 112 * st.s);
    const lift = clamp((922 - kFeet) / 220);
    const kR = (82 - 30 * lift) * st.s;
    art += `<ellipse cx="${st.x + 6}" cy="${kFeet}" rx="${kR}" ry="${kR * 0.19}" fill="#7A4A28" opacity="${0.26 - 0.12 * lift}"/>`;
    if (showCom) {
      const cFeet = cs.y + (cs.bob || 0) + 180 * cs.s;
      const cR = 64 * cs.s;
      art += `<ellipse cx="${cs.x - 4}" cy="${cFeet}" rx="${cR}" ry="${cR * 0.2}" fill="#7A4A28" opacity="0.22"/>`;
    }

    if (t < 18.3) {
      art += comSvg + kitSvg;
    } else if (drawerBehind) {
      art += comSvg + kitSvg + drawer(dr);
    } else {
      const kitBehindCom = t > 22.15 && t < 22.72;
      art += kitBehindCom ? kitSvg + comSvg + drawer(dr) : comSvg + drawer(dr) + kitSvg;
    }

    /* the pink light the drawer throws on the sand and characters */
    if (t > 18.9 && t < 26) {
      const g = Math.min(1, (t - 18.9) * 1.4) * (1 - seg(t, 25.2, 26));
      art += `<ellipse cx="${dr.x}" cy="902" rx="${300 * g}" ry="${90 * g}" fill="#FF4E90" opacity="${0.32 * g}" filter="blur(24px)"/>`;
    }

    /* puff of stylised smoke when it opens */
    if (t > 24.05 && t < 25.6) {
      const p = seg(t, 24.05, 25.5);
      const puffs = [
        [1470, 700, 40], [1530, 676, 54], [1585, 700, 46], [1440, 730, 34], [1610, 726, 30],
      ];
      puffs.forEach(([px, py, pr], i) => {
        const q = clamp(p * 1.5 - i * 0.16);
        art += `<circle cx="${px + Math.sin(i + t) * 12}" cy="${py - q * 40}" r="${pr * (0.4 + q * 1.4)}" fill="#FFDDEC" opacity="${0.85 * (1 - q) * (q > 0 ? 1 : 0)}"/>`;
      });
    }

    shake = dr.shake * 12;
    if (t > 23.3 && t < 23.42) shake = 18;
  } else {
    art += brandSet(t, 1);
    art += `<ellipse cx="1540" cy="912" rx="150" ry="20" fill="#000000" opacity="0.30"/>`;
    art += kittler({ ...st, x: 1540, y: 780, s: st.s * 1.18 });
  }

  /* pink flash */
  if (t > 23.08 && t < 23.95) {
    const f = Math.sin(seg(t, 23.08, 23.95) * Math.PI);
    art += `<rect x="-40" y="-40" width="${W + 80}" height="${H + 80}" fill="url(#flashGrad)" opacity="${0.92 * f}"/>`;
    art += `<rect x="-40" y="-40" width="${W + 80}" height="${H + 80}" fill="#FFFFFF" opacity="${0.55 * Math.pow(f, 3)}"/>`;
  }

  const view = camera(t);
  document.getElementById("art").setAttribute("viewBox", view.map((v) => Math.round(v * 100) / 100).join(" "));
  document.getElementById("scene").setAttribute(
    "transform",
    shake ? `translate(${(Math.sin(t * 61) * shake).toFixed(1)} ${(Math.cos(t * 47) * shake * 0.6).toFixed(1)})` : "",
  );
  document.getElementById("scene").innerHTML = art;
  document.getElementById("type").innerHTML = typeLayer(t);
  document.getElementById("makeup").innerHTML = wipe(t);
}

function wipe(t) {
  if (t < 31.75 || t > 32.75) return "";
  const p = seg(t, 31.75, 32.65);
  const y = p < 0.5 ? lerp(1080, 0, eOut(p * 2)) : lerp(0, -1080, eIn((p - 0.5) * 2));
  return `
    <div style="position:absolute;left:0;top:0;width:1920px;height:1080px;transform:translateY(${y}px)">
      <div style="position:absolute;left:0;top:0;width:1920px;height:1080px;background:#FF3F86"></div>
      <div style="position:absolute;left:0;top:0;width:1920px;height:22px;background:#F5AA18"></div>
      <div style="position:absolute;left:0;bottom:0;width:1920px;height:8px;background:#181A1D"></div>
    </div>`;
}

/* -------------------------------------------------------------- playback */

async function boot() {
  cues = await (await fetch("./cues.json")).json();

  const small = 0.55;
  const stage = document.getElementById("stage");
  let fit = () => {
    const s = Math.min(window.innerWidth / W, (window.innerHeight - 40) / H, 1);
    stage.style.transform = `scale(${s})`;
    document.getElementById("app").style.width = `${W * s}px`;
    document.getElementById("app").style.height = `${H * s}px`;
  };
  fit();
  window.addEventListener("resize", fit);

  let t = 0;
  render(0);

  window.seek = (time) => {
    t = clamp(time, 0, cues.duration);
    render(t);
    const c = document.getElementById("clock");
    if (c) c.textContent = `00:${String(Math.floor(t)).padStart(2, "0")}:${String(Math.floor((t % 1) * 24)).padStart(2, "0")}`;
    const b = document.getElementById("bar");
    if (b) b.style.width = `${(t / cues.duration) * 100}%`;
  };
  window.DURATION = cues.duration;
  window.CUES = cues;

  let raf = 0;
  let playing = false;
  let origin = 0;
  const loop = (now) => {
    const tt = (now - origin) / 1000;
    window.seek(tt);
    if (tt >= cues.duration) {
      playing = false;
      raf = 0;
      return;
    }
    raf = requestAnimationFrame(loop);
  };
  document.getElementById("play").addEventListener("click", () => {
    if (playing) {
      playing = false;
      cancelAnimationFrame(raf);
      return;
    }
    origin = performance.now() - t * 1000;
    playing = true;
    raf = requestAnimationFrame(loop);
  });

  if (new URLSearchParams(location.search).has("capture")) {
    document.getElementById("hud").style.display = "none";
    document.getElementById("app").style.width = W + "px";
    document.getElementById("app").style.height = H + "px";
    stage.style.transform = "scale(1)";
    fit = () => {};
  }

  window.__ready = true;
}

boot();
