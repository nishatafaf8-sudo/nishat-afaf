import { FaithMode } from '../types';

let activeAudioCtx: AudioContext | null = null;
let activeOscillators: OscillatorNode[] = [];
let activeGain: GainNode | null = null;
let stopTimeoutId: number | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const AudioCtx =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  if (!AudioCtx) return null;
  if (!activeAudioCtx) {
    activeAudioCtx = new AudioCtx();
  }
  if (activeAudioCtx.state === 'suspended') {
    activeAudioCtx.resume().catch(() => {});
  }
  return activeAudioCtx;
}

export function stopHarmonicSound() {
  if (stopTimeoutId !== null) {
    window.clearTimeout(stopTimeoutId);
    stopTimeoutId = null;
  }
  activeOscillators.forEach((osc) => {
    try {
      osc.stop();
      osc.disconnect();
    } catch {
      // ignore already stopped
    }
  });
  activeOscillators = [];
  if (activeGain) {
    try {
      activeGain.disconnect();
    } catch {
      // ignore
    }
    activeGain = null;
  }
}

export function playHarmonicCall(mode: FaithMode, volume = 0.35, onEnded?: () => void) {
  stopHarmonicSound();
  const ctx = getAudioContext();
  if (!ctx) {
    if (onEnded) onEnded();
    return;
  }

  const master = ctx.createGain();
  master.gain.setValueAtTime(Math.max(0.05, Math.min(0.8, volume)), ctx.currentTime);
  master.connect(ctx.destination);
  activeGain = master;

  const now = ctx.currentTime;

  if (mode === 'Muslim') {
    const notes = [
      { freq: 293.66, start: 0.0, dur: 0.9 },
      { freq: 311.13, start: 0.85, dur: 0.65 },
      { freq: 369.99, start: 1.45, dur: 1.1 },
      { freq: 392.0, start: 2.5, dur: 0.8 },
      { freq: 440.0, start: 3.25, dur: 1.1 },
      { freq: 392.0, start: 4.3, dur: 0.7 },
      { freq: 369.99, start: 4.95, dur: 0.75 },
      { freq: 293.66, start: 5.65, dur: 1.4 },
    ];

    notes.forEach(({ freq, start, dur }) => {
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const env = ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(freq, now + start);

      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(freq * 2, now + start);

      const subGain = ctx.createGain();
      subGain.gain.setValueAtTime(0.18, now + start);

      env.gain.setValueAtTime(0.0001, now + start);
      env.gain.linearRampToValueAtTime(0.45, now + start + 0.12);
      env.gain.exponentialRampToValueAtTime(0.001, now + start + dur);

      osc1.connect(env);
      osc2.connect(subGain);
      subGain.connect(env);
      env.connect(master);

      osc1.start(now + start);
      osc2.start(now + start);
      osc1.stop(now + start + dur + 0.05);
      osc2.stop(now + start + dur + 0.05);

      activeOscillators.push(osc1, osc2);
    });

    stopTimeoutId = window.setTimeout(() => {
      stopHarmonicSound();
      if (onEnded) onEnded();
    }, 7200);
  } else {
    // Soothing Mind-Refresh lo-fi warm major-9th harmonic chord + soft breath chime
    const chordFreqs = [
      { freq: 261.63, amp: 0.32 }, // C4
      { freq: 329.63, amp: 0.24 }, // E4
      { freq: 392.0, amp: 0.22 }, // G4
      { freq: 493.88, amp: 0.16 }, // B4
      { freq: 587.33, amp: 0.12 }, // D5
    ];

    chordFreqs.forEach(({ freq, amp }) => {
      const osc = ctx.createOscillator();
      const env = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      env.gain.setValueAtTime(0.0001, now);
      env.gain.linearRampToValueAtTime(amp, now + 0.8);
      env.gain.exponentialRampToValueAtTime(0.0008, now + 6.2);

      osc.connect(env);
      env.connect(master);
      osc.start(now);
      osc.stop(now + 6.3);
      activeOscillators.push(osc);
    });

    stopTimeoutId = window.setTimeout(() => {
      stopHarmonicSound();
      if (onEnded) onEnded();
    }, 6400);
  }
}

export function playTimerCompleteChime() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const freqs = [523.25, 659.25, 783.99, 1046.5];

  freqs.forEach((f, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(f, now + idx * 0.14);

    gain.gain.setValueAtTime(0.001, now + idx * 0.14);
    gain.gain.linearRampToValueAtTime(0.22, now + idx * 0.14 + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.14 + 0.8);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now + idx * 0.14);
    osc.stop(now + idx * 0.14 + 0.85);
  });
}

const AZAN_STREAMS = [
  'https://cdn.aladhan.com/audio/adhans/a1.mp3',
  'https://www.islamcan.com/audio/adhan/azan1.mp3',
];

