import React, { useEffect, useMemo, useState } from 'react';
import { Bell, BellOff, Check, Flame, MapPin, Play, Square, Volume2 } from 'lucide-react';
import { MIND_REFRESH_TRACKS } from '../data/elevoraData';
import { ElevoraState, WaqtKey } from '../types';
import {
  MindSoundscapeId,
  playManualAzan,
  playMindRefreshSound,
  setManualAzanVolume,
  setMindRefreshVolume,
  stopHarmonicSound,
  stopManualAzan,
  stopMindRefreshSound,
} from '../utils/audio';
import { BANGLADESH_DISTRICTS, getNextWaqtCountdown } from '../utils/prayerTimes';

interface SalahViewProps {
  state: ElevoraState;
  onToggleWaqt: (waqt: WaqtKey) => void;
  onToggleAzan: (waqt: WaqtKey) => void;
  onChangeDistrict: (district: string) => void;
}

export const SalahView: React.FC<SalahViewProps> = ({
  state,
  onToggleWaqt,
  onToggleAzan,
  onChangeDistrict,
}) => {
  const isMuslim = state.profile.faithMode === 'Muslim';
  const [now, setNow] = useState(() => new Date());
  const [isPlayingAzan, setIsPlayingAzan] = useState(false);
  const [azanWaqtLabel, setAzanWaqtLabel] = useState<string>('');
  const [azanStatus, setAzanStatus] = useState<string>('');
  const [selectedSoundId, setSelectedSoundId] = useState<MindSoundscapeId>('rain');
  const [volume, setVolume] = useState(0.65);

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => {
      window.clearInterval(id);
      stopManualAzan();
      stopMindRefreshSound();
      stopHarmonicSound();
    };
  }, []);

  const info = useMemo(
    () => getNextWaqtCountdown(state.profile.district, now, state.profile.faithMode),
    [state.profile.district, now, state.profile.faithMode]
  );

  const completedCount = Object.values(state.salah.completed).filter(Boolean).length;

  const handleTogglePlayAzan = (waqtName?: string) => {
    if (isPlayingAzan && (!waqtName || waqtName === azanWaqtLabel)) {
      stopManualAzan();
      stopMindRefreshSound();
      setIsPlayingAzan(false);
      setAzanWaqtLabel('');
      setAzanStatus(isMuslim ? 'Azan stopped.' : 'Soundscape paused.');
      return;
    }

    if (isMuslim) {
      setIsPlayingAzan(true);
      setAzanWaqtLabel(waqtName || 'Full Azan');
      setAzanStatus('Loading Azan audio...');
      playManualAzan(
        volume,
        () => {
          setIsPlayingAzan(false);
          setAzanWaqtLabel('');
          setAzanStatus('Azan recitation completed.');
        },
        (msg) => setAzanStatus(msg)
      );
    } else {
      const chosen =
        MIND_REFRESH_TRACKS.find((t) => t.soundId === selectedSoundId) ||
        MIND_REFRESH_TRACKS[0];
      setIsPlayingAzan(true);
      setAzanWaqtLabel(chosen.title);
      setAzanStatus(`Playing: ${chosen.title}`);
      playMindRefreshSound(selectedSoundId, volume);
    }
  };

  const handleSelectSoundscape = (soundId: MindSoundscapeId, title: string) => {
    setSelectedSoundId(soundId);
    setIsPlayingAzan(true);
    setAzanWaqtLabel(title);
    setAzanStatus(`Playing: ${title}`);
    playMindRefreshSound(soundId, volume);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-zinc-50">
            {isMuslim ? 'Salah & Azan Tracker' : 'Mind Refresh & Daily Reset Breaks'}
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            {isMuslim
              ? 'Synchronized Bangladesh district waqt times, individual Azan toggles, and manual Play Azan anytime.'
              : 'Universal 5-checkpoint daily brain refresh schedule (hydration, screen breaks, breathwork) synced to your local daylight.'}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <MapPin className="w-4 h-4 text-blue-400 shrink-0" />
          <select
            value={state.profile.district}
            onChange={(e) => onChangeDistrict(e.target.value)}
            className="px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-zinc-100 focus:outline-none focus:border-blue-500"
          >
            {BANGLADESH_DISTRICTS.map((d) => (
              <option key={d.name} value={d.name}>
                {d.name} (
                {d.offsetMinutes === 0
                  ? 'Dhaka Base'
                  : `${d.offsetMinutes > 0 ? '+' : ''}${d.offsetMinutes}m`}
                )
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-5">
          <div className="text-xs text-zinc-400">
            {isMuslim ? 'Next Prayer' : 'Next Refresh Break'} · {info.nextName}
          </div>
          <div className="mt-2 font-mono-num text-3xl font-bold text-blue-400">
            {info.countdownFormatted}
          </div>
          <div className="mt-1 font-mono-num text-xs text-zinc-500">
            Scheduled at {info.nextDisplayTime}
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-5">
          <div className="text-xs text-zinc-400">
            {isMuslim ? 'Daily Waqt Completed' : 'Daily Mind Resets Completed'}
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-mono-num text-3xl font-bold text-zinc-50">
              {completedCount}/5
            </span>
            <span className="text-xs text-zinc-400">
              {completedCount === 5 ? 'Full day complete' : `${5 - completedCount} remaining`}
            </span>
          </div>
          <div className="mt-3 h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all"
              style={{ width: `${(completedCount / 5) * 100}%` }}
            />
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-5">
          <div className="text-xs text-zinc-400">Consistency Streak</div>
          <div className="mt-2 flex items-center gap-2">
            <Flame className="w-6 h-6 text-amber-400" />
            <span className="font-mono-num text-3xl font-bold text-zinc-50">
              {state.salah.streakDays} days
            </span>
          </div>
          <div className="mt-1 text-xs text-zinc-500">Auto-tracked across daily resets</div>
        </div>
      </div>

      {/* Play Azan Anytime OR 6-Soundscape Mind Refresh Studio */}
      <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-6 space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1">
            <h2 className="font-display text-base font-semibold text-zinc-100">
              {isMuslim
                ? 'Manual Azan Player (Play Anytime On Demand)'
                : '6-Soundscape Mind Refresh Studio'}
            </h2>
            <p className="text-xs text-zinc-400">
              {azanStatus
                ? azanStatus
                : isMuslim
                  ? 'Press Play Azan anytime you want to listen to the call to prayer—even outside automatic waqt alerts.'
                  : 'Choose from Rain, Ocean Waves, Forest Chimes, Singing Bowl, 432Hz Pad, or Warm Fireplace anytime you need calm focus.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2.5">
              <Volume2 className="w-4 h-4 text-zinc-400" />
              <label htmlFor="azan-vol" className="text-xs text-zinc-400 whitespace-nowrap">
                Volume: <span className="font-mono-num text-zinc-200">{Math.round(volume * 100)}%</span>
              </label>
              <input
                id="azan-vol"
                type="range"
                min={0.1}
                max={1}
                step={0.05}
                value={volume}
                onChange={(e) => {
                  const next = parseFloat(e.target.value);
                  setVolume(next);
                  setManualAzanVolume(next);
                  setMindRefreshVolume(next);
                }}
                className="w-24 accent-blue-500"
              />
            </div>

            <button
              type="button"
              onClick={() => handleTogglePlayAzan(isMuslim ? 'Full Azan' : undefined)}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap ${
                isPlayingAzan
                  ? 'bg-red-500/20 border border-red-500/40 text-red-300 hover:bg-red-500/30'
                  : 'bg-blue-500 hover:bg-blue-400 text-white'
              }`}
            >
              {isPlayingAzan ? (
                <>
                  <Square className="w-3.5 h-3.5" />
                  <span>{isMuslim ? `Stop Azan (${azanWaqtLabel})` : 'Stop Sound'}</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" />
                  <span>{isMuslim ? 'Play Azan Now' : 'Play Selected Sound'}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {!isMuslim && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-4 border-t border-zinc-800/70">
            {MIND_REFRESH_TRACKS.map((track) => {
              const active = selectedSoundId === track.soundId && isPlayingAzan;
              const selected = selectedSoundId === track.soundId;
              return (
                <button
                  key={track.id}
                  type="button"
                  onClick={() => handleSelectSoundscape(track.soundId, track.title)}
                  className={`text-left p-3.5 rounded-xl border transition-colors cursor-pointer ${
                    active
                      ? 'border-blue-500 bg-blue-500/15'
                      : selected
                        ? 'border-indigo-500/50 bg-indigo-500/10'
                        : 'border-zinc-800 bg-zinc-950/60 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-zinc-100">{track.title}</span>
                    <Play className={`w-3.5 h-3.5 shrink-0 ${active ? 'text-blue-400' : 'text-zinc-500'}`} />
                  </div>
                  <div className="text-xs text-zinc-400 mt-1">{track.category}</div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 5 Checkpoints Schedule List */}
      <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 divide-y divide-zinc-800/70">
        {info.schedule.map((item) => {
          const isPrayed = state.salah.completed[item.key];
          const azanOn = state.salah.azanEnabled[item.key];
          const isNext = info.nextKey === item.key;
          const isThisRowPlaying = isPlayingAzan && azanWaqtLabel === item.label;

          return (
            <div
              key={item.key}
              className={`p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
                isNext ? 'bg-blue-500/5' : ''
              }`}
            >
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => onToggleWaqt(item.key)}
                  className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
                    isPrayed
                      ? 'bg-blue-500 border-blue-500 text-white'
                      : 'bg-zinc-950 border-zinc-700 text-transparent hover:border-blue-500/60'
                  }`}
                  aria-label={`Mark ${item.label} complete`}
                >
                  <Check className="w-4 h-4" />
                </button>

                <div>
                  <div className="flex items-center gap-2.5">
                    <span className="font-display text-base font-semibold text-zinc-100">
                      {isMuslim ? item.label : item.altLabel}
                    </span>
                    {isNext && (
                      <span className="text-xs font-medium text-blue-400">· Next Up</span>
                    )}
                  </div>
                  <div className="text-xs text-zinc-500 mt-0.5">
                    {isPrayed
                      ? isMuslim
                        ? 'Prayed on record today'
                        : 'Refresh break completed today'
                      : 'Pending for today'}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between sm:justify-end gap-3">
                <span className="font-mono-num text-base font-semibold text-zinc-200 mr-2">
                  {item.displayTime}
                </span>

                {isMuslim && (
                  <button
                    type="button"
                    onClick={() => handleTogglePlayAzan(item.label)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                      isThisRowPlaying
                        ? 'bg-red-500/15 border-red-500/40 text-red-300'
                        : 'bg-zinc-950 border-zinc-800 text-blue-300 hover:border-blue-500/50'
                    }`}
                  >
                    {isThisRowPlaying ? (
                      <>
                        <Square className="w-3 h-3" />
                        <span>Stop</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3 h-3" />
                        <span>Play Azan</span>
                      </>
                    )}
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => onToggleAzan(item.key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                    azanOn
                      ? 'bg-indigo-500/15 border-indigo-500/35 text-indigo-300'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  {azanOn ? (
                    <Bell className="w-3.5 h-3.5" />
                  ) : (
                    <BellOff className="w-3.5 h-3.5" />
                  )}
                  <span>
                    {isMuslim
                      ? azanOn
                        ? 'Azan On'
                        : 'Azan Off'
                      : azanOn
                        ? 'Break Alert On'
                        : 'Alert Off'}
                  </span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
