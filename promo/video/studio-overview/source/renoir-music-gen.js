// Renoir promo score v2: restrained, minimal-house groove at 120 BPM. Direct DSP (no Web Audio), deterministic.
function renderRenoirMusic2() {
  const sr = 44100, DUR = 26, N = sr * DUR, TAU = Math.PI * 2;
  const mk = () => new Float32Array(N);
  const DL = mk(), DR = mk(), ML = mk(), MR = mk(), VS = mk(), ES = mk();
  let seed = 99; const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296) * 2 - 1;
  const mf = (m) => 440 * Math.pow(2, (m - 69) / 12);
  const voice = (bus, t0, dur, fn, g, pan, vs, es) => {
    pan = pan || 0; vs = vs || 0; es = es || 0;
    const i0 = Math.max(0, Math.floor(t0 * sr)), n = Math.floor(dur * sr), A = bus ? ML : DL, B = bus ? MR : DR;
    const pl = Math.cos((pan + 1) * Math.PI / 4), pr = Math.sin((pan + 1) * Math.PI / 4);
    for (let k = 0; k < n; k++) {
      const i = i0 + k; if (i >= N) break;
      const x = fn(k / sr, k) * g;
      A[i] += x * pl; B[i] += x * pr;
      if (vs) VS[i] += x * vs; if (es) ES[i] += x * es;
    }
  };
  const E = Math.exp;
  const kick = (t0, g) => { let ph = 0; voice(0, t0, 0.42, (t) => { ph += TAU * (46 + 110 * E(-t / 0.035)) / sr; return Math.sin(ph) * E(-t / 0.13) * Math.min(1, t / 0.002) + (t < 0.006 ? rnd() * 0.25 * (1 - t / 0.006) : 0); }, g, 0, 0.015); };
  const sub = (t0, m, dur, g) => { const f = mf(m); let ph = 0; voice(1, t0, dur + 0.12, (t) => { ph += TAU * f / sr; const e = Math.min(1, t / 0.008) * (t < dur ? 1 : Math.max(0, 1 - (t - dur) / 0.12)) * E(-t / (dur * 1.6)); return (Math.sin(ph) + 0.5 * Math.sin(2 * ph) + 0.18 * Math.sin(3 * ph)) * e; }, g, 0); };
  const hat = (t0, g, open) => { let lp = 0; voice(0, t0, open ? 0.16 : 0.045, (t) => { const x = rnd(); lp += (x - lp) * 0.6; return (x - lp) * E(-t / (open ? 0.045 : 0.011)); }, g, rnd() * 0.5, 0.04); };
  const clap = (t0, g) => { for (let k = 0; k < 3; k++) { let la = 0, lb = 0; voice(0, t0 + k * 0.011, 0.2, (t) => { const x = rnd(); la += (x - la) * 0.5; lb += (x - lb) * 0.07; return (la - lb) * 3 * E(-t / (k === 2 ? 0.075 : 0.01)); }, g * (k === 2 ? 1 : 0.6), 0, 0.22); } };
  const rim = (t0, g) => voice(0, t0, 0.06, (t) => (Math.sin(TAU * 1250 * t) + 0.5 * Math.sin(TAU * 1870 * t)) * E(-t / 0.009), g, 0.3, 0.1);
  const ep = (t0, m, dur, g, pan, vs, es) => { const f = mf(m); voice(0, t0, dur, (t) => { const idx = 1.5 * E(-t / 0.16) + 0.25; const y = Math.sin(TAU * f * t + Math.sin(TAU * f * t) * idx) * E(-t / (dur * 0.33)) * Math.min(1, t / 0.003) + 0.06 * Math.sin(TAU * f * 4 * t) * E(-t / 0.04); return y * Math.min(1, (dur - t) / 0.05); }, g, pan, vs, es); };
  const pluck = (t0, m, g, pan, vs, es, dur) => { dur = dur || 0.7; const f = mf(m), L = Math.max(2, Math.round(sr / f)), buf = new Float32Array(L); for (let i = 0; i < L; i++) buf[i] = rnd(); for (let r = 0; r < 2; r++) for (let i = 0; i < L; i++) buf[i] = (buf[i] + buf[(i + 1) % L]) * 0.5; let p = 0; voice(0, t0, dur, (t) => { const a = buf[p]; buf[p] = (a + buf[(p + 1) % L]) * 0.5 * 0.997; p = (p + 1) % L; return a * 2.2 * Math.min(1, (dur - t) / 0.05); }, g, pan, vs, es); };
  const bell = (t0, m, dur, g, vs) => { const f = mf(m); voice(0, t0, dur, (t) => (Math.sin(TAU * f * t) * E(-t / (dur * 0.3)) + 0.35 * Math.sin(TAU * f * 2.76 * t) * E(-t / 0.12) + 0.15 * Math.sin(TAU * f * 5.4 * t) * E(-t / 0.05)) * Math.min(1, (dur - t) / 0.05), g, 0, vs, 0.3); };
  const pad = (t0, dur, notes, g) => notes.forEach((m, j) => { const f = mf(m); voice(1, t0, dur + 0.5, (t) => { const e = Math.min(1, t / 0.35) * (t < dur ? 1 : Math.max(0, 1 - (t - dur) / 0.5)); return (Math.sin(TAU * f * t) + 0.3 * Math.sin(TAU * f * 2.004 * t) + 0.12 * Math.sin(TAU * f * 3 * t)) * e; }, g / notes.length, j % 2 ? 0.45 : -0.45, 0.3); });
  const riser = (t0, dur, g) => { let lp = 0, ph = 0; voice(0, t0, dur, (t) => { const p = t / dur, x = rnd(); lp += (x - lp) * (0.04 + 0.9 * p * p); ph += TAU * (300 * Math.pow(7, p)) / sr; return ((x - lp) * 1.4 + 0.2 * Math.sin(ph)) * p * p; }, g, 0, 0.3); };
  const boom = (t0, g, len) => { let ph = 0, lp = 0; voice(0, t0, len, (t) => { ph += TAU * (36 + 70 * E(-t / 0.12)) / sr; const x = rnd(); lp += (x - lp) * 0.5; return Math.sin(ph) * E(-t / (len * 0.3)) + (x - lp) * 0.28 * E(-t / (len * 0.22)); }, g, 0, 0.35); };

  const CH = {
    Am9: { b: 45, pad: [45, 57, 60, 64, 71], st: [57, 60, 64, 67], arp: [64, 67, 69, 71, 72, 76] },
    Fmaj7: { b: 41, pad: [41, 53, 57, 60, 64], st: [53, 57, 60, 64], arp: [60, 64, 65, 69, 72, 76] },
    Cmaj7: { b: 48, pad: [48, 55, 59, 64], st: [55, 59, 60, 64], arp: [64, 67, 71, 72, 76, 79] },
    G6: { b: 43, pad: [43, 55, 59, 62, 64], st: [55, 59, 62, 64], arp: [62, 67, 71, 74, 76, 79] },
    Dm9: { b: 50, pad: [50, 53, 57, 60, 64], st: [53, 57, 60, 64], arp: [62, 65, 69, 72, 74, 76] },
    Em7: { b: 40, pad: [40, 55, 59, 62, 67], st: [55, 59, 62, 64], arp: [64, 67, 71, 74, 76, 79] },
    Cmaj9: { b: 48, pad: [48, 55, 59, 62, 64, 67], st: [55, 59, 62, 64], arp: [62, 64, 67, 71, 74, 79] },
  };
  const SEG = [[0, 'Am9'], [1.5, 'Fmaj7'], [3, 'Cmaj7'], [5.5, 'G6'], [8, 'Am9'], [10.5, 'Fmaj7'], [13, 'Cmaj7'], [15.5, 'Dm9'], [18.5, 'Em7'], [22, 'Cmaj9']];
  const END = 25.5, ch = (t) => { let c = SEG[0][1]; for (const s of SEG) if (s[0] <= t + 1e-6) c = s[1]; return CH[c]; };
  // pads per segment
  SEG.forEach((s, i) => { const t1 = i + 1 < SEG.length ? SEG[i + 1][0] : END; pad(s[0] - (i ? 0.25 : 0), t1 - s[0] + (i ? 0.25 : 0), CH[s[1]].pad, i === 9 ? 0.2 : 0.16); });
  // groove (global 0.5s grid)
  const kicks = [];
  for (let n = 0; n * 0.5 < END; n++) {
    const t = n * 0.5, bar = t % 2;
    if (t >= 1.5 && t < 23.5) { kick(t, t < 3 ? 0.75 : 0.95); kicks.push(t); }
    if (t === 0) { kick(0, 0.5); kicks.push(0); }
    if (t >= 1.5 && t < 22) {
      const c = ch(t);
      if (bar === 0) sub(t, c.b, 0.9, 0.36);
      if (bar === 1 && t >= 3) sub(t, c.b, 0.4, 0.3);
      if (bar === 1.5 && t >= 3) sub(t + 0.25, c.b + 12, 0.2, 0.2);
    }
    if (t >= 22 && t < 25 && t === 22) sub(22, 48, 3.1, 0.42);
    if (t >= 1.5 && t < 23.5) hat(t + 0.25, 0.1, bar === 1.5);
    if (t >= 5.5 && t < 23) { hat(t + 0.125, 0.04); hat(t + 0.375, 0.035); }
    if (t >= 15.5 && t < 18.5) hat(t, 0.05);
    if (t >= 3 && t < 23.5 && (bar === 0.5 || bar === 1.5)) clap(t, 0.28);
    if (t >= 8 && t < 22 && bar === 1.25 - 0.25 + 0.25 - 0.25 + 0.25 - 0.25 + 0.25 - 0.25) { /* noop guard */ }
    if (t >= 8 && t < 22 && bar === 1) rim(t + 0.25, 0.06);
  }
  // arpeggio
  const PAT = [0, 2, 4, 2, 1, 3, 5, 3];
  for (let n = 0; n * 0.25 < 23.2; n++) {
    const t = n * 0.25, c = ch(t);
    if (t < 1.5 && n % 2) continue;
    if (t >= 22 && n % 2) continue;
    const idx = PAT[n % 8] % c.arp.length, on = n % 2 === 0;
    pluck(t, c.arp[idx] + (t >= 15.5 && t < 18.5 && n % 4 === 3 ? 12 : 0), on ? 0.1 : 0.065, ((n % 4) - 1.5) * 0.35, 0.18, 0.28);
  }
  // chord stabs (3-3-2) via electric piano
  for (let b = 1; b * 2 < 22; b++) {
    const t0 = b * 2;
    [0, 0.75, 1.5].forEach((o, k) => { const t = t0 + o; if (t < 2 || t >= 22) return; if (t < 3 && k > 1) return; const c = ch(t); c.st.forEach((m, j) => ep(t, m, k === 2 ? 0.28 : 0.5, 0.05, (j - 1.5) * 0.3, 0.2, 0.35)); });
  }
  // cuts: riser + impact
  SEG.forEach((s, i) => { if (!i) return; const t = s[0], big = t === 22; riser(t - (big ? 1 : 0.5), big ? 1 : 0.5, big ? 0.16 : 0.1); boom(t, big ? 0.7 : 0.38, big ? 2.4 : 0.7); });
  // process reveals
  [67, 71, 74, 79].forEach((m, i) => { const t = 18.5 + 0.5 + i * 0.42; bell(t, m + 12, 0.6, 0.09, 0.4); });
  // CTA
  [72, 76, 79].forEach((m, i) => pluck(23.0 + i * 0.05, m, 0.11, (i - 1) * 0.5, 0.3, 0.3, 1.0));
  const tap = 23.95; bell(tap, 96, 0.9, 0.12, 0.5); bell(tap, 91, 0.9, 0.08, 0.5); hat(tap, 0.12, false);
  [79, 76, 74, 71, 67].forEach((m, i) => bell(24.2 + i * 0.2, m + 12, 0.9, 0.05, 0.6));

  // sidechain duck for pad + bass
  const duck = mk(); { let p = 0; for (let i = 0; i < N; i++) { const t = i / sr; while (p + 1 < kicks.length && kicks[p + 1] <= t) p++; const tk = kicks.length && kicks[p] <= t ? kicks[p] : -9; duck[i] = 1 - 0.6 * E(-(t - tk) / 0.1); } }
  // reverb (Schroeder)
  const rev = (src, dl) => { const out = mk(); dl.forEach((D) => { const buf = new Float32Array(D); let p = 0, lp = 0; for (let i = 0; i < N; i++) { const y = buf[p]; lp = y * 0.65 + lp * 0.35; buf[p] = src[i] + lp * 0.84; out[i] += y * 0.25; p = (p + 1) % D; } }); [556, 441, 341].forEach((D) => { const buf = new Float32Array(D); let p = 0; for (let i = 0; i < N; i++) { const bo = buf[p], w = out[i] + 0.5 * bo; out[i] = -0.5 * w + bo; buf[p] = w; p = (p + 1) % D; } }); return out; };
  const RL = rev(VS, [1687, 1601, 2053, 2251]), RR = rev(VS, [1733, 1637, 2099, 2293]);
  const dly = (d) => { const o = mk(); for (let i = d; i < N; i++) o[i] = ES[i - d] + o[i - d] * 0.36; return o; };
  const EL = dly(16538), ER = dly(22050);
  const OL = new Float32Array(N), OR = new Float32Array(N); let peak = 0;
  for (let i = 0; i < N; i++) {
    const t = i / sr, fade = Math.min(1, t / 0.02) * (t < 24.7 ? 1 : Math.max(0, 1 - (t - 24.7) / 0.8));
    const l = (DL[i] + ML[i] * duck[i] + RL[i] * 0.85 + EL[i] * 0.9) * fade, r = (DR[i] + MR[i] * duck[i] + RR[i] * 0.85 + ER[i] * 0.9) * fade;
    OL[i] = Math.tanh(l * 1.15); OR[i] = Math.tanh(r * 1.15);
    peak = Math.max(peak, Math.abs(OL[i]), Math.abs(OR[i]));
  }
  const k = 0.89 / peak; for (let i = 0; i < N; i++) { OL[i] *= k; OR[i] *= k; }
  return { L: OL, R: OR, sr, N };
}
