import React, { useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { motion } from 'motion/react';
import {
  ArrowDown,
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  Compass,
  FileText,
  FlaskConical,
  GraduationCap,
  Heart,
  Languages,
  Layers,
  Lock,
  LogOut,
  MapPin,
  MessageSquarePlus,
  Mic,
  Moon,
  ShieldCheck,
  Sparkles,
  Star,
  Timer,
  Trash2,
  Volume2,
  Wind,
} from 'lucide-react';
import { AI_MASCOT_AVATAR } from '../data/elevoraData';
import { FaithMode, HscStream, HscYear, StudentProfile, StudentReview } from '../types';
import { BANGLADESH_DISTRICTS } from '../utils/prayerTimes';

interface OnboardingViewProps {
  initialProfile: StudentProfile;
  authUser: User | null;
  authError: string;
  reviews: StudentReview[];
  reviewsLoading: boolean;
  onGoogleSignIn: () => Promise<void>;
  onSignOut: () => Promise<void>;
  onSubmitReview: (params: {
    authorName: string;
    hscContext: string;
    rating: number;
    comment: string;
  }) => Promise<void>;
  onDeleteReview: (reviewId: string) => Promise<void>;
  onComplete: (profile: Partial<StudentProfile>) => Promise<void> | void;
}

const HERO_QUOTES = [
  '“Finish Page 1, Page 2, then the entire book — and turn every new idea into a daily flashcard!”',
  '“Practice real DET speaking & writing with AI grading right from your browser microphone.”',
  '“Every focus task asks for 1 honest line of proof — zero fake ticking, real HSC progress.”',
];

export const OnboardingView: React.FC<OnboardingViewProps> = ({
  initialProfile,
  authUser,
  authError,
  reviews,
  reviewsLoading,
  onGoogleSignIn,
  onSignOut,
  onSubmitReview,
  onDeleteReview,
  onComplete,
}) => {
  const [name, setName] = useState(initialProfile.name || '');
  const [hscYear, setHscYear] = useState<HscYear>(initialProfile.hscYear || 'HSC 2nd Year');
  const [stream, setStream] = useState<HscStream>(initialProfile.stream || 'Science');
  const [district, setDistrict] = useState(initialProfile.district || 'Dhaka');
  const [faithMode, setFaithMode] = useState<FaithMode>(initialProfile.faithMode || 'Muslim');
  const [error, setError] = useState('');
  const [signingIn, setSigningIn] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [heroTipIdx, setHeroTipIdx] = useState(0);

  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [deletingReviewId, setDeletingReviewId] = useState<string | null>(null);
  const [founderLang, setFounderLang] = useState<'en' | 'bn'>('en');

  useEffect(() => {
    setName(initialProfile.name || authUser?.displayName || '');
    setHscYear(initialProfile.hscYear || 'HSC 2nd Year');
    setStream(initialProfile.stream || 'Science');
    setDistrict(initialProfile.district || 'Dhaka');
    setFaithMode(initialProfile.faithMode || 'Muslim');
  }, [authUser?.uid, initialProfile]);

  useEffect(() => {
    const id = window.setInterval(() => {
      setHeroTipIdx((prev) => (prev + 1) % HERO_QUOTES.length);
    }, 4500);
    return () => window.clearInterval(id);
  }, []);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleGoogleLogin = async () => {
    setSigningIn(true);
    setError('');
    try {
      await onGoogleSignIn();
    } finally {
      setSigningIn(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError('Please enter your name so Professor Mochi can personalize Elevora.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      await onComplete({
        name: trimmed,
        hscYear,
        stream,
        district,
        faithMode,
        email: initialProfile.email || authUser?.email || '',
        onboarded: true,
      });
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : 'Failed to save your personalized workspace.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleInlineReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setReviewError('');
    setReviewSuccess(false);
    setReviewSubmitting(true);
    try {
      await onSubmitReview({
        authorName: name.trim() || authUser?.displayName || 'Elevora Student',
        hscContext: `${hscYear} · ${stream}`,
        rating: reviewRating,
        comment: reviewComment,
      });
      setReviewComment('');
      setReviewRating(5);
      setReviewSuccess(true);
      window.setTimeout(() => setReviewSuccess(false), 3000);
    } catch (err: unknown) {
      setReviewError(err instanceof Error ? err.message : 'Failed to publish review.');
    } finally {
      setReviewSubmitting(false);
    }
  };

  const handleDeleteOwnReview = async (reviewId: string) => {
    setDeletingReviewId(reviewId);
    try {
      await onDeleteReview(reviewId);
    } finally {
      setDeletingReviewId(null);
    }
  };

  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : null;

  return (
    <div className="relative min-h-screen bg-zinc-950 text-zinc-100 overflow-x-hidden">
      {/* Deep Ambient Midnight Blue Glows & Animated 2D Grid */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(37,99,235,0.14),_transparent_55%)]" />
        <motion.div
          animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-24 -left-24 w-[28rem] h-[28rem] rounded-full bg-blue-600/12 blur-3xl"
        />
        <motion.div
          animate={{ x: [0, -35, 0], y: [0, 35, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/3 -right-24 w-[30rem] h-[30rem] rounded-full bg-indigo-500/12 blur-3xl"
        />

        {/* Animated Orbit Ring 2D Graphic */}
        <motion.svg
          viewBox="0 0 120 120"
          className="hidden lg:block absolute top-24 right-12 w-24 h-24 text-blue-400/15"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        >
          <circle cx="60" cy="60" r="46" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="6 6" />
          <circle cx="60" cy="14" r="4" fill="currentColor" />
        </motion.svg>
      </div>

      {/* Sticky Glass Landing Header */}
      <header className="sticky top-0 z-40 border-b border-zinc-800/70 bg-zinc-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-500/15 border border-blue-500/35 flex items-center justify-center text-blue-400">
              <Compass className="w-5 h-5" />
            </div>
            <span className="font-display text-xl font-bold tracking-tight text-zinc-50">
              Elevora
            </span>
          </div>

          <div className="hidden md:flex items-center gap-6 text-xs font-medium text-zinc-400">
            <button
              type="button"
              onClick={() => scrollToSection('features-showcase')}
              className="hover:text-zinc-100 transition-colors cursor-pointer"
            >
              Explore Features
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('how-it-works')}
              className="hover:text-zinc-100 transition-colors cursor-pointer whitespace-nowrap"
            >
              How It Works
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('creator-story')}
              className="hover:text-zinc-100 transition-colors cursor-pointer whitespace-nowrap"
            >
              Creator
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('student-reviews')}
              className="hover:text-zinc-100 transition-colors cursor-pointer whitespace-nowrap"
            >
              Reviews{reviews.length > 0 ? ` (${reviews.length})` : ''}
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('workspace-setup')}
              className="hover:text-zinc-100 transition-colors cursor-pointer whitespace-nowrap"
            >
              Student Setup
            </button>
          </div>

          <button
            type="button"
            onClick={() => scrollToSection('workspace-setup')}
            className="px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-400 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
          >
            <span>Enter Workspace</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8">
        {/* SECTION 1: Animated Hero Showcase */}
        <section className="py-12 sm:py-20 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-7 space-y-6"
          >
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-blue-400">
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>All-in-One HSC Science, Commerce &amp; Arts Workspace</span>
              <span className="text-zinc-600" aria-hidden="true">·</span>
              <button
                type="button"
                onClick={() => scrollToSection('creator-story')}
                className="text-sky-300 hover:text-sky-200 underline underline-offset-4 decoration-blue-500/40 cursor-pointer"
              >
                Built by Nishat Afaf
              </button>
            </div>

            <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-zinc-50 leading-[1.12] text-balance">
              Master Your HSC Syllabus, English DET &amp; Daily Discipline in{' '}
              <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">
                One Unified Studio.
              </span>
            </h1>

            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed max-w-2xl">
              Built for ambitious 11th &amp; 12th grade students in Bangladesh. Combine complete NCTB chapter tracking, proof-verified study tasks, page-by-page bilingual books, AI DET speaking &amp; writing exams, and a real-life printable CV builder.
            </p>

            {/* Interactive Professor Mochi 2D Animated Mentor Bubble */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="rounded-2xl border border-blue-500/25 bg-zinc-900/75 backdrop-blur-md p-4 flex items-center gap-4 max-w-xl"
            >
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="w-16 h-16 rounded-2xl overflow-hidden border border-blue-500/40 bg-zinc-950 shrink-0"
              >
                <img
                  src={AI_MASCOT_AVATAR}
                  alt="Professor Mochi AI Mentor"
                  className="w-full h-full object-cover"
                />
              </motion.div>
              <div className="space-y-1 min-w-0">
                <div className="text-xs font-semibold text-blue-400">
                  Professor Mochi · Your AI Study Mentor
                </div>
                <motion.p
                  key={heroTipIdx}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-xs sm:text-sm text-zinc-200 leading-relaxed"
                >
                  {HERO_QUOTES[heroTipIdx]}
                </motion.p>
              </div>
            </motion.div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => scrollToSection('workspace-setup')}
                className="px-6 py-3.5 rounded-xl bg-blue-500 hover:bg-blue-400 text-white font-semibold text-sm flex items-center gap-2 shadow-lg shadow-blue-500/25 transition-colors cursor-pointer"
              >
                <span>Start My Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>

              <button
                type="button"
                onClick={() => scrollToSection('features-showcase')}
                className="px-5 py-3.5 rounded-xl border border-zinc-800 bg-zinc-900/80 hover:border-zinc-700 text-zinc-200 font-medium text-sm flex items-center gap-2 transition-colors cursor-pointer"
              >
                <span>See What’s Inside</span>
                <ArrowDown className="w-4 h-4 text-blue-400" />
              </button>
            </div>
          </motion.div>

          {/* Right: Animated Live Interactive Workspace Preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="lg:col-span-5 relative"
          >
            <div className="rounded-3xl border border-blue-500/25 bg-zinc-900/80 backdrop-blur-xl p-6 shadow-2xl shadow-blue-950/30 space-y-5">
              <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3.5">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-pulse" />
                  <span className="text-xs font-semibold text-zinc-200">
                    Live Workspace Preview
                  </span>
                </div>
                <span className="font-mono-num text-xs text-blue-400">Auto-Saved</span>
              </div>

              {/* Animated Mini Focus Ring + Task Verification */}
              <div className="rounded-2xl bg-zinc-950/90 border border-zinc-800/80 p-4 flex items-center gap-4">
                <div className="relative w-14 h-14 shrink-0 flex items-center justify-center">
                  <svg className="w-14 h-14 -rotate-90" viewBox="0 0 60 60">
                    <circle cx="30" cy="30" r="24" stroke="#27272a" strokeWidth="5" fill="none" />
                    <motion.circle
                      cx="30"
                      cy="30"
                      r="24"
                      stroke="#3b82f6"
                      strokeWidth="5"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={150}
                      animate={{ strokeDashoffset: [150, 35, 150] }}
                      transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                    />
                  </svg>
                  <Timer className="w-4 h-4 text-blue-400 absolute" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-semibold text-zinc-100">
                    Pomodoro + Verified Task Bar
                  </div>
                  <div className="text-xs text-blue-400 mt-0.5 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 shrink-0" />
                    <span className="truncate">Proof: “Solved 12 Vector MCQs”</span>
                  </div>
                </div>
              </div>

              {/* Animated Audio / DET Soundwave Preview */}
              <div className="rounded-2xl bg-zinc-950/90 border border-zinc-800/80 p-4 space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-zinc-100 flex items-center gap-1.5">
                    <Mic className="w-3.5 h-3.5 text-indigo-400" />
                    <span>DET Speaking AI &amp; Audio Engine</span>
                  </span>
                  <span className="font-mono-num text-blue-400 font-bold">145 / 160</span>
                </div>
                <div className="flex items-end gap-1 h-7 pt-1">
                  {[45, 85, 60, 95, 70, 50, 90, 65, 80, 40, 75, 55, 88, 62].map((h, i) => (
                    <motion.div
                      key={i}
                      animate={{ height: [`${Math.max(25, h - 35)}%`, `${h}%`, `${Math.max(20, h - 40)}%`] }}
                      transition={{
                        duration: 1.4,
                        repeat: Infinity,
                        delay: i * 0.08,
                        ease: 'easeInOut',
                      }}
                      className="flex-1 rounded-full bg-gradient-to-t from-blue-600 to-sky-400"
                    />
                  ))}
                </div>
              </div>

              {/* Animated Syllabus Progress Bars */}
              <div className="rounded-2xl bg-zinc-950/90 border border-zinc-800/80 p-4 space-y-2.5">
                <div className="flex items-center justify-between text-xs text-zinc-300">
                  <span className="font-semibold">Science · Commerce · Arts Syllabus</span>
                  <span className="font-mono-num text-blue-400">NCTB Full</span>
                </div>
                <div className="space-y-2">
                  {[
                    { label: 'Physics / Accounting / History', w: '82%' },
                    { label: 'English 1st & 2nd Paper + ICT', w: '68%' },
                  ].map((bar, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="text-[11px] text-zinc-400">{bar.label}</div>
                      <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: '15%' }}
                          animate={{ width: ['25%', bar.w, '25%'] }}
                          transition={{ duration: 5 + idx * 1.5, repeat: Infinity, ease: 'easeInOut' }}
                          className="h-full bg-blue-500 rounded-full"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* SECTION 2: Animated Feature Tiles ("Website-e ki ki ase & egula diye ki hbe") */}
        <section id="features-showcase" className="py-14 border-t border-zinc-800/70 space-y-10">
          <div className="max-w-2xl space-y-2">
            <div className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
              Interactive Platform Tour
            </div>
            <h2 className="font-display text-2xl sm:text-4xl font-bold text-zinc-50">
              Everything Inside Elevora &amp; How It Elevates You
            </h2>
            <p className="text-sm text-zinc-400">
              10 integrated modules designed to keep every HSC study hour measurable, verified, and connected to your future scholarship &amp; CV.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Tile 1: HSC Syllabus */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.35 }}
              className="rounded-2xl border border-zinc-800/90 hover:border-blue-500/45 bg-zinc-900/65 p-6 flex flex-col justify-between gap-5 transition-colors"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
                  <Layers className="w-5 h-5" />
                </div>
                <h3 className="font-display text-lg font-semibold text-zinc-50">
                  Full HSC Syllabus Tracker
                </h3>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Complete Bangladesh NCTB 1st &amp; 2nd Paper chapters for{' '}
                  <strong className="text-zinc-100">Science, Commerce, and Arts</strong> (including History, Economics, Sociology, Logic, Civics, Physics, Accounting &amp; ICT).
                </p>
              </div>
              <div className="rounded-xl bg-zinc-950/90 border border-zinc-800/80 p-3 flex items-center justify-between text-xs">
                <span className="text-zinc-400">One-tap +1 Chapter</span>
                <span className="font-mono-num text-blue-400 font-semibold">Live % Sync</span>
              </div>
            </motion.div>

            {/* Tile 2: Verified Focus & Task Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.35, delay: 0.05 }}
              className="rounded-2xl border border-zinc-800/90 hover:border-blue-500/45 bg-zinc-900/65 p-6 flex flex-col justify-between gap-5 transition-colors"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                  <Timer className="w-5 h-5" />
                </div>
                <h3 className="font-display text-lg font-semibold text-zinc-50">
                  Focus Studio &amp; Proof Task Bar
                </h3>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Lock onto a task with 15/25/45/50 min timers. Before ticking any task done, confirm 1 short line of real proof so you never fool yourself with fake progress.
                </p>
              </div>
              <div className="rounded-xl bg-zinc-950/90 border border-zinc-800/80 p-3 flex items-center justify-between text-xs">
                <span className="text-zinc-400">Real Accountability</span>
                <span className="text-indigo-300 font-semibold">Verified ✓</span>
              </div>
            </motion.div>

            {/* Tile 3: Page-by-Page Book Reader & Flashcards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.35, delay: 0.1 }}
              className="rounded-2xl border border-zinc-800/90 hover:border-blue-500/45 bg-zinc-900/65 p-6 flex flex-col justify-between gap-5 transition-colors"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h3 className="font-display text-lg font-semibold text-zinc-50">
                  Page-by-Page Books &amp; Flashcards
                </h3>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Read complete 5-chapter self-development books Page 1, 2, 3 in English + বাংলা split view. Highlight words or save any new lesson directly into your Home Flashcards.
                </p>
              </div>
              <div className="rounded-xl bg-zinc-950/90 border border-zinc-800/80 p-3 flex items-center justify-between text-xs">
                <span className="text-zinc-400">EN ↔ বাংলা Vault</span>
                <span className="font-mono-num text-sky-400 font-semibold">15 Pages/Book</span>
              </div>
            </motion.div>

            {/* Tile 4: Pro DET AI Studio */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.35, delay: 0.15 }}
              className="rounded-2xl border border-zinc-800/90 hover:border-blue-500/45 bg-zinc-900/65 p-6 flex flex-col justify-between gap-5 transition-colors"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <h3 className="font-display text-lg font-semibold text-zinc-50">
                  Pro Duolingo English Test (DET) Hub
                </h3>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Real microphone Speaking recording graded by AI, spoken Listening dictation, C-Test Literacy, and timed Writing samples scored on the official 10–160 DET scale.
                </p>
              </div>
              <div className="rounded-xl bg-zinc-950/90 border border-zinc-800/80 p-3 flex items-center justify-between text-xs">
                <span className="text-zinc-400">Live Mic + Audio</span>
                <span className="font-mono-num text-blue-400 font-semibold">10–160 AI Score</span>
              </div>
            </motion.div>

            {/* Tile 5: Random Surahs & Azan OR 6 Mind Refresh Sounds */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.35, delay: 0.2 }}
              className="rounded-2xl border border-zinc-800/90 hover:border-blue-500/45 bg-zinc-900/65 p-6 flex flex-col justify-between gap-5 transition-colors"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                  <Volume2 className="w-5 h-5" />
                </div>
                <h3 className="font-display text-lg font-semibold text-zinc-50">
                  Random Surahs + Azan / 6 Calm Sounds
                </h3>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Muslim mode unlocks district Salah countdowns, play-anytime Azan, &amp; 12 random Alafasy Surahs. Mind Refresh mode offers Rain, Ocean, Forest, Bowl, 432Hz &amp; Fireplace sounds.
                </p>
              </div>
              <div className="rounded-xl bg-zinc-950/90 border border-zinc-800/80 p-3 flex items-center justify-between text-xs">
                <span className="text-zinc-400">Adaptive Peace</span>
                <span className="text-indigo-300 font-semibold">Muslim / Universal</span>
              </div>
            </motion.div>

            {/* Tile 6: Research Suite, Skill Examiner & Real CV */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.35, delay: 0.25 }}
              className="rounded-2xl border border-zinc-800/90 hover:border-blue-500/45 bg-zinc-900/65 p-6 flex flex-col justify-between gap-5 transition-colors"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400">
                  <FileText className="w-5 h-5" />
                </div>
                <h3 className="font-display text-lg font-semibold text-zinc-50">
                  Research Lab, Skill AI &amp; Real-Life CV
                </h3>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Draft research papers, submit daily skill work for strict AI feedback, log your own ECAs from scratch, and auto-generate a clean Harvard-style printable PDF CV.
                </p>
              </div>
              <div className="rounded-xl bg-zinc-950/90 border border-zinc-800/80 p-3 flex items-center justify-between text-xs">
                <span className="text-zinc-400">Admission Ready</span>
                <span className="text-sky-400 font-semibold">1-Click PDF CV</span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* SECTION 3: Animated 3-Step Flow */}
        <section id="how-it-works" className="py-10 border-t border-zinc-800/70">
          <div className="rounded-3xl border border-zinc-800/80 bg-zinc-900/40 p-6 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: '01',
                icon: Compass,
                title: 'Personalize Your Track',
                desc: 'Choose Science, Commerce, or Arts, your district, and Muslim or Mind Refresh rhythm.',
              },
              {
                step: '02',
                icon: FlaskConical,
                title: 'Study, Verify & Practice Daily',
                desc: 'Run Pomodoro blocks with proof verification, read books page-by-page, and train DET with AI.',
              },
              {
                step: '03',
                icon: Award,
                title: 'Graduate With a Real Portfolio',
                desc: 'Every syllabus score, skill evaluation, research draft, and ECA syncs straight to your PDF CV.',
              },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="flex items-start gap-4"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/35 flex items-center justify-center text-blue-400 shrink-0 font-mono-num text-xs font-bold">
                    {item.step}
                  </div>
                  <div className="space-y-1">
                    <div className="font-display text-sm font-semibold text-zinc-100 flex items-center gap-1.5">
                      <Icon className="w-3.5 h-3.5 text-blue-400" />
                      <span>{item.title}</span>
                    </div>
                    <p className="text-xs text-zinc-400 leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* SECTION 3A: Creator & Founder Story (Nishat Afaf) */}
        <section id="creator-story" className="py-14 border-t border-zinc-800/70">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.45 }}
            className="rounded-3xl border border-blue-500/25 bg-gradient-to-br from-zinc-900/90 via-zinc-900/80 to-blue-950/35 overflow-hidden shadow-2xl"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
              {/* Left: Original Authentic Photo (Unchanged) */}
              <div className="lg:col-span-4 relative bg-zinc-950/70 border-b lg:border-b-0 lg:border-r border-zinc-800/80 p-6 sm:p-8 flex flex-col items-center justify-center gap-4">
                <div className="relative w-full max-w-[260px] aspect-[3/4] rounded-2xl overflow-hidden border border-blue-500/35 shadow-xl shadow-blue-950/50 bg-zinc-900">
                  <img
                    src="/assets/aistudio/image_b5bd086c.png"
                    alt="Nishat Afaf — Creator of Elevora"
                    className="w-full h-full object-cover object-center"
                  />
                </div>

                <div className="text-center space-y-0.5">
                  <div className="font-display text-lg font-bold text-zinc-50">
                    Nishat Afaf
                  </div>
                  <div className="text-xs text-blue-400 font-medium">
                    Creator of Elevora (formerly Uttoron) · Age 18 (2026)
                  </div>
                </div>
              </div>

              {/* Right: Story Copy + English/Bangla Translation Toggle */}
              <div className="lg:col-span-8 p-6 sm:p-10 flex flex-col justify-between gap-6">
                <div className="space-y-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="text-xs font-semibold text-blue-400">
                        {founderLang === 'en' ? "Creator's Note" : 'নির্মাতার কথা'}
                      </div>
                      <h2 className="font-display text-2xl sm:text-3xl font-bold text-zinc-50">
                        {founderLang === 'en'
                          ? 'Meet Nishat Afaf — Why I Built Elevora'
                          : 'নিশাত আফাফ — যেভাবে জন্ম হলো Elevora-র'}
                      </h2>
                    </div>

                    {/* English | বাংলা Translation Toggle */}
                    <div
                      className="flex items-center gap-1 p-1 rounded-xl bg-zinc-950 border border-zinc-800 shrink-0"
                      role="group"
                      aria-label="Language switch for creator story"
                    >
                      <Languages className="w-3.5 h-3.5 text-blue-400 ml-2 mr-1" />
                      <button
                        type="button"
                        onClick={() => setFounderLang('en')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                          founderLang === 'en'
                            ? 'bg-blue-500 text-white'
                            : 'text-zinc-400 hover:text-zinc-100'
                        }`}
                      >
                        English
                      </button>
                      <button
                        type="button"
                        onClick={() => setFounderLang('bn')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                          founderLang === 'bn'
                            ? 'bg-blue-500 text-white'
                            : 'text-zinc-400 hover:text-zinc-100'
                        }`}
                      >
                        বাংলা
                      </button>
                    </div>
                  </div>

                  {founderLang === 'en' ? (
                    <div className="space-y-3.5 text-sm sm:text-[15px] text-zinc-300 leading-relaxed">
                      <p>
                        I’m <strong className="text-zinc-50">Nishat Afaf</strong>, currently 18 years old (as of 2026). I wouldn’t call myself an extraordinary student; rather, I’m just an ordinary, slightly below-average student with above-average dreams! A strange combination, isn’t it? :&apos;)
                      </p>
                      <p>
                        I initially built <strong className="text-blue-300">Uttoron</strong> to solve my own study needs. Then I thought—why not turn it into something that helps other students too? That’s how <strong className="text-blue-300">Elevora</strong> came to life, blending <em className="text-zinc-100">Elevate</em> and <em className="text-zinc-100">Aura</em> to stand for daily growth, self-improvement, and unlocking your potential.
                      </p>
                      <p>
                        Crafted with AI and my very best efforts, this little initiative is <strong className="text-zinc-100">100% free and open to everyone</strong>. I don’t claim it’s perfect—I just hope it becomes a quiet helping hand in your journey. Please overlook any mistakes and share your suggestions below! ❤️
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3.5 text-sm sm:text-[15px] text-zinc-300 leading-relaxed">
                      <p>
                        আমি <strong className="text-zinc-50">নিশাত আফাফ (Nishat Afaf)</strong>, বর্তমান বয়স ১৮ বছর (২০২৬ অনুযায়ী)। আমি নিজেকে অসাধারণ কোনো ছাত্রী বলব না; বরং আমি একজন সাধারণ, গড়ের চেয়ে কিছুটা সাধারণ মানের শিক্ষার্থী—যার স্বপ্নগুলো গড়ের চেয়ে অনেক বড়! অদ্ভুত এক সমন্বয়, তাই না? :&apos;)
                      </p>
                      <p>
                        প্রথমে নিজের পড়াশোনার প্রয়োজনেই <strong className="text-blue-300">‘উত্তরণ (Uttoron)’</strong> তৈরি করেছিলাম। পরে ভাবলাম—এমন কিছু কেন বানাই না যা অন্য শিক্ষার্থীদেরও উপকারে আসবে? সেখান থেকেই <strong className="text-blue-300">Elevora</strong>-র জন্ম। ইংরেজি <em className="text-zinc-100">Elevate</em> (উন্নতি) এবং <em className="text-zinc-100">Aura</em> (ইতিবাচক আভা) শব্দ দুটি থেকে নেওয়া এই নামটি প্রতিদিন নিজেকে গড়ে তোলা ও নিজের সুপ্ত প্রতিভা বিকাশের প্রতীক।
                      </p>
                      <p>
                        এআই (AI)-এর সহায়তা ও আমার সর্বোচ্চ চেষ্টায় তৈরি এই ক্ষুদ্র উদ্যোগটি সবার জন্য <strong className="text-zinc-100">সম্পূর্ণ বিনামূল্যে উন্মুক্ত</strong>। এটি একদম নিখুঁত তা দাবি করছি না—শুধু আশা করি কারো না কারো এগিয়ে যাওয়ার পথে ছোট্ট একটি সহায়ক হয়ে থাকবে। কোনো ভুলত্রুটি থাকলে ক্ষমাসুন্দর দৃষ্টিতে দেখবেন এবং আপনার পরামর্শ জানাবেন! ❤️
                      </p>
                    </div>
                  )}
                </div>

                <div className="pt-5 border-t border-zinc-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-2.5">
                    <Heart className="w-4 h-4 text-blue-400 fill-blue-400/30 shrink-0" />
                    <span className="font-display text-base sm:text-lg font-bold bg-gradient-to-r from-blue-300 via-sky-200 to-indigo-300 bg-clip-text text-transparent">
                      {founderLang === 'en'
                        ? 'Dream Big. Elevate Every Day.'
                        : 'বড় স্বপ্ন দেখো, প্রতিদিন নিজেকে এগিয়ে নাও।'}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => scrollToSection('student-reviews')}
                    className="px-4 py-2 rounded-xl border border-blue-500/35 bg-blue-500/10 hover:bg-blue-500/20 text-xs font-semibold text-blue-300 flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 w-fit"
                  >
                    <span>
                      {founderLang === 'en' ? 'Share Suggestions & Reviews' : 'পরামর্শ ও রিভিউ দিন'}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* SECTION 3B: Student Reviews Showcase & Submission */}
        <section id="student-reviews" className="py-14 border-t border-zinc-800/70 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-2 max-w-2xl">
              <div className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
                Student Community Feedback
              </div>
              <h2 className="font-display text-2xl sm:text-4xl font-bold text-zinc-50">
                What HSC Students Say About Elevora
              </h2>
              <p className="text-sm text-zinc-400">
                Real experiences shared by learners using Elevora for HSC board preparation, DET speaking &amp; writing, and daily focus discipline.
              </p>
            </div>

            {avgRating && (
              <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 flex items-center gap-3 shrink-0">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                  <span className="font-mono-num text-xl font-bold text-zinc-50">
                    {avgRating}
                  </span>
                </div>
                <div className="text-xs text-zinc-300 leading-tight">
                  <div className="font-semibold text-zinc-100">Average Rating</div>
                  <div className="text-zinc-400">
                    {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: Live Student Reviews Grid */}
            <div className="lg:col-span-7 space-y-4">
              {reviewsLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[1, 2].map((skeleton) => (
                    <div
                      key={skeleton}
                      className="h-36 rounded-2xl border border-zinc-800 bg-zinc-900/50 animate-pulse p-5"
                    />
                  ))}
                </div>
              ) : reviews.length === 0 ? (
                <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/50 p-8 text-center space-y-2">
                  <MessageSquarePlus className="w-8 h-8 text-blue-400 mx-auto" />
                  <div className="font-display text-base font-semibold text-zinc-100">
                    No student reviews yet — be the first!
                  </div>
                  <p className="text-xs text-zinc-400 max-w-md mx-auto">
                    Sign in with Google on the right to share how Elevora helps your HSC study routine.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {reviews.map((rev) => {
                    const isMine = authUser?.uid === rev.authorUid;
                    const dateStr = new Date(rev.createdAtMs).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    });

                    return (
                      <motion.div
                        key={rev.id}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="rounded-2xl border border-zinc-800/90 bg-zinc-900/70 p-5 flex flex-col justify-between gap-4"
                      >
                        <div className="space-y-2.5">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-0.5">
                              {[1, 2, 3, 4, 5].map((s) => (
                                <Star
                                  key={s}
                                  className={`w-3.5 h-3.5 ${
                                    s <= rev.rating
                                      ? 'text-amber-400 fill-amber-400'
                                      : 'text-zinc-700'
                                  }`}
                                />
                              ))}
                            </div>
                            {isMine && (
                              <button
                                type="button"
                                disabled={deletingReviewId === rev.id}
                                onClick={() => void handleDeleteOwnReview(rev.id)}
                                className="p-1 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                                title="Delete my review"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                          <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed break-words">
                            “{rev.comment}”
                          </p>
                        </div>

                        <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between gap-2 text-xs">
                          <div className="min-w-0">
                            <div className="font-semibold text-zinc-100 truncate">
                              {rev.authorName}
                            </div>
                            <div className="text-[11px] text-blue-400 truncate">
                              {rev.hscContext}
                            </div>
                          </div>
                          <span className="text-[11px] text-zinc-500 shrink-0">{dateStr}</span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Right: Write a Review Card */}
            <div className="lg:col-span-5 rounded-2xl border border-blue-500/25 bg-zinc-900/80 p-6 space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-500/15 border border-blue-500/35 flex items-center justify-center text-blue-400">
                  <MessageSquarePlus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-display text-base font-semibold text-zinc-50">
                    Write a Review
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Share feedback directly on this landing page
                  </p>
                </div>
              </div>

              {!authUser ? (
                <div className="space-y-4 pt-1">
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    Sign in with your Google account so your verified review appears immediately on the 1st page alongside fellow HSC students.
                  </p>
                  <button
                    type="button"
                    disabled={signingIn}
                    onClick={handleGoogleLogin}
                    className="w-full py-3 px-4 rounded-xl bg-blue-500 hover:bg-blue-400 disabled:opacity-60 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <span>
                      {signingIn ? 'Connecting Google Account...' : 'Sign In with Google to Post Review'}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleInlineReviewSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <span className="block text-xs font-medium text-zinc-300">Your Rating</span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewRating(star)}
                          className="p-1.5 rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer"
                          aria-label={`Rate ${star} stars`}
                        >
                          <Star
                            className={`w-5 h-5 ${
                              star <= reviewRating
                                ? 'text-amber-400 fill-amber-400'
                                : 'text-zinc-600'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label
                      htmlFor="landing-review-comment"
                      className="block text-xs font-medium text-zinc-300"
                    >
                      Your Experience ({reviewComment.length}/400)
                    </label>
                    <textarea
                      id="landing-review-comment"
                      rows={3}
                      maxLength={400}
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="Elevora কীভাবে আপনার HSC পড়াশোনা, Board MCQ/CQ বা AI Teacher দিয়ে সাহায্য করছে..."
                      className="w-full px-3.5 py-2.5 bg-zinc-950/90 border border-zinc-800 rounded-xl text-xs sm:text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  {reviewError && (
                    <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
                      {reviewError}
                    </div>
                  )}

                  {reviewSuccess && (
                    <div className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 rounded-lg px-3 py-2">
                      Your review is now live on the 1st page!
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={reviewSubmitting}
                    className="w-full py-3 rounded-xl bg-blue-500 hover:bg-blue-400 disabled:opacity-60 text-white text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
                  >
                    {reviewSubmitting ? 'Publishing Review...' : 'Publish Review on 1st Page'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>

        {/* SECTION 4: Student Login & Workspace Setup Form */}
        <section id="workspace-setup" className="py-14 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.45 }}
            className="grid grid-cols-1 lg:grid-cols-12 border border-blue-500/25 bg-zinc-900/80 backdrop-blur-2xl rounded-3xl overflow-hidden shadow-2xl"
          >
            {/* Left Companion Summary */}
            <div className="lg:col-span-5 p-8 sm:p-10 bg-gradient-to-br from-zinc-900 via-zinc-900/95 to-blue-950/40 border-b lg:border-b-0 lg:border-r border-zinc-800/80 flex flex-col justify-between gap-8">
              <div className="space-y-6">
                <div className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
                  Ready to Begin?
                </div>
                <div>
                  <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-zinc-50 leading-tight">
                    Set up your Elevora profile in 15 seconds.
                  </h2>
                  <p className="text-sm text-zinc-400 leading-relaxed mt-3">
                    Everything saves automatically in your browser so your HSC chapters, DET scores, flashcards, and CV stay intact whenever you return.
                  </p>
                </div>

                <div className="rounded-2xl border border-zinc-800 bg-zinc-950/85 p-4 flex items-center gap-4">
                  <motion.div
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                    className="w-16 h-16 rounded-2xl overflow-hidden bg-zinc-900 border border-blue-500/35 shrink-0"
                  >
                    <img
                      src={AI_MASCOT_AVATAR}
                      alt="Professor Mochi"
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                  <div className="text-xs text-zinc-300 leading-relaxed">
                    <div className="font-semibold text-blue-400 mb-0.5">Professor Mochi</div>
                    “Start fresh, verify every task honestly, and watch how far 90 days of calm consistency takes you!”
                  </div>
                </div>
              </div>

                <div className="space-y-2.5 pt-5 border-t border-zinc-800/70 text-xs text-zinc-400">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0" />
                    <span>Verified Google Auth &amp; encrypted private cloud storage</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span>Only you can view or edit your study progress, flashcards &amp; CV</span>
                  </div>
                </div>
              </div>

              {/* Right Auth Gate / Setup Form */}
              {!authUser ? (
                <div className="lg:col-span-7 p-8 sm:p-10 flex flex-col justify-center space-y-6">
                  <div className="space-y-2">
                    <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400">
                      <Lock className="w-3.5 h-3.5" />
                      <span>Private Per-User Account Sync</span>
                    </div>
                    <h3 className="font-display text-2xl font-bold text-zinc-50">
                      Sign In Securely to Your Elevora Space
                    </h3>
                    <p className="text-sm text-zinc-400 leading-relaxed">
                      Log in with your Google account so all your HSC chapters, Board CQ/MCQ practice, DET scores, flashcards, and CV stay securely saved exclusively for you across any device.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-5 space-y-3 text-xs text-zinc-300">
                    <div className="font-semibold text-zinc-100">Why sign in?</div>
                    <ul className="space-y-2 text-zinc-400">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                        <span>Separate private workspace for every individual student</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                        <span>Auto-restores your saved profile, syllabus &amp; CV on every login</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                        <span>Protected by strict owner-only cloud security rules</span>
                      </li>
                    </ul>
                  </div>

                  {(authError || error) && (
                    <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg px-3.5 py-2.5">
                      {authError || error}
                    </p>
                  )}

                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    type="button"
                    disabled={signingIn}
                    onClick={handleGoogleLogin}
                    className="w-full py-3.5 px-5 rounded-xl bg-blue-500 hover:bg-blue-400 disabled:opacity-60 text-white font-semibold text-sm flex items-center justify-center gap-3 shadow-lg shadow-blue-500/20 transition-colors cursor-pointer"
                  >
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                      <path
                        fill="#ffffff"
                        d="M21.35 11.1h-9.17v2.98h5.27c-.23 1.47-1.69 4.3-5.27 4.3-3.17 0-5.76-2.62-5.76-5.85s2.59-5.85 5.76-5.85c1.81 0 3.02.77 3.71 1.43l2.53-2.44C16.8 4.17 14.69 3.25 12.18 3.25 7.25 3.25 3.25 7.25 3.25 12.18s4 8.93 8.93 8.93c5.15 0 8.57-3.62 8.57-8.72 0-.59-.06-1.03-.15-1.29z"
                      />
                    </svg>
                    <span>{signingIn ? 'Verifying Google Account...' : 'Continue Securely with Google'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="lg:col-span-7 p-8 sm:p-10 space-y-6">
                  {/* Verified Account Pill */}
                  <div className="rounded-xl border border-blue-500/30 bg-blue-500/10 px-4 py-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      {authUser.photoURL ? (
                        <img
                          src={authUser.photoURL}
                          alt={authUser.displayName || 'Student'}
                          className="w-9 h-9 rounded-full border border-blue-400/50 shrink-0"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-blue-500/30 border border-blue-400/50 flex items-center justify-center text-xs font-bold text-blue-200 shrink-0">
                          {(authUser.displayName || authUser.email || 'S')[0].toUpperCase()}
                        </div>
                      )}
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-blue-300 flex items-center gap-1.5">
                          <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                          <span>Verified Private Account</span>
                        </div>
                        <div className="text-xs text-zinc-300 truncate">{authUser.email}</div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => void onSignOut()}
                      className="px-2.5 py-1.5 rounded-lg border border-zinc-700 bg-zinc-900/90 hover:bg-zinc-800 text-xs text-zinc-300 flex items-center gap-1 shrink-0 cursor-pointer"
                    >
                      <LogOut className="w-3 h-3" />
                      <span>Switch Account</span>
                    </button>
                  </div>

                  <div>
                    <h3 className="font-display text-xl font-semibold text-zinc-100">
                      Personalize Your HSC Workspace
                    </h3>
                    <p className="text-xs text-zinc-400 mt-1">
                      Saved privately to your account — you can edit these preferences anytime.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="student-name" className="block text-sm font-medium text-zinc-300">
                      Student Name
                    </label>
                    <input
                      id="student-name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g., Tahmid Hasan / Ananya Roy / David Gomes"
                      className="w-full px-4 py-2.5 bg-zinc-950/90 border border-zinc-800 rounded-xl text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <span className="block text-sm font-medium text-zinc-300">Class Selection</span>
                      <div className="grid grid-cols-2 gap-2 p-1 bg-zinc-950/90 border border-zinc-800 rounded-xl">
                        {(['HSC 1st Year', 'HSC 2nd Year'] as HscYear[]).map((yr) => (
                          <button
                            key={yr}
                            type="button"
                            onClick={() => setHscYear(yr)}
                            className={`px-3 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                              hscYear === yr
                                ? 'bg-blue-500 text-white font-semibold'
                                : 'text-zinc-400 hover:text-zinc-200'
                            }`}
                          >
                            {yr}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="district-select" className="block text-sm font-medium text-zinc-300">
                        Bangladesh District
                      </label>
                      <select
                        id="district-select"
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-zinc-950/90 border border-zinc-800 rounded-xl text-sm text-zinc-100 focus:outline-none focus:border-blue-500 transition-colors"
                      >
                        {BANGLADESH_DISTRICTS.map((d) => (
                          <option key={d.name} value={d.name}>
                            {d.name} ({d.region})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="block text-sm font-medium text-zinc-300">
                      Academic Stream (All 3 HSC Tracks)
                    </span>
                    <div className="grid grid-cols-3 gap-2 p-1 bg-zinc-950/90 border border-zinc-800 rounded-xl">
                      {(['Science', 'Commerce', 'Arts'] as HscStream[]).map((st) => (
                        <button
                          key={st}
                          type="button"
                          onClick={() => setStream(st)}
                          className={`px-3 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                            stream === st
                              ? 'bg-indigo-500 text-white font-semibold'
                              : 'text-zinc-400 hover:text-zinc-200'
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="block text-sm font-medium text-zinc-300">Daily Rhythm Mode</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setFaithMode('Muslim')}
                        className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                          faithMode === 'Muslim'
                            ? 'border-blue-500 bg-blue-500/10 text-zinc-100'
                            : 'border-zinc-800 bg-zinc-950/60 text-zinc-400 hover:border-zinc-700'
                        }`}
                      >
                        <div className="text-sm font-semibold text-zinc-100 flex items-center gap-1.5">
                          <Moon className="w-3.5 h-3.5 text-blue-400" />
                          <span>Muslim Mode</span>
                        </div>
                        <div className="text-xs text-zinc-400 mt-0.5">
                          Salah &amp; Play-Anytime Azan + 5-Min Ayats &amp; Bangla Ortho
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setFaithMode('Mind Refresh')}
                        className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                          faithMode === 'Mind Refresh'
                            ? 'border-indigo-500 bg-indigo-500/10 text-zinc-100'
                            : 'border-zinc-800 bg-zinc-950/60 text-zinc-400 hover:border-zinc-700'
                        }`}
                      >
                        <div className="text-sm font-semibold text-zinc-100 flex items-center gap-1.5">
                          <Wind className="w-3.5 h-3.5 text-indigo-400" />
                          <span>Mind Refresh (All Faiths)</span>
                        </div>
                        <div className="text-xs text-zinc-400 mt-0.5">
                          6 Ambient Soundscapes (Rain, Ocean, Forest, Bowl, 432Hz, Fire)
                        </div>
                      </button>
                    </div>
                  </div>

                  {(authError || error) && (
                    <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
                      {authError || error}
                    </p>
                  )}

                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3.5 px-5 rounded-xl bg-blue-500 hover:bg-blue-400 disabled:opacity-60 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 transition-colors cursor-pointer"
                  >
                    <span>{submitting ? 'Saving Your Workspace...' : 'Save & Launch My Elevora Workspace'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </form>
              )}
          </motion.div>
        </section>

        <footer className="py-8 border-t border-zinc-800/70 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-500">
          <div>
            Elevora · Built by <span className="text-zinc-300 font-medium">Nishat Afaf</span> · Free &amp; Open for All Students
          </div>
          <div className="text-blue-400 font-medium">Dream Big. Elevate Every Day.</div>
        </footer>
      </main>
    </div>
  );
};
