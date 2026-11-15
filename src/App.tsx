import { useState } from 'react';
import { Menu } from 'lucide-react';
import { AiTeacherView } from './components/AiTeacherView';
import { BookReaderView } from './components/BookReaderView';
import { CvBuilderView } from './components/CvBuilderView';
import { DashboardView } from './components/DashboardView';
import { DetHubView } from './components/DetHubView';
import { EcaRemindersView } from './components/EcaRemindersView';
import { FocusView } from './components/FocusView';
import { OnboardingView } from './components/OnboardingView';
import { ResearchView } from './components/ResearchView';
import { ReviewModal } from './components/ReviewModal';
import { SalahView } from './components/SalahView';
import { Sidebar } from './components/Sidebar';
import { SkillExaminerView } from './components/SkillExaminerView';
import { SyllabusView } from './components/SyllabusView';
import { useElevoraState } from './hooks/useElevoraState';
import { useReviews } from './hooks/useReviews';
import { ModuleId } from './types';

const MODULE_TITLES: Record<ModuleId, string> = {
  dashboard: 'Home Dashboard',
  salah: 'Salah & Azan Tracker',
  focus: 'Focus Timer Studio',
  syllabus: 'HSC Syllabus & Board Exam Lab',
  tutor: 'AI Teacher Studio (Photo & Visual)',
  books: 'Book Reader & Vocabulary Vault',
  research: 'Research & Paper Drafting Suite',
  det: 'DET Prep Hub & Practice History',
  skills: 'Daily Skill Guide & AI Examiner',
  eca: 'ECA & Event Reminders',
  cv: 'My CV Builder',
};

