import { kittler, drawer } from "./rig.js";
import { commander } from "./commander.js";

let out = "";

const label = (x, y, s) =>
  `<text x="${x}" y="${y}" font-family="Segoe UI" font-size="15" letter-spacing="2" fill="#7c7568">${s}</text>`;

const ground = (cx, cy, rx) =>
  `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${rx * 0.16}" fill="#8a7a63" opacity="0.22"/>`;

/* Kittler: hip y, feet at y+100 */
out += ground(210, 590, 110);
out += kittler({ x: 210, y: 480, rot: 0, mouth: "smile", armL: [0.18, 0.12], armR: [0.34, -0.75], legL: [0.1, -0.04], legR: [-0.1, 0.06] });
out += label(150, 640, "STAND");

out += ground(520, 590, 110);
out += kittler({ x: 520, y: 480, rot: -3, head: 5, eyeOpen: 1.8, mouth: "open", mouthOpen: 1, glasses: 20, armL: [-1.1, -0.2], armR: [1.0, 0.25], legL: [0.22, -0.1], legR: [-0.16, 0.12], squash: -0.05 });
out += label(450, 640, "SHOCK");

out += ground(830, 590, 110);
out += kittler({ x: 830, y: 480, rot: 0, outfit: "formal", glasses: -600, mouth: "smile", armL: [0.2, 0.25], armR: [-1.2, 0.5], legL: [0.1, -0.04], legR: [-0.1, 0.06] });
out += label(760, 640, "FORMAL");

out += kittler({ x: 1160, y: 480, rot: -22, head: -4, mouth: "smile", glasses: 0, hold: "drink", armL: [-2.4, -0.5], armR: [0.55, 1.5], legL: [1.35, -0.3], legR: [1.25, -0.24], tail: -0.15 });
out += label(1080, 640, "RECLINE");

out += ground(1500, 600, 100);
out += commander({ x: 1500, y: 440, s: 0.9, hold: "folder", armR: [-1.15, 0.55], head: 6, brow: 1 });
out += label(1420, 640, "COMMANDER");

out += drawer({ x: 700, y: 980, s: 0.75, open: 0.55, glow: 0.9 });
out += label(620, 1000, "DRAWER");

document.getElementById("scene").innerHTML = out;
