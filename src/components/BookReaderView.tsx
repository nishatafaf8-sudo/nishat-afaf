import React, { useState } from 'react';
import {
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  Languages,
  Lock,
  Pin,
  Plus,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { BOOKS_LIBRARY } from '../data/elevoraData';
import { VocabItem } from '../types';

interface BookReaderViewProps {
  completedBookPageKeys: string[];
  completedChapterIds: string[];
  chapterTakeaways: Record<string, string>;
  vocabVault: VocabItem[];
  onMarkPageDone: (pageKey: string) => void;
  onCompleteChapter: (chapterId: string, takeaway: string) => void;
  onAddVocab: (item: Omit<VocabItem, 'id' | 'mastered'>) => void;
  onToggleVocabMastered: (id: string) => void;
  onToggleVocabPinHome: (id: string) => void;
}

export const BookReaderView: React.FC<BookReaderViewProps> = ({
  completedBookPageKeys,
  completedChapterIds,
  chapterTakeaways,
  vocabVault,
  onMarkPageDone,
  onCompleteChapter,
  onAddVocab,
  onToggleVocabMastered,
  onToggleVocabPinHome,
}) => {
  const [selectedBookId, setSelectedBookId] = useState(BOOKS_LIBRARY[0].id);
  const selectedBook = BOOKS_LIBRARY.find((b) => b.id === selectedBookId) || BOOKS_LIBRARY[0];

  const [selectedChapterId, setSelectedChapterId] = useState(selectedBook.chapters[0].id);
  const selectedChapter =
    selectedBook.chapters.find((c) => c.id === selectedChapterId) || selectedBook.chapters[0];

  const [pageIdx, setPageIdx] = useState(0);
  const [languageView, setLanguageView] = useState<'english' | 'bilingual' | 'bangla'>('bilingual');
  const [activeSubTab, setActiveSubTab] = useState<'reader' | 'vocab'>('reader');

  // Quick-capture selected word OR new learned takeaway -> Flashcard
  const [selectedSnippet, setSelectedSnippet] = useState('');
  const [quickBangla, setQuickBangla] = useState('');
  const [quickDef, setQuickDef] = useState('');
  const [quickNotice, setQuickNotice] = useState('');

  // Inline "Save New Learning as Flashcard" on every page
  const [lessonFront, setLessonFront] = useState('');
  const [lessonBack, setLessonBack] = useState('');
  const [lessonSavedMsg, setLessonSavedMsg] = useState('');

  // Mandatory Review Gate Quiz State
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [takeawayText, setTakeawayText] = useState('');
  const [quizFeedback, setQuizFeedback] = useState('');

  // Custom Vocab Form in Vault tab
  const [newWord, setNewWord] = useState('');
  const [newPos, setNewPos] = useState('noun / lesson');
  const [newDef, setNewDef] = useState('');
  const [newBangla, setNewBangla] = useState('');
  const [newSentence, setNewSentence] = useState('');

  const totalPagesInBook = selectedBook.chapters.reduce(
    (acc, c) => acc + c.englishParagraphs.length,
    0
  );
  const donePagesInBook = selectedBook.chapters.reduce(
    (acc, c) =>
      acc +
      c.englishParagraphs.filter((_, idx) =>
        completedBookPageKeys.includes(`${c.id}:p${idx}`)
      ).length,
    0
  );
  const bookProgressPct =
    totalPagesInBook > 0 ? Math.round((donePagesInBook / totalPagesInBook) * 100) : 0;

  const isWholeBookDone =
    selectedBook.chapters.every((c) => completedChapterIds.includes(c.id)) &&
    donePagesInBook === totalPagesInBook;

  const safePageIdx = Math.min(pageIdx, selectedChapter.englishParagraphs.length - 1);
  const currentPageKey = `${selectedChapter.id}:p${safePageIdx}`;
  const isCurrentPageDone = completedBookPageKeys.includes(currentPageKey);
  const isLastPageOfChapter = safePageIdx >= selectedChapter.englishParagraphs.length - 1;
  const isChapterDone = completedChapterIds.includes(selectedChapter.id);

  // Calculate book-wide sequential page number (e.g. Page 4 of 15)
  const globalPageNumber =
    selectedBook.chapters
      .slice(0, selectedBook.chapters.findIndex((c) => c.id === selectedChapter.id))
      .reduce((acc, c) => acc + c.englishParagraphs.length, 0) +
    safePageIdx +
    1;

  const handleSelectBook = (bookId: string) => {
    setSelectedBookId(bookId);
    const bk = BOOKS_LIBRARY.find((b) => b.id === bookId);
    if (bk && bk.chapters[0]) {
      setSelectedChapterId(bk.chapters[0].id);
      setPageIdx(0);
      setQuizAnswers({});
      setQuizFeedback('');
    }
  };

  const handleFinishCurrentPage = () => {
    onMarkPageDone(currentPageKey);
    if (!isLastPageOfChapter) {
      setPageIdx(safePageIdx + 1);
    } else if (isChapterDone) {
      // Advance directly to next chapter's page 1 if chapter already verified
      const chIndex = selectedBook.chapters.findIndex((c) => c.id === selectedChapter.id);
      if (chIndex >= 0 && chIndex < selectedBook.chapters.length - 1) {
        setSelectedChapterId(selectedBook.chapters[chIndex + 1].id);
        setPageIdx(0);
        setQuizAnswers({});
        setQuizFeedback('');
      }
    }
  };

  const handleTextMouseUp = () => {
    const sel = window.getSelection()?.toString().trim() || '';
    if (sel && sel.length <= 50 && /^[a-zA-Z\s-]+$/.test(sel)) {
      setSelectedSnippet(sel);
      setQuickNotice('');
    }
  };

  const handleSaveSelectedWordToHome = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSnippet.trim() || !quickBangla.trim()) return;
    onAddVocab({
      word: selectedSnippet.trim(),
      partOfSpeech: 'selected',
      englishDef: quickDef.trim() || `Highlighted on Page ${globalPageNumber} of ${selectedBook.title}.`,
      banglaMeaning: quickBangla.trim(),
      exampleSentence: `Learned in ${selectedBook.title} · Ch ${selectedChapter.number}.`,
      sourceBook: selectedBook.title,
      itemType: 'vocab',
    });
    setQuickNotice(`"${selectedSnippet.trim()}" saved & pinned to your Home Flashcards!`);
    setSelectedSnippet('');
    setQuickBangla('');
    setQuickDef('');
  };

  const handleSaveNewLessonFlashcard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lessonFront.trim() || !lessonBack.trim()) return;
    onAddVocab({
      word: lessonFront.trim(),
      partOfSpeech: 'new learning',
      englishDef: `Learned on Page ${globalPageNumber} (${selectedChapter.title})`,
      banglaMeaning: lessonBack.trim(),
      exampleSentence: `From ${selectedBook.title}, Chapter ${selectedChapter.number}, Page ${safePageIdx + 1}.`,
      sourceBook: selectedBook.title,
      itemType: 'lesson',
    });
    setLessonSavedMsg(`"${lessonFront.trim()}" added to Daily Flashcards & Home Page!`);
    setLessonFront('');
    setLessonBack('');
  };

  const handleVerifyReviewGate = (e: React.FormEvent) => {
    e.preventDefault();
    const allCorrect = selectedChapter.quiz.every(
      (q, idx) => quizAnswers[idx] === q.correctIndex
    );

    if (!allCorrect) {
      setQuizFeedback('Review Gate locked: Please answer all comprehension questions accurately.');
      return;
    }

    if (takeawayText.trim().length < 15) {
      setQuizFeedback(
        'Write a genuine 1-sentence takeaway (at least 15 characters) to unlock completion.'
      );
      return;
    }

    // Mark all pages in this chapter done too when quiz passes
    selectedChapter.englishParagraphs.forEach((_, idx) => {
      onMarkPageDone(`${selectedChapter.id}:p${idx}`);
    });
    setQuizFeedback('');
    onCompleteChapter(selectedChapter.id, takeawayText.trim());
    setTakeawayText('');

    // Auto-advance to next chapter if available
    const chIndex = selectedBook.chapters.findIndex((c) => c.id === selectedChapter.id);
    if (chIndex >= 0 && chIndex < selectedBook.chapters.length - 1) {
      setSelectedChapterId(selectedBook.chapters[chIndex + 1].id);
      setPageIdx(0);
      setQuizAnswers({});
    }
  };

  const handleAddCustomVocab = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWord.trim() || !newBangla.trim() || !newDef.trim()) return;
    onAddVocab({
      word: newWord.trim(),
      partOfSpeech: newPos.trim() || 'word',
      englishDef: newDef.trim(),
      banglaMeaning: newBangla.trim(),
      exampleSentence: newSentence.trim() || `Saved while reading ${selectedBook.title}.`,
      sourceBook: selectedBook.title,
      itemType: 'vocab',
    });
    setNewWord('');
    setNewDef('');
    setNewBangla('');
    setNewSentence('');
  };

  const chapterVocab = vocabVault.filter((v) =>
    selectedChapter.featuredVocabIds.includes(v.id)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-zinc-50">
            Book Reader (Page-by-Page) &amp; Learning Flashcards
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Read page 1, page 2, page 3 chapter-by-chapter to finish an entire book, and turn everything new you learn into flashcards.
          </p>
        </div>

        <div className="flex items-center gap-1 p-1 bg-zinc-900 border border-zinc-800 rounded-xl self-start">
          <button
            type="button"
            onClick={() => setActiveSubTab('reader')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
              activeSubTab === 'reader'
                ? 'bg-blue-500 text-white font-semibold'
                : 'text-zinc-400 hover:text-zinc-100'
            }`}
          >
            Book Reader
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('vocab')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
              activeSubTab === 'vocab'
                ? 'bg-indigo-500 text-white font-semibold'
                : 'text-zinc-400 hover:text-zinc-100'
            }`}
          >
            Flashcard Vault ({vocabVault.length})
          </button>
        </div>
      </div>

      {activeSubTab === 'reader' ? (
        <div className="space-y-6">
          {/* Book Shelf with Total Book Progress */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {BOOKS_LIBRARY.map((book) => {
              const active = book.id === selectedBook.id;
              const bookPages = book.chapters.reduce(
                (acc, c) => acc + c.englishParagraphs.length,
                0
              );
              const bookPagesDone = book.chapters.reduce(
                (acc, c) =>
                  acc +
                  c.englishParagraphs.filter((_, idx) =>
                    completedBookPageKeys.includes(`${c.id}:p${idx}`)
                  ).length,
                0
              );
              const doneCh = book.chapters.filter((c) =>
                completedChapterIds.includes(c.id)
              ).length;
              const pct = bookPages > 0 ? Math.round((bookPagesDone / bookPages) * 100) : 0;

              return (
                <button
                  key={book.id}
                  type="button"
                  onClick={() => handleSelectBook(book.id)}
                  className={`text-left rounded-2xl border p-4 flex items-center gap-4 transition-colors cursor-pointer ${
                    active
                      ? 'border-blue-500/60 bg-blue-500/8'
                      : 'border-zinc-800/80 bg-zinc-900/60 hover:border-zinc-700'
                  }`}
                >
                  <div className="w-16 h-22 rounded-lg overflow-hidden bg-zinc-950 border border-zinc-800 shrink-0">
                    <img
                      src={book.coverImage}
                      alt={book.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-display text-base font-semibold text-zinc-100 truncate">
                      {book.title}
                    </div>
                    <div className="text-xs text-zinc-400 line-clamp-2 mt-0.5">
                      {book.subtitle}
                    </div>
                    <div className="mt-2 h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <div className="text-xs font-mono-num text-blue-400 mt-1.5">
                      {bookPagesDone}/{bookPages} pages · {doneCh}/{book.chapters.length} ch
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Whole-Book Progress Banner */}
          <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="text-xs text-blue-400 font-medium flex items-center gap-1.5">
                {isWholeBookDone ? (
                  <>
                    <Award className="w-4 h-4 text-blue-400" />
                    <span>Entire Book Completed (100%)!</span>
                  </>
                ) : (
                  <>
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>
                      Reading {selectedBook.title} · Book Page {globalPageNumber} of {totalPagesInBook}
                    </span>
                  </>
                )}
              </div>
              <div className="text-xs text-zinc-400 font-mono-num">
                {donePagesInBook}/{totalPagesInBook} pages finished ({bookProgressPct}% of complete book)
              </div>
            </div>
            <div className="w-full sm:w-56 h-2 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 transition-all"
                style={{ width: `${bookProgressPct}%` }}
              />
            </div>
          </div>

          {/* Chapter Reader & Review Gate */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            <div className="xl:col-span-8 rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-6 sm:p-8 space-y-6">
              {/* Chapter Tabs + Language Mode */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800/80">
                <div className="flex flex-wrap items-center gap-1.5">
                  {selectedBook.chapters.map((ch) => (
                    <button
                      key={ch.id}
                      type="button"
                      onClick={() => {
                        setSelectedChapterId(ch.id);
                        setPageIdx(0);
                        setQuizAnswers({});
                        setQuizFeedback('');
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer whitespace-nowrap ${
                        ch.id === selectedChapter.id
                          ? 'bg-blue-500 text-white border-blue-500 font-semibold'
                          : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      Ch {ch.number}
                      {completedChapterIds.includes(ch.id) ? ' ✓' : ''}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-1 p-1 bg-zinc-950 border border-zinc-800 rounded-xl self-start">
                  {(
                    [
                      { id: 'english', label: 'English' },
                      { id: 'bilingual', label: 'Split View' },
                      { id: 'bangla', label: 'বাংলা' },
                    ] as const
                  ).map((mode) => (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => setLanguageView(mode.id)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                        languageView === mode.id
                          ? 'bg-indigo-500 text-white'
                          : 'text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      {mode.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chapter Heading & Page 1, 2, 3 Stepper */}
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="font-display text-xl sm:text-2xl font-bold text-zinc-50">
                      Chapter {selectedChapter.number}: {selectedChapter.title}
                    </h2>
                    {languageView !== 'english' && (
                      <p className="text-sm text-blue-400 mt-1 flex items-center gap-1.5">
                        <Languages className="w-3.5 h-3.5" />
                        <span>{selectedChapter.banglaTitle}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Page Selector (Page 1, Page 2, Page 3) */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {selectedChapter.englishParagraphs.map((_, idx) => {
                    const pDone = completedBookPageKeys.includes(`${selectedChapter.id}:p${idx}`);
                    const active = idx === safePageIdx;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setPageIdx(idx)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer whitespace-nowrap font-mono-num ${
                          active
                            ? 'bg-zinc-100 text-zinc-950 border-zinc-100 font-semibold'
                            : pDone
                              ? 'bg-blue-500/15 border-blue-500/40 text-blue-300'
                              : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                        }`}
                      >
                        Page {idx + 1} {pDone ? '✓' : ''}
                      </button>
                    );
                  })}
                  <span className="text-xs text-zinc-500 ml-1">
                    Tip: Highlight any word to save as a flashcard
                  </span>
                </div>
              </div>

              {/* Single Focused Page Content (Page 1 / Page 2 / Page 3) */}
              <div
                onMouseUp={handleTextMouseUp}
                className="rounded-2xl border border-zinc-800/80 bg-zinc-950/60 p-5 sm:p-6 space-y-5"
              >
                <div className="flex items-center justify-between text-xs text-zinc-400 font-mono-num">
                  <span>
                    Page {safePageIdx + 1} of {selectedChapter.englishParagraphs.length} (Book Page {globalPageNumber}/{totalPagesInBook})
                  </span>
                  <span className={isCurrentPageDone ? 'text-blue-400' : 'text-zinc-500'}>
                    {isCurrentPageDone ? 'Page Completed ✓' : 'Reading Now'}
                  </span>
                </div>

                <div
                  className={`grid gap-5 ${
                    languageView === 'bilingual' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'
                  }`}
                >
                  {languageView !== 'bangla' && (
                    <p className="text-[15px] sm:text-base text-zinc-100 leading-relaxed selection:bg-blue-500/35">
                      {selectedChapter.englishParagraphs[safePageIdx]}
                    </p>
                  )}
                  {languageView !== 'english' && (
                    <p className="text-[15px] sm:text-base text-zinc-300 leading-relaxed bg-zinc-900/70 border border-zinc-800/70 rounded-xl p-4">
                      {selectedChapter.banglaParagraphs[safePageIdx]}
                    </p>
                  )}
                </div>

                {/* Page-by-Page Navigation & Mark Page Done */}
                <div className="pt-4 border-t border-zinc-800/70 flex flex-wrap items-center justify-between gap-3">
                  <button
                    type="button"
                    disabled={safePageIdx === 0}
                    onClick={() => setPageIdx((p) => Math.max(0, p - 1))}
                    className="px-3.5 py-2 rounded-xl border border-zinc-800 bg-zinc-900 text-xs font-medium text-zinc-300 hover:text-zinc-50 disabled:opacity-40 flex items-center gap-1.5 cursor-pointer"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>Previous Page</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleFinishCurrentPage}
                    className="px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-400 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <span>
                      {!isLastPageOfChapter
                        ? `Mark Page ${safePageIdx + 1} Done & Go to Page ${safePageIdx + 2}`
                        : isChapterDone
                          ? `Page ${safePageIdx + 1} Done · Next Chapter`
                          : `Mark Final Page ${safePageIdx + 1} Done`}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Selected Text Quick Popup */}
              {(selectedSnippet || quickNotice) && (
                <div className="rounded-xl border border-indigo-500/40 bg-indigo-500/8 p-4 space-y-3">
                  {quickNotice ? (
                    <div className="text-xs font-medium text-blue-400">{quickNotice}</div>
                  ) : (
                    <form onSubmit={handleSaveSelectedWordToHome} className="space-y-3">
                      <div className="text-xs font-semibold text-indigo-300">
                        Selected Word: <span className="text-zinc-50 text-sm">“{selectedSnippet}”</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <input
                          type="text"
                          required
                          value={quickBangla}
                          onChange={(e) => setQuickBangla(e.target.value)}
                          placeholder="Bangla meaning / lesson note..."
                          className="px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:outline-none focus:border-blue-500"
                        />
                        <input
                          type="text"
                          value={quickDef}
                          onChange={(e) => setQuickDef(e.target.value)}
                          placeholder="Short English explanation (optional)..."
                          className="px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="submit"
                          className="px-3.5 py-1.5 rounded-lg bg-blue-500 hover:bg-blue-400 text-white font-semibold text-xs cursor-pointer"
                        >
                          Save as Home Flashcard
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedSnippet('')}
                          className="px-3 py-1.5 rounded-lg bg-zinc-900 text-xs text-zinc-400 hover:text-zinc-200 cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}

              {/* Quick "Save What I Learned Today as Flashcard" Box right inside the Reader */}
              <form
                onSubmit={handleSaveNewLessonFlashcard}
                className="rounded-xl border border-zinc-800/80 bg-zinc-950/60 p-4 space-y-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="text-xs font-semibold text-blue-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Save Anything New You Learned as a Flashcard</span>
                  </div>
                  <span className="text-xs text-zinc-500">Auto-shows on Home Page</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <input
                    type="text"
                    required
                    value={lessonFront}
                    onChange={(e) => setLessonFront(e.target.value)}
                    placeholder="Front: New Word or Concept (e.g., Two-Minute Rule)"
                    className="px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 focus:outline-none focus:border-blue-500"
                  />
                  <input
                    type="text"
                    required
                    value={lessonBack}
                    onChange={(e) => setLessonBack(e.target.value)}
                    placeholder="Back: Bangla meaning or Key Lesson learned"
                    className="px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2">
                  {lessonSavedMsg ? (
                    <span className="text-xs text-blue-400">{lessonSavedMsg}</span>
                  ) : (
                    <span className="text-xs text-zinc-500">
                      Saved flashcards stay in your Daily Home Flashcard deck.
                    </span>
                  )}
                  <button
                    type="submit"
                    className="px-3.5 py-1.5 rounded-lg bg-indigo-500 hover:bg-indigo-400 text-white font-semibold text-xs flex items-center gap-1 cursor-pointer whitespace-nowrap"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Learning Flashcard</span>
                  </button>
                </div>
              </form>

              {/* Chapter Vocabulary & Concepts */}
              {chapterVocab.length > 0 && (
                <div className="pt-4 border-t border-zinc-800/80 space-y-3">
                  <div className="text-xs font-medium text-indigo-400">
                    Key Concepts &amp; Words From This Chapter
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {chapterVocab.map((v) => (
                      <div
                        key={v.id}
                        className="rounded-xl border border-zinc-800 bg-zinc-950/80 p-3.5 flex flex-col justify-between gap-2.5"
                      >
                        <div>
                          <div className="flex items-baseline justify-between gap-2">
                            <span className="font-semibold text-sm text-zinc-100">{v.word}</span>
                            <span className="text-xs text-blue-400">{v.banglaMeaning}</span>
                          </div>
                          <p className="text-xs text-zinc-400 mt-1">{v.englishDef}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => onToggleVocabPinHome(v.id)}
                          className={`self-start px-2.5 py-1 rounded-lg text-xs font-medium border flex items-center gap-1 cursor-pointer ${
                            v.pinnedForHome
                              ? 'bg-blue-500/15 border-blue-500/40 text-blue-300'
                              : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                          }`}
                        >
                          <Pin className="w-3 h-3" />
                          <span>{v.pinnedForHome ? 'Shown on Home ✓' : 'Pin to Home'}</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Mandatory Review Gate Sidebar */}
            <div className="xl:col-span-4 rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-6 space-y-5 self-start">
              <div className="flex items-center gap-2.5">
                {isChapterDone ? (
                  <ShieldCheck className="w-5 h-5 text-blue-400" />
                ) : (
                  <Lock className="w-5 h-5 text-amber-400" />
                )}
                <div>
                  <h3 className="font-display text-base font-semibold text-zinc-100">
                    Chapter {selectedChapter.number} Review Gate
                  </h3>
                  <p className="text-xs text-zinc-400">
                    {isChapterDone
                      ? 'Chapter verified and marked complete'
                      : 'Finish pages 1–3 & pass the quick check to complete chapter'}
                  </p>
                </div>
              </div>

              {isChapterDone ? (
                <div className="rounded-xl border border-blue-500/30 bg-blue-500/10 p-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm font-semibold text-blue-300">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Chapter {selectedChapter.number} Completed</span>
                  </div>
                  <div className="text-xs text-zinc-300">
                    <span className="text-zinc-400">Your Saved Takeaway:</span> “
                    {chapterTakeaways[selectedChapter.id]}”
                  </div>
                </div>
              ) : (
                <form onSubmit={handleVerifyReviewGate} className="space-y-4">
                  {selectedChapter.quiz.map((q, qIdx) => (
                    <div key={qIdx} className="space-y-2">
                      <div className="text-xs font-medium text-zinc-200 leading-snug">
                        {qIdx + 1}. {q.question}
                      </div>
                      <div className="space-y-1.5">
                        {q.options.map((opt, optIdx) => {
                          const chosen = quizAnswers[qIdx] === optIdx;
                          return (
                            <button
                              key={optIdx}
                              type="button"
                              onClick={() =>
                                setQuizAnswers((prev) => ({ ...prev, [qIdx]: optIdx }))
                              }
                              className={`w-full text-left px-3 py-2 rounded-lg border text-xs transition-colors cursor-pointer ${
                                chosen
                                  ? 'border-indigo-500 bg-indigo-500/15 text-zinc-100'
                                  : 'border-zinc-800 bg-zinc-950/70 text-zinc-400 hover:text-zinc-200'
                              }`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}

                  <div className="space-y-1.5">
                    <label
                      htmlFor="takeaway-input"
                      className="block text-xs font-medium text-zinc-300"
                    >
                      1-Sentence Personal Action Takeaway
                    </label>
                    <textarea
                      id="takeaway-input"
                      rows={3}
                      value={takeawayText}
                      onChange={(e) => setTakeawayText(e.target.value)}
                      placeholder="How will you apply this chapter in your HSC study routine today?"
                      className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  {quizFeedback && (
                    <p className="text-xs text-amber-300 bg-amber-500/10 border border-amber-500/30 rounded-lg px-3 py-2">
                      {quizFeedback}
                    </p>
                  )}

                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 rounded-xl bg-blue-500 hover:bg-blue-400 text-white font-semibold text-xs transition-colors cursor-pointer"
                  >
                    Complete Chapter &amp; Go Next
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Flashcard & Vocabulary Vault Manager */
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          <form
            onSubmit={handleAddCustomVocab}
            className="xl:col-span-4 rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-6 space-y-4 self-start"
          >
            <div>
              <h2 className="font-display text-lg font-semibold text-zinc-100">
                Add Word or Lesson Flashcard
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Every card saved here is pinned automatically to your Home Page flashcard deck.
              </p>
            </div>

            <div className="space-y-3">
              <input
                type="text"
                value={newWord}
                onChange={(e) => setNewWord(e.target.value)}
                placeholder="Word or New Concept (e.g., Ubiquitous)"
                required
                className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-zinc-100 focus:outline-none focus:border-blue-500"
              />
              <input
                type="text"
                value={newPos}
                onChange={(e) => setNewPos(e.target.value)}
                placeholder="Type (noun, adj., key concept)"
                className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-zinc-100 focus:outline-none focus:border-blue-500"
              />
              <input
                type="text"
                value={newBangla}
                onChange={(e) => setNewBangla(e.target.value)}
                placeholder="Bangla meaning / Lesson summary"
                required
                className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-zinc-100 focus:outline-none focus:border-blue-500"
              />
              <textarea
                rows={2}
                value={newDef}
                onChange={(e) => setNewDef(e.target.value)}
                placeholder="Short English explanation"
                required
                className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-zinc-100 focus:outline-none focus:border-blue-500"
              />
              <input
                type="text"
                value={newSentence}
                onChange={(e) => setNewSentence(e.target.value)}
                placeholder="Example or note (optional)"
                className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-zinc-100 focus:outline-none focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-semibold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Save &amp; Pin Flashcard</span>
            </button>
          </form>

          <div className="xl:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-4 self-start">
            {vocabVault.map((v) => (
              <div
                key={v.id}
                className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-5 flex flex-col justify-between gap-3"
              >
                <div>
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className="font-display text-lg font-bold text-zinc-50">{v.word}</h3>
                    <span className="text-xs text-zinc-500">{v.partOfSpeech}</span>
                  </div>
                  <div className="text-sm font-medium text-blue-400 mt-1">
                    {v.banglaMeaning}
                  </div>
                  <p className="text-xs text-zinc-300 mt-2 leading-relaxed">{v.englishDef}</p>
                  <p className="text-xs text-zinc-500 italic mt-2">“{v.exampleSentence}”</p>
                </div>

                <div className="pt-3 border-t border-zinc-800/70 flex flex-wrap items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => onToggleVocabPinHome(v.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium border flex items-center gap-1 cursor-pointer ${
                      v.pinnedForHome
                        ? 'bg-indigo-500/15 border-indigo-500/40 text-indigo-300'
                        : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <Pin className="w-3 h-3" />
                    <span>{v.pinnedForHome ? 'Shown on Home' : 'Pin to Home'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onToggleVocabMastered(v.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium border cursor-pointer ${
                      v.mastered
                        ? 'bg-blue-500/15 border-blue-500/40 text-blue-300'
                        : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {v.mastered ? 'Mastered ✓' : 'In Review'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
