import { useEffect, useRef, useState } from "react";
import { useSoundContext } from "../context/SoundContext";
import wispSrc from "../assets/site/bubble-wisp.png";

// Bubbles drift up through a small tank above the footer's bottom row and
// pop on tap/click (or a swipe across several at once), each pop adding to
// a running count — the popping itself is the universal, no-context-needed
// hook (the same reason bubble wrap is satisfying to anyone); "hers" shows
// up as a garnish rather than the premise. One bubble at a time carries an
// actual wisp cropped from her own hero line-art (bubble-wisp.png,
// recolored live to match the current theme), worth a bonus. A couple of
// "cracked" bubbles are mixed in too, marked with an actual crack glyph —
// popping one costs a life and breaks your streak, the actual stakes a
// tap game needs to feel like a game instead of a toy you can't lose at.
// Every 10th pop triggers a bigger on-brand burst instead of a generic
// confetti effect. The regular pop still reuses the click-pop burst
// language already established by CustomCursor's ripple. Pauses off-screen
// via IntersectionObserver; under prefers-reduced-motion bubbles hold
// still (no drift/wobble) but stay poppable.
const TARGET_COUNT = 10;
const MOBILE_TARGET_COUNT = 6;
const POP_DURATION = 420;
const HIGH_SCORE_KEY = "rv-bubble-high-score";
const SIGNATURE_CHANCE = 0.22;
const SIGNATURE_BONUS = 3;
const DANGER_CHANCE = 0.16;
const DANGER_MAX = 2;
const START_LIVES = 3;
const COUNTDOWN_START = 3;
const COUNTDOWN_TICK = 1000;
const MILESTONE_STEP = 10;
const COMBO_WINDOW = 700;
const COMBO_MIN_SHOW = 3;
const CELEBRATION_PHRASES = ["Nice!", "On Fire!", "Streak!", "Crushing It!", "Whoa!"];
const MISS_PHRASES = ["Careful!", "Oof.", "Watch it!"];
// Stays easy for the first ~10 pops, then ramps up over the next 25 —
// smaller bubbles that move and wobble faster are harder to land a
// click/swipe on — capped so it stays winnable rather than impossible.
// Applied live each frame (not baked in at spawn) so bubbles already on
// screen get visibly more restless as the run continues, not just new
// ones.
const DIFFICULTY_START = 10;
const DIFFICULTY_RAMP = 25;

function difficultyFor(popCount) {
  return Math.min(1, Math.max(0, (popCount - DIFFICULTY_START) / DIFFICULTY_RAMP));
}

// Every token here already exists in the site's palette — no new hue for
// "danger" (that would break the tonal cream/sage/forest system for one
// bubble type). Instead the cracked bubble borrows --ink, the darkest/
// heaviest token in either theme, so it reads as ominous through weight
// and the crack glyph rather than color-coding alone.
function getColors() {
  const styles = getComputedStyle(document.documentElement);
  return {
    glass: styles.getPropertyValue("--forest-soft").trim() || "#3d5850",
    highlight: styles.getPropertyValue("--paper").trim() || "#f7f2e6",
    signature: styles.getPropertyValue("--forest").trim() || "#1c3a31",
    danger: styles.getPropertyValue("--ink").trim() || "#21201b",
  };
}