let activeAzanElement: HTMLAudioElement | null = null;

export function stopManualAzan() {
  if (activeAzanElement) {
    try {
      activeAzanElement.pause();
      activeAzanElement.currentTime = 0;
    } catch {
      // ignore
    }
    activeAzanElement = null;
  }
  stopHarmonicSound();
}

export function setManualAzanVolume(volume: number) {
  if (activeAzanElement) {
    activeAzanElement.volume = Math.max(0.05, Math.min(1, volume));
  }
}

export function playManualAzan(
  volume = 0.6,
  onEnded?: () => void,
  onStatus?: (message: string) => void
) {
  stopManualAzan();

  const tryPlayStream = (idx: number) => {
    if (idx >= AZAN_STREAMS.length) {
      if (onStatus) {
        onStatus('Playing built-in Hijaz Azan tone (audio stream unavailable).');
      }
      playHarmonicCall('Muslim', Math.min(0.8, volume), onEnded);
      return;
    }

    const audio = new Audio(AZAN_STREAMS[idx]);
    audio.volume = Math.max(0.05, Math.min(1, volume));
    activeAzanElement = audio;

    audio.onended = () => {
      activeAzanElement = null;
      if (onEnded) onEnded();
    };

    audio.onerror = () => {
      if (activeAzanElement === audio) {
        tryPlayStream(idx + 1);
      }
    };

    audio
      .play()
      .then(() => {
        if (onStatus) {
          onStatus('Playing Azan recitation — press Stop anytime to mute.');
        }
      })
      .catch(() => {
        tryPlayStream(idx + 1);
      });
  };

  tryPlayStream(0);
}

export type MindSoundscapeId =
  | 'rain'
  | 'ocean'
  | 'forest'
  | 'bowl'
  | 'focus432'
  | 'fireplace';

let mindCleanupFns: Array<() => void> = [];
let mindMasterGain: GainNode | null = null;

export function stopMindRefreshSound() {
  mindCleanupFns.forEach((fn) => {
    try {
      fn();
    } catch {
      // ignore
    }
  });
  mindCleanupFns = [];
  if (mindMasterGain) {
    try {
      mindMasterGain.disconnect();
    } catch {
      // ignore
    }
    mindMasterGain = null;
  }
}

export function setMindRefreshVolume(volume: number) {
  if (mindMasterGain && activeAudioCtx) {
    mindMasterGain.gain.setTargetAtTime(
      Math.max(0.02, Math.min(0.9, volume)),
      activeAudioCtx.currentTime,
      0.08
    );
  }
}

