# QC report — DENK Deutsch · G11 Mid Revision

Film: `out/denk-deutsch-g11-mid-revision.mp4`
44.50 s · 1920×1080 · 24.000 fps · H.264 High (CRF 16, yuv420p) · AAC 48 kHz stereo 192 kb/s · 8.4 MB

## Checks actually performed

**Picture**
- Rendered all 1,068 frames from a deterministic timeline (every frame a pure
  function of `t`), encoded once, then pulled 15 frames back out of the encoded
  MP4 (`out/qc-contact-sheet.jpg`) and inspected them: 2.0, 6.5, 9.4, 11.9,
  15.4, 19.6, 21.0, 22.8, 24.9, 26.6, 29.0, 31.2, 34.0, 37.2, 44.0 s.
- During production I inspected individual 1920×1080 stills before and after
  each correction. Defects found this way and fixed, in this order:
  1. **The pink drawer was invisible from 18.35 s to 22.7 s** — Kittler jumped
     into a drawer that had not been drawn yet. Draw order corrected; the
     drawer is now on screen from the moment it descends.
  2. **Kittler still held his cocktail in the formal outfit**, including the
     final card. Cleared at the reveal.
  3. **Kittler's leap passed through the commander's head → read as one body
     inside another.** He now flies behind the commander and is drawn in front
     of the drawer, so the occlusion direction is unambiguous.
  4. **Kittler was hidden behind the drawer for 1 s while "stepping out".**
     Front/behind switch moved to the moment he leaves the portal.
  5. **Neither character had a contact shadow** — they floated over the sand.
     Height-aware shadows added for both, plus a fixed shadow in the badge.
  6. **Commander's hands were white blobs** on dark sleeves. Now dark gloves.
  7. **Legs merged into a skirt silhouette.** Hip spacing widened; two legs read.
  8. **The establishing wide was too empty** (Kittler ~5 % of frame height) and
     **two camera setups clipped characters** (commander cut at frame left
     during 25–29 s). Both camera setups recomposed.
  9. **The drawer crowded Kittler through the reveal.** It now withdraws at
     26.15 s, leaving a clean two-shot.
  10. **Kittler was undersized in the final badge.** Scaled to fill the roundel.

**Sound**
- Score, ambience, footsteps, drawer mechanics, whoosh, flash shimmer, sting,
  promotional theme and the seven title accents are all synthesised in
  `_build/audio.mjs` — no library, no licensed or game music.
- Commander's line ("Kittler. We have a mission.") is Windows SAPI *Microsoft
  David*, rate −2, trimmed and placed at 14.86 s and 15.45 s.
- Verified in the encoded file: **peak −1.1 dBFS, mean −25.6 dB, 0 clipped
  samples** in the 32-bit float mix before quantisation.
- Section balance measured: beach cue −27.3 dB RMS · footsteps −23.4 dB ·
  hush −43.2 dB · **dialogue −21.1 dB RMS / −1.7 dB peak** · drawer −24.2 dB ·
  flash −19.9 dB · theme −25.6 dB · finale −25.6 dB. Dialogue sits in a near-
  silent band, so it is intelligible without ducking music.
- **Bug found and fixed:** the tape-stop that kills the beach cue at 10.0 s was
  applied to the whole mix, silencing everything after 11 s. The cue now runs
  on its own bus; only the music winds down.

**Text**
- Strings are literals in `film/film.js` → `typeLayer()`, never generated:
  `DENK` · `DEUTSCH` · `INTRODUCE` · `G11` · `MID REVISION` ·
  `MONDAY 11/2/2026` · `9:30 PM` · `WE ARE WAITING YOU`.
- Verified at 1920×1080 in `out/final-card.png`, character by character:
  the seven required elements are present, no misspelling, no invented venue,
  school, link or extra event detail, no watermark or stray generated text.
- Last line lands at 37.70 s and the complete card holds to 44.50 s =
  **6.8 s**, above the 4 s minimum. Type never crosses Kittler's face or the
  roundel; the date/time are 40 px and 78 px tall, both legible on a phone.

## Scores

| | Category | Score | Note |
| --- | --- | --- | --- |
| A | Kittler identity | 4 | One rig throughout: same face, ears, black head patch, black nose, whiskers, markings. Flat-illustration reference adapted to vector, so fur texture is simplified by design. |
| B | Anatomy & movement | 4 | No extra or missing limbs, no morphing, no floating sunglasses. Hands are simplified mitten circles. |
| C | Commander consistency | 4 | Single rig, no drift between shots. Deliberately stiff performance; his range is smaller than Kittler's. |
| D | Beach & lighting | 4 | One sun direction throughout, no exposure jumps, contact shadows ground the actors. Vector shading, not 3D materials. |
| E | Comedic timing | 4 | Anticipation → action → reaction → pause on a fixed beat grid; the 6–10 s relaxation beat is intentionally slow. |
| F | Transformation clarity | 4 | Drawer present for the whole gag, one entry, one flash, one exit, no partial or duplicate Kittler. |
| G | Formal outfit continuity | 4 | Identical from reveal to last frame; props cleared. |
| H | Typography accuracy | 5 | Exact literals, seven elements, 6.8 s hold. |
| I | Audio clarity & sync | 4 | Intelligible dialogue over a silent band, SFX on frame times. Voice is synthetic TTS, not a performed read. |
| J | Editing & pacing | 4 | 44.5 s within the 35–45 s target; hard cuts, one designed wipe. |
| K | Brand identity | 4 | Exact palette (#181A1D / #DF1428 / #F5AA18 / #FAF9F6). No official logo file was supplied, so the mark is a typographic wordmark, not a traced logo. |
| L | Professional polish | 4 | Coherent, designed, no AI-video artefacts — but cel-vector craft, not a 3D render. |

No critical category below 4. The fours are honest: they mark style and
performance limits, not broken shots.

## Limitations — what this is not

1. **Not 3D.** No 3D package, render farm or text-to-video model was available.
   The "stylised 3D animated-film look" is approximated in flat vector art.
   This is the single largest gap against the brief.
2. **No lip-sync solver.** The commander's mouth opens on two timed windows
   matched to the TTS duration; it is not phoneme-accurate. The shot is framed
   so his mouth is small.
3. **No motion blur, no depth of field, no camera shake** — the brief asked to
   avoid most of these anyway, and the renderer is frame-exact rather than
   sampled.
4. **Not watched at real time on a player.** I inspected 15 encoded frames plus
   the targeted stills listed above. I cannot press play and watch 44.5 s of
   motion, so smoothness of every in-between is verified by construction (fixed
   24 fps sampling of continuous functions), not by eye.
5. **TTS voice**, not a licensed actor: correct, serious, slightly synthetic.
   Original music and SFX only; nothing sampled from Vice City or Neighbours
   from Hell.
6. **The wordmark is set in type** (Arial Black + Segoe UI Semibold). No DENK
   Deutsch logo artwork was provided; if one exists, the card should be
   recomposed around it.
7. **Kittler's "official" outfit** follows the supplied green-floral-and-denim
   reference; the formal jacket is an original design built from the brand
   palette, since no formal reference was supplied.