function hexToRgb(hex) {
  const m = hex.trim().match(/^#([0-9a-f]{6})$/i);
  if (!m) return { r: 61, g: 88, b: 80 };
  const n = parseInt(m[1], 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

function makeBubble(w, h, fromBottom, difficulty = 0, kind = "normal") {
  const r = (11 + Math.random() * 13) * (1 - difficulty * 0.35);
  const baseX = r + Math.random() * Math.max(1, w - r * 2);
  const y = fromBottom ? h + r : r + Math.random() * Math.max(1, h - r * 2);
  return {
    baseX,
    y,
    r,
    vy: 0.25 + Math.random() * 0.35,
    phase: Math.random() * Math.PI * 2,
    wobbleAmp: 6 + Math.random() * 10,
    kind,
    // Seeded to the resting position (not 0,0) so the synchronous draw()
    // call inside resize() — which fires before the first animation
    // frame — doesn't flash bubbles in the top-left corner for one tick.
    drawX: baseX,
    drawY: y,
  };
}

export default function DotPlayground({ className }) {
  const mountRef = useRef(null);
  const [hintVisible, setHintVisible] = useState(true);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [celebrate, setCelebrate] = useState(false);
  const [celebrationText, setCelebrationText] = useState(null);
  const [missText, setMissText] = useState(null);
  const [combo, setCombo] = useState(0);
  const [lives, setLives] = useState(START_LIVES);
  const [lifeLost, setLifeLost] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [countdown, setCountdown] = useState(null);
  const { playClick } = useSoundContext();
  const playClickRef = useRef(playClick);
  playClickRef.current = playClick;

  useEffect(() => {
    const container = mountRef.current;
    const canvas = document.createElement("canvas");
    canvas.style.display = "block";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.touchAction = "none";
    container.appendChild(canvas);
    const ctx = canvas.getContext("2d");

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let w = 0;
    let h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const colors = getColors();
    let glass = hexToRgb(colors.glass);
    let highlight = hexToRgb(colors.highlight);
    let signatureRgb = hexToRgb(colors.signature);
    let dangerRgb = hexToRgb(colors.danger);
    let bubbles = [];
    let pops = [];
    let popCount = 0;
    let hasSignature = false;
    let dangerCount = 0;
    let celebrateTimeout = null;
    let missTimeout = null;
    let comboCount = 0;
    let lastPopTs = 0;
    let comboTimeout = null;
    let livesLeft = START_LIVES;
    let isGameOver = false;
    let countdownInterval = null;
    let lifeLostTimeout = null;
    let highScore = Number(localStorage.getItem(HIGH_SCORE_KEY)) || 0;
    setHighScore(highScore);
    let raf = null;

    // The wisp is plain black linework on transparent — recolored live via
    // source-in compositing onto an offscreen canvas so it always matches
    // the current theme, the same trick the rest of the site uses to keep
    // a single asset correct in both themes rather than shipping two files.
    const wispImg = new Image();
    const wispCanvas = document.createElement("canvas");
    const wispCtx = wispCanvas.getContext("2d");
    let wispReady = false;
    const recolorWisp = () => {
      if (!wispImg.naturalWidth) return;
      wispCanvas.width = wispImg.naturalWidth;
      wispCanvas.height = wispImg.naturalHeight;
      wispCtx.clearRect(0, 0, wispCanvas.width, wispCanvas.height);
      wispCtx.drawImage(wispImg, 0, 0);
      wispCtx.globalCompositeOperation = "source-in";
      wispCtx.fillStyle = `rgb(${signatureRgb.r}, ${signatureRgb.g}, ${signatureRgb.b})`;
      wispCtx.fillRect(0, 0, wispCanvas.width, wispCanvas.height);
      wispCtx.globalCompositeOperation = "source-over";
      wispReady = true;
    };
    wispImg.onload = () => {
      recolorWisp();
      draw();
    };
    wispImg.src = wispSrc;

    const targetCount = () => (w < 480 ? MOBILE_TARGET_COUNT : TARGET_COUNT);

    function drawBubble(b) {
      const isDanger = b.kind === "danger";
      const isSignature = b.kind === "signature";
      const base = isDanger ? dangerRgb : glass;

      // Radial gradient instead of a flat fill + separate solid ring —
      // reads as a glassy, curved surface (denser toward the rim) rather
      // than a flat disc with a hard outline stacked on top. The danger
      // bubble reuses the same treatment in --ink instead of a new hue —
      // heavier/smokier rather than color-coded.
      const grad = ctx.createRadialGradient(
        b.drawX - b.r * 0.25,
        b.drawY - b.r * 0.25,
        b.r * 0.1,
        b.drawX,
        b.drawY,
        b.r
      );
      // Only a little heavier than a normal bubble, not a different order
      // of magnitude — it should read as "slightly off" if you're paying
      // attention, not visually dominate the whole tank.
      grad.addColorStop(0, `rgba(${base.r}, ${base.g}, ${base.b}, ${isDanger ? 0.07 : 0.04})`);
      grad.addColorStop(0.75, `rgba(${base.r}, ${base.g}, ${base.b}, ${isDanger ? 0.15 : 0.1})`);
      grad.addColorStop(1, `rgba(${base.r}, ${base.g}, ${base.b}, ${isDanger ? 0.34 : 0.24})`);

      ctx.save();
      ctx.shadowColor = `rgba(${base.r}, ${base.g}, ${base.b}, ${isDanger ? 0.16 : 0.25})`;
      ctx.shadowBlur = 6;
      ctx.shadowOffsetY = 2;
      ctx.beginPath();
      ctx.arc(b.drawX, b.drawY, b.r, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
      ctx.restore();

      // The one bubble in rotation carrying a wisp cropped from her own
      // hero line-art — clipped to the bubble's own circle so it reads as
      // something floating inside the glass, not pasted on top of it.
      if (isSignature && wispReady) {
        const size = b.r * 1.6;
        ctx.save();
        ctx.beginPath();
        ctx.arc(b.drawX, b.drawY, b.r * 0.94, 0, Math.PI * 2);
        ctx.clip();
        ctx.globalAlpha = 0.8;
        ctx.drawImage(wispCanvas, b.drawX - size / 2, b.drawY - size / 2, size, size);
        ctx.restore();
      }

      // An actual crack — a jagged fault line with a small branch, like
      // fractured glass — rather than a plain X, so "cracked" reads as
      // literal rather than an arbitrary warning symbol. One color only
      // (--ink, same as the fill/rim) — the crack reads through opacity
      // against the softer semi-transparent fill, not a second hue.
      if (isDanger) {
        const k = b.r * 0.55;
        ctx.save();
        ctx.globalAlpha = 0.6;
        ctx.strokeStyle = `rgb(${dangerRgb.r}, ${dangerRgb.g}, ${dangerRgb.b})`;
        ctx.lineWidth = 1.1;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.beginPath();
        ctx.moveTo(b.drawX - k * 0.1, b.drawY - k);
        ctx.lineTo(b.drawX + k * 0.3, b.drawY - k * 0.32);
        ctx.lineTo(b.drawX - k * 0.22, b.drawY - k * 0.02);
        ctx.lineTo(b.drawX + k * 0.35, b.drawY + k * 0.45);
        ctx.lineTo(b.drawX - k * 0.08, b.drawY + k);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(b.drawX - k * 0.22, b.drawY - k * 0.02);
        ctx.lineTo(b.drawX - k * 0.62, b.drawY + k * 0.15);
        ctx.stroke();
        ctx.restore();
      }

      const rimRgb = isSignature ? signatureRgb : base;
      ctx.beginPath();
      ctx.arc(b.drawX, b.drawY, b.r, 0, Math.PI * 2);
      ctx.lineWidth = isSignature ? 1.4 : isDanger ? 1.1 : 1;
      ctx.strokeStyle = `rgba(${rimRgb.r}, ${rimRgb.g}, ${rimRgb.b}, ${isSignature ? 0.55 : isDanger ? 0.4 : 0.35})`;
      ctx.stroke();

      // Small soft crescent glint rather than a hard-edged dot — closer
      // to how light actually catches a curved, wet surface. Skipped on
      // the cracked bubble — it's meant to read as one tone (--ink) only,
      // not gain a second highlight color on top of the crack.
      if (!isDanger) {
        const glintGrad = ctx.createRadialGradient(
          b.drawX - b.r * 0.32,
          b.drawY - b.r * 0.32,
          0,
          b.drawX - b.r * 0.32,
          b.drawY - b.r * 0.32,
          b.r * 0.32
        );
        glintGrad.addColorStop(0, `rgba(${highlight.r}, ${highlight.g}, ${highlight.b}, 0.75)`);
        glintGrad.addColorStop(1, `rgba(${highlight.r}, ${highlight.g}, ${highlight.b}, 0)`);
        ctx.beginPath();
        ctx.arc(b.drawX - b.r * 0.32, b.drawY - b.r * 0.32, b.r * 0.32, 0, Math.PI * 2);
        ctx.fillStyle = glintGrad;
        ctx.fill();
      }
    }

    function drawPop(p, now) {
      const c = p.kind === "danger" ? dangerRgb : glass;
      const t = Math.min(1, (now - p.start) / POP_DURATION);
      const rad = p.r * (1 + t * 0.9);
      ctx.beginPath();
      ctx.arc(p.x, p.y, rad, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${c.r}, ${c.g}, ${c.b}, ${(1 - t) * 0.8})`;
      ctx.lineWidth = 2;
      ctx.stroke();
      for (const d of p.droplets) {
        const dx = Math.cos(d.angle) * d.dist * t;
        const dy = Math.sin(d.angle) * d.dist * t;
        ctx.beginPath();
        ctx.arc(p.x + dx, p.y + dy, Math.max(0, 3 * (1 - t * 0.6)), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${c.r}, ${c.g}, ${c.b}, ${1 - t})`;
        ctx.fill();
      }
    }

    function draw() {
      if (!w || !h) return;
      ctx.clearRect(0, 0, w, h);
      for (const b of bubbles) drawBubble(b);
      const now = performance.now();
      for (const p of pops) drawPop(p, now);
    }

    const fillToTarget = (fromBottom) => {
      if (isGameOver) return;
      const target = targetCount();
      const difficulty = difficultyFor(popCount);
      while (bubbles.length < target) {
        // At most one signature bubble (a rare find) and up to two danger
        // bubbles (actual obstacles, so more than one at once is the
        // point) in the tank at a time.
        let kind = "normal";
        if (!hasSignature && Math.random() < SIGNATURE_CHANCE) {
          kind = "signature";
          hasSignature = true;
        } else if (dangerCount < DANGER_MAX && Math.random() < DANGER_CHANCE) {
          kind = "danger";
          dangerCount += 1;
        }
        bubbles.push(makeBubble(w, h, fromBottom, difficulty, kind));
      }
    };

    const resize = () => {
      w = container.clientWidth;
      h = container.clientHeight;
      if (!w || !h) return;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (!bubbles.length) {
        fillToTarget(false);
      } else {
        bubbles.forEach((b) => {
          b.baseX = Math.min(Math.max(b.baseX, b.r), w - b.r);
          b.y = Math.min(Math.max(b.y, b.r), h + b.r);
        });
      }
      draw();
    };
    resize();
    window.addEventListener("resize", resize);
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);

    const themeObserver = new MutationObserver(() => {
      const c = getColors();
      glass = hexToRgb(c.glass);
      highlight = hexToRgb(c.highlight);
      signatureRgb = hexToRgb(c.signature);
      dangerRgb = hexToRgb(c.danger);
      recolorWisp();
      draw();
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    const localPoint = (e) => {
      const rect = canvas.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    // Three simultaneous bursts scattered across the tank, not one burst
    // at dead center — reads as a real "moment" rather than the same pop
    // animation slightly bigger. Paired with a phrase and a background
    // glow so a milestone is unmistakable instead of something you'd miss
    // if you blinked.
    const triggerCelebration = () => {
      const now = performance.now();
      const points = [
        { x: w * 0.28, y: h * 0.45 },
        { x: w * 0.72, y: h * 0.4 },
        { x: w * 0.5, y: h * 0.65 },
      ];
      for (const pt of points) {
        const count = 10;
        const droplets = Array.from({ length: count }, (_, di) => ({
          angle: (di / count) * Math.PI * 2 + Math.random() * 0.4,
          dist: 20 + Math.random() * 18,
        }));
        pops.push({ x: pt.x, y: pt.y, r: 14, start: now, droplets });
      }
      setCelebrate(true);
      setCelebrationText(CELEBRATION_PHRASES[Math.floor(Math.random() * CELEBRATION_PHRASES.length)]);
      clearTimeout(celebrateTimeout);
      celebrateTimeout = setTimeout(() => {
        setCelebrate(false);
        setCelebrationText(null);
      }, 900);
    };

    // Three lives, not infinite play — a cracked bubble takes one instead
    // of docking points, since running out is already the real cost.
    // Freezes the tank behind a Game Over overlay with a visible 3..2..1
    // countdown, then restarts on its own — no "play again" tap to commit
    // to (this is a footer easter egg, not a page), but the count makes
    // the restart feel deliberate instead of an abrupt cut back into play.
    const triggerGameOver = () => {
      isGameOver = true;
      setGameOver(true);
      setFinalScore(popCount);
      bubbles = [];
      pops = [];
      draw();

      let n = COUNTDOWN_START;
      setCountdown(n);
      clearInterval(countdownInterval);
      countdownInterval = setInterval(() => {
        n -= 1;
        if (n <= 0) {
          clearInterval(countdownInterval);
          setCountdown(null);
          restartGame();
        } else {
          setCountdown(n);
        }
      }, COUNTDOWN_TICK);
    };

    const restartGame = () => {
      isGameOver = false;
      popCount = 0;
      livesLeft = START_LIVES;
      hasSignature = false;
      dangerCount = 0;
      comboCount = 0;
      setGameOver(false);
      setScore(0);
      setLives(START_LIVES);
      setCombo(0);
      fillToTarget(false);
      draw();
    };

    const popAt = (x, y) => {
      if (isGameOver) return false;
      for (let i = bubbles.length - 1; i >= 0; i--) {
        const b = bubbles[i];
        if (Math.hypot(b.drawX - x, b.drawY - y) <= b.r + 4) {
          const isSignature = b.kind === "signature";
          const isDanger = b.kind === "danger";
          bubbles.splice(i, 1);
          if (isSignature) hasSignature = false;
          if (isDanger) dangerCount = Math.max(0, dangerCount - 1);

          const dropletCount = isSignature ? 10 : isDanger ? 8 : 6;
          const droplets = Array.from({ length: dropletCount }, (_, di) => ({
            angle: (di / dropletCount) * Math.PI * 2 + Math.random() * 0.5,
            dist: b.r * (1.1 + Math.random() * 0.6),
          }));
          pops.push({ x: b.drawX, y: b.drawY, r: b.r, kind: b.kind, start: performance.now(), droplets });

          const delta = isSignature ? SIGNATURE_BONUS : isDanger ? 0 : 1;
          popCount += delta;

          const now = performance.now();
          if (isDanger) {
            // A cracked bubble breaks the streak outright rather than just
            // not extending it, and costs a life instead of docking points
            // — running out of lives is already the real cost of a miss.
            comboCount = 0;
            clearTimeout(comboTimeout);
            setCombo(0);
            setMissText(MISS_PHRASES[Math.floor(Math.random() * MISS_PHRASES.length)]);
            clearTimeout(missTimeout);
            missTimeout = setTimeout(() => setMissText(null), 700);
            livesLeft -= 1;
            setLives(livesLeft);
            setLifeLost(true);
            clearTimeout(lifeLostTimeout);
            lifeLostTimeout = setTimeout(() => setLifeLost(false), 500);
            playClickRef.current();
            if (livesLeft <= 0) {
              triggerGameOver();
              lastPopTs = now;
              return true;
            }
          } else {
            comboCount = now - lastPopTs < COMBO_WINDOW ? comboCount + 1 : 1;
            setCombo(comboCount >= COMBO_MIN_SHOW ? comboCount : 0);
            clearTimeout(comboTimeout);
            comboTimeout = setTimeout(() => {
              comboCount = 0;
              setCombo(0);
            }, COMBO_WINDOW);
          }
          lastPopTs = now;

          // Reduced-motion bubbles never drift, so a replacement spawned
          // "from the bottom" (off-canvas, waiting to rise into view)
          // would just sit there invisible forever — spawn it already
          // in-frame instead.
          fillToTarget(!reducedMotion);
          if (!isDanger) playClickRef.current();
          setScore(popCount);
          if (popCount > highScore) {
            highScore = popCount;
            localStorage.setItem(HIGH_SCORE_KEY, String(highScore));
            setHighScore(highScore);
          }
          if (!isDanger && Math.floor(popCount / MILESTONE_STEP) > Math.floor((popCount - delta) / MILESTONE_STEP)) {
            triggerCelebration();
          }
          if (reducedMotion) draw();
          return true;
        }
      }
      return false;
    };

    let isDown = false;
    const onPointerDown = (e) => {
      isDown = true;
      const p = localPoint(e);
      popAt(p.x, p.y);
    };
    const onPointerMove = (e) => {
      if (!isDown) return;
      const p = localPoint(e);
      popAt(p.x, p.y);
    };
    const onPointerUp = () => {
      isDown = false;
    };
    const onCanvasEnter = () => setHintVisible(false);

    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("pointerenter", onCanvasEnter);

    const step = () => {
      if (w && h) {
        const now = performance.now();
        const difficulty = difficultyFor(popCount);
        const speedMul = 1 + difficulty * 1.5;
        const wobbleMul = 1 + difficulty * 2;
        const phaseSpeedMul = 1 + difficulty * 1.4;
        for (const b of bubbles) {
          if (!reducedMotion) {
            b.y -= b.vy * speedMul;
            b.phase += 0.02 * phaseSpeedMul;
          }
          b.drawX = b.baseX + (reducedMotion ? 0 : Math.sin(b.phase) * b.wobbleAmp * wobbleMul);
          b.drawY = b.y;
        }
        if (!reducedMotion) {
          const before = bubbles.length;
          const leaving = bubbles.filter((b) => b.y + b.r <= 0);
          if (leaving.length) {
            bubbles = bubbles.filter((b) => b.y + b.r > 0);
            if (leaving.some((b) => b.kind === "signature")) hasSignature = false;
            dangerCount -= leaving.filter((b) => b.kind === "danger").length;
          }
          if (bubbles.length !== before) fillToTarget(true);
        }
        pops = pops.filter((p) => now - p.start < POP_DURATION);
        draw();
      }
      raf = requestAnimationFrame(step);
    };

    const io = new IntersectionObserver(
      (entries) => {
        const isVisible = entries[0].isIntersecting;
        if (isVisible && !raf) raf = requestAnimationFrame(step);
        if (!isVisible && raf) {
          cancelAnimationFrame(raf);
          raf = null;
        }
      },
      { threshold: 0.05 }
    );
    io.observe(container);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      clearTimeout(celebrateTimeout);
      clearTimeout(comboTimeout);
      clearTimeout(missTimeout);
      clearTimeout(lifeLostTimeout);
      clearInterval(countdownInterval);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerenter", onCanvasEnter);
      resizeObserver.disconnect();
      themeObserver.disconnect();
      io.disconnect();
      container.removeChild(canvas);
    };
  }, []);

  return (
    <div className={className ? `dot-playground ${className}` : "dot-playground"}>
      <div className="dot-playground__bar">
        <span className="dot-playground__title-group">
          <span className="dot-playground__title">Pop Break</span>
          <span
            className={`dot-playground__lives${lifeLost ? " is-losing" : ""}`}
            aria-label={`${lives} lives left`}
          >
            {Array.from({ length: START_LIVES }, (_, i) => (
              <span key={i} className={`dot-playground__life${i < lives ? "" : " is-lost"}`} />
            ))}
          </span>
        </span>
        <span className={`dot-playground__score${celebrate ? " is-celebrating" : ""}`} aria-live="polite">
          popped: {score} · best: {highScore}
        </span>
      </div>
      <div className={`dot-playground__stage${celebrate ? " is-flourish" : ""}`}>
        <div
          className="dot-playground__canvas"
          ref={mountRef}
          role="img"
          aria-label="Bubble-popping mini game"
        />
        <span className={`dot-playground__hint${hintVisible ? "" : " is-hidden"}`} aria-hidden="true">
          pop some bubbles &amp; calm your mind
        </span>
        {combo >= COMBO_MIN_SHOW && <span className="dot-playground__combo">×{combo}</span>}
        {celebrationText && <span className="dot-playground__celebration-text">{celebrationText}</span>}
        {missText && <span className="dot-playground__miss-text">{missText}</span>}
        {gameOver && (
          <div className="dot-playground__gameover" aria-live="assertive">
            <span className="dot-playground__gameover-title">Game Over</span>
            <span className="dot-playground__gameover-score">final score: {finalScore}</span>
            {countdown != null && (
              <span key={countdown} className="dot-playground__gameover-countdown">
                {countdown}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
