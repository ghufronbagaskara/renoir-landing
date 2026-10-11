const LIGHT = { bg: '#FFFFFF', ink: '#0A0A0A', dim: '#6B6B6B', hair: 'rgba(10,10,10,0.14)', shadow: '0 30px 60px rgba(0,0,0,0.14)', chipLab: '#A3A3A3', dark: false };
const DARK = { bg: '#0A0A0A', ink: '#F5F5F5', dim: '#A3A3A3', hair: 'rgba(255,255,255,0.22)', shadow: '0 30px 70px rgba(0,0,0,0.7)', chipLab: '#525252', dark: true };
const ThCtx = React.createContext(LIGHT);
const GS = '"General Sans", "Helvetica Neue", Arial, sans-serif';
const IN = '"Inter", system-ui, sans-serif';

const MOTION = {
  enter: (T, a, b) => Easing.easeOutCubic(clamp((T - a) / (b - a), 0, 1)),
  draw: (T, a, b) => Easing.easeInOutCubic(clamp((T - a) / (b - a), 0, 1)),
  pop: (T, a, b) => Easing.easeOutBack(clamp((T - a) / (b - a), 0, 1)),
};
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const mixHex = (a, b, k) => { const x = hex(a), y = hex(b); return 'rgb(' + x.map((v, i) => Math.round(v + (y[i] - v) * k)).join(',') + ')'; };
const label = (th, extra) => ({ fontFamily: IN, fontWeight: 600, fontSize: 26, letterSpacing: '0.1em', textTransform: 'uppercase', color: th.dim, ...extra });

function Lines({ T, lines, size, x, y, inAt, step = 0.1, outAt = 1e9, color, w = 960 }) {
  const th = React.useContext(ThCtx);
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: w }}>
      {lines.map((l, i) => {
        const pin = MOTION.enter(T, inAt + i * step, inAt + i * step + 0.5);
        const pout = MOTION.draw(T, outAt + i * 0.05, outAt + i * 0.05 + 0.35);
        const ty = (1 - pin) * 150 - pout * 150;
        return (
          <div key={i} style={{ overflow: 'hidden', visibility: pin === 0 || pout === 1 ? 'hidden' : 'visible', paddingTop: size * 0.06, paddingBottom: size * 0.12, marginBottom: -size * 0.1 }}>
            <div style={{ transform: 'translateY(' + ty + '%)', fontFamily: GS, fontWeight: 600, fontSize: size, lineHeight: 0.98, letterSpacing: '-0.04em', whiteSpace: 'nowrap', color: l.em ? th.dim : (color || th.ink) }}>{l.t}</div>
          </div>
        );
      })}
    </div>
  );
}

function Rise({ T, a, out = 1e9, style, children }) {
  const p = MOTION.enter(T, a, a + 0.45), q = MOTION.draw(T, out, out + 0.3);
  return <div style={{ ...style, opacity: p * (1 - q), transform: 'translateY(' + ((1 - p) * 44 - q * 30) + 'px)' }}>{children}</div>;
}

function Mark({ size, color }) {
  return <svg width={size} height={size * 64 / 66} viewBox="0 0 66 64" fill={color} style={{ display: 'block' }}><path d="M27 11 43 2v36L27 47V11Z" /><path d="M3 45 24 33 42 44 21 56 3 45Z" /><path d="M47 31 63 40v20L46 50V31Z" /></svg>;
}

function Crop({ src, w, h, style }) {
  const th = React.useContext(ThCtx);
  const ih = Math.max(h, w * 630 / 1200), iw = ih * 1200 / 630;
  return (
    <div style={{ ...style, width: w, height: h, overflow: 'hidden', borderRadius: 28, border: '2px solid ' + th.hair, background: '#fff', boxShadow: th.shadow }}>
      <img src={'uploads/' + src} alt="" draggable={false} style={{ display: 'block', width: iw, height: ih, maxWidth: 'none', marginTop: -(ih - h) / 2 }} />
    </div>
  );
}

