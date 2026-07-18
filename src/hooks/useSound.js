import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "rv-sound";
let ctx = null;

function getContext() {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    ctx = new AudioCtx();
  }
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

// Tiny synthesized UI tones — no audio files. A short sine blip with a fast
// exponential decay reads as a soft "tick", not a beep, and stays out of the
// way at low volume. Hover and click get slightly different pitches so the
// two feel distinct without needing separate samples.
function playTone(freq, duration, gainPeak) {
  const audioCtx = getContext();
  if (!audioCtx) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = "sine";
  osc.frequency.value = freq;
  const now = audioCtx.currentTime;
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(gainPeak, now + 0.008);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start(now);
  osc.stop(now + duration);
}

function getInitialEnabled() {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored === "on";
}

// Phone only — desktop/laptop trackpads have no haptic motor at all, and
// tablets were explicitly asked to be excluded even though they're also
// touch/coarse-pointer devices. There's no direct "is this a phone" media
// query, so pointer:coarse (real touch, not mouse/trackpad) combined with
// a phone-width cap is the practical proxy.
function vibrateIfPhone() {
  if (typeof window === "undefined" || !navigator.vibrate) return;
  if (!window.matchMedia("(pointer: coarse) and (max-width: 767px)").matches) return;
  navigator.vibrate(12);
}

// Sound is opt-in (default off) — a portfolio a recruiter opens at their
// desk shouldn't make noise unprompted; the toggle makes it discoverable.
export function useSound() {
  const [enabled, setEnabled] = useState(getInitialEnabled);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, enabled ? "on" : "off");
  }, [enabled]);

  const toggleSound = useCallback(() => setEnabled((v) => !v), []);

  // Click-only sound (matches kishore.design/about's pattern) — hover
  // ticks read as noisy/accidental since hover fires constantly just from
  // moving the mouse across the page, whereas a click is a deliberate act.
  const playHover = useCallback(() => {}, []);

  const playClick = useCallback(() => {
    if (enabled) playTone(480, 0.12, 0.08);
    vibrateIfPhone();
  }, [enabled]);

  return { enabled, toggleSound, playHover, playClick };
}
