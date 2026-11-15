import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowRight,
  Bell,
  BookOpen,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Pause,
  Pin,
  Play,
  RotateCw,
  Shuffle,
  Square,
  Volume2,
} from 'lucide-react';
import {
  AI_MASCOT_AVATAR,
  MIND_REFRESH_TRACKS,
  MOTIVATION_QUOTES_MUSLIM,
  MOTIVATION_QUOTES_OTHER,
  QURAN_DAILY_TRACKS,
} from '../data/elevoraData';
import { ElevoraState, ModuleId, WaqtKey } from '../types';
import {
  playManualAzan,
  playMindRefreshSound,
  stopHarmonicSound,
  stopManualAzan,
  stopMindRefreshSound,
} from '../utils/audio';
import { getNextWaqtCountdown } from '../utils/prayerTimes';

interface DashboardViewProps {
  state: ElevoraState;
  onNavigate: (module: ModuleId) => void;
  onToggleWaqt: (waqt: WaqtKey) => void;
  onLogQuranReflection: (minutes: number, surahId: string) => void;
  onToggleVocabMastered: (vocabId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  state,
  onNavigate,
  onToggleWaqt,
  onLogQuranReflection,
  onToggleVocabMastered,
}) => {
  const isMuslim = state.profile.faithMode === 'Muslim';
  const quotes = isMuslim ? MOTIVATION_QUOTES_MUSLIM : MOTIVATION_QUOTES_OTHER;
  const [quoteIdx, setQuoteIdx] = useState(0);
  const [now, setNow] = useState(() => new Date());

  // Daily 5-Min Quran (random each visit) / Mind Refresh 6-Soundscape State
  const [trackIndex, setTrackIndex] = useState(() => {
    const len = state.profile.faithMode === 'Muslim'
      ? QURAN_DAILY_TRACKS.length
      : MIND_REFRESH_TRACKS.length;
    return Math.floor(Math.random() * len);
  });
  const [activeSurahPartIdx, setActiveSurahPartIdx] = useState(0);
  const [expandAyats, setExpandAyats] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isPlayingManualAzan, setIsPlayingManualAzan] = useState(false);
  const [sessionSecondsLeft, setSessionSecondsLeft] = useState(300);
  const [audioStatusNote, setAudioStatusNote] = useState('');
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Flashcard State — prioritizes newly selected / learned items from Book Reader!
  const [vocabFilter, setVocabFilter] = useState<'pinned' | 'all'>('pinned');
  const [flashIdx, setFlashIdx] = useState(0);
  const [showBangla, setShowBangla] = useState(false);

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => {
      setQuoteIdx((prev) => (prev + 1) % quotes.length);
    }, 18000);
    return () => window.clearInterval(id);
  }, [quotes.length]);

  useEffect(() => {
    if (!isPlayingAudio) return;
    const id = window.setInterval(() => {
      setSessionSecondsLeft((prev) => {
        if (prev <= 1) {
          setIsPlayingAudio(false);
          if (audioRef.current) audioRef.current.pause();
          stopMindRefreshSound();
          stopHarmonicSound();
          const currentId = isMuslim
            ? QURAN_DAILY_TRACKS[trackIndex % QURAN_DAILY_TRACKS.length].id
            : MIND_REFRESH_TRACKS[trackIndex % MIND_REFRESH_TRACKS.length].id;
          onLogQuranReflection(5, currentId);
          setAudioStatusNote('5-minute daily session completed and logged.');
          return 300;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [isPlayingAudio, isMuslim, trackIndex, onLogQuranReflection]);

  useEffect(() => {
    return () => {
      if (audioRef.current) audioRef.current.pause();
      stopManualAzan();
      stopMindRefreshSound();
      stopHarmonicSound();
    };
  }, []);

  const handleToggleHomeAzan = () => {
    if (isPlayingManualAzan) {
      stopManualAzan();
      setIsPlayingManualAzan(false);
      return;
    }
    setIsPlayingManualAzan(true);
    playManualAzan(0.65, () => setIsPlayingManualAzan(false));
  };

  const nextPrayerInfo = useMemo(
    () => getNextWaqtCountdown(state.profile.district, now, state.profile.faithMode),
    [state.profile.district, now, state.profile.faithMode]
  );

  const syllabusStats = useMemo(() => {
    const relevant = state.syllabus.filter(
      (s) => s.stream === 'Both' || s.stream === state.profile.stream
    );
    const total = relevant.reduce((acc, s) => acc + s.chapters.length, 0);
    const done = relevant.reduce(
      (acc, s) => acc + s.chapters.filter((c) => c.completed).length,
      0
    );
    const pct = total > 0 ? Math.round((done / total) * 100) : 0;
    return { total, done, pct };
  }, [state.syllabus, state.profile.stream]);

  const focusTodayMin = useMemo(() => {
    const todayStr = new Date().toISOString().slice(0, 10);
    return state.focusSessions
      .filter((fs) => fs.completedAt.slice(0, 10) === todayStr)
      .reduce((acc, fs) => acc + fs.minutes, 0);
  }, [state.focusSessions]);

  const latestDet = state.detHistory.length
    ? state.detHistory[state.detHistory.length - 1].score
    : null;

  const waqtDoneCount = Object.values(state.salah.completed).filter(Boolean).length;

  const upcomingReminders = useMemo(() => {
    const todayMs = new Date().setHours(0, 0, 0, 0);
    return state.events
      .filter((e) => e.reminderActive)
      .map((e) => {
        const eventMs = new Date(e.date + 'T00:00:00').getTime();
        const daysLeft = Math.ceil((eventMs - todayMs) / 86400000);
        return { ...e, daysLeft };
      })
      .filter((e) => e.daysLeft >= 0)
      .sort((a, b) => a.daysLeft - b.daysLeft)
      .slice(0, 3);
  }, [state.events]);

  const currentQuranTrack = QURAN_DAILY_TRACKS[trackIndex % QURAN_DAILY_TRACKS.length];
  const currentMindTrack = MIND_REFRESH_TRACKS[trackIndex % MIND_REFRESH_TRACKS.length];
  const currentSurahPart =
    currentQuranTrack.surahs[activeSurahPartIdx % currentQuranTrack.surahs.length] ||
    currentQuranTrack.surahs[0];

  const playSurahAudioUrl = (url: string) => {
    if (!audioRef.current) {
      audioRef.current = new Audio(url);
    } else if (audioRef.current.src !== url) {
      audioRef.current.src = url;
    }
    audioRef.current.play().catch(() => {
      setAudioStatusNote('5-min recitation timer active — read Arabic, বাংলা উচ্চারণ & অর্থ below.');
    });
  };

  // Auto-advance between paired Surahs (2 Surahs) & loop cleanly within the 5-minute session
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.onended = () => {
      if (!isPlayingAudio || !isMuslim) return;
      const totalParts = currentQuranTrack.surahs.length;
      const nextPartIdx = (activeSurahPartIdx + 1) % totalParts;
      setActiveSurahPartIdx(nextPartIdx);
      const nextPart = currentQuranTrack.surahs[nextPartIdx];
      audio.src = nextPart.audioUrl;
      audio.play().catch(() => {
        setAudioStatusNote(`Continuing 5-min session: ${nextPart.surahName}`);
      });
    };
    return () => {
      audio.onended = null;
    };
  }, [isPlayingAudio, isMuslim, activeSurahPartIdx, currentQuranTrack]);

  const handleToggleAudio = () => {
    if (isPlayingAudio) {
      setIsPlayingAudio(false);
      if (audioRef.current) audioRef.current.pause();
      stopMindRefreshSound();
      stopHarmonicSound();
      setAudioStatusNote('Paused. Resume anytime to complete your 5-minute session.');
      return;
    }

    setAudioStatusNote('');
    setIsPlayingAudio(true);

    if (isMuslim) {
      playSurahAudioUrl(currentSurahPart.audioUrl);
    } else {
      playMindRefreshSound(currentMindTrack.soundId, 0.55);
      setAudioStatusNote(`Playing "${currentMindTrack.title}" with 5-minute reset timer.`);
    }
  };

  const handleSwitchSurahPart = (partIdx: number) => {
    setActiveSurahPartIdx(partIdx);
    const nextPart = currentQuranTrack.surahs[partIdx % currentQuranTrack.surahs.length];
    if (isPlayingAudio && isMuslim) {
      playSurahAudioUrl(nextPart.audioUrl);
    }
  };

  const handleSwitchTrack = (nextIdx: number, autoStart = false) => {
    if (audioRef.current) audioRef.current.pause();
    stopMindRefreshSound();
    stopHarmonicSound();
    setSessionSecondsLeft(300);
    setActiveSurahPartIdx(0);
    setTrackIndex(nextIdx);

    if (autoStart) {
      setIsPlayingAudio(true);
      if (isMuslim) {
        const nextQuran = QURAN_DAILY_TRACKS[nextIdx % QURAN_DAILY_TRACKS.length];
        playSurahAudioUrl(nextQuran.surahs[0].audioUrl);
      } else {
        const nextMind = MIND_REFRESH_TRACKS[nextIdx % MIND_REFRESH_TRACKS.length];
        playMindRefreshSound(nextMind.soundId, 0.55);
        setAudioStatusNote(`Playing "${nextMind.title}".`);
      }
    } else {
      setIsPlayingAudio(false);
      setAudioStatusNote('');
    }
  };

  const handleRandomTrack = () => {
    const len = isMuslim ? QURAN_DAILY_TRACKS.length : MIND_REFRESH_TRACKS.length;
    if (len <= 1) return;
    let pick = Math.floor(Math.random() * len);
    if (pick === trackIndex % len) {
      pick = (pick + 1) % len;
    }
    handleSwitchTrack(pick, isPlayingAudio);
  };

  // Prioritize newly selected / pinned words from Book Reader on Home Page
  const pinnedWords = useMemo(
    () => state.vocabVault.filter((v) => v.pinnedForHome),
    [state.vocabVault]
  );

  const vocabPool =
    vocabFilter === 'pinned' && pinnedWords.length > 0 ? pinnedWords : state.vocabVault;
  const activeCard = vocabPool[flashIdx % Math.max(1, vocabPool.length)];

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Active Synced Event Reminders Banner */}
      {upcomingReminders.length > 0 && (
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 px-5 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start sm:items-center gap-3">
            <Bell className="w-4 h-4 text-amber-400 shrink-0 mt-0.5 sm:mt-0" />
            <div className="text-sm text-zinc-200">
              <span className="font-semibold text-amber-300">Upcoming Reminder:</span>{' '}
              {upcomingReminders[0].title}{' '}
              <span className="text-zinc-400 font-mono-num">
                ·{' '}
                {upcomingReminders[0].daysLeft === 0
                  ? 'Today'
                  : `In ${upcomingReminders[0].daysLeft} day${upcomingReminders[0].daysLeft === 1 ? '' : 's'}`}
                {upcomingReminders.length > 1 ? ` (+${upcomingReminders.length - 1} more)` : ''}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('eca')}
            className="text-xs font-medium text-amber-300 hover:text-amber-200 flex items-center gap-1 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <span>Manage Events</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Cycling Daily Motivation Banner with Cute AI Mentor Badge */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="relative overflow-hidden rounded-2xl border border-blue-500/20 bg-gradient-to-br from-zinc-900/95 via-zinc-900/80 to-blue-950/35 p-6 sm:p-8 shadow-lg shadow-blue-950/10"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4 max-w-3xl">
            <img
              src={AI_MASCOT_AVATAR}
              alt="AI Mentor"
              className="w-12 h-12 rounded-xl object-cover border border-blue-500/40 shrink-0 hidden sm:block"
            />
            <div className="space-y-2">
              <div className="text-xs font-medium text-blue-400">
                Daily Mentorship · {state.profile.hscYear} {state.profile.stream} ·{' '}
                {state.profile.district}
              </div>
              <h1 className="font-display text-xl sm:text-2xl font-bold text-zinc-50 leading-snug text-balance">
                “{quotes[quoteIdx]}”
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-start md:self-center">
            <button
              type="button"
              onClick={() => setQuoteIdx((prev) => (prev - 1 + quotes.length) % quotes.length)}
              className="p-2 rounded-xl border border-zinc-800 bg-zinc-950/80 text-zinc-300 hover:text-zinc-50 hover:border-zinc-700 transition-colors cursor-pointer"
              aria-label="Previous motivation quote"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setQuoteIdx((prev) => (prev + 1) % quotes.length)}
              className="p-2 rounded-xl border border-zinc-800 bg-zinc-950/80 text-zinc-300 hover:text-zinc-50 hover:border-zinc-700 transition-colors cursor-pointer"
              aria-label="Next motivation quote"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.section>

      {/* Quick Academic & Progress Counters */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          type="button"
          onClick={() => onNavigate('syllabus')}
          className="text-left rounded-2xl border border-zinc-800/80 bg-zinc-900/60 hover:border-zinc-700 p-5 transition-colors cursor-pointer"
        >
          <div className="text-xs text-zinc-400">HSC {state.profile.stream} Syllabus</div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="font-mono-num text-2xl font-bold text-zinc-50">
              {syllabusStats.pct}%
            </span>
            <span className="font-mono-num text-xs text-blue-400">
              {syllabusStats.done}/{syllabusStats.total} ch
            </span>
          </div>
          <div className="mt-3 h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full transition-all"
              style={{ width: `${syllabusStats.pct}%` }}
            />
          </div>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('focus')}
          className="text-left rounded-2xl border border-zinc-800/80 bg-zinc-900/60 hover:border-zinc-700 p-5 transition-colors cursor-pointer"
        >
          <div className="text-xs text-zinc-400">Focus Time Today</div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="font-mono-num text-2xl font-bold text-zinc-50">
              {focusTodayMin}m
            </span>
            <span className="font-mono-num text-xs text-indigo-400">
              {state.focusSessions.length} total logs
            </span>
          </div>
          <div className="mt-3 text-xs text-zinc-500">Pomodoro Studio ready</div>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('det')}
          className="text-left rounded-2xl border border-zinc-800/80 bg-zinc-900/60 hover:border-zinc-700 p-5 transition-colors cursor-pointer"
        >
          <div className="text-xs text-zinc-400">DET Latest Score</div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="font-mono-num text-2xl font-bold text-zinc-50">
              {latestDet ?? '—'}
            </span>
            <span className="font-mono-num text-xs text-zinc-400">/ 160 scale</span>
          </div>
          <div className="mt-3 text-xs text-zinc-500">4 practice modules active</div>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('books')}
          className="text-left rounded-2xl border border-zinc-800/80 bg-zinc-900/60 hover:border-zinc-700 p-5 transition-colors cursor-pointer"
        >
          <div className="text-xs text-zinc-400">Chapters &amp; Daily Words</div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="font-mono-num text-2xl font-bold text-zinc-50">
              {state.completedChapterIds.length}
            </span>
            <span className="font-mono-num text-xs text-blue-400">
              {pinnedWords.length} pinned today
            </span>
          </div>
          <div className="mt-3 text-xs text-zinc-500">Bilingual reader active</div>
        </button>
      </section>

      {/* Main Two-Column Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left 7 cols: Live Next Prayer / Break + 5-Min Audio / Mind Refresh Player */}
        <div className="xl:col-span-7 space-y-6">
          <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="text-xs text-zinc-400">
                  {isMuslim ? 'Next Salah Countdown' : 'Next Mind Refresh Break'} ·{' '}
                  {state.profile.district}
                </div>
                <div className="mt-1 flex items-baseline gap-3">
                  <h2 className="font-display text-xl font-bold text-zinc-50">
                    {nextPrayerInfo.nextName}
                  </h2>
                  <span className="font-mono-num text-sm text-blue-400">
                    at {nextPrayerInfo.nextDisplayTime}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <div className="font-mono-num text-2xl sm:text-3xl font-bold text-zinc-50 tracking-tight">
                  {nextPrayerInfo.countdownFormatted}
                </div>
                <div className="font-mono-num text-xs text-zinc-400">
                  {waqtDoneCount}/5 {isMuslim ? 'waqt prayed today' : 'breaks completed'}
                </div>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-zinc-800/70 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                {nextPrayerInfo.schedule.map((item) => {
                  const done = state.salah.completed[item.key];
                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => onToggleWaqt(item.key)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                        done
                          ? 'bg-blue-500/15 border-blue-500/40 text-blue-300'
                          : 'bg-zinc-950/70 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      {done && <Check className="w-3 h-3" />}
                      <span>{isMuslim ? item.label : item.altLabel.split(' ')[0]}</span>
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center gap-3 shrink-0">
                {isMuslim && (
                  <button
                    type="button"
                    onClick={handleToggleHomeAzan}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border flex items-center gap-1.5 cursor-pointer whitespace-nowrap transition-colors ${
                      isPlayingManualAzan
                        ? 'bg-red-500/15 border-red-500/40 text-red-300'
                        : 'bg-blue-500/15 border-blue-500/40 text-blue-300 hover:bg-blue-500/25'
                    }`}
                  >
                    {isPlayingManualAzan ? (
                      <>
                        <Square className="w-3 h-3" />
                        <span>Stop Azan</span>
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
                  onClick={() => onNavigate('salah')}
                  className="text-xs font-medium text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer whitespace-nowrap"
                >
                  <span>Open Tracker</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Daily 5-Min Random Quran Player OR 6-Soundscape Mind Refresh Player */}
          <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <div className="text-xs text-blue-400 font-medium flex flex-wrap items-center gap-2">
                  <span>
                    {isMuslim
                      ? `Random 5-Min Quran (${(trackIndex % QURAN_DAILY_TRACKS.length) + 1}/${QURAN_DAILY_TRACKS.length}) · Mishary Alafasy`
                      : currentMindTrack.category}
                  </span>
                  {isMuslim && currentQuranTrack.isPairedShortSurah && (
                    <span className="px-2 py-0.5 rounded-md bg-blue-500/15 border border-blue-500/30 text-[11px] text-blue-300">
                      2 Short Surahs Paired
                    </span>
                  )}
                </div>
                <h2 className="font-display text-lg font-semibold text-zinc-50 mt-0.5">
                  {isMuslim ? currentQuranTrack.surahName : currentMindTrack.title}
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-mono-num text-xs text-zinc-400">
                  Today: {state.salah.quranMinutesCompletedToday} min
                </span>
                <button
                  type="button"
                  onClick={handleRandomTrack}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-zinc-950 border border-zinc-800 hover:border-blue-500/40 text-blue-300 hover:text-blue-200 flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
                >
                  <Shuffle className="w-3 h-3" />
                  <span>{isMuslim ? 'Random Surah' : 'Random Sound'}</span>
                </button>
              </div>
            </div>

            {/* Paired Short Surahs Tabs (when 2 Surahs are paired in a 5-min session) */}
            {isMuslim && (
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div className="flex flex-wrap items-center gap-1.5">
                  {currentQuranTrack.surahs.map((part, pIdx) => {
                    const isPartActive = pIdx === activeSurahPartIdx % currentQuranTrack.surahs.length;
                    return (
                      <button
                        key={part.surahNumber}
                        type="button"
                        onClick={() => handleSwitchSurahPart(pIdx)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer whitespace-nowrap ${
                          isPartActive
                            ? 'bg-blue-500 border-blue-500 text-white'
                            : 'bg-zinc-950/80 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                        }`}
                      >
                        {currentQuranTrack.surahs.length > 1 ? `${pIdx + 1}. ` : ''}
                        {part.banglaName}
                      </button>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={() => setExpandAyats((prev) => !prev)}
                  className="text-xs font-medium text-blue-400 hover:text-blue-300 cursor-pointer whitespace-nowrap"
                >
                  {expandAyats ? 'Compact Ayats' : `View All ${currentSurahPart.ayahs.length} Ayats`}
                </button>
              </div>
            )}

            {/* For Mind Refresh mode, quick 6-Soundscape Selector directly on Home */}
            {!isMuslim && (
              <div className="flex flex-wrap gap-1.5 mb-4">
                {MIND_REFRESH_TRACKS.map((tr, idx) => {
                  const active = idx === trackIndex % MIND_REFRESH_TRACKS.length;
                  const shortLabels: Record<string, string> = {
                    rain: 'Rain',
                    ocean: 'Ocean Waves',
                    forest: 'Forest Chimes',
                    bowl: 'Singing Bowl',
                    focus432: '432Hz Focus',
                    fireplace: 'Fireplace',
                  };
                  return (
                    <button
                      key={tr.id}
                      type="button"
                      onClick={() => handleSwitchTrack(idx, true)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors cursor-pointer whitespace-nowrap ${
                        active
                          ? 'bg-indigo-500 border-indigo-500 text-white'
                          : 'bg-zinc-950/70 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      {shortLabels[tr.soundId] || tr.title}
                    </button>
                  );
                })}
              </div>
            )}

            {isMuslim ? (
              <div className="space-y-2.5">
                <div className="rounded-xl bg-blue-500/5 border border-blue-500/20 px-4 py-2.5 flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs text-zinc-300">
                    {currentQuranTrack.reflectionBangla}
                  </span>
                  <span className="text-xs font-semibold text-blue-300" dir="rtl">
                    {currentSurahPart.arabicTitle}
                  </span>
                </div>

                <div
                  className={`space-y-2.5 overflow-y-auto pr-1 ${
                    expandAyats ? 'max-h-[520px]' : 'max-h-[290px]'
                  }`}
                >
                  {currentSurahPart.ayahs.map((ayah) => (
                    <div
                      key={`${currentSurahPart.surahNumber}-${ayah.ayahNumber}`}
                      className="rounded-xl bg-zinc-950/85 border border-zinc-800/80 p-3.5 space-y-2"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <span className="px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 font-mono-num text-[11px] text-blue-300 shrink-0">
                          আয়াত {ayah.ayahNumber}
                        </span>
                        <p
                          className="text-right font-semibold text-base sm:text-lg text-blue-200 leading-loose"
                          dir="rtl"
                        >
                          {ayah.arabic}
                        </p>
                      </div>
                      <p className="text-xs text-sky-300 leading-relaxed">
                        <span className="font-semibold text-sky-400">উচ্চারণ:</span>{' '}
                        {ayah.banglaPronunciation}
                      </p>
                      <p className="text-xs text-zinc-300 leading-relaxed">
                        <span className="font-semibold text-zinc-200">অর্থ:</span>{' '}
                        {ayah.banglaMeaning}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="rounded-xl bg-zinc-950/80 border border-zinc-800/70 p-4 space-y-2.5">
                <p className="font-display font-semibold text-base text-indigo-300">
                  {currentMindTrack.promptHeadline}
                </p>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  {currentMindTrack.englishGuide}
                </p>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  {currentMindTrack.banglaGuide}
                </p>
              </div>
            )}

            <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleToggleAudio}
                  className="px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-400 text-white font-semibold text-xs flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap"
                >
                  {isPlayingAudio ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>
                    {isPlayingAudio
                      ? 'Pause 5-Min Session'
                      : isMuslim
                        ? 'Start 5-Min Recitation'
                        : 'Start 5-Min Mind Refresh'}
                  </span>
                </button>
                <div className="flex items-center gap-1.5 font-mono-num text-sm text-zinc-200">
                  <Clock className="w-3.5 h-3.5 text-zinc-500" />
                  <span>{formatTimer(sessionSecondsLeft)}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  const id = isMuslim ? currentQuranTrack.id : currentMindTrack.id;
                  onLogQuranReflection(5, id);
                  setAudioStatusNote('5 minutes marked complete for today.');
                }}
                className="px-3 py-2 rounded-xl border border-zinc-800 bg-zinc-950/70 hover:bg-zinc-800 text-xs font-medium text-zinc-300 transition-colors cursor-pointer whitespace-nowrap"
              >
                Mark 5-Min Done
              </button>
            </div>

            {audioStatusNote && (
              <div className="mt-3 flex items-center gap-2 text-xs text-blue-400">
                <Volume2 className="w-3.5 h-3.5 shrink-0" />
                <span>{audioStatusNote}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right 5 cols: Daily Selected & Book Vocabulary Flashcard */}
        <div className="xl:col-span-5 flex flex-col justify-between rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-6 space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-2">
              <div>
                <div className="text-xs text-indigo-400 font-medium flex items-center gap-1.5">
                  <Pin className="w-3.5 h-3.5" />
                  <span>New Learnings &amp; Words · Synced From Books</span>
                </div>
                <h2 className="font-display text-lg font-semibold text-zinc-50 mt-0.5">
                  Daily Study Flashcards
                </h2>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('books')}
                className="text-xs text-zinc-400 hover:text-zinc-200 flex items-center gap-1 cursor-pointer whitespace-nowrap"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Add Flashcard</span>
              </button>
            </div>

            {/* Filter between Today's Selected Words & All Vault */}
            <div className="flex items-center gap-1 p-1 bg-zinc-950 border border-zinc-800 rounded-xl w-fit">
              <button
                type="button"
                onClick={() => {
                  setVocabFilter('pinned');
                  setFlashIdx(0);
                }}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  vocabFilter === 'pinned'
                    ? 'bg-blue-500 text-white font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Selected for Daily Home ({pinnedWords.length})
              </button>
              <button
                type="button"
                onClick={() => {
                  setVocabFilter('all');
                  setFlashIdx(0);
                }}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  vocabFilter === 'all'
                    ? 'bg-indigo-500 text-white font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                All Vault ({state.vocabVault.length})
              </button>
            </div>

            {activeCard ? (
              <div
                onClick={() => setShowBangla((prev) => !prev)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setShowBangla((prev) => !prev);
                  }
                }}
                className="min-h-[210px] rounded-xl border border-zinc-800 bg-zinc-950/85 p-6 flex flex-col justify-between cursor-pointer hover:border-indigo-500/50 transition-colors"
              >
                <div className="flex items-center justify-between text-xs text-zinc-500">
                  <span>
                    {activeCard.sourceBook} · {activeCard.partOfSpeech}
                  </span>
                  <span>{showBangla ? 'Bangla Meaning' : 'Tap card to flip'}</span>
                </div>

                <div className="my-5">
                  <div className="font-display text-2xl sm:text-3xl font-bold text-zinc-50">
                    {activeCard.word}
                  </div>
                  {showBangla ? (
                    <div className="mt-3 space-y-2">
                      <div className="text-lg font-semibold text-blue-400">
                        {activeCard.banglaMeaning}
                      </div>
                      <p className="text-xs text-zinc-400 leading-relaxed">
                        {activeCard.englishDef}
                      </p>
                    </div>
                  ) : (
                    <div className="mt-3 space-y-2">
                      <p className="text-sm text-zinc-300 leading-relaxed">
                        {activeCard.englishDef}
                      </p>
                      <p className="text-xs text-zinc-500 italic">
                        “{activeCard.exampleSentence}”
                      </p>
                    </div>
                  )}
                </div>

                <div className="text-xs text-zinc-500">
                  Card {(flashIdx % vocabPool.length) + 1} of {vocabPool.length} ·{' '}
                  {activeCard.mastered ? 'Mastered' : 'In Daily Review'}
                </div>
              </div>
            ) : null}
          </div>

          {activeCard && (
            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => onToggleVocabMastered(activeCard.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-medium border transition-colors cursor-pointer whitespace-nowrap ${
                  activeCard.mastered
                    ? 'bg-blue-500/15 border-blue-500/40 text-blue-300'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                }`}
              >
                {activeCard.mastered ? 'Mastered ✓' : 'Mark Mastered'}
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowBangla((prev) => !prev)}
                  className="px-3.5 py-2 rounded-xl text-xs font-medium bg-zinc-950 border border-zinc-800 text-zinc-300 hover:text-zinc-50 transition-colors cursor-pointer whitespace-nowrap"
                >
                  {showBangla ? 'Show English' : 'বাংলা অর্থ'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowBangla(false);
                    setFlashIdx((prev) => (prev + 1) % vocabPool.length);
                  }}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-indigo-500 hover:bg-indigo-400 text-white flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>Next Word</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
