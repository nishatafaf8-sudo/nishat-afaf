import React, { useMemo, useRef, useState } from 'react';
import {
  Bot,
  Eye,
  ImagePlus,
  Lightbulb,
  Send,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react';
import { AI_MASCOT_AVATAR } from '../data/elevoraData';
import { HscStream, SyllabusSubject } from '../types';

interface AiTeacherViewProps {
  syllabus: SyllabusSubject[];
  studentName: string;
  studentStream: HscStream;
}

interface TutorTurn {
  id: string;
  role: 'user' | 'assistant';
  subject: string;
  text: string;
  imageDataUrl?: string;
  keyFormulaOrRule?: string;
  stepByStep?: string[];
  visualSvg?: string;
  visualCaption?: string;
  followUpQuestions?: string[];
}

function sanitizeSvgMarkup(rawSvg: string): string {
  if (!rawSvg || !rawSvg.includes('<svg')) return '';
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(rawSvg, 'image/svg+xml');
    const svg = doc.querySelector('svg');
    if (!svg || doc.querySelector('parsererror')) return '';

    const blockedTags = svg.querySelectorAll('script, foreignObject, iframe, object, embed');
    blockedTags.forEach((el) => el.remove());

    const allElements = svg.querySelectorAll('*');
    allElements.forEach((el) => {
      Array.from(el.attributes).forEach((attr) => {
        if (attr.name.toLowerCase().startsWith('on') || attr.value.toLowerCase().includes('javascript:')) {
          el.removeAttribute(attr.name);
        }
      });
    });

    svg.setAttribute('class', 'w-full h-auto max-h-80 rounded-xl');
    return svg.outerHTML;
  } catch {
    return '';
  }
}

