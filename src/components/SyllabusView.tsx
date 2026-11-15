import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  BarChart3,
  BookOpenCheck,
  Calendar,
  Check,
  CheckCircle2,
  Eye,
  EyeOff,
  FileCheck2,
  Flame,
  Layers,
  MapPin,
  Plus,
  PlusCircle,
  RefreshCw,
  RotateCcw,
  Shuffle,
  Sparkles,
  XCircle,
} from 'lucide-react';
import {
  ChapterBoardPack,
  ChapterCqItem,
  ChapterMcqItem,
  CqAiEvaluation,
  getCuratedChapterPack,
  getCuratedPackCounts,
  hasCuratedChapterPack,
} from '../data/boardAnalysisData';
import { HscStream, HscYear, SyllabusSubject } from '../types';

interface SyllabusViewProps {
  syllabus: SyllabusSubject[];
  studentStream: HscStream;
  studentYear: HscYear;
  onToggleChapter: (subjectId: string, chapterId: string) => void;
  onIncrementSubject: (subjectId: string) => void;
  onAddChapter: (subjectId: string, title: string) => void;
}

const AI_PACKS_STORAGE_KEY = 'elevora_ai_board_packs_v1';
const BOARD_LIST = [
  'All',
  'Dhaka',
  'Rajshahi',
  'Chattogram',
  'Cumilla',
  'Sylhet',
  'Jashore',
  'Dinajpur',
  'Barishal',
  'Mymensingh',
] as const;

const YEAR_LIST = ['All', '2024', '2023', '2022', '2021', '2019', '2018'] as const;