export default function App() {
  const {
    state,
    authUser,
    authLoading,
    cloudSyncStatus,
    authError,
    signInWithGoogle,
    signOutAccount,
    completeOnboarding,
    updateProfile,
    toggleWaqtCompleted,
    toggleWaqtAzan,
    logQuranReflection,
    addFocusSession,
    addFocusTask,
    verifyAndCompleteFocusTask,
    reopenFocusTask,
    deleteFocusTask,
    toggleSyllabusChapter,
    incrementSubjectChapter,
    addSyllabusChapter,
    markBookPageDone,
    completeBookChapter,
    toggleVocabMastered,
    toggleVocabPinHome,
    addVocabItem,
    updateResearch,
    addDetAttempt,
    addSkillSubmission,
    addEca,
    toggleEcaInCv,
    deleteEca,
    addEvent,
    toggleEventReminder,
    deleteEvent,
  } = useElevoraState();

  const { reviews, reviewsLoading, submitReview, deleteReview } = useReviews();

  const [activeModule, setActiveModule] = useState<ModuleId>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);

  if (authLoading || (authUser && cloudSyncStatus === 'loading')) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center p-6 gap-4">
        <div className="w-12 h-12 rounded-2xl border-2 border-blue-500/30 border-t-blue-400 animate-spin" />
        <div className="text-center space-y-1">
          <div className="font-display text-lg font-semibold text-zinc-50">
            Securing Your Elevora Workspace
          </div>
          <p className="text-xs text-zinc-400">
            Syncing your personal HSC syllabus, flashcards, DET history &amp; CV...
          </p>
        </div>
      </div>
    );
  }

  if (!authUser || !state.profile.onboarded) {
    return (
      <OnboardingView
        initialProfile={state.profile}
        authUser={authUser}
        authError={authError}
        reviews={reviews}
        reviewsLoading={reviewsLoading}
        onGoogleSignIn={signInWithGoogle}
        onSignOut={signOutAccount}
        onSubmitReview={submitReview}
        onDeleteReview={deleteReview}
        onComplete={async (patch) => {
          await completeOnboarding(patch);
          setActiveModule('dashboard');
        }}
      />
    );
  }

  const resolvedTitle =
    activeModule === 'salah' && state.profile.faithMode !== 'Muslim'
      ? 'Mind Refresh & Daily Reset Breaks'
      : MODULE_TITLES[activeModule];

  return (
    <div className="min-h-screen bg-zinc-950 bg-[radial-gradient(ellipse_at_top_right,_rgba(37,99,235,0.08),_transparent_50%)] text-zinc-100 flex">
      <Sidebar
        activeModule={activeModule}
        onSelectModule={setActiveModule}
        onOpenReviewModal={() => setReviewModalOpen(true)}
        onEditProfile={() => updateProfile({ onboarded: false })}
        onSignOut={() => void signOutAccount()}
        profile={state.profile}
        authUser={authUser}
        cloudSyncStatus={cloudSyncStatus}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="no-print sticky top-0 z-30 bg-zinc-950/85 backdrop-blur-md border-b border-zinc-800/80 px-5 sm:px-8 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-300 hover:text-zinc-50 cursor-pointer"
              aria-label="Open navigation menu"
            >
              <Menu className="w-4 h-4" />
            </button>
            <div className="text-sm font-medium text-zinc-200 truncate">
              <span className="text-zinc-500">Elevora / </span>
              <span>{resolvedTitle}</span>
            </div>
          </div>

          <div className="text-xs text-zinc-400 whitespace-nowrap shrink-0 hidden sm:block">
            {state.profile.faithMode} Mode · {state.profile.stream} · {state.profile.district}
          </div>
        </header>

        <main className="flex-1 w-full max-w-7xl mx-auto p-5 sm:p-8">
          {activeModule === 'dashboard' && (
            <DashboardView
              state={state}
              onNavigate={setActiveModule}
              onToggleWaqt={toggleWaqtCompleted}
              onLogQuranReflection={logQuranReflection}
              onToggleVocabMastered={toggleVocabMastered}
            />
          )}

          {activeModule === 'salah' && (
            <SalahView
              state={state}
              onToggleWaqt={toggleWaqtCompleted}
              onToggleAzan={toggleWaqtAzan}
              onChangeDistrict={(district) => updateProfile({ district })}
            />
          )}

          {activeModule === 'focus' && (
            <FocusView
              sessions={state.focusSessions}
              tasks={state.focusTasks}
              onLogSession={addFocusSession}
              onAddTask={addFocusTask}
              onVerifyCompleteTask={verifyAndCompleteFocusTask}
              onReopenTask={reopenFocusTask}
              onDeleteTask={deleteFocusTask}
            />
          )}

          {activeModule === 'syllabus' && (
            <SyllabusView
              syllabus={state.syllabus}
              studentStream={state.profile.stream}
              studentYear={state.profile.hscYear}
              onToggleChapter={toggleSyllabusChapter}
              onIncrementSubject={incrementSubjectChapter}
              onAddChapter={addSyllabusChapter}
            />
          )}

          {activeModule === 'tutor' && (
            <AiTeacherView
              syllabus={state.syllabus}
              studentName={state.profile.name}
              studentStream={state.profile.stream}
            />
          )}

          {activeModule === 'books' && (
            <BookReaderView
              completedBookPageKeys={state.completedBookPageKeys}
              completedChapterIds={state.completedChapterIds}
              chapterTakeaways={state.chapterTakeaways}
              vocabVault={state.vocabVault}
              onMarkPageDone={markBookPageDone}
              onCompleteChapter={completeBookChapter}
              onAddVocab={addVocabItem}
              onToggleVocabMastered={toggleVocabMastered}
              onToggleVocabPinHome={toggleVocabPinHome}
            />
          )}

          {activeModule === 'research' && (
            <ResearchView
              research={state.research}
              onUpdateResearch={updateResearch}
            />
          )}

          {activeModule === 'det' && (
            <DetHubView
              history={state.detHistory}
              onLogAttempt={addDetAttempt}
            />
          )}

          {activeModule === 'skills' && (
            <SkillExaminerView
              profile={state.profile}
              submissions={state.skillSubmissions}
              onSaveSubmission={addSkillSubmission}
            />
          )}

          {activeModule === 'eca' && (
            <EcaRemindersView
              ecas={state.ecas}
              events={state.events}
              onAddEca={addEca}
              onToggleEcaCv={toggleEcaInCv}
              onDeleteEca={deleteEca}
              onAddEvent={addEvent}
              onToggleEventReminder={toggleEventReminder}
              onDeleteEvent={deleteEvent}
            />
          )}

          {activeModule === 'cv' && (
            <CvBuilderView
              state={state}
              onUpdateProfile={updateProfile}
            />
          )}
        </main>
      </div>

      <ReviewModal
        open={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        profile={state.profile}
        onSubmitReview={submitReview}
      />
    </div>
  );
}
