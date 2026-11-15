import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  BarChart3,
  CheckCircle2,
  Clock,
  Headphones,
  Loader2,
  Mic,
  PenTool,
  Plus,
  Sparkles,
  Square,
  Volume2,
} from 'lucide-react';
import { AI_MASCOT_AVATAR } from '../data/elevoraData';
import { DetAttempt, DetSegment } from '../types';

interface DetHubViewProps {
  history: DetAttempt[];
  onLogAttempt: (attempt: DetAttempt) => void;
}

type DetTab = DetSegment | 'History';

// C-Test style Literacy blanks
const CTEST_SEGMENTS = [
  { prefix: 'Mod', missing: 'ern', full: 'Modern', suffix: ' ' },
  { prefix: 'edu', missing: 'cation', full: 'education', suffix: ' ' },
  { prefix: 're', missing: 'lies', full: 'relies', suffix: ' heavily on ' },
  { prefix: 'crit', missing: 'ical', full: 'critical', suffix: ' ' },
  { prefix: 'think', missing: 'ing', full: 'thinking', suffix: ' and ' },
  { prefix: 'acad', missing: 'emic', full: 'academic', suffix: ' ' },
  { prefix: 'inte', missing: 'grity', full: 'integrity', suffix: '. Students who ' },
  { prefix: 'prac', missing: 'tice', full: 'practice', suffix: ' ' },
  { prefix: 'consis', missing: 'tently', full: 'consistently', suffix: ' develop stronger ' },
  { prefix: 'analy', missing: 'tical', full: 'analytical', suffix: ' clarity.' },
];

const LISTENING_PROMPTS = [
  {
    id: 'l-1',
    sentence: 'Renewable energy storage remains essential for stabilizing rural electrical grids during monsoon storms.',
    question: 'According to the audio, why is renewable energy storage important?',
    options: [
      'It lowers urban housing prices immediately',
      'It stabilizes rural electrical grids during monsoon storms',
      'It replaces all mathematics curricula',
    ],
    correctOption: 1,
  },
  {
    id: 'l-2',
    sentence: 'Consistent daily reading expands academic vocabulary far more effectively than memorizing isolated word lists.',
    question: 'What does the speaker recommend for building academic vocabulary?',
    options: [
      'Consistent daily reading in context',
      'Memorizing random dictionary pages overnight',
      'Avoiding complex articles completely',
    ],
    correctOption: 0,
  },
];

const SPEAKING_PROMPTS = [
  'Describe a scientific concept, historical event, or business principle from your HSC studies that changed how you see the real world. Speak for 30 to 60 seconds with clear examples.',
  'Many students prefer studying late at night, while others wake up early at dawn. Which study routine works better for deep focus, and why? Give two reasons.',
  'Talk about an academic skill or habit you want to master before entering university, and explain the exact steps you are taking this month.',
];

const WRITING_PROMPTS = [
  {
    id: 'w-photo',
    title: 'Write About the Scene & Academic Argument (3–5 Min Timed)',
    prompt:
      'Look at the study desk scene below: a student working with a laptop, notebook, and warm desk lamp at dawn. First describe the scene clearly (2 sentences), then explain why a calm, distraction-free environment matters for high-stakes exams (4–5 sentences).',
    hasScene: true,
  },
  {
    id: 'w-essay',
    title: 'Interactive Academic Writing (5 Min Timed)',
    prompt:
      'Some universities place greater weight on extracurricular leadership and independent research, while others rely solely on standardized board exam scores. Which admissions approach is fairer for students, and why? Support your position with clear reasoning.',
    hasScene: false,
  },
];

interface SpeakingEval {
  score: number;
  cefrLevel: string;
  transcriptDetected: string;
  fluencyAndPronunciation: string;
  vocabularyAndGrammar: string;
  improvements: string[];
  modelResponse: string;
}

interface WritingEval {
  score: number;
  cefrLevel: string;
  strengths: string[];
  grammarFixes: string[];
  feedback: string;
  improvedSample: string;
}