function createNoiseBuffer(ctx: AudioContext, seconds = 3, brown = false): AudioBuffer {
  const sampleRate = ctx.sampleRate;
  const length = sampleRate * seconds;
  const buffer = ctx.createBuffer(1, length, sampleRate);
  const data = buffer.getChannelData(0);
  let lastOut = 0;
  for (let i = 0; i < length; i++) {
    const white = Math.random() * 2 - 1;
    if (brown) {
      data[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = data[i];
      data[i] *= 3.2;
    } else {
      data[i] = white;
    }
  }
  return buffer;
}

export function playMindRefreshSound(soundId: MindSoundscapeId, volume = 0.55) {
  stopMindRefreshSound();
  const ctx = getAudioContext();
  if (!ctx) return;

  const master = ctx.createGain();
  master.gain.setValueAtTime(0.001, ctx.currentTime);
  master.gain.linearRampToValueAtTime(
    Math.max(0.05, Math.min(0.85, volume)),
    ctx.currentTime + 0.5
  );
  master.connect(ctx.destination);
  mindMasterGain = master;

  if (soundId === 'rain') {
    const src = ctx.createBufferSource();
    src.buffer = createNoiseBuffer(ctx, 4, false);
    src.loop = true;

    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.setValueAtTime(1400, ctx.currentTime);

    const hp = ctx.createBiquadFilter();
    hp.type = 'highpass';
    hp.frequency.setValueAtTime(320, ctx.currentTime);

    const g = ctx.createGain();
    g.gain.setValueAtTime(0.32, ctx.currentTime);

    src.connect(hp);
    hp.connect(lp);
    lp.connect(g);
    g.connect(master);
    src.start();

    mindCleanupFns.push(() => {
      src.stop();
      src.disconnect();
    });
  } else if (soundId === 'ocean') {
    const src = ctx.createBufferSource();
    src.buffer = createNoiseBuffer(ctx, 4, true);
    src.loop = true;

    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.setValueAtTime(520, ctx.currentTime);

    const waveGain = ctx.createGain();
    waveGain.gain.setValueAtTime(0.35, ctx.currentTime);

    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.setValueAtTime(0.12, ctx.currentTime);
    lfoGain.gain.setValueAtTime(0.26, ctx.currentTime);

    lfo.connect(lfoGain);
    lfoGain.connect(waveGain.gain);

    src.connect(lp);
    lp.connect(waveGain);
    waveGain.connect(master);

    src.start();
    lfo.start();
    mindCleanupFns.push(() => {
      src.stop();
      lfo.stop();
      src.disconnect();
      lfo.disconnect();
    });
  } else if (soundId === 'forest') {
    const breeze = ctx.createBufferSource();
    breeze.buffer = createNoiseBuffer(ctx, 4, true);
    breeze.loop = true;

    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.setValueAtTime(650, ctx.currentTime);
    bp.Q.setValueAtTime(0.9, ctx.currentTime);

    const breezeGain = ctx.createGain();
    breezeGain.gain.setValueAtTime(0.24, ctx.currentTime);

    breeze.connect(bp);
    bp.connect(breezeGain);
    breezeGain.connect(master);
    breeze.start();

    const pentatonic = [523.25, 587.33, 659.25, 783.99, 880.0];
    const playChime = () => {
      if (!mindMasterGain) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const env = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(
        pentatonic[Math.floor(Math.random() * pentatonic.length)],
        now
      );
      env.gain.setValueAtTime(0.001, now);
      env.gain.linearRampToValueAtTime(0.12, now + 0.06);
      env.gain.exponentialRampToValueAtTime(0.0008, now + 2.4);
      osc.connect(env);
      env.connect(master);
      osc.start(now);
      osc.stop(now + 2.5);
    };
    playChime();
    const chimeInterval = window.setInterval(playChime, 2900);

    mindCleanupFns.push(() => {
      window.clearInterval(chimeInterval);
      breeze.stop();
      breeze.disconnect();
    });
  } else if (soundId === 'bowl') {
    const ringBowl = () => {
      if (!mindMasterGain) return;
      const now = ctx.currentTime;
      const partials = [
        { freq: 216, amp: 0.25 },
        { freq: 432, amp: 0.16 },
        { freq: 648, amp: 0.08 },
      ];
      partials.forEach(({ freq, amp }) => {
        const osc = ctx.createOscillator();
        const env = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);
        env.gain.setValueAtTime(0.001, now);
        env.gain.linearRampToValueAtTime(amp, now + 0.25);
        env.gain.exponentialRampToValueAtTime(0.001, now + 6.5);
        osc.connect(env);
        env.connect(master);
        osc.start(now);
        osc.stop(now + 6.6);
      });
    };
    ringBowl();
    const bowlInterval = window.setInterval(ringBowl, 6200);
    mindCleanupFns.push(() => {
      window.clearInterval(bowlInterval);
    });
  } else if (soundId === 'focus432') {
    const padFreqs = [
      { freq: 108, amp: 0.22 },
      { freq: 216, amp: 0.16 },
      { freq: 324, amp: 0.1 },
      { freq: 432, amp: 0.08 },
    ];
    const oscs: OscillatorNode[] = [];
    padFreqs.forEach(({ freq, amp }) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      g.gain.setValueAtTime(amp, ctx.currentTime);
      osc.connect(g);
      g.connect(master);
      osc.start();
      oscs.push(osc);
    });
    mindCleanupFns.push(() => {
      oscs.forEach((o) => {
        o.stop();
        o.disconnect();
      });
    });
  } else if (soundId === 'fireplace') {
    const hearth = ctx.createBufferSource();
    hearth.buffer = createNoiseBuffer(ctx, 4, true);
    hearth.loop = true;

    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.setValueAtTime(340, ctx.currentTime);

    const hearthGain = ctx.createGain();
    hearthGain.gain.setValueAtTime(0.42, ctx.currentTime);

    hearth.connect(lp);
    lp.connect(hearthGain);
    hearthGain.connect(master);
    hearth.start();

    const crackleInterval = window.setInterval(() => {
      if (!mindMasterGain || Math.random() > 0.55) return;
      const now = ctx.currentTime;
      const pop = ctx.createBufferSource();
      pop.buffer = createNoiseBuffer(ctx, 0.05, false);
      const bp = ctx.createBiquadFilter();
      bp.type = 'bandpass';
      bp.frequency.setValueAtTime(1800 + Math.random() * 1400, now);
      const env = ctx.createGain();
      env.gain.setValueAtTime(0.001, now);
      env.gain.linearRampToValueAtTime(0.14, now + 0.005);
      env.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      pop.connect(bp);
      bp.connect(env);
      env.connect(master);
      pop.start(now);
      pop.stop(now + 0.045);
    }, 320);

    mindCleanupFns.push(() => {
      window.clearInterval(crackleInterval);
      hearth.stop();
      hearth.disconnect();
    });
  }
}