function Nav({ T, nd, St }) {
  const ink = mixHex(LIGHT.ink, DARK.ink, nd), bg = mixHex(LIGHT.bg, DARK.bg, nd);
  const out = MOTION.draw(T, St - 0.1, St + 0.3);
  return (
    <div style={{ position: 'absolute', left: 80, right: 80, top: 245, height: 80, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <Rise T={T} a={0.1} style={{ display: 'flex', alignItems: 'center', gap: 18, fontFamily: GS, fontWeight: 600, fontSize: 56, letterSpacing: '-0.03em', lineHeight: 1, color: ink }}><Mark size={46} color={ink} />Renoir</Rise>
      <div style={{ opacity: 1 - out }}>
        <Rise T={T} a={0.2} style={{ fontFamily: IN, fontWeight: 600, fontSize: 28, lineHeight: 1.1, whiteSpace: 'nowrap', padding: '18px 34px', borderRadius: 50, background: ink, color: bg }}>Start a project</Rise>
      </div>
    </div>
  );
}

function Sc({ th, from, to, children }) {
  return <ThCtx.Provider value={th}><Shot from={from} to={to}>{children}</Shot></ThCtx.Provider>;
}

const SERVICES = [
  { name: [{ t: 'Marketing &' }, { t: 'landing sites', em: 1 }], desc: 'For companies whose website is the first thing a prospect judges them by.', img: 'maxy-ai.jpg', img2: 'ai-ceo-circle.jpg', fee: 'FIXED FEE', sub: 'for agreed scope' },
  { name: [{ t: 'Custom internal' }, { t: 'systems', em: 1 }], desc: 'For operations running on spreadsheets, chat threads, and paper.', img: 'order-sales.jpg', img2: 'activity-review.jpg', fee: 'FIXED FEE', sub: 'for agreed scope' },
  { name: [{ t: 'UI/UX &' }, { t: 'visual identity', em: 1 }], desc: 'For products that need a clearer experience and an identity of their own.', img: 'expert-profile.jpg', img2: 'industrial-coatings.jpg', fee: 'FIXED FEE', sub: 'for agreed scope' },
  { name: [{ t: 'Deployment' }, { t: '& care', em: 1 }], desc: 'Monitoring, backups, documentation. We keep it running, or you take it.', img: 'operations-control.jpg', img2: 'field-projects.jpg', fee: 'INCLUDED', sub: 'for every client' },
];

function Service({ T, s, e, idx }) {
  const th = React.useContext(ThCtx);
  const d = SERVICES[idx - 1], out = e - 0.3;
  const p = MOTION.enter(T, s + 0.05, s + 0.65), q = MOTION.draw(T, out, e);
  const b = MOTION.pop(T, s + 0.6, s + 1.0), p2 = MOTION.enter(T, s + 0.3, s + 0.9);
  return (
    <React.Fragment>
      <Rise T={T} a={s} out={out} style={{ ...label(th), position: 'absolute', left: 80, top: 352 }}>0{idx} / 04</Rise>
      <Lines T={T} x={80} y={400} size={100} inAt={s + 0.02} step={0.07} outAt={out} lines={d.name} />
      <Rise T={T} a={s + 0.2} out={out} style={{ position: 'absolute', left: 80, top: 650, width: 920, fontFamily: IN, fontWeight: 500, fontSize: 36, lineHeight: 1.35, color: th.ink, textWrap: 'pretty' }}>{d.desc}</Rise>
      <Crop src={d.img} w={920} h={483} style={{ position: 'absolute', left: 80, top: 800, opacity: p * (1 - q), transform: 'translateY(' + ((1 - p) * 170 - q * 80) + 'px)' }} />
      <Crop src={d.img2} w={640} h={336} style={{ position: 'absolute', left: 360, top: 1236, opacity: p2 * (1 - q), transform: 'translateY(' + ((1 - p2) * 190 - q * 90) + 'px)' }} />
      <div style={{ position: 'absolute', left: 80, top: 1424, width: 400, height: 124, borderRadius: 24, background: th.ink, padding: '24px 30px', boxSizing: 'border-box', opacity: Math.max(0, Math.min(1, b)) * (1 - q), transform: 'scale(' + b + ')', transformOrigin: 'left bottom' }}>
        <div style={{ fontFamily: IN, fontWeight: 600, fontSize: 24, letterSpacing: '0.12em', color: th.chipLab }}>{d.fee}</div>
        <div style={{ fontFamily: IN, fontWeight: 600, fontSize: 32, color: th.bg, marginTop: 6 }}>{d.sub}</div>
      </div>
    </React.Fragment>
  );
}

const ALL = [['ai-ceo-circle.jpg', 'AI CEO Circle'], ['activity-review.jpg', 'Activity Review'], ['expert-profile.jpg', 'Expert Profile'], ['field-projects.jpg', 'Field Projects'], ['industrial-coatings.jpg', 'Industrial Coatings'], ['maxy-ai.jpg', 'MAXY AI'], ['operations-control.jpg', 'Operations Control'], ['order-sales.jpg', 'Order & Field Sales']];

function Work({ T, s, e }) {
  const th = React.useContext(ThCtx);
  const out = e - 0.3, q = MOTION.draw(T, out, e);
  const PE = Easing.easeInOutQuad(clamp((T - s - 0.1) / (e - s - 0.3), 0, 1));
  return (
    <React.Fragment>
      <Lines T={T} x={80} y={350} size={116} inAt={s + 0.02} outAt={out} lines={[{ t: 'Selected work' }]} />
      {[0, 1, 2].map((r) => {
        const p = MOTION.enter(T, s + 0.15 + r * 0.12, s + 0.75 + r * 0.12);
        const x0 = r === 1 ? -330 + 520 * PE : 80 - r * 126 - 520 * PE;
        return (
          <div key={r} style={{ position: 'absolute', left: 0, top: 560 + r * 330, width: 1080, height: 320, overflow: 'hidden', opacity: p * (1 - q), transform: 'translateY(' + ((1 - p) * 90 - q * 40) + 'px)' }}>
            {[-3, -2, -1, 0, 1, 2, 3, 4, 5, 6].map((k) => {
              const it = ALL[(((r * 3 + k) % 8) + 8) % 8];
              return (
                <div key={k} style={{ position: 'absolute', left: x0 + k * 504, top: 0 }}>
                  <Crop src={it[0]} w={480} h={252} style={{ position: 'relative' }} />
                  <div style={{ fontFamily: IN, fontWeight: 500, fontSize: 24, color: th.dim, marginTop: 14, whiteSpace: 'nowrap' }}>{it[1]}</div>
                </div>
              );
            })}
          </div>
        );
      })}
    </React.Fragment>
  );
}

const STAGES = [['Scope', 'A written scope and a fixed price.'], ['Design', 'You approve it before any code exists.'], ['Build', 'On a live staging URL you can check.'], ['Deploy & care', 'Monitoring on. We keep it running.']];

function Piece({ music, flip }) {
  const { T, CUES, playing } = useComposition();
  const au = React.useRef(null), st = React.useRef({});
  st.current = { T, playing, music };
  React.useEffect(() => {
    const a = new Audio('renoir-music-v2.wav'); a.preload = 'auto'; au.current = a; window.__renoirAudio = a;
    const kick = () => {
      const s = st.current;
      if (a.paused && s.playing && s.music) { try { a.currentTime = s.T; } catch (e) {} a.play().then(() => window.dispatchEvent(new Event('om-audio-ok'))).catch(() => {}); }
    };
    window.addEventListener('pointerdown', kick); window.addEventListener('keydown', kick);
    return () => { a.pause(); window.removeEventListener('pointerdown', kick); window.removeEventListener('keydown', kick); };
  }, []);
  React.useEffect(() => {
    const a = au.current; if (!a) return;
    if (playing && music) {
      if (a.paused || Math.abs(a.currentTime - T) > 0.35) { try { a.currentTime = T; } catch (e) {} }
      if (a.paused) a.play().then(() => window.dispatchEvent(new Event('om-audio-ok'))).catch(() => window.dispatchEvent(new Event('om-audio-blocked')));
    } else if (!a.paused) a.pause();
  }, [playing, music, Math.floor(T * 4)]);

  const H = CUES.Hook, Tm = CUES.Team, S = CUES.Site, Sy = CUES.System, D = CUES.Design, C = CUES.Care, W = CUES.Work, P = CUES.Process, St = CUES.Start;
  const hb = H + 1.5;
  const bt = [H, hb, Tm, S, Sy, D, C, W, P, St];
  const th = bt.map((_, i) => ((i % 2 === 1) !== !!flip ? DARK : LIGHT));
  let nd = th[0].dark ? 1 : 0;
  for (let i = 1; i < bt.length; i++) nd += ((th[i].dark ? 1 : 0) - nd) * clamp((T - (bt[i] + (i === bt.length - 1 ? 0.03 : -0.075))) / 0.1, 0, 1);

  const pa = MOTION.enter(T, H + 0.25, H + 0.85), qa = MOTION.draw(T, H + 1.05, H + 1.4);
  const pb = MOTION.enter(T, hb + 0.1, hb + 0.7), qb = MOTION.draw(T, Tm - 0.4, Tm);
  const tp = (a) => MOTION.enter(T, Tm + a, Tm + a + 0.6), tqe = MOTION.draw(T, S - 0.35, S);
  const pOut = St - 0.35;
  const btn = MOTION.pop(T, St + 1.0, St + 1.4);
  const tap = MOTION.draw(T, St + 1.9, St + 2.05) - MOTION.draw(T, St + 2.05, St + 2.3);
  const ring = MOTION.enter(T, St + 1.95, St + 2.5);
  const tS = th[9];

  return (
    <div data-screen-label={'t=' + Math.floor(T) + 's'} style={{ position: 'absolute', inset: 0, background: th[0].bg, overflow: 'hidden' }}>
      {bt.map((b, i) => {
        if (!i) return null;
        const p = MOTION.draw(T, b - 0.2, b + 0.3);
        if (p <= 0) return null;
        return <div key={i} style={{ position: 'absolute', inset: 0, background: th[i].bg, clipPath: i === bt.length - 1 ? 'circle(' + 2400 * p + 'px at 300px 1180px)' : 'inset(0 0 ' + (1 - p) * 100 + '% 0)' }} />;
      })}

      <Sc th={th[0]} from={H - 0.02} to={hb}>
        <Lines T={T} x={80} y={360} size={144} inAt={H + 0.1} step={0.1} outAt={H + 1.1} lines={[{ t: 'Make a' }, { t: 'stronger' }, { t: 'impression.', em: 1 }]} />
        <Crop src="ai-ceo-circle.jpg" w={920} h={483} style={{ position: 'absolute', left: 80, top: 950, opacity: pa * (1 - qa), transform: 'translateY(' + ((1 - pa) * 150 - qa * 90) + 'px)' }} />
      </Sc>
      <Sc th={th[1]} from={hb - 0.1} to={Tm + 0.02}>
        <Lines T={T} x={80} y={360} size={144} inAt={hb + 0.1} step={0.1} outAt={Tm - 0.5} lines={[{ t: 'Run a' }, { t: 'better' }, { t: 'operation.', em: 1 }]} />
        <Crop src="activity-review.jpg" w={920} h={483} style={{ position: 'absolute', left: 80, top: 950, opacity: pb * (1 - qb), transform: 'translateY(' + ((1 - pb) * 150 - qb * 70) + 'px)' }} />
      </Sc>

      <Sc th={th[2]} from={Tm - 0.02} to={S + 0.02}>
        <Lines T={T} x={80} y={360} size={160} inAt={Tm + 0.1} step={0.12} outAt={S - 0.3} lines={[{ t: 'Design' }, { t: 'to server.', em: 1 }]} />
        <Rise T={T} a={Tm + 0.4} out={S - 0.3} style={{ position: 'absolute', left: 80, top: 722, fontFamily: IN, fontWeight: 500, fontSize: 38, color: th[2].ink }}>One team for the whole job.</Rise>
        <Crop src="industrial-coatings.jpg" w={800} h={420} style={{ position: 'absolute', left: 80, top: 850, opacity: tp(0.2) * (1 - tqe), transform: 'translateX(' + ((1 - tp(0.2)) * -240) + 'px) translateY(' + (-tqe * 60) + 'px)' }} />
        <Crop src="field-projects.jpg" w={800} h={420} style={{ position: 'absolute', left: 200, top: 1130, opacity: tp(0.4) * (1 - tqe), transform: 'translateX(' + ((1 - tp(0.4)) * 240) + 'px) translateY(' + (-tqe * 60) + 'px)' }} />
        <div style={{ ...label(th[2], { color: th[2].bg, fontSize: 26 }), position: 'absolute', left: 104, top: 874, background: th[2].ink, padding: '10px 22px', borderRadius: 30, opacity: tp(0.6) * (1 - tqe) }}>Design</div>
        <div style={{ ...label(th[2], { color: th[2].ink, fontSize: 26 }), position: 'absolute', left: 224, top: 1154, background: th[2].bg, border: '2px solid ' + th[2].ink, padding: '8px 22px', borderRadius: 30, opacity: tp(0.8) * (1 - tqe) }}>Server</div>
      </Sc>

      <Sc th={th[3]} from={S - 0.02} to={Sy + 0.02}><Service T={T} s={S} e={Sy} idx={1} /></Sc>
      <Sc th={th[4]} from={Sy - 0.02} to={D + 0.02}><Service T={T} s={Sy} e={D} idx={2} /></Sc>
      <Sc th={th[5]} from={D - 0.02} to={C + 0.02}><Service T={T} s={D} e={C} idx={3} /></Sc>
      <Sc th={th[6]} from={C - 0.02} to={W + 0.02}><Service T={T} s={C} e={W} idx={4} /></Sc>
      <Sc th={th[7]} from={W - 0.02} to={P + 0.02}><Work T={T} s={W} e={P} /></Sc>

      <Sc th={th[8]} from={P - 0.02} to={St + 0.02}>
        <Lines T={T} x={80} y={350} size={96} inAt={P + 0.02} step={0.08} outAt={pOut} lines={[{ t: 'Four stages,' }, { t: 'with the work' }, { t: 'in view.', em: 1 }]} />
        {STAGES.map((sg, i) => {
          const a = P + 0.5 + i * 0.42, p = MOTION.enter(T, a, a + 0.5), q = MOTION.draw(T, pOut, pOut + 0.3);
          return (
            <div key={i} style={{ position: 'absolute', left: 80, top: 700 + i * 165, width: 920, height: 165, opacity: 1 - q, transform: 'translateY(' + (-q * 30) + 'px)' }}>
              <div style={{ height: 2, width: 920 * MOTION.draw(T, a - 0.1, a + 0.5), background: th[8].hair }} />
              <div style={{ opacity: p, transform: 'translateY(' + (1 - p) * 40 + 'px)', display: 'flex', gap: 28, paddingTop: 22 }}>
                <div style={{ fontFamily: IN, fontWeight: 600, fontSize: 28, color: th[8].dim, width: 64, paddingTop: 16 }}>0{i + 1}</div>
                <div>
                  <div style={{ fontFamily: GS, fontWeight: 600, fontSize: 80, letterSpacing: '-0.04em', lineHeight: 0.98, color: th[8].ink }}>{sg[0]}</div>
                  <div style={{ fontFamily: IN, fontWeight: 500, fontSize: 30, color: th[8].dim, marginTop: 8 }}>{sg[1]}</div>
                </div>
              </div>
            </div>
          );
        })}
        <Rise T={T} a={P + 2.1} out={pOut} style={{ position: 'absolute', left: 80, top: 1420, display: 'flex', gap: 14 }}>
          {['Fixed price', 'Sites in 2–4 weeks', '100% code ownership'].map((t, i) => <div key={i} style={{ ...label(th[8], { color: th[8].ink, fontSize: 24, letterSpacing: '0.04em', textTransform: 'none' }), border: '2px solid ' + th[8].ink, borderRadius: 40, padding: '12px 22px', whiteSpace: 'nowrap' }}>{t}</div>)}
        </Rise>
      </Sc>

      <Sc th={tS} from={St - 0.02} to={St + 99}>
        <Lines T={T} x={80} y={440} size={150} inAt={St + 0.4} step={0.12} lines={[{ t: 'Tell us' }, { t: 'what needs' }, { t: 'to work.' }]} />
        <div style={{ position: 'absolute', left: 80, top: 1050, width: 620, height: 132, opacity: clamp(btn, 0, 1), transform: 'scale(' + (btn * (1 - 0.05 * tap)) + ')', transformOrigin: 'left center' }}>
          <div style={{ position: 'absolute', inset: 0, borderRadius: 66, border: '3px solid ' + tS.ink, opacity: (1 - ring) * 0.9, transform: 'scale(' + (1 + 0.22 * ring) + ')' }} />
          <div style={{ position: 'absolute', inset: 0, borderRadius: 66, background: tS.ink, color: tS.bg, fontFamily: GS, fontWeight: 600, letterSpacing: '-0.02em', fontSize: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 18 }}>Start a project <span>→</span></div>
        </div>
        <Rise T={T} a={St + 1.3} style={{ position: 'absolute', left: 80, top: 1236, fontFamily: GS, fontWeight: 600, letterSpacing: '-0.03em', fontSize: 62, color: tS.ink }}>@renoir.studio</Rise>
        <Rise T={T} a={St + 1.4} style={{ position: 'absolute', left: 80, top: 1318, fontFamily: IN, fontWeight: 500, fontSize: 34, color: tS.dim }}>on Instagram</Rise>
        <Rise T={T} a={St + 1.5} style={{ position: 'absolute', left: 80, top: 1384, fontFamily: IN, fontWeight: 500, fontSize: 28, color: tS.ink }}>renoir.ghufronbagaskara08.workers.dev</Rise>
        <div style={{ position: 'absolute', left: 0, right: 0, top: 1480, height: 96, overflow: 'hidden', background: tS.ink, opacity: MOTION.enter(T, St + 1.2, St + 1.7) }}>
          <div style={{ position: 'absolute', top: 0, left: 0, whiteSpace: 'nowrap', fontFamily: GS, fontWeight: 600, letterSpacing: '-0.03em', fontSize: 54, lineHeight: '96px', color: tS.bg, transform: 'translateX(' + (-(T - St) * 160) + 'px)' }}>{'Start a project  →  '.repeat(10)}</div>
        </div>
      </Sc>

      <Nav T={T} nd={nd} St={St} />
    </div>
  );
}

function RenoirPromo() {
  const [t, setTweak] = useTweaks(window.TWEAK_DEFAULTS);
  const [blocked, setBlocked] = React.useState(false);
  React.useEffect(() => {
    const b = () => setBlocked(true), o = () => setBlocked(false);
    window.addEventListener('om-audio-blocked', b); window.addEventListener('om-audio-ok', o);
    return () => { window.removeEventListener('om-audio-blocked', b); window.removeEventListener('om-audio-ok', o); };
  }, []);
  const dl = () => { const a = document.createElement('a'); a.href = 'renoir-music-v2.wav'; a.download = 'renoir-music.wav'; document.body.appendChild(a); a.click(); a.remove(); };
  React.useEffect(() => {
    const ts = [0, 100, 300, 800].map((d) => setTimeout(() => window.dispatchEvent(new Event('resize')), d));
    return () => ts.forEach(clearTimeout);
  }, []);
  return (
    <React.Fragment>
      <CompositionStage width={1080} height={1920} scenes={window.OM_SCENES} playback={window.OM_PLAYBACK} bg={t.flip ? '#0A0A0A' : '#FFFFFF'}>
        <Piece music={t.music !== false} flip={!!t.flip} />
      </CompositionStage>
      <TweaksPanel>
        <TweakSection label="Look" />
        <TweakToggle label="Start on black" value={!!t.flip} onChange={(v) => setTweak('flip', v)} />
        <TweakSection label="Sound & timeline" />
        <TweakToggle label="Music" value={t.music !== false} onChange={(v) => setTweak('music', v)} />
        <TweakButton label="Download music (WAV)" onClick={dl} secondary />
        <TweakToggle label="Motion editor" value={t.motionEditor} onChange={(v) => setTweak('motionEditor', v)} />
      </TweaksPanel>
      {blocked && t.music !== false ? <div style={{ position: 'fixed', top: 14, left: '50%', transform: 'translateX(-50%)', zIndex: 50, padding: '9px 18px', borderRadius: 30, background: '#0A0A0A', color: '#fff', font: '600 13px system-ui, sans-serif', pointerEvents: 'none' }}>Click anywhere to turn on sound</div> : null}
    </React.Fragment>
  );
}
window.RenoirPromo = RenoirPromo;