export const DetHubView: React.FC<DetHubViewProps> = ({ history, onLogAttempt }) => {
  const [activeTab, setActiveTab] = useState<DetTab>('Literacy');

  // 1. Literacy (C-Test)
  const [cAnswers, setCAnswers] = useState<Record<number, string>>({});
  const [litChecked, setLitChecked] = useState(false);

  // 2. Listening / Comprehension (Web Speech Audio + Dictation + Question)
  const [listenIdx, setListenIdx] = useState(0);
  const [playsUsed, setPlaysUsed] = useState(0);
  const [isSpeakingAudio, setIsSpeakingAudio] = useState(false);
  const [speechRate, setSpeechRate] = useState(0.95);
  const [dictationText, setDictationText] = useState('');
  const [listenMcq, setListenMcq] = useState<number | null>(null);
  const [listenSubmitted, setListenSubmitted] = useState(false);
  const [listenAccuracy, setListenAccuracy] = useState<number | null>(null);

  // 3. Speaking / Conversation (Real Mic Recording + Live Speech Recognition + AI Evaluation)
  const [speakPromptIdx, setSpeakPromptIdx] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [audioBlobUrl, setAudioBlobUrl] = useState<string | null>(null);
  const [audioBase64, setAudioBase64] = useState<string | null>(null);
  const [audioMime, setAudioMime] = useState<string>('audio/webm');
  const [liveTranscript, setLiveTranscript] = useState('');
  const [micError, setMicError] = useState('');
  const [speakLoading, setSpeakLoading] = useState(false);
  const [speakResult, setSpeakResult] = useState<SpeakingEval | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordTimerRef = useRef<number | null>(null);
  const recognitionRef = useRef<{ stop: () => void } | null>(null);

  // 4. Production / Writing (Timed AI Writing Examiner)
  const [writePromptIdx, setWritePromptIdx] = useState(0);
  const [writeText, setWriteText] = useState('');
  const [writeSecondsLeft, setWriteSecondsLeft] = useState(240);
  const [writeTimerRunning, setWriteTimerRunning] = useState(false);
  const [writeLoading, setWriteLoading] = useState(false);
  const [writeError, setWriteError] = useState('');
  const [writeResult, setWriteResult] = useState<WritingEval | null>(null);

  // Manual Log
  const [manualSegment, setManualSegment] = useState<DetSegment>('Literacy');
  const [manualScore, setManualScore] = useState('130');
  const [manualTime, setManualTime] = useState('180');
  const [manualNote, setManualNote] = useState('');

  // Writing countdown effect
  useEffect(() => {
    if (!writeTimerRunning) return;
    const id = window.setInterval(() => {
      setWriteSecondsLeft((prev) => {
        if (prev <= 1) {
          setWriteTimerRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [writeTimerRunning]);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (recordTimerRef.current) window.clearInterval(recordTimerRef.current);
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    };
  }, []);

  // === HANDLERS: 1. LITERACY ===
  const handleCheckLiteracy = () => {
    let correct = 0;
    CTEST_SEGMENTS.forEach((seg, idx) => {
      if ((cAnswers[idx] || '').trim().toLowerCase() === seg.missing.toLowerCase()) {
        correct++;
      }
    });
    const scaled = Math.round(65 + (correct / CTEST_SEGMENTS.length) * 90);
    setLitChecked(true);
    onLogAttempt({
      id: `det-${Date.now()}`,
      segment: 'Literacy',
      score: scaled,
      rawCorrect: `${correct}/${CTEST_SEGMENTS.length} blanks`,
      timeSpentSec: 110,
      date: new Date().toISOString().slice(0, 10),
      notes: 'DET C-Test (Read & Complete)',
    });
  };

  // === HANDLERS: 2. LISTENING ===
  const activeListenPrompt = LISTENING_PROMPTS[listenIdx % LISTENING_PROMPTS.length];

  const handlePlayListeningAudio = () => {
    if (playsUsed >= 3) return;
    if (!('speechSynthesis' in window)) {
      setListenAccuracy(null);
      return;
    }
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(activeListenPrompt.sentence);
    utter.lang = 'en-US';
    utter.rate = speechRate;
    utter.onstart = () => setIsSpeakingAudio(true);
    utter.onend = () => setIsSpeakingAudio(false);
    utter.onerror = () => setIsSpeakingAudio(false);
    setPlaysUsed((p) => p + 1);
    window.speechSynthesis.speak(utter);
  };

  const handleSubmitListening = () => {
    const clean = (s: string) =>
      s
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .trim()
        .split(/\s+/)
        .filter(Boolean);

    const targetWords = clean(activeListenPrompt.sentence);
    const typedWords = clean(dictationText);
    let matches = 0;
    targetWords.forEach((w, idx) => {
      if (typedWords[idx] === w || typedWords.includes(w)) matches++;
    });

    const dictPct = targetWords.length ? matches / targetWords.length : 0;
    const mcqCorrect = listenMcq === activeListenPrompt.correctOption ? 1 : 0;
    const combinedRatio = dictPct * 0.65 + mcqCorrect * 0.35;
    const detScore = Math.round(65 + combinedRatio * 90);

    setListenAccuracy(Math.round(dictPct * 100));
    setListenSubmitted(true);

    onLogAttempt({
      id: `det-${Date.now()}`,
      segment: 'Comprehension',
      score: detScore,
      rawCorrect: `${Math.round(dictPct * 100)}% dictation · ${mcqCorrect ? 'MCQ ✓' : 'MCQ ✗'}`,
      timeSpentSec: 90,
      date: new Date().toISOString().slice(0, 10),
      notes: 'DET Listen & Type + Audio Comprehension',
    });
  };

  // === HANDLERS: 3. SPEAKING (REAL MIC + AI) ===
  const handleStartRecording = async () => {
    setMicError('');
    setSpeakResult(null);
    setAudioBlobUrl(null);
    setAudioBase64(null);
    setLiveTranscript('');

    if (!navigator.mediaDevices?.getUserMedia) {
      setMicError('Microphone API unavailable in this browser. You can type your spoken response below to still test AI grading.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const preferredMime = MediaRecorder.isTypeSupported('audio/webm')
        ? 'audio/webm'
        : MediaRecorder.isTypeSupported('audio/mp4')
          ? 'audio/mp4'
          : '';
      const recorder = preferredMime
        ? new MediaRecorder(stream, { mimeType: preferredMime })
        : new MediaRecorder(stream);

      setAudioMime(recorder.mimeType || 'audio/webm');
      audioChunksRef.current = [];

      recorder.ondataavailable = (ev) => {
        if (ev.data.size > 0) audioChunksRef.current.push(ev.data);
      };

      recorder.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(audioChunksRef.current, { type: recorder.mimeType || 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setAudioBlobUrl(url);

        const reader = new FileReader();
        reader.onloadend = () => {
          const dataUrl = reader.result as string;
          const base64 = dataUrl.split(',')[1] || '';
          setAudioBase64(base64);
        };
        reader.readAsDataURL(blob);
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);
      setRecordSeconds(0);

      recordTimerRef.current = window.setInterval(() => {
        setRecordSeconds((s) => {
          if (s >= 89) {
            handleStopRecording();
            return 90;
          }
          return s + 1;
        });
      }, 1000);

      // Optional live speech-to-text preview if browser supports SpeechRecognition
      const SpeechRec =
        (window as unknown as { SpeechRecognition?: new () => unknown; webkitSpeechRecognition?: new () => unknown })
          .SpeechRecognition ||
        (window as unknown as { webkitSpeechRecognition?: new () => unknown }).webkitSpeechRecognition;

      if (SpeechRec) {
        try {
          const rec = new SpeechRec() as {
            continuous: boolean;
            interimResults: boolean;
            lang: string;
            onresult: (e: { results: ArrayLike<{ 0: { transcript: string } }> }) => void;
            start: () => void;
            stop: () => void;
          };
          rec.continuous = true;
          rec.interimResults = true;
          rec.lang = 'en-US';
          rec.onresult = (event) => {
            let full = '';
            for (let i = 0; i < event.results.length; i++) {
              full += event.results[i][0].transcript + ' ';
            }
            setLiveTranscript(full.trim());
          };
          rec.start();
          recognitionRef.current = rec;
        } catch {
          // ignore speech recognition errors, audio recording still works
        }
      }
    } catch {
      setMicError('Microphone permission denied or blocked. Allow mic access or type your spoken answer below for AI evaluation.');
    }
  };

  const handleStopRecording = () => {
    if (recordTimerRef.current) {
      window.clearInterval(recordTimerRef.current);
      recordTimerRef.current = null;
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
      recognitionRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  };

  const handleSubmitSpeakingAi = async () => {
    if (!audioBase64 && liveTranscript.trim().length < 8) {
      setMicError('Record at least a few seconds of speaking (or type your spoken response) before submitting.');
      return;
    }
    setSpeakLoading(true);
    setMicError('');
    setSpeakResult(null);

    try {
      const res = await fetch('/api/evaluate-det', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'speaking',
          prompt: SPEAKING_PROMPTS[speakPromptIdx % SPEAKING_PROMPTS.length],
          audioBase64,
          mimeType: audioMime,
          studentText: liveTranscript,
          timeSpentSec: Math.max(15, recordSeconds),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to evaluate speaking.');

      const result = data as SpeakingEval;
      setSpeakResult(result);
      onLogAttempt({
        id: `det-${Date.now()}`,
        segment: 'Conversation',
        score: result.score,
        rawCorrect: `CEFR ${result.cefrLevel} · Mic AI Graded`,
        timeSpentSec: Math.max(15, recordSeconds),
        date: new Date().toISOString().slice(0, 10),
        notes: 'AI-evaluated DET Speaking',
      });
    } catch (err: unknown) {
      setMicError(err instanceof Error ? err.message : 'Unable to grade speaking audio.');
    } finally {
      setSpeakLoading(false);
    }
  };

  // === HANDLERS: 4. WRITING / PRODUCTION (AI GRADED) ===
  const activeWritePrompt = WRITING_PROMPTS[writePromptIdx % WRITING_PROMPTS.length];
  const wordCount = writeText.trim() ? writeText.trim().split(/\s+/).length : 0;

  const handleSubmitWritingAi = async () => {
    if (writeText.trim().length < 25) {
      setWriteError('Write at least 25 characters before submitting to the DET AI Examiner.');
      return;
    }
    setWriteTimerRunning(false);
    setWriteLoading(true);
    setWriteError('');
    setWriteResult(null);

    const spent = Math.max(30, 240 - writeSecondsLeft);
    try {
      const res = await fetch('/api/evaluate-det', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'writing',
          prompt: activeWritePrompt.prompt,
          studentText: writeText,
          timeSpentSec: spent,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to evaluate DET writing.');

      const result = data as WritingEval;
      setWriteResult(result);
      onLogAttempt({
        id: `det-${Date.now()}`,
        segment: 'Production',
        score: result.score,
        rawCorrect: `${wordCount} words · CEFR ${result.cefrLevel}`,
        timeSpentSec: spent,
        date: new Date().toISOString().slice(0, 10),
        notes: 'AI-graded DET Writing',
      });
    } catch (err: unknown) {
      setWriteError(err instanceof Error ? err.message : 'Unable to evaluate writing.');
    } finally {
      setWriteLoading(false);
    }
  };

  // === HISTORY & CHART ===
  const handleAddManual = (e: React.FormEvent) => {
    e.preventDefault();
    const sc = Math.min(160, Math.max(10, parseInt(manualScore, 10) || 120));
    const sec = Math.max(30, parseInt(manualTime, 10) || 180);
    onLogAttempt({
      id: `det-${Date.now()}`,
      segment: manualSegment,
      score: sc,
      rawCorrect: 'External Mock',
      timeSpentSec: sec,
      date: new Date().toISOString().slice(0, 10),
      notes: manualNote.trim() || 'Official practice test log',
    });
    setManualNote('');
  };

  const stats = useMemo(() => {
    if (!history.length) return { avg: 0, best: 0, totalMin: 0 };
    const sum = history.reduce((a, b) => a + b.score, 0);
    const best = Math.max(...history.map((h) => h.score));
    const totalMin = Math.round(history.reduce((a, b) => a + b.timeSpentSec, 0) / 60);
    return { avg: Math.round(sum / history.length), best, totalMin };
  }, [history]);

  const chartPoints = useMemo(() => {
    const recent = history.slice(-10);
    if (recent.length < 2) return '';
    const w = 520;
    const h = 140;
    return recent
      .map((item, idx) => {
        const x = 20 + (idx / (recent.length - 1)) * (w - 40);
        const y = h - 18 - ((item.score - 60) / 100) * (h - 36);
        return `${x},${Math.max(14, Math.min(h - 14, y))}`;
      })
      .join(' ');
  }, [history]);

  const tabLabels: Array<{ id: DetTab; label: string }> = [
    { id: 'Literacy', label: 'Literacy (C-Test)' },
    { id: 'Comprehension', label: 'Listening & Audio' },
    { id: 'Conversation', label: 'Speaking (Mic + AI)' },
    { id: 'Production', label: 'Writing (AI Examiner)' },
    { id: 'History', label: `Practice History (${history.length})` },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-zinc-50">
          Duolingo English Test (DET) Professional Studio
        </h1>
        <p className="text-sm text-zinc-400 mt-1">
          Interactive C-Test literacy, live speech listening, real microphone speaking evaluated by AI, and timed AI essay grading on the 10–160 scale.
        </p>
      </div>

      {/* Sub-navigation */}
      <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-zinc-900 border border-zinc-800 rounded-xl w-fit">
        {tabLabels.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`px-3.5 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === tab.id
                ? tab.id === 'History'
                  ? 'bg-indigo-500 text-white font-semibold'
                  : 'bg-blue-500 text-white font-semibold'
                : 'text-zinc-400 hover:text-zinc-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 1. LITERACY: DET C-TEST (READ & COMPLETE) */}
      {activeTab === 'Literacy' && (
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-6 sm:p-8 space-y-6">
          <div>
            <div className="text-xs text-blue-400 font-medium">
              DET Literacy · Read &amp; Complete (C-Test)
            </div>
            <h2 className="font-display text-xl font-semibold text-zinc-50 mt-1">
              Type the missing letters to complete each academic word
            </h2>
          </div>

          <div className="p-6 rounded-2xl bg-zinc-950/90 border border-zinc-800 text-base sm:text-lg leading-loose text-zinc-200">
            {CTEST_SEGMENTS.map((seg, idx) => {
              const userVal = cAnswers[idx] || '';
              const isCorrect = userVal.trim().toLowerCase() === seg.missing.toLowerCase();

              return (
                <React.Fragment key={idx}>
                  <span className="inline-flex items-baseline whitespace-nowrap">
                    <span className="font-semibold text-zinc-100">{seg.prefix}</span>
                    <input
                      type="text"
                      disabled={litChecked}
                      value={userVal}
                      onChange={(e) =>
                        setCAnswers((prev) => ({ ...prev, [idx]: e.target.value }))
                      }
                      style={{ width: `${Math.max(3.2, seg.missing.length * 0.72 + 1)}rem` }}
                      aria-label={`Complete word starting with ${seg.prefix}`}
                      className={`mx-0.5 px-1.5 py-0.5 text-center font-mono-num text-sm rounded-md border focus:outline-none ${
                        litChecked
                          ? isCorrect
                            ? 'border-blue-500 bg-blue-500/15 text-blue-300'
                            : 'border-red-500 bg-red-500/15 text-red-300'
                          : 'border-zinc-700 bg-zinc-900 text-sky-300 focus:border-blue-500'
                      }`}
                    />
                    {litChecked && !isCorrect && (
                      <span className="text-xs text-blue-400 ml-1 font-mono-num">
                        ({seg.full})
                      </span>
                    )}
                  </span>
                  <span>{seg.suffix}</span>
                </React.Fragment>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            {!litChecked ? (
              <button
                type="button"
                onClick={handleCheckLiteracy}
                className="px-5 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-400 text-white font-semibold text-xs cursor-pointer"
              >
                Grade C-Test &amp; Save Score
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setCAnswers({});
                  setLitChecked(false);
                }}
                className="px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-semibold text-xs cursor-pointer"
              >
                Try Again
              </button>
            )}
            {litChecked && (
              <span className="text-xs text-blue-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Score saved to Practice History</span>
              </span>
            )}
          </div>
        </div>
      )}

      {/* 2. LISTENING: PLAYABLE AUDIO + LISTEN & TYPE + COMPREHENSION */}
      {activeTab === 'Comprehension' && (
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-xs text-blue-400 font-medium">
                DET Listening · Listen &amp; Type + Comprehension
              </div>
              <h2 className="font-display text-xl font-semibold text-zinc-50 mt-1">
                Play the spoken audio (max 3 replays) and transcribe accurately
              </h2>
            </div>

            <button
              type="button"
              onClick={() => {
                setListenIdx((p) => (p + 1) % LISTENING_PROMPTS.length);
                setPlaysUsed(0);
                setDictationText('');
                setListenMcq(null);
                setListenSubmitted(false);
                setListenAccuracy(null);
              }}
              className="px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 hover:text-zinc-50 cursor-pointer self-start"
            >
              Switch Audio Track
            </button>
          </div>

          {/* Audio Player Bar */}
          <div className="rounded-2xl bg-zinc-950 border border-zinc-800 p-5 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                type="button"
                disabled={playsUsed >= 3 || isSpeakingAudio}
                onClick={handlePlayListeningAudio}
                className={`px-5 py-3 rounded-xl font-semibold text-xs flex items-center gap-2 transition-colors ${
                  playsUsed >= 3
                    ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                    : 'bg-blue-500 hover:bg-blue-400 text-white cursor-pointer'
                }`}
              >
                {isSpeakingAudio ? (
                  <Volume2 className="w-4 h-4 animate-pulse" />
                ) : (
                  <Headphones className="w-4 h-4" />
                )}
                <span>
                  {isSpeakingAudio
                    ? 'Speaking Audio...'
                    : playsUsed >= 3
                      ? '0 Replays Left'
                      : `Play Spoken Audio (${3 - playsUsed} left)`}
                </span>
              </button>

              <div className="flex items-center gap-2 text-xs text-zinc-400">
                <span>Speed:</span>
                {[0.85, 1.0].map((rate) => (
                  <button
                    key={rate}
                    type="button"
                    onClick={() => setSpeechRate(rate)}
                    className={`px-2 py-1 rounded-lg border font-mono-num cursor-pointer ${
                      speechRate === rate
                        ? 'border-blue-500 bg-blue-500/15 text-blue-300'
                        : 'border-zinc-800 text-zinc-400'
                    }`}
                  >
                    {rate}x
                  </button>
                ))}
              </div>
            </div>

            <span className="font-mono-num text-xs text-zinc-500">
              Replays used: {playsUsed}/3
            </span>
          </div>

          {/* Step 1: Dictation Input */}
          <div className="space-y-2">
            <label htmlFor="det-dictation" className="block text-sm font-medium text-zinc-200">
              1. Type exactly what you hear:
            </label>
            <textarea
              id="det-dictation"
              rows={3}
              disabled={listenSubmitted}
              value={dictationText}
              onChange={(e) => setDictationText(e.target.value)}
              placeholder="Listen carefully and type the spoken sentence..."
              className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-zinc-100 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Step 2: Audio Comprehension Question */}
          <div className="space-y-2.5">
            <div className="text-sm font-medium text-zinc-200">
              2. {activeListenPrompt.question}
            </div>
            <div className="space-y-2">
              {activeListenPrompt.options.map((opt, idx) => (
                <button
                  key={idx}
                  type="button"
                  disabled={listenSubmitted}
                  onClick={() => setListenMcq(idx)}
                  className={`w-full text-left px-4 py-2.5 rounded-xl border text-xs transition-colors cursor-pointer ${
                    listenSubmitted
                      ? idx === activeListenPrompt.correctOption
                        ? 'border-blue-500 bg-blue-500/15 text-blue-200'
                        : listenMcq === idx
                          ? 'border-red-500 bg-red-500/15 text-red-300'
                          : 'border-zinc-800 bg-zinc-950/60 text-zinc-500'
                      : listenMcq === idx
                        ? 'border-blue-500 bg-blue-500/15 text-zinc-100'
                        : 'border-zinc-800 bg-zinc-950/70 text-zinc-300 hover:border-zinc-700'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {listenSubmitted && (
            <div className="p-4 rounded-xl bg-zinc-950 border border-blue-500/35 space-y-1.5">
              <div className="text-xs font-semibold text-blue-400">
                Dictation Match: {listenAccuracy}%
              </div>
              <div className="text-xs text-zinc-300">
                <span className="text-zinc-500">Original Spoken Sentence:</span> “
                {activeListenPrompt.sentence}”
              </div>
            </div>
          )}

          {!listenSubmitted ? (
            <button
              type="button"
              onClick={handleSubmitListening}
              className="px-5 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-400 text-white font-semibold text-xs cursor-pointer"
            >
              Submit Listening &amp; Score
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                setPlaysUsed(0);
                setDictationText('');
                setListenMcq(null);
                setListenSubmitted(false);
                setListenAccuracy(null);
              }}
              className="px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-semibold text-xs cursor-pointer"
            >
              Retry Listening
            </button>
          )}
        </div>
      )}

      {/* 3. SPEAKING: REAL MICROPHONE + AI AUDIO EXAMINER */}
      {activeTab === 'Conversation' && (
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <img
                src={AI_MASCOT_AVATAR}
                alt="AI Speaking Examiner"
                className="w-11 h-11 rounded-xl object-cover border border-blue-500/40 shrink-0"
              />
              <div>
                <div className="text-xs text-blue-400 font-medium">
                  DET Speaking · Real Microphone + Multimodal AI Grader
                </div>
                <h2 className="font-display text-lg font-semibold text-zinc-50">
                  Speak aloud for 30–60s and get evaluated on Pronunciation &amp; Fluency
                </h2>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setSpeakPromptIdx((p) => (p + 1) % SPEAKING_PROMPTS.length);
                setSpeakResult(null);
                setAudioBlobUrl(null);
                setAudioBase64(null);
                setLiveTranscript('');
                setRecordSeconds(0);
              }}
              className="px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 hover:text-zinc-50 cursor-pointer self-start"
            >
              Next Topic
            </button>
          </div>

          <div className="p-5 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-zinc-200 leading-relaxed">
            <span className="text-xs text-sky-400 block mb-1">Speaking Prompt:</span>
            {SPEAKING_PROMPTS[speakPromptIdx % SPEAKING_PROMPTS.length]}
          </div>

          {/* Microphone Recording Studio */}
          <div className="rounded-2xl bg-zinc-950/90 border border-zinc-800 p-6 flex flex-col sm:flex-row items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              {!isRecording ? (
                <button
                  type="button"
                  onClick={handleStartRecording}
                  className="px-5 py-3 rounded-xl bg-blue-500 hover:bg-blue-400 text-white font-semibold text-xs flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <Mic className="w-4 h-4" />
                  <span>{audioBlobUrl ? 'Re-record Answer' : 'Start Speaking (Mic)'}</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleStopRecording}
                  className="px-5 py-3 rounded-xl bg-red-500 hover:bg-red-400 text-white font-semibold text-xs flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <Square className="w-4 h-4" />
                  <span>Stop Recording</span>
                </button>
              )}

              <div>
                <div className="font-mono-num text-xl font-bold text-zinc-100">
                  00:{String(recordSeconds).padStart(2, '0')}{' '}
                  <span className="text-xs font-normal text-zinc-500">/ 01:30 max</span>
                </div>
                <div className="text-xs text-zinc-400">
                  {isRecording
                    ? 'Listening to your microphone...'
                    : audioBlobUrl
                      ? 'Audio captured — ready for AI grading'
                      : 'Press Start Speaking and speak naturally'}
                </div>
              </div>
            </div>

            {audioBlobUrl && (
              <audio controls src={audioBlobUrl} className="h-10 max-w-xs" />
            )}
          </div>

          {/* Live / Editable Transcript */}
          <div className="space-y-1.5">
            <label htmlFor="speak-transcript" className="text-xs text-zinc-400">
              Live Speech Caption / Backup Transcript (auto-fills if supported, or edit manually):
            </label>
            <textarea
              id="speak-transcript"
              rows={3}
              value={liveTranscript}
              onChange={(e) => setLiveTranscript(e.target.value)}
              placeholder="Your spoken words appear here automatically in Chrome/Edge, or you can type if mic is unavailable..."
              className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 focus:outline-none focus:border-blue-500"
            />
          </div>

          {micError && (
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300">
              {micError}
            </div>
          )}

          <button
            type="button"
            disabled={speakLoading || isRecording}
            onClick={handleSubmitSpeakingAi}
            className="px-5 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-400 disabled:opacity-60 text-white font-semibold text-xs flex items-center gap-2 cursor-pointer"
          >
            {speakLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>AI Examiner is listening &amp; grading...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Evaluate My Speaking with AI</span>
              </>
            )}
          </button>

          {speakResult && (
            <div className="rounded-2xl border border-blue-500/35 bg-zinc-950/90 p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                <div>
                  <div className="text-xs text-blue-400 font-medium">
                    DET Speaking Assessment · CEFR {speakResult.cefrLevel}
                  </div>
                  <div className="text-sm text-zinc-300 mt-1">
                    Detected Speech: “{speakResult.transcriptDetected}”
                  </div>
                </div>
                <div className="font-mono-num text-3xl font-bold text-blue-400 shrink-0">
                  {speakResult.score}/160
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 space-y-1">
                  <div className="font-semibold text-sky-400">Fluency &amp; Pronunciation</div>
                  <p className="text-zinc-300 leading-relaxed">
                    {speakResult.fluencyAndPronunciation}
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 space-y-1">
                  <div className="font-semibold text-indigo-400">Vocabulary &amp; Grammar</div>
                  <p className="text-zinc-300 leading-relaxed">
                    {speakResult.vocabularyAndGrammar}
                  </p>
                </div>
              </div>

              <div className="space-y-1 text-xs">
                <div className="font-semibold text-amber-400">How to Reach 145+:</div>
                <ul className="list-disc pl-4 text-zinc-300 space-y-1">
                  {speakResult.improvements.map((imp, i) => (
                    <li key={i}>{imp}</li>
                  ))}
                </ul>
              </div>

              <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs space-y-1">
                <div className="font-semibold text-blue-400">Band 145+ Model Spoken Answer</div>
                <p className="text-zinc-300 leading-relaxed">{speakResult.modelResponse}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4. WRITING / PRODUCTION: TIMED ESSAY + AI GRADER */}
      {activeTab === 'Production' && (
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-6 sm:p-8 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-xs text-blue-400 font-medium">
                DET Production · Timed Writing &amp; AI Examiner
              </div>
              <h2 className="font-display text-xl font-semibold text-zinc-50 mt-1">
                {activeWritePrompt.title}
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <span className="font-mono-num text-sm font-bold text-sky-400 flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {String(Math.floor(writeSecondsLeft / 60)).padStart(2, '0')}:
                {String(writeSecondsLeft % 60).padStart(2, '0')}
              </span>
              <button
                type="button"
                onClick={() => {
                  setWritePromptIdx((p) => (p + 1) % WRITING_PROMPTS.length);
                  setWriteText('');
                  setWriteSecondsLeft(240);
                  setWriteTimerRunning(false);
                  setWriteResult(null);
                  setWriteError('');
                }}
                className="px-3 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 hover:text-zinc-50 cursor-pointer"
              >
                Switch Prompt
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {activeWritePrompt.hasScene && (
              <div className="lg:col-span-4 rounded-xl border border-zinc-800 bg-zinc-950 p-4 flex items-center justify-center">
                {/* Clean SVG Desk Scene for "Write About the Photo" */}
                <svg viewBox="0 0 260 180" className="w-full h-40">
                  <rect width="260" height="180" rx="12" fill="#090d16" />
                  <circle cx="215" cy="40" r="18" fill="#1e3a8a" opacity="0.6" />
                  <rect x="20" y="132" width="220" height="12" rx="4" fill="#1e293b" />
                  {/* Laptop */}
                  <rect x="75" y="76" width="84" height="52" rx="5" fill="#1d4ed8" opacity="0.25" stroke="#60a5fa" strokeWidth="2" />
                  <rect x="65" y="128" width="104" height="6" rx="2" fill="#64748b" />
                  {/* Lamp */}
                  <path d="M195 132 L195 85 L178 68" fill="none" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" />
                  <polygon points="168,68 188,68 182,56 174,56" fill="#38bdf8" />
                  <polygon points="168,68 188,68 205,132 150,132" fill="#38bdf8" opacity="0.08" />
                  {/* Notebook */}
                  <rect x="28" y="114" width="32" height="18" rx="2" fill="#334155" stroke="#94a3b8" strokeWidth="1" />
                </svg>
              </div>
            )}

            <div
              className={`${
                activeWritePrompt.hasScene ? 'lg:col-span-8' : 'lg:col-span-12'
              } p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-zinc-200 leading-relaxed flex items-center`}
            >
              {activeWritePrompt.prompt}
            </div>
          </div>

          <textarea
            rows={7}
            value={writeText}
            onChange={(e) => {
              if (!writeTimerRunning && writeSecondsLeft === 240) setWriteTimerRunning(true);
              setWriteText(e.target.value);
            }}
            placeholder="Start typing here — the 4-minute DET countdown begins automatically..."
            className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-zinc-100 leading-relaxed focus:outline-none focus:border-blue-500"
          />

          {writeError && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300">
              {writeError}
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="font-mono-num text-xs text-zinc-400">
              {wordCount} words written (Target: 75–140 words)
            </span>

            <button
              type="button"
              disabled={writeLoading}
              onClick={handleSubmitWritingAi}
              className="px-5 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-400 disabled:opacity-60 text-white font-semibold text-xs flex items-center gap-2 cursor-pointer"
            >
              {writeLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Grading Essay...</span>
                </>
              ) : (
                <>
                  <PenTool className="w-4 h-4" />
                  <span>Submit Writing to AI Examiner</span>
                </>
              )}
            </button>
          </div>

          {writeResult && (
            <div className="rounded-2xl border border-blue-500/35 bg-zinc-950/90 p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                <div>
                  <div className="text-xs text-blue-400 font-medium">
                    DET Writing Score · CEFR {writeResult.cefrLevel}
                  </div>
                  <p className="text-xs text-zinc-300 mt-1">{writeResult.feedback}</p>
                </div>
                <div className="font-mono-num text-3xl font-bold text-blue-400 shrink-0">
                  {writeResult.score}/160
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1.5">
                  <div className="font-semibold text-sky-400">Strengths</div>
                  <ul className="list-disc pl-4 text-zinc-300 space-y-1">
                    {writeResult.strengths.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-1.5">
                  <div className="font-semibold text-amber-400">Exact Grammar Fixes</div>
                  <ul className="list-disc pl-4 text-zinc-300 space-y-1">
                    {writeResult.grammarFixes.map((g, i) => (
                      <li key={i}>{g}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-xs space-y-1">
                <div className="font-semibold text-blue-400">Band 145+ Improved Rewrite</div>
                <p className="text-zinc-300 leading-relaxed">{writeResult.improvedSample}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 5. PRACTICE HISTORY */}
      {activeTab === 'History' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-5">
              <div className="text-xs text-zinc-400">Average DET Score</div>
              <div className="font-mono-num text-3xl font-bold text-zinc-50 mt-1">
                {stats.avg} <span className="text-xs font-normal text-zinc-500">/ 160</span>
              </div>
            </div>
            <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-5">
              <div className="text-xs text-zinc-400">Personal Best Score</div>
              <div className="font-mono-num text-3xl font-bold text-blue-400 mt-1">
                {stats.best}
              </div>
            </div>
            <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-5">
              <div className="text-xs text-zinc-400">Total Practice Time</div>
              <div className="font-mono-num text-3xl font-bold text-sky-400 mt-1">
                {stats.totalMin} min
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            <div className="xl:col-span-7 rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-6">
              <div className="flex items-center gap-2 text-sm font-semibold text-zinc-100 mb-4">
                <BarChart3 className="w-4 h-4 text-blue-400" />
                <span>Score Trend (Recent Sessions)</span>
              </div>

              {history.length >= 2 ? (
                <svg viewBox="0 0 520 140" className="w-full h-36 overflow-visible">
                  <line x1="20" y1="20" x2="500" y2="20" stroke="#27272a" strokeDasharray="4 4" />
                  <line x1="20" y1="70" x2="500" y2="70" stroke="#27272a" strokeDasharray="4 4" />
                  <line x1="20" y1="120" x2="500" y2="120" stroke="#27272a" strokeDasharray="4 4" />
                  <polyline
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={chartPoints}
                  />
                </svg>
              ) : (
                <div className="h-36 flex items-center justify-center text-xs text-zinc-500">
                  Complete at least 2 sessions to render trend line.
                </div>
              )}
            </div>

            <form
              onSubmit={handleAddManual}
              className="xl:col-span-5 rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-6 space-y-3"
            >
              <div className="text-sm font-semibold text-zinc-100">Log External Mock Test</div>
              <div className="grid grid-cols-3 gap-2">
                <select
                  value={manualSegment}
                  onChange={(e) => setManualSegment(e.target.value as DetSegment)}
                  className="col-span-1 px-2.5 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-200"
                >
                  <option value="Literacy">Literacy</option>
                  <option value="Comprehension">Listening</option>
                  <option value="Conversation">Speaking</option>
                  <option value="Production">Writing</option>
                </select>
                <input
                  type="number"
                  min={10}
                  max={160}
                  value={manualScore}
                  onChange={(e) => setManualScore(e.target.value)}
                  placeholder="Score"
                  className="px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 font-mono-num"
                />
                <input
                  type="number"
                  min={30}
                  value={manualTime}
                  onChange={(e) => setManualTime(e.target.value)}
                  placeholder="Sec"
                  className="px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 font-mono-num"
                />
              </div>
              <input
                type="text"
                value={manualNote}
                onChange={(e) => setManualNote(e.target.value)}
                placeholder="Notes (e.g., Official Practice Test #4)"
                className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100"
              />
              <button
                type="submit"
                className="w-full py-2 rounded-xl bg-blue-500 hover:bg-blue-400 text-white text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Log Score</span>
              </button>
            </form>
          </div>

          <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-800 text-xs text-zinc-400">
                    <th className="py-3 px-5 font-medium">Date</th>
                    <th className="py-3 px-5 font-medium">Segment</th>
                    <th className="py-3 px-5 font-medium">Accuracy / Notes</th>
                    <th className="py-3 px-5 font-medium">Time</th>
                    <th className="py-3 px-5 font-medium text-right">DET Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60 text-sm">
                  {history.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-10 text-center text-xs text-zinc-500">
                        No DET sessions logged yet. Complete any Literacy, Listening, Speaking, or Writing drill above!
                      </td>
                    </tr>
                  ) : (
                    [...history].reverse().map((row) => (
                      <tr key={row.id} className="hover:bg-zinc-900/80">
                        <td className="py-3 px-5 font-mono-num text-xs text-zinc-400">{row.date}</td>
                        <td className="py-3 px-5 font-medium text-zinc-200">{row.segment}</td>
                        <td className="py-3 px-5 text-xs text-zinc-400">
                          {row.rawCorrect} · {row.notes}
                        </td>
                        <td className="py-3 px-5 font-mono-num text-xs text-zinc-400">
                          {Math.floor(row.timeSpentSec / 60)}m {row.timeSpentSec % 60}s
                        </td>
                        <td className="py-3 px-5 font-mono-num font-bold text-blue-400 text-right">
                          {row.score}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