export const AiTeacherView: React.FC<AiTeacherViewProps> = ({
  syllabus,
  studentName,
  studentStream,
}) => {
  const subjectOptions = useMemo(() => {
    const streamSubs = syllabus.filter(
      (s) => s.stream === 'Both' || s.stream === studentStream
    );
    const otherSubs = syllabus.filter(
      (s) => s.stream !== 'Both' && s.stream !== studentStream
    );
    return [...streamSubs, ...otherSubs];
  }, [syllabus, studentStream]);

  const [selectedSubject, setSelectedSubject] = useState<string>(
    () => subjectOptions[0]?.name || 'Physics 1st Paper'
  );
  const [visualMode, setVisualMode] = useState(true);
  const [question, setQuestion] = useState('');
  const [imagePreviewUrl, setImagePreviewUrl] = useState('');
  const [imageBase64, setImageBase64] = useState('');
  const [imageMimeType, setImageMimeType] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [turns, setTurns] = useState<TutorTurn[]>([
    {
      id: 'welcome-turn',
      role: 'assistant',
      subject: 'All HSC Subjects',
      text: `আসসালামু আলাইকুম / হ্যালো ${studentName || 'Student'}! আমি Professor Mochi — তোমার পার্সোনাল AI শিক্ষক। Science, Commerce, Arts, ICT, English বা Bangla—যে কোনো বিষয়ের প্রশ্ন করতে পারো, অথবা খাতা/বইয়ের অঙ্ক বা ডায়াগ্রামের ছবি আপলোড করো। নিচের "Visual Diagram Mode" অন রাখলে আমি চিত্র ও গ্রাফসহ বুঝিয়ে দেব!`,
      keyFormulaOrRule:
        'Tip: Upload any textbook/handwritten math, circuit, ledger, or economics graph photo and ask "Explain this visually step-by-step!"',
      followUpQuestions: [
        'Explain river-boat crossing vector problem with a visual diagram',
        'হিসাব সমীকরণ (A = L + E) ও ডেবিট-ক্রেডিট নিয়ম ভিজ্যুয়াল ছকে বুঝিয়ে দাও',
        'Demand ও Supply curve থেকে ভারসাম্য দাম কীভাবে বের করে?',
      ],
    },
  ]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (PNG, JPG, WebP).');
      return;
    }
    if (file.size > 6 * 1024 * 1024) {
      setError('Please choose an image smaller than 6 MB.');
      return;
    }

    setError('');
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result || '');
      const commaIdx = result.indexOf(',');
      if (commaIdx > -1) {
        setImagePreviewUrl(result);
        setImageBase64(result.slice(commaIdx + 1));
        setImageMimeType(file.type || 'image/jpeg');
      }
    };
    reader.readAsDataURL(file);
  };

  const clearAttachedImage = () => {
    setImagePreviewUrl('');
    setImageBase64('');
    setImageMimeType('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const sendQuestion = async (overrideText?: string, forceVisual?: boolean) => {
    const promptText = (overrideText ?? question).trim();
    if (!promptText && !imageBase64) {
      setError('Please type your question or attach a photo of your problem.');
      return;
    }

    const useVisual = forceVisual ?? visualMode;
    setError('');
    setLoading(true);

    const userTurn: TutorTurn = {
      id: `user-${Date.now()}`,
      role: 'user',
      subject: selectedSubject,
      text: promptText || 'Uploaded a problem photo — please solve and explain step-by-step.',
      imageDataUrl: imagePreviewUrl || undefined,
    };

    const nextTurns = [...turns, userTurn];
    setTurns(nextTurns);

    const payloadImage = imageBase64;
    const payloadMime = imageMimeType;

    if (!overrideText) setQuestion('');
    clearAttachedImage();

    try {
      const res = await fetch('/api/ai-teacher', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: selectedSubject,
          stream: studentStream,
          question: promptText,
          imageBase64: payloadImage || undefined,
          mimeType: payloadMime || undefined,
          visualMode: useVisual,
          history: nextTurns.slice(-5).map((t) => ({ role: t.role, text: t.text })),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Professor Mochi could not answer right now.');
      }

      const safeSvg = sanitizeSvgMarkup(String(data.visualSvg || ''));

      const aiTurn: TutorTurn = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        subject: selectedSubject,
        text: String(data.answer || ''),
        keyFormulaOrRule: data.keyFormulaOrRule ? String(data.keyFormulaOrRule) : undefined,
        stepByStep: Array.isArray(data.stepByStep) ? data.stepByStep.map(String) : undefined,
        visualSvg: safeSvg || undefined,
        visualCaption: data.visualCaption ? String(data.visualCaption) : undefined,
        followUpQuestions: Array.isArray(data.followUpQuestions)
          ? data.followUpQuestions.map(String)
          : undefined,
      };

      setTurns((prev) => [...prev, aiTurn]);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to reach AI Teacher.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <img
            src={AI_MASCOT_AVATAR}
            alt="Professor Mochi AI Teacher"
            className="w-12 h-12 rounded-2xl object-cover border border-blue-500/40 shrink-0"
          />
          <div>
            <h1 className="font-display text-2xl font-bold text-zinc-50">
              AI Teacher Studio (Professor Mochi)
            </h1>
            <p className="text-sm text-zinc-400">
              Ask any Science, Commerce, Arts, ICT, or English question — attach problem photos &amp; get visual diagram explanations.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setVisualMode((prev) => !prev)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold border flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap ${
              visualMode
                ? 'bg-blue-500/15 border-blue-500/45 text-blue-300'
                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Visual Diagram Mode: {visualMode ? 'ON' : 'OFF'}</span>
          </button>

          <button
            type="button"
            onClick={() => setTurns((prev) => prev.slice(0, 1))}
            className="px-3 py-2 rounded-xl text-xs font-medium border border-zinc-800 bg-zinc-900 text-zinc-300 hover:text-zinc-50 flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Chat</span>
          </button>
        </div>
      </div>

      {/* Chat Thread */}
      <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/50 p-5 sm:p-6 space-y-5 max-h-[620px] overflow-y-auto">
        {turns.map((turn) => (
          <div
            key={turn.id}
            className={`flex gap-3.5 ${turn.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {turn.role === 'assistant' && (
              <img
                src={AI_MASCOT_AVATAR}
                alt="Professor Mochi"
                className="w-9 h-9 rounded-xl object-cover border border-blue-500/40 shrink-0 mt-1"
              />
            )}

            <div
              className={`max-w-3xl rounded-2xl p-4 sm:p-5 space-y-3.5 ${
                turn.role === 'user'
                  ? 'bg-blue-600/20 border border-blue-500/35 text-zinc-100'
                  : 'bg-zinc-950/90 border border-zinc-800/90 text-zinc-200'
              }`}
            >
              <div className="flex items-center justify-between gap-3 text-[11px]">
                <span className="font-semibold text-blue-400">
                  {turn.role === 'user' ? `${studentName || 'You'} · ${turn.subject}` : `Professor Mochi · ${turn.subject}`}
                </span>
              </div>

              {turn.imageDataUrl && (
                <img
                  src={turn.imageDataUrl}
                  alt="Uploaded question"
                  className="max-h-60 rounded-xl border border-zinc-800 object-contain bg-zinc-950"
                />
              )}

              <p className="text-sm leading-relaxed whitespace-pre-line">{turn.text}</p>

              {turn.keyFormulaOrRule && (
                <div className="rounded-xl border border-indigo-500/30 bg-indigo-500/10 px-4 py-2.5 text-xs text-indigo-200 flex items-start gap-2">
                  <Lightbulb className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                  <span>{turn.keyFormulaOrRule}</span>
                </div>
              )}

              {turn.stepByStep && turn.stepByStep.length > 0 && (
                <div className="space-y-1.5">
                  <div className="text-xs font-semibold text-blue-300">
                    Step-by-Step Solution:
                  </div>
                  <ol className="space-y-1.5 list-decimal pl-5 text-xs text-zinc-300 leading-relaxed">
                    {turn.stepByStep.map((step, idx) => (
                      <li key={idx}>{step}</li>
                    ))}
                  </ol>
                </div>
              )}

              {turn.visualSvg && (
                <div className="rounded-xl border border-blue-500/30 bg-zinc-950 p-3.5 space-y-2">
                  <div className="text-[11px] font-semibold text-sky-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Visual Whiteboard Explanation</span>
                  </div>
                  <div
                    className="w-full overflow-x-auto"
                    dangerouslySetInnerHTML={{ __html: turn.visualSvg }}
                  />
                  {turn.visualCaption && (
                    <p className="text-[11px] text-zinc-400">{turn.visualCaption}</p>
                  )}
                </div>
              )}

              {turn.followUpQuestions && turn.followUpQuestions.length > 0 && (
                <div className="pt-2 flex flex-wrap gap-1.5">
                  {turn.followUpQuestions.map((fq, i) => (
                    <button
                      key={i}
                      type="button"
                      disabled={loading}
                      onClick={() => void sendQuestion(fq, true)}
                      className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-blue-500/40 text-[11px] text-zinc-300 hover:text-blue-300 text-left transition-colors cursor-pointer"
                    >
                      {fq}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-3 text-xs text-blue-400 px-2">
            <Bot className="w-4 h-4 animate-bounce" />
            <span>Professor Mochi is solving &amp; drawing your explanation...</span>
          </div>
        )}
      </div>

      {/* Composer */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void sendQuestion();
        }}
        className="rounded-2xl border border-zinc-800/80 bg-zinc-900/70 p-4 sm:p-5 space-y-3.5"
      >
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
          <div className="sm:col-span-5">
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs font-medium text-zinc-100 focus:outline-none focus:border-blue-500"
            >
              <option value="General HSC Doubt">All Subjects / General HSC Doubt</option>
              {subjectOptions.map((sub) => (
                <option key={sub.id} value={sub.name}>
                  {sub.name}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-7 flex flex-wrap items-center justify-between sm:justify-end gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3.5 py-2 rounded-xl border border-zinc-700 bg-zinc-950 hover:border-blue-500/50 text-xs font-medium text-zinc-200 flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap"
            >
              <ImagePlus className="w-4 h-4 text-blue-400" />
              <span>Attach Problem Photo (ছবি আপলোড)</span>
            </button>
          </div>
        </div>

        {imagePreviewUrl && (
          <div className="relative inline-flex items-center gap-3 rounded-xl border border-blue-500/35 bg-zinc-950 p-2.5">
            <img
              src={imagePreviewUrl}
              alt="Preview"
              className="w-16 h-16 rounded-lg object-cover border border-zinc-800"
            />
            <div className="text-xs text-zinc-300 pr-6">
              Problem photo attached · Ready for AI analysis
            </div>
            <button
              type="button"
              onClick={clearAttachedImage}
              className="absolute top-1.5 right-1.5 p-1 rounded-md bg-zinc-900 text-zinc-400 hover:text-red-300 cursor-pointer"
              aria-label="Remove attached photo"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {error && (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">
            {error}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <textarea
            rows={2}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="যেকোনো বিষয়ের প্রশ্ন লিখুন (যেমন: কুলম্বের সূত্র চিত্রসহ বুঝাও / Accounting রেওয়ামিল ভুল সংশোধন / Grammar modifier)..."
            className="flex-1 px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-400 disabled:opacity-60 text-white text-sm font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer shrink-0"
          >
            <Send className="w-4 h-4" />
            <span>{loading ? 'Thinking...' : 'Ask AI Teacher'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