function parseBoardAndYear(
  boardTag: string,
  explicitBoard?: string,
  explicitYear?: string
): { board: string; year: string } {
  let board = explicitBoard?.trim() || '';
  let year = explicitYear?.trim() || '';

  if (!board) {
    const foundBoard = BOARD_LIST.find(
      (b) => b !== 'All' && boardTag.toLowerCase().includes(b.toLowerCase())
    );
    board = foundBoard || 'All Boards';
  }

  if (!year) {
    const fourDigit = boardTag.match(/\b(20\d{2})\b/);
    if (fourDigit) {
      year = fourDigit[1];
    } else {
      const twoDigit = boardTag.match(/'(\d{2})\b/);
      if (twoDigit) {
        year = `20${twoDigit[1]}`;
      }
    }
  }

  return { board, year };
}

function loadStoredAiPacks(): Record<string, ChapterBoardPack> {
  try {
    const raw = window.localStorage.getItem(AI_PACKS_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? (parsed as Record<string, ChapterBoardPack>) : {};
  } catch {
    return {};
  }
}

export const SyllabusView: React.FC<SyllabusViewProps> = ({
  syllabus,
  studentStream,
  studentYear,
  onToggleChapter,
  onIncrementSubject,
  onAddChapter,
}) => {
  const [activeTab, setActiveTab] = useState<'checklist' | 'board-lab'>('checklist');
  const [paperFilter, setPaperFilter] = useState<'All' | HscYear>(studentYear);
  const [streamFilter, setStreamFilter] = useState<HscStream | 'All'>(studentStream);
  const [newChapterDrafts, setNewChapterDrafts] = useState<Record<string, string>>({});

  // Board Lab state
  const streamSubjects = useMemo(
    () => syllabus.filter((s) => s.stream === 'Both' || s.stream === studentStream),
    [syllabus, studentStream]
  );
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(
    () => streamSubjects[0]?.id || syllabus[0]?.id || ''
  );
  const selectedSubject = useMemo(
    () => syllabus.find((s) => s.id === selectedSubjectId) || streamSubjects[0] || syllabus[0],
    [syllabus, selectedSubjectId, streamSubjects]
  );
  const [selectedChapterId, setSelectedChapterId] = useState<string>(
    () => selectedSubject?.chapters[0]?.id || ''
  );
  const selectedChapter = useMemo(
    () =>
      selectedSubject?.chapters.find((c) => c.id === selectedChapterId) ||
      selectedSubject?.chapters[0],
    [selectedSubject, selectedChapterId]
  );

  const [labSection, setLabSection] = useState<'analysis' | 'mcq' | 'cq'>('mcq');
  const [aiPacksByChapter, setAiPacksByChapter] =
    useState<Record<string, ChapterBoardPack>>(loadStoredAiPacks);
  const [generatingPack, setGeneratingPack] = useState(false);
  const [appendingPack, setAppendingPack] = useState(false);
  const [labError, setLabError] = useState('');
  const autoRequestedRef = useRef<Set<string>>(new Set());

  // Multi-year & Board filters inside Board Lab
  const [yearFilter, setYearFilter] = useState<string>('All');
  const [boardFilter, setBoardFilter] = useState<string>('All');
  const [shuffleSeed, setShuffleSeed] = useState<number>(0);

  // MCQ interactive state
  const [mcqSelections, setMcqSelections] = useState<Record<string, number>>({});

  // CQ interactive state
  const [activeCqIndex, setActiveCqIndex] = useState(0);
  const [showModelSolution, setShowModelSolution] = useState(false);
  const [cqDraft, setCqDraft] = useState('');
  const [gradingCq, setGradingCq] = useState(false);
  const [cqEval, setCqEval] = useState<CqAiEvaluation | null>(null);

  useEffect(() => {
    try {
      window.localStorage.setItem(AI_PACKS_STORAGE_KEY, JSON.stringify(aiPacksByChapter));
    } catch {
      // Ignore storage quota errors
    }
  }, [aiPacksByChapter]);

  const activePack = useMemo(() => {
    if (!selectedSubject || !selectedChapter) return null;
    const curated = hasCuratedChapterPack(selectedChapter.id)
      ? getCuratedChapterPack(selectedSubject, selectedChapter)
      : null;
    const aiPack = aiPacksByChapter[selectedChapter.id] || null;

    if (curated && aiPack) {
      // Combine curated multi-year bank with any appended AI questions
      const existingMcqQ = new Set(curated.mcqs.map((m) => m.question));
      const extraMcqs = aiPack.mcqs.filter((m) => !existingMcqQ.has(m.question));
      const existingCqU = new Set(curated.cqs.map((c) => c.uddipok));
      const extraCqs = aiPack.cqs.filter((c) => !existingCqU.has(c.uddipok));
      return {
        importantTopics:
          aiPack.importantTopics.length > curated.importantTopics.length
            ? aiPack.importantTopics
            : curated.importantTopics,
        mcqs: [...curated.mcqs, ...extraMcqs],
        cqs: [...curated.cqs, ...extraCqs],
      };
    }
    return aiPack || curated || getCuratedChapterPack(selectedSubject, selectedChapter);
  }, [selectedSubject, selectedChapter, aiPacksByChapter]);

  const requestChapterPack = async (mode: 'replace' | 'append') => {
    if (!selectedSubject || !selectedChapter) return;
    const targetChapterId = selectedChapter.id;
    if (mode === 'append') {
      setAppendingPack(true);
    } else {
      setGeneratingPack(true);
    }
    setLabError('');

    const currentCount = activePack ? activePack.mcqs.length + activePack.cqs.length : 0;

    try {
      const res = await fetch('/api/board-practice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate',
          subjectName: selectedSubject.name,
          chapterTitle: selectedChapter.title,
          stream: selectedSubject.stream,
          paper: selectedSubject.paper,
          existingCount: mode === 'append' ? currentCount : 0,
          focusBoard: boardFilter,
          focusYear: yearFilter,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Could not generate Board Pack.');
      }

      const incomingTopics = Array.isArray(data.importantTopics) ? data.importantTopics : [];
      const incomingMcqs: ChapterMcqItem[] = Array.isArray(data.mcqs)
        ? data.mcqs.map((m: Record<string, unknown>, idx: number) => {
            const rawTag = String(m.boardTag || 'HSC Board Standard');
            const parsed = parseBoardAndYear(
              rawTag,
              typeof m.board === 'string' ? m.board : undefined,
              typeof m.year === 'string' ? m.year : undefined
            );
            return {
              id: `ai-mcq-${targetChapterId}-${Date.now()}-${idx}`,
              question: String(m.question || ''),
              options: Array.isArray(m.options) ? m.options.map(String) : [],
              correctIndex: Number(m.correctIndex ?? 0),
              boardTag: rawTag,
              board: parsed.board,
              year: parsed.year,
              explanation: String(m.explanation || ''),
            };
          })
        : [];

      const incomingCqs: ChapterCqItem[] = Array.isArray(data.cqs)
        ? data.cqs.map((c: Record<string, unknown>, idx: number) => {
            const rawTag = String(c.boardTag || 'HSC Board Standard');
            const parsed = parseBoardAndYear(
              rawTag,
              typeof c.board === 'string' ? c.board : undefined,
              typeof c.year === 'string' ? c.year : undefined
            );
            return {
              id: `ai-cq-${targetChapterId}-${Date.now()}-${idx}`,
              boardTag: rawTag,
              board: parsed.board,
              year: parsed.year,
              uddipok: String(c.uddipok || ''),
              ka: String(c.ka || ''),
              kha: String(c.kha || ''),
              ga: String(c.ga || ''),
              gha: String(c.gha || ''),
              modelSolution: String(c.modelSolution || ''),
            };
          })
        : [];

      setAiPacksByChapter((prev) => {
        const existing = prev[targetChapterId];
        if (mode === 'append' && existing) {
          return {
            ...prev,
            [targetChapterId]: {
              importantTopics:
                existing.importantTopics.length >= incomingTopics.length
                  ? existing.importantTopics
                  : incomingTopics,
              mcqs: [...existing.mcqs, ...incomingMcqs],
              cqs: [...existing.cqs, ...incomingCqs],
            },
          };
        }
        return {
          ...prev,
          [targetChapterId]: {
            importantTopics: incomingTopics,
            mcqs: incomingMcqs,
            cqs: incomingCqs,
          },
        };
      });

      if (mode === 'replace') {
        setMcqSelections({});
        setActiveCqIndex(0);
        setShowModelSolution(false);
        setCqEval(null);
      }
    } catch (err: unknown) {
      setLabError(err instanceof Error ? err.message : 'Failed to load chapter board questions.');
    } finally {
      setGeneratingPack(false);
      setAppendingPack(false);
    }
  };

  // Auto-generate dedicated chapter-wise multi-year bank when opening a non-curated chapter in Board Lab
  useEffect(() => {
    if (activeTab !== 'board-lab' || !selectedChapter || !selectedSubject) return;
    const chId = selectedChapter.id;
    if (hasCuratedChapterPack(chId)) return;
    if (aiPacksByChapter[chId]) return;
    if (autoRequestedRef.current.has(chId)) return;

    autoRequestedRef.current.add(chId);
    void requestChapterPack('replace');
  }, [activeTab, selectedChapter?.id, selectedSubject?.id]);

  // Filtered MCQs and CQs by Year & Board
  const filteredMcqs = useMemo(() => {
    if (!activePack) return [];
    const list = activePack.mcqs.filter((m) => {
      const meta = parseBoardAndYear(m.boardTag, m.board, m.year);
      const matchYear = yearFilter === 'All' || meta.year === yearFilter;
      const matchBoard =
        boardFilter === 'All' || meta.board.toLowerCase() === boardFilter.toLowerCase();
      return matchYear && matchBoard;
    });
    if (shuffleSeed === 0) return list;
    const copy = [...list];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = (i * 7 + shuffleSeed * 3) % (i + 1);
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }, [activePack, yearFilter, boardFilter, shuffleSeed]);

  const filteredCqs = useMemo(() => {
    if (!activePack) return [];
    return activePack.cqs.filter((c) => {
      const meta = parseBoardAndYear(c.boardTag, c.board, c.year);
      const matchYear = yearFilter === 'All' || meta.year === yearFilter;
      const matchBoard =
        boardFilter === 'All' || meta.board.toLowerCase() === boardFilter.toLowerCase();
      return matchYear && matchBoard;
    });
  }, [activePack, yearFilter, boardFilter]);

  const visibleSubjects = useMemo(() => {
    return syllabus.filter((sub) => {
      const matchPaper = paperFilter === 'All' || sub.paper === paperFilter;
      const matchStream =
        streamFilter === 'All' || sub.stream === 'Both' || sub.stream === streamFilter;
      return matchPaper && matchStream;
    });
  }, [syllabus, paperFilter, streamFilter]);

  const globalStats = useMemo(() => {
    const total = streamSubjects.reduce((acc, s) => acc + s.chapters.length, 0);
    const done = streamSubjects.reduce(
      (acc, s) => acc + s.chapters.filter((c) => c.completed).length,
      0
    );
    return {
      total,
      done,
      pct: total > 0 ? Math.round((done / total) * 100) : 0,
    };
  }, [streamSubjects]);

  const openChapterInBoardLab = (subjectId: string, chapterId?: string) => {
    const sub = syllabus.find((s) => s.id === subjectId);
    setSelectedSubjectId(subjectId);
    setSelectedChapterId(chapterId || sub?.chapters[0]?.id || '');
    setActiveTab('board-lab');
    setYearFilter('All');
    setBoardFilter('All');
    setMcqSelections({});
    setActiveCqIndex(0);
    setShowModelSolution(false);
    setCqEval(null);
    setLabError('');
  };

  const switchChapter = (chapterId: string) => {
    setSelectedChapterId(chapterId);
    setYearFilter('All');
    setBoardFilter('All');
    setMcqSelections({});
    setActiveCqIndex(0);
    setCqEval(null);
    setShowModelSolution(false);
    setLabError('');
  };

  const handleEvaluateCq = async () => {
    if (!selectedSubject || !selectedChapter || filteredCqs.length === 0) return;
    const currentCq = filteredCqs[activeCqIndex % filteredCqs.length];
    if (!currentCq) return;
    if (cqDraft.trim().length < 15) {
      setLabError('Please write your CQ answer (ক, খ, গ, ঘ) before AI checking.');
      return;
    }

    setGradingCq(true);
    setLabError('');
    try {
      const res = await fetch('/api/board-practice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'evaluate-cq',
          subjectName: selectedSubject.name,
          chapterTitle: selectedChapter.title,
          stream: selectedSubject.stream,
          paper: selectedSubject.paper,
          cq: currentCq,
          studentAnswer: cqDraft,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Could not evaluate CQ answer.');
      }
      setCqEval(data as CqAiEvaluation);
    } catch (err: unknown) {
      setLabError(err instanceof Error ? err.message : 'CQ grading failed.');
    } finally {
      setGradingCq(false);
    }
  };

  const mcqAnsweredCount = filteredMcqs.filter((m) => mcqSelections[m.id] !== undefined).length;
  const mcqCorrectCount = filteredMcqs.filter(
    (m) => mcqSelections[m.id] === m.correctIndex
  ).length;

  const getChapterBadgeCounts = (chapterId: string) => {
    const aiPack = aiPacksByChapter[chapterId];
    const curatedCounts = getCuratedPackCounts(chapterId);
    if (curatedCounts && aiPack) {
      return {
        mcqs: curatedCounts.mcqs + aiPack.mcqs.length,
        cqs: curatedCounts.cqs + aiPack.cqs.length,
      };
    }
    if (aiPack) {
      return { mcqs: aiPack.mcqs.length, cqs: aiPack.cqs.length };
    }
    return curatedCounts;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-zinc-50">
            HSC Syllabus &amp; Board Exam Lab
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Chapter-wise multi-year Board Questions (2018–2024), Topic Priority Analysis, CQ (সৃজনশীল) &amp; MCQ Practice.
          </p>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 px-5 py-3 flex items-center gap-5">
          <div>
            <div className="text-xs text-zinc-400">Global {studentStream} Completion</div>
            <div className="font-mono-num text-xl font-bold text-blue-400">
              {globalStats.pct}%{' '}
              <span className="text-xs font-normal text-zinc-400">
                ({globalStats.done}/{globalStats.total} chapters)
              </span>
            </div>
          </div>
          <div className="w-28 h-2 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all"
              style={{ width: `${globalStats.pct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Mode Tabs: Syllabus Checklist vs Board Analysis, CQ & MCQ */}
      <div className="flex flex-wrap items-center gap-2 p-1 bg-zinc-900 border border-zinc-800 rounded-xl w-fit">
        <button
          type="button"
          onClick={() => setActiveTab('checklist')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'checklist'
              ? 'bg-blue-500 text-white'
              : 'text-zinc-400 hover:text-zinc-100'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Syllabus Checklist</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('board-lab')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'board-lab'
              ? 'bg-indigo-500 text-white'
              : 'text-zinc-400 hover:text-zinc-100'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Chapter-Wise Board CQ &amp; MCQ Lab</span>
        </button>
      </div>

      {activeTab === 'checklist' ? (
        <>
          {/* Filters */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1 p-1 bg-zinc-900 border border-zinc-800 rounded-xl">
              {(['All', 'HSC 1st Year', 'HSC 2nd Year'] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPaperFilter(p)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                    paperFilter === p
                      ? 'bg-blue-500 text-white font-semibold'
                      : 'text-zinc-400 hover:text-zinc-100'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-1 p-1 bg-zinc-900 border border-zinc-800 rounded-xl">
              {(['Science', 'Commerce', 'Arts', 'All'] as const).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStreamFilter(st)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                    streamFilter === st
                      ? 'bg-indigo-500 text-white font-semibold'
                      : 'text-zinc-400 hover:text-zinc-100'
                  }`}
                >
                  {st === 'All' ? 'All Streams' : st}
                </button>
              ))}
            </div>
          </div>

          {/* Subject Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {visibleSubjects.map((sub) => {
              const total = sub.chapters.length;
              const done = sub.chapters.filter((c) => c.completed).length;
              const pct = total > 0 ? Math.round((done / total) * 100) : 0;
              const draft = newChapterDrafts[sub.id] || '';

              return (
                <div
                  key={sub.id}
                  className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-6 flex flex-col justify-between gap-5"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-xs text-zinc-400">
                          {sub.paper} · {sub.stream === 'Both' ? 'Core Compulsory' : sub.stream}
                        </div>
                        <h2 className="font-display text-lg font-semibold text-zinc-100 mt-0.5">
                          {sub.name}
                        </h2>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => openChapterInBoardLab(sub.id)}
                          className="px-2.5 py-1.5 rounded-xl text-xs font-medium border border-indigo-500/35 bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20 flex items-center gap-1 cursor-pointer whitespace-nowrap"
                        >
                          <BarChart3 className="w-3.5 h-3.5" />
                          <span>Board Lab</span>
                        </button>
                        <button
                          type="button"
                          disabled={done >= total}
                          onClick={() => onIncrementSubject(sub.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                            done >= total
                              ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30 cursor-default'
                              : 'bg-blue-500 hover:bg-blue-400 text-white cursor-pointer'
                          }`}
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>{done >= total ? 'All Done' : '+1 Done'}</span>
                        </button>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center gap-3">
                      <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="font-mono-num text-xs text-zinc-300 shrink-0">
                        {pct}% ({done}/{total})
                      </span>
                    </div>

                    <div className="mt-4 divide-y divide-zinc-800/60">
                      {sub.chapters.map((ch) => {
                        const counts = getChapterBadgeCounts(ch.id);
                        return (
                          <div
                            key={ch.id}
                            className="py-2.5 flex items-center justify-between gap-2"
                          >
                            <button
                              type="button"
                              onClick={() => onToggleChapter(sub.id, ch.id)}
                              className="flex-1 flex items-center gap-3 text-left group cursor-pointer min-w-0"
                            >
                              <span
                                className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                                  ch.completed
                                    ? 'bg-blue-500 border-blue-500 text-white'
                                    : 'bg-zinc-950 border-zinc-700 text-transparent group-hover:border-blue-500/60'
                                }`}
                              >
                                <Check className="w-3.5 h-3.5" />
                              </span>
                              <span
                                className={`text-sm transition-colors truncate ${
                                  ch.completed
                                    ? 'text-zinc-500 line-through'
                                    : 'text-zinc-200 group-hover:text-zinc-50'
                                }`}
                              >
                                {ch.title}
                              </span>
                            </button>

                            <button
                              type="button"
                              onClick={() => openChapterInBoardLab(sub.id, ch.id)}
                              className={`px-2.5 py-1 rounded-lg border text-[11px] font-medium transition-colors shrink-0 cursor-pointer whitespace-nowrap ${
                                counts
                                  ? 'bg-blue-500/10 border-blue-500/35 text-blue-300 hover:bg-blue-500/20'
                                  : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-indigo-500/40 hover:text-indigo-300'
                              }`}
                            >
                              {counts ? `${counts.mcqs} MCQ · ${counts.cqs} CQ` : 'Board CQ/MCQ'}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!draft.trim()) return;
                      onAddChapter(sub.id, draft);
                      setNewChapterDrafts((prev) => ({ ...prev, [sub.id]: '' }));
                    }}
                    className="pt-3 border-t border-zinc-800/70 flex items-center gap-2"
                  >
                    <input
                      type="text"
                      value={draft}
                      onChange={(e) =>
                        setNewChapterDrafts((prev) => ({ ...prev, [sub.id]: e.target.value }))
                      }
                      placeholder="Add custom chapter or topic..."
                      className="flex-1 px-3 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 hover:border-zinc-700 text-xs text-zinc-300 flex items-center gap-1 cursor-pointer whitespace-nowrap"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span>Add</span>
                    </button>
                  </form>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        /* BOARD QUESTION ANALYSIS, CHAPTER-WISE MULTI-YEAR CQ & MCQ PRACTICE LAB */
        <div className="space-y-6">
          {/* Subject & Chapter Selector Bar */}
          <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-5 space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end">
              <div className="lg:col-span-4 space-y-1.5">
                <label className="block text-xs font-medium text-zinc-400">
                  Select Subject ({studentStream} + Core)
                </label>
                <select
                  value={selectedSubject?.id || ''}
                  onChange={(e) => {
                    const nextSub = syllabus.find((s) => s.id === e.target.value);
                    setSelectedSubjectId(e.target.value);
                    switchChapter(nextSub?.chapters[0]?.id || '');
                  }}
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-zinc-100 focus:outline-none focus:border-blue-500"
                >
                  {syllabus.map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      [{sub.stream === 'Both' ? 'Core' : sub.stream}] {sub.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="lg:col-span-5 space-y-1.5">
                <label className="block text-xs font-medium text-zinc-400">
                  Select Chapter (অধ্যায়ভিত্তিক আলাদা বোর্ড প্রশ্ন)
                </label>
                <select
                  value={selectedChapter?.id || ''}
                  onChange={(e) => switchChapter(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-zinc-100 focus:outline-none focus:border-blue-500"
                >
                  {selectedSubject?.chapters.map((ch) => {
                    const counts = getChapterBadgeCounts(ch.id);
                    return (
                      <option key={ch.id} value={ch.id}>
                        {ch.title} {counts ? `(${counts.mcqs} MCQ · ${counts.cqs} CQ)` : ''}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="lg:col-span-3 flex items-center gap-2">
                <button
                  type="button"
                  disabled={generatingPack || appendingPack}
                  onClick={() => void requestChapterPack('append')}
                  className="flex-1 py-2.5 px-3.5 rounded-xl bg-blue-500 hover:bg-blue-400 disabled:opacity-60 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>
                    {appendingPack
                      ? 'Adding Questions...'
                      : generatingPack
                        ? 'Loading Chapter...'
                        : '+ Add More Board Qs'}
                  </span>
                </button>
                <button
                  type="button"
                  disabled={generatingPack || appendingPack}
                  onClick={() => void requestChapterPack('replace')}
                  title="Regenerate fresh multi-year Board Bank for this chapter"
                  className="p-2.5 rounded-xl border border-zinc-800 bg-zinc-950 hover:border-zinc-700 text-zinc-300 hover:text-zinc-50 disabled:opacity-50 cursor-pointer shrink-0"
                >
                  <RefreshCw className={`w-4 h-4 ${generatingPack ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>

            {/* Chapter-wise Quick Pill Switcher */}
            {selectedSubject && (
              <div className="pt-3 border-t border-zinc-800/80 space-y-2">
                <div className="flex items-center justify-between text-[11px] text-zinc-400">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Layers className="w-3.5 h-3.5 text-blue-400" />
                    <span>
                      Chapters in {selectedSubject.name} — প্রতি অধ্যায়ের আলাদা বোর্ড প্রশ্ন:
                    </span>
                  </span>
                  <span className="text-zinc-500">
                    {selectedSubject.chapters.length} Chapters
                  </span>
                </div>
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {selectedSubject.chapters.map((ch, idx) => {
                    const isActive = ch.id === selectedChapter?.id;
                    const counts = getChapterBadgeCounts(ch.id);
                    const shortLabel = ch.title.split(':')[0] || `Ch ${idx + 1}`;
                    return (
                      <button
                        key={ch.id}
                        type="button"
                        onClick={() => switchChapter(ch.id)}
                        className={`px-3 py-1.5 rounded-xl border text-xs font-medium shrink-0 transition-colors cursor-pointer flex items-center gap-1.5 ${
                          isActive
                            ? 'bg-blue-500/20 border-blue-500 text-blue-200'
                            : 'bg-zinc-950/80 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                        }`}
                      >
                        <span>{shortLabel}</span>
                        {counts && (
                          <span className="font-mono-num text-[10px] px-1.5 py-0.5 rounded bg-zinc-900 text-blue-300">
                            {counts.mcqs}M/{counts.cqs}C
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {labError && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-xs text-red-300">
              {labError}
            </div>
          )}

          {/* Sub-tabs & Year/Board Filter Controls */}
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-1 p-1 bg-zinc-900 border border-zinc-800 rounded-xl w-fit">
              <button
                type="button"
                onClick={() => setLabSection('mcq')}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                  labSection === 'mcq'
                    ? 'bg-indigo-500 text-white'
                    : 'text-zinc-400 hover:text-zinc-100'
                }`}
              >
                <BookOpenCheck className="w-3.5 h-3.5" />
                <span>
                  MCQ Practice ({filteredMcqs.length}
                  {activePack && filteredMcqs.length !== activePack.mcqs.length
                    ? `/${activePack.mcqs.length}`
                    : ''}
                  )
                </span>
              </button>
              <button
                type="button"
                onClick={() => setLabSection('cq')}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                  labSection === 'cq'
                    ? 'bg-sky-500 text-white'
                    : 'text-zinc-400 hover:text-zinc-100'
                }`}
              >
                <FileCheck2 className="w-3.5 h-3.5" />
                <span>
                  CQ (সৃজনশীল) ({filteredCqs.length}
                  {activePack && filteredCqs.length !== activePack.cqs.length
                    ? `/${activePack.cqs.length}`
                    : ''}
                  )
                </span>
              </button>
              <button
                type="button"
                onClick={() => setLabSection('analysis')}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                  labSection === 'analysis'
                    ? 'bg-blue-500 text-white'
                    : 'text-zinc-400 hover:text-zinc-100'
                }`}
              >
                <Flame className="w-3.5 h-3.5" />
                <span>গুরুত্বপূর্ণ টপিক বিশ্লেষণ ({activePack?.importantTopics.length || 0})</span>
              </button>
            </div>

            {/* Year & Board Multi-Filter Bar */}
            {labSection !== 'analysis' && (
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1 p-1 rounded-xl bg-zinc-900 border border-zinc-800 overflow-x-auto">
                  <Calendar className="w-3.5 h-3.5 text-zinc-400 ml-2 mr-1 shrink-0" />
                  {YEAR_LIST.map((yr) => (
                    <button
                      key={yr}
                      type="button"
                      onClick={() => {
                        setYearFilter(yr);
                        setActiveCqIndex(0);
                      }}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-mono-num font-medium transition-colors cursor-pointer whitespace-nowrap ${
                        yearFilter === yr
                          ? 'bg-blue-500 text-white font-semibold'
                          : 'text-zinc-400 hover:text-zinc-100'
                      }`}
                    >
                      {yr === 'All' ? 'সব সাল' : `'${yr.slice(2)}`}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800">
                  <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <select
                    value={boardFilter}
                    onChange={(e) => {
                      setBoardFilter(e.target.value);
                      setActiveCqIndex(0);
                    }}
                    className="bg-transparent text-xs text-zinc-200 focus:outline-none cursor-pointer"
                    aria-label="Filter by Education Board"
                  >
                    {BOARD_LIST.map((b) => (
                      <option key={b} value={b} className="bg-zinc-950 text-zinc-100">
                        {b === 'All' ? 'সব বোর্ড (All Boards)' : `${b} Board`}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>

          {generatingPack && (
            <div className="rounded-2xl border border-blue-500/30 bg-blue-500/10 p-6 flex items-center gap-4">
              <div className="w-8 h-8 rounded-xl border-2 border-blue-400/30 border-t-blue-400 animate-spin shrink-0" />
              <div>
                <div className="text-sm font-semibold text-zinc-100">
                  Preparing Multi-Year Board Questions for {selectedChapter?.title}...
                </div>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Fetching chapter-specific 2018–2024 Board MCQs, 3 Creative Questions (CQs), and priority topics. Once loaded, it saves automatically for this chapter!
                </p>
              </div>
            </div>
          )}

          {/* PANEL 1: BOARD QUESTION TOPIC PRIORITY ANALYSIS */}
          {labSection === 'analysis' && activePack && !generatingPack && (
            <div className="space-y-4">
              <div className="rounded-2xl border border-blue-500/25 bg-blue-500/5 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-semibold text-blue-400">
                    HSC Board Question Trend · {selectedSubject?.name}
                  </div>
                  <h2 className="font-display text-lg font-bold text-zinc-50 mt-0.5">
                    {selectedChapter?.title}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => void requestChapterPack('append')}
                  disabled={appendingPack}
                  className="px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-400 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{appendingPack ? 'Adding Questions...' : '+ Add More MCQs & CQs'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {activePack.importantTopics.map((tp, idx) => {
                  const priorityColor =
                    tp.priority === 'Very High'
                      ? 'bg-blue-500/15 border-blue-500/40 text-blue-300'
                      : tp.priority === 'High'
                        ? 'bg-indigo-500/15 border-indigo-500/40 text-indigo-300'
                        : 'bg-zinc-800 border-zinc-700 text-zinc-300';
                  return (
                    <div
                      key={idx}
                      className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-5 flex flex-col justify-between gap-4"
                    >
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between gap-2">
                          <span
                            className={`px-2.5 py-0.5 rounded-md border text-[11px] font-semibold ${priorityColor}`}
                          >
                            {tp.priority === 'Very High'
                              ? '★★★ Most Important'
                              : tp.priority === 'High'
                                ? '★★ High Priority'
                                : '★ Medium Priority'}
                          </span>
                          <span className="font-mono-num text-xs text-blue-400 font-semibold">
                            {tp.boardFrequency}
                          </span>
                        </div>
                        <h3 className="font-display text-base font-semibold text-zinc-100 leading-snug">
                          {tp.topic}
                        </h3>
                        <p className="text-xs text-zinc-300 leading-relaxed">{tp.questionPattern}</p>
                      </div>
                      <div className="pt-3 border-t border-zinc-800/70 text-[11px] text-zinc-400">
                        Board Years: <span className="text-zinc-200">{tp.recentBoards}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* PANEL 2: CHAPTER MCQ PRACTICE */}
          {labSection === 'mcq' && activePack && !generatingPack && (
            <div className="space-y-4">
              <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-5 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="font-display text-lg font-semibold text-zinc-50">
                    Chapter MCQ Bank · {selectedChapter?.title}
                  </h2>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Showing {filteredMcqs.length} multi-year board MCQs
                    {yearFilter !== 'All' ? ` (${yearFilter})` : ''}
                    {boardFilter !== 'All' ? ` (${boardFilter} Board)` : ''}. Select an option for instant Bangla/English explanation.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <div className="px-3.5 py-1.5 rounded-xl bg-zinc-950 border border-zinc-800 font-mono-num text-xs text-zinc-200">
                    Score: <span className="text-blue-400 font-bold">{mcqCorrectCount}</span> /{' '}
                    {mcqAnsweredCount} answered ({filteredMcqs.length} shown)
                  </div>
                  <button
                    type="button"
                    onClick={() => setShuffleSeed((s) => (s === 0 ? Date.now() % 97 : 0))}
                    className={`px-3 py-1.5 rounded-xl border text-xs flex items-center gap-1.5 cursor-pointer ${
                      shuffleSeed > 0
                        ? 'border-blue-500/50 bg-blue-500/15 text-blue-300'
                        : 'border-zinc-800 bg-zinc-950 text-zinc-300 hover:text-zinc-50'
                    }`}
                  >
                    <Shuffle className="w-3.5 h-3.5" />
                    <span>{shuffleSeed > 0 ? 'Shuffled' : 'Shuffle'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setMcqSelections({})}
                    className="px-3 py-1.5 rounded-xl border border-zinc-800 bg-zinc-950 text-xs text-zinc-300 hover:text-zinc-50 flex items-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset</span>
                  </button>
                </div>
              </div>

              {filteredMcqs.length === 0 ? (
                <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8 text-center space-y-3">
                  <p className="text-sm text-zinc-300">
                    No MCQs match the filter ({boardFilter} Board · {yearFilter}).
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setYearFilter('All');
                        setBoardFilter('All');
                      }}
                      className="px-4 py-2 rounded-xl border border-zinc-700 bg-zinc-950 text-xs text-zinc-200 hover:bg-zinc-800 cursor-pointer"
                    >
                      Show All Years &amp; Boards
                    </button>
                    <button
                      type="button"
                      disabled={appendingPack}
                      onClick={() => void requestChapterPack('append')}
                      className="px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-400 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Generate {boardFilter === 'All' ? '' : boardFilter} {yearFilter === 'All' ? '' : yearFilter} MCQs Now</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredMcqs.map((mcq, qIdx) => {
                    const chosen = mcqSelections[mcq.id];
                    const answered = chosen !== undefined;
                    const meta = parseBoardAndYear(mcq.boardTag, mcq.board, mcq.year);
                    return (
                      <div
                        key={mcq.id}
                        className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-6 space-y-4"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2.5">
                          <div className="text-sm font-medium text-zinc-100 leading-relaxed">
                            <span className="font-mono-num text-blue-400 font-bold mr-2">
                              Q{qIdx + 1}.
                            </span>
                            {mcq.question}
                          </div>
                          <span className="px-2.5 py-1 rounded-lg border border-blue-500/30 bg-blue-500/10 text-[11px] font-mono-num text-blue-300 shrink-0 w-fit">
                            {mcq.boardTag || `${meta.board} Board '${meta.year.slice(2)}`}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {mcq.options.map((opt, optIdx) => {
                            const isSelected = chosen === optIdx;
                            const isCorrect = optIdx === mcq.correctIndex;
                            let style =
                              'border-zinc-800 bg-zinc-950/70 text-zinc-300 hover:border-zinc-700';
                            if (answered) {
                              if (isCorrect) {
                                style = 'border-emerald-500/60 bg-emerald-500/15 text-emerald-200';
                              } else if (isSelected && !isCorrect) {
                                style = 'border-red-500/60 bg-red-500/15 text-red-200';
                              } else {
                                style = 'border-zinc-800/60 bg-zinc-950/40 text-zinc-500';
                              }
                            }

                            return (
                              <button
                                key={optIdx}
                                type="button"
                                onClick={() =>
                                  setMcqSelections((prev) => ({ ...prev, [mcq.id]: optIdx }))
                                }
                                className={`p-3 rounded-xl border text-left text-xs font-medium flex items-center justify-between gap-2 transition-colors cursor-pointer ${style}`}
                              >
                                <span>
                                  <strong className="mr-2 font-mono-num">
                                    {String.fromCharCode(65 + optIdx)}.
                                  </strong>
                                  {opt}
                                </span>
                                {answered && isCorrect && (
                                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                )}
                                {answered && isSelected && !isCorrect && (
                                  <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                                )}
                              </button>
                            );
                          })}
                        </div>

                        {answered && (
                          <div className="rounded-xl bg-zinc-950/90 border border-zinc-800 p-3.5 text-xs text-zinc-300 leading-relaxed">
                            <span className="font-semibold text-blue-400">ব্যাখ্যা: </span>
                            {mcq.explanation}
                          </div>
                        )}
                      </div>
                    );
                  })}

                  <div className="rounded-2xl border border-dashed border-blue-500/35 bg-blue-500/5 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-xs text-zinc-300">
                      <strong className="text-zinc-100">Want even more previous years&apos; board questions for this chapter?</strong>{' '}
                      Add 6 brand-new MCQs + 2 CQs from other boards and years directly into this chapter.
                    </div>
                    <button
                      type="button"
                      disabled={appendingPack || generatingPack}
                      onClick={() => void requestChapterPack('append')}
                      className="px-4 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-400 disabled:opacity-60 text-white text-xs font-semibold flex items-center gap-1.5 shrink-0 cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>
                        {appendingPack ? 'Adding Questions...' : '+ Add 6 More MCQs & 2 CQs'}
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* PANEL 3: CHAPTER CQ (CREATIVE QUESTION) PRACTICE + AI 10-MARK GRADING */}
          {labSection === 'cq' && activePack && !generatingPack && (
            <div className="space-y-5">
              {filteredCqs.length === 0 ? (
                <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8 text-center space-y-3">
                  <p className="text-sm text-zinc-300">
                    No CQs match the filter ({boardFilter} Board · {yearFilter}).
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setYearFilter('All');
                        setBoardFilter('All');
                      }}
                      className="px-4 py-2 rounded-xl border border-zinc-700 bg-zinc-950 text-xs text-zinc-200 hover:bg-zinc-800 cursor-pointer"
                    >
                      Show All Years &amp; Boards
                    </button>
                    <button
                      type="button"
                      disabled={appendingPack}
                      onClick={() => void requestChapterPack('append')}
                      className="px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-400 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Generate Board CQs Now</span>
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                      {filteredCqs.map((item, idx) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => {
                            setActiveCqIndex(idx);
                            setShowModelSolution(false);
                            setCqEval(null);
                          }}
                          className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                            idx === activeCqIndex % filteredCqs.length
                              ? 'bg-sky-500 border-sky-500 text-white'
                              : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-100'
                          }`}
                        >
                          সৃজনশীল #{idx + 1} · {item.boardTag}
                        </button>
                      ))}
                    </div>

                    <button
                      type="button"
                      disabled={appendingPack || generatingPack}
                      onClick={() => void requestChapterPack('append')}
                      className="px-3.5 py-2 rounded-xl border border-blue-500/35 bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 text-xs font-semibold flex items-center gap-1.5 cursor-pointer shrink-0"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span>{appendingPack ? 'Adding CQs...' : '+ Add 2 More Board CQs'}</span>
                    </button>
                  </div>

                  {(() => {
                    const currentCq = filteredCqs[activeCqIndex % filteredCqs.length];
                    if (!currentCq) return null;
                    return (
                      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                        {/* Left: Uddipok + ক, খ, গ, ঘ + Model Solution */}
                        <div className="xl:col-span-6 rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-6 space-y-5">
                          <div className="flex items-center justify-between gap-2">
                            <span className="px-2.5 py-1 rounded-lg border border-sky-500/35 bg-sky-500/10 text-xs font-semibold text-sky-300">
                              সৃজনশীল প্রশ্ন (১০ নম্বর) · {currentCq.boardTag}
                            </span>
                            <button
                              type="button"
                              onClick={() => setShowModelSolution((prev) => !prev)}
                              className="px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-950 text-xs text-zinc-300 hover:text-zinc-50 flex items-center gap-1.5 cursor-pointer"
                            >
                              {showModelSolution ? (
                                <>
                                  <EyeOff className="w-3.5 h-3.5" />
                                  <span>Hide Model Answer</span>
                                </>
                              ) : (
                                <>
                                  <Eye className="w-3.5 h-3.5" />
                                  <span>Show Model Answer</span>
                                </>
                              )}
                            </button>
                          </div>

                          <div className="rounded-xl bg-zinc-950/90 border border-zinc-800 p-4 space-y-2">
                            <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                              উদ্দীপক (Stem)
                            </div>
                            <p className="text-sm text-zinc-100 leading-relaxed whitespace-pre-line">
                              {currentCq.uddipok}
                            </p>
                          </div>

                          <div className="space-y-3 text-sm text-zinc-200">
                            <div className="rounded-xl bg-zinc-950/60 border border-zinc-800/70 p-3.5">
                              <span className="font-bold text-blue-400 mr-2">ক (১):</span>
                              {currentCq.ka}
                            </div>
                            <div className="rounded-xl bg-zinc-950/60 border border-zinc-800/70 p-3.5">
                              <span className="font-bold text-indigo-400 mr-2">খ (২):</span>
                              {currentCq.kha}
                            </div>
                            <div className="rounded-xl bg-zinc-950/60 border border-zinc-800/70 p-3.5">
                              <span className="font-bold text-sky-400 mr-2">গ (৩):</span>
                              {currentCq.ga}
                            </div>
                            <div className="rounded-xl bg-zinc-950/60 border border-zinc-800/70 p-3.5">
                              <span className="font-bold text-amber-400 mr-2">ঘ (৪):</span>
                              {currentCq.gha}
                            </div>
                          </div>

                          {showModelSolution && (
                            <div className="rounded-xl border border-blue-500/30 bg-blue-500/5 p-4 space-y-2">
                              <div className="text-xs font-semibold text-blue-300">
                                নমুনা সমাধান নির্দেশিকা (Model Outline)
                              </div>
                              <p className="text-xs text-zinc-300 leading-relaxed whitespace-pre-line">
                                {currentCq.modelSolution}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Right: Student CQ Draft & AI 10-Mark Examiner */}
                        <div className="xl:col-span-6 rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-6 space-y-4">
                          <div>
                            <h3 className="font-display text-lg font-semibold text-zinc-50">
                              Write Your CQ Answer &amp; Get AI Board Marking
                            </h3>
                            <p className="text-xs text-zinc-400 mt-0.5">
                              Draft your ক, খ, গ, ঘ solution below (in Bangla or English) and let the AI Board Examiner score it out of 10.
                            </p>
                          </div>

                          <textarea
                            rows={8}
                            value={cqDraft}
                            onChange={(e) => setCqDraft(e.target.value)}
                            placeholder={'ক) ...\n\nখ) ...\n\nগ) ...\n\nঘ) ...'}
                            className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-blue-500"
                          />

                          <button
                            type="button"
                            disabled={gradingCq}
                            onClick={handleEvaluateCq}
                            className="w-full py-3 px-4 rounded-xl bg-blue-500 hover:bg-blue-400 disabled:opacity-60 text-white text-sm font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                          >
                            <Sparkles className="w-4 h-4" />
                            <span>
                              {gradingCq ? 'Grading CQ Answer...' : 'Grade My CQ Answer (10 Marks)'}
                            </span>
                          </button>

                          {cqEval && (
                            <div className="rounded-2xl border border-blue-500/30 bg-zinc-950/90 p-5 space-y-4">
                              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-3">
                                <div>
                                  <div className="text-xs text-zinc-400">Board Examiner Score</div>
                                  <div className="font-mono-num text-2xl font-bold text-blue-400">
                                    {cqEval.totalMarks} / 10
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 font-mono-num text-xs">
                                  <span className="px-2 py-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-300">
                                    ক: {cqEval.kaMark}/1
                                  </span>
                                  <span className="px-2 py-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-300">
                                    খ: {cqEval.khaMark}/2
                                  </span>
                                  <span className="px-2 py-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-300">
                                    গ: {cqEval.gaMark}/3
                                  </span>
                                  <span className="px-2 py-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-300">
                                    ঘ: {cqEval.ghaMark}/4
                                  </span>
                                </div>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                                <div className="space-y-1.5">
                                  <div className="font-semibold text-emerald-400">Strengths</div>
                                  <ul className="space-y-1 text-zinc-300 list-disc pl-4">
                                    {cqEval.strengths.map((s, i) => (
                                      <li key={i}>{s}</li>
                                    ))}
                                  </ul>
                                </div>
                                <div className="space-y-1.5">
                                  <div className="font-semibold text-amber-400">To Score 10/10</div>
                                  <ul className="space-y-1 text-zinc-300 list-disc pl-4">
                                    {cqEval.improvements.map((s, i) => (
                                      <li key={i}>{s}</li>
                                    ))}
                                  </ul>
                                </div>
                              </div>

                              <div className="text-xs text-blue-300 bg-blue-500/10 border border-blue-500/20 rounded-xl px-3.5 py-2.5">
                                <strong>Examiner Tip:</strong> {cqEval.boardTip}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })()}
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
