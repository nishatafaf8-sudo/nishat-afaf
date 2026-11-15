import React, { useEffect, useState } from 'react';
import {
  Check,
  CheckCircle2,
  ListTodo,
  Pause,
  Play,
  Plus,
  RotateCcw,
  ShieldCheck,
  Target,
  Trash2,
} from 'lucide-react';
import { FocusCategory, FocusSession, FocusTask } from '../types';
import { playTimerCompleteChime } from '../utils/audio';

interface FocusViewProps {
  sessions: FocusSession[];
  tasks: FocusTask[];
  onLogSession: (session: FocusSession, taskId?: string) => void;
  onAddTask: (title: string, category: FocusCategory) => void;
  onVerifyCompleteTask: (taskId: string, proofNote: string) => void;
  onReopenTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
}

const PRESETS = [15, 25, 45, 50];
const CATEGORIES: FocusCategory[] = [
  'HSC 2nd Year',
  'HSC 1st Year',
  'DET English',
  'Research',
  'Reading',
  'Scholarship',
  'ECA',
];

export const FocusView: React.FC<FocusViewProps> = ({
  sessions,
  tasks,
  onLogSession,
  onAddTask,
  onVerifyCompleteTask,
  onReopenTask,
  onDeleteTask,
}) => {
  const [selectedMinutes, setSelectedMinutes] = useState(25);
  const [customInput, setCustomInput] = useState('30');
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [category, setCategory] = useState<FocusCategory>('HSC 2nd Year');
  const [statusMessage, setStatusMessage] = useState('');

  // Task Bar State
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [activeTaskId, setActiveTaskId] = useState<string>('');
  const [verifyingTaskId, setVerifyingTaskId] = useState<string | null>(null);
  const [proofDraft, setProofDraft] = useState('');
  const [proofError, setProofError] = useState('');

  const activeTask = tasks.find((t) => t.id === activeTaskId && !t.completed) || null;
  const pendingTasks = tasks.filter((t) => !t.completed);
  const verifiedTasks = tasks.filter((t) => t.completed);

  useEffect(() => {
    if (!isRunning) return;
    const id = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          playTimerCompleteChime();
          onLogSession(
            {
              id: `fs-${Date.now()}`,
              category,
              minutes: selectedMinutes,
              taskTitle: activeTask?.title,
              completedAt: new Date().toISOString(),
            },
            activeTask?.id
          );
          setStatusMessage(
            activeTask
              ? `Completed ${selectedMinutes} min focus block on "${activeTask.title}"!`
              : `Completed ${selectedMinutes} min ${category} focus block!`
          );
          return selectedMinutes * 60;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [isRunning, selectedMinutes, category, activeTask, onLogSession]);

  const applyPreset = (mins: number) => {
    setIsRunning(false);
    setSelectedMinutes(mins);
    setSecondsLeft(mins * 60);
    setStatusMessage('');
  };

  const handleApplyCustom = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseInt(customInput, 10);
    if (isNaN(parsed) || parsed < 1 || parsed > 180) {
      setStatusMessage('Enter a custom duration between 1 and 180 minutes.');
      return;
    }
    applyPreset(parsed);
  };

  const handleCompleteEarly = () => {
    const elapsedSec = selectedMinutes * 60 - secondsLeft;
    const elapsedMin = Math.max(1, Math.round(elapsedSec / 60));
    setIsRunning(false);
    playTimerCompleteChime();
    onLogSession(
      {
        id: `fs-${Date.now()}`,
        category,
        minutes: elapsedMin,
        taskTitle: activeTask?.title,
        completedAt: new Date().toISOString(),
      },
      activeTask?.id
    );
    setSecondsLeft(selectedMinutes * 60);
    setStatusMessage(
      activeTask
        ? `Logged ${elapsedMin} min toward "${activeTask.title}".`
        : `Logged ${elapsedMin} min session under ${category}.`
    );
  };

  const handleAddTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    onAddTask(newTaskTitle, category);
    setNewTaskTitle('');
  };

  const handleStartVerify = (taskId: string) => {
    setVerifyingTaskId(taskId);
    setProofDraft('');
    setProofError('');
  };

  const handleConfirmVerify = (e: React.FormEvent, taskId: string) => {
    e.preventDefault();
    if (proofDraft.trim().length < 6) {
      setProofError('Write at least 6 characters stating what you actually finished.');
      return;
    }
    onVerifyCompleteTask(taskId, proofDraft.trim());
    if (activeTaskId === taskId) {
      setActiveTaskId('');
    }
    setVerifyingTaskId(null);
    setProofDraft('');
    setProofError('');
  };

  const totalSec = selectedMinutes * 60;
  const progressRatio = totalSec > 0 ? (totalSec - secondsLeft) / totalSec : 0;
  const radius = 104;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progressRatio);

  const minsDisplay = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const secsDisplay = String(secondsLeft % 60).padStart(2, '0');

  const todayTotal = sessions
    .filter((s) => s.completedAt.slice(0, 10) === new Date().toISOString().slice(0, 10))
    .reduce((acc, s) => acc + s.minutes, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-zinc-50">
          Focus Timer &amp; Verified Task Bar
        </h1>
        <p className="text-sm text-zinc-400 mt-1">
          Pick a task, run your focus timer, and confirm 1 short line of proof to mark work genuinely done.
        </p>
      </div>

      {/* Session Task Bar — Add & Focus on Tasks */}
      <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <ListTodo className="w-4 h-4 text-blue-400" />
            <h2 className="font-display text-base font-semibold text-zinc-100">
              Study Task Bar
            </h2>
            <span className="font-mono-num text-xs text-zinc-400">
              · {pendingTasks.length} active · {verifiedTasks.length} verified done
            </span>
          </div>
          {activeTask && (
            <div className="text-xs text-blue-300 flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-blue-400" />
              <span>Focused on: {activeTask.title}</span>
            </div>
          )}
        </div>

        {/* Simple Quick Add Bar */}
        <form onSubmit={handleAddTaskSubmit} className="flex flex-col sm:flex-row gap-2.5">
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder={`Add a ${category} task (e.g., Solve 10 Physics MCQs or Finish 2 pages of book)...`}
            className="flex-1 px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            className="px-4 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-400 text-white text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Add Task</span>
          </button>
        </form>

        {/* Active & Verified Tasks */}
        {tasks.length === 0 ? (
          <div className="rounded-xl border border-dashed border-zinc-800 bg-zinc-950/40 px-4 py-5 text-center text-xs text-zinc-500">
            No tasks added yet. Add what you plan to finish in this session so every minute stays accountable.
          </div>
        ) : (
          <div className="space-y-2.5">
            {pendingTasks.map((task) => {
              const isSelected = activeTask?.id === task.id;
              const isVerifying = verifyingTaskId === task.id;

              return (
                <div
                  key={task.id}
                  className={`rounded-xl border p-3.5 transition-colors ${
                    isSelected
                      ? 'border-blue-500/60 bg-blue-500/8'
                      : 'border-zinc-800 bg-zinc-950/70'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-zinc-100">{task.title}</div>
                      <div className="text-xs text-zinc-400 mt-0.5 flex flex-wrap items-center gap-2">
                        <span>{task.category}</span>
                        <span>·</span>
                        <span className="font-mono-num text-blue-400">
                          {task.focusMinutesSpent} min focused
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => setActiveTaskId(isSelected ? '' : task.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border cursor-pointer whitespace-nowrap ${
                          isSelected
                            ? 'bg-blue-500 border-blue-500 text-white'
                            : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                        }`}
                      >
                        {isSelected ? 'Focusing ✓' : 'Focus This'}
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          isVerifying ? setVerifyingTaskId(null) : handleStartVerify(task.id)
                        }
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-500/15 border border-indigo-500/40 text-indigo-300 hover:bg-indigo-500/25 flex items-center gap-1 cursor-pointer whitespace-nowrap"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>{isVerifying ? 'Cancel' : 'Verify & Done'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onDeleteTask(task.id)}
                        className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 cursor-pointer"
                        aria-label="Delete task"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Simple 1-line Proof Check to ensure genuine completion */}
                  {isVerifying && (
                    <form
                      onSubmit={(e) => handleConfirmVerify(e, task.id)}
                      className="mt-3 pt-3 border-t border-zinc-800/80 space-y-2"
                    >
                      <label
                        htmlFor={`proof-${task.id}`}
                        className="block text-xs font-medium text-blue-300"
                      >
                        Quick Reality Check — write 1 short line proving what you actually finished:
                      </label>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <input
                          id={`proof-${task.id}`}
                          type="text"
                          value={proofDraft}
                          onChange={(e) => setProofDraft(e.target.value)}
                          placeholder="e.g., Solved 12 Vector MCQs, reviewed 2 mistakes / Read Chapter 2 pages 1-3"
                          className="flex-1 px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-xs text-zinc-100 focus:outline-none focus:border-blue-500"
                          autoFocus
                        />
                        <button
                          type="submit"
                          className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-400 text-white text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Confirm Done</span>
                        </button>
                      </div>
                      {proofError && <p className="text-xs text-amber-400">{proofError}</p>}
                    </form>
                  )}
                </div>
              );
            })}

            {verifiedTasks.length > 0 && (
              <div className="pt-2 space-y-2">
                <div className="text-xs font-medium text-zinc-500">
                  Verified Completed Tasks ({verifiedTasks.length})
                </div>
                {verifiedTasks.slice(0, 6).map((task) => (
                  <div
                    key={task.id}
                    className="rounded-xl border border-zinc-800/60 bg-zinc-950/40 px-3.5 py-2.5 flex items-start justify-between gap-3"
                  >
                    <div className="flex items-start gap-2.5 min-w-0">
                      <span className="mt-0.5 w-4 h-4 rounded bg-blue-500 text-white flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3" />
                      </span>
                      <div className="min-w-0">
                        <div className="text-xs font-medium text-zinc-400 line-through">
                          {task.title}
                        </div>
                        <div className="text-xs text-blue-400 mt-0.5">
                          Proof: “{task.proofNote}” ·{' '}
                          <span className="font-mono-num text-zinc-400">
                            {task.focusMinutesSpent}m focused
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => onReopenTask(task.id)}
                        className="text-xs text-zinc-500 hover:text-zinc-300 cursor-pointer"
                      >
                        Undo
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteTask(task.id)}
                        className="p-1 text-zinc-600 hover:text-red-400 cursor-pointer"
                        aria-label="Remove completed task"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Timer Console */}
        <div className="xl:col-span-7 rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-6 sm:p-8 flex flex-col items-center">
          {/* Preset Blocks */}
          <div className="w-full flex flex-wrap items-center justify-center gap-2 mb-6">
            {PRESETS.map((mins) => (
              <button
                key={mins}
                type="button"
                onClick={() => applyPreset(mins)}
                className={`px-3.5 py-2 rounded-xl text-xs font-medium border transition-colors cursor-pointer whitespace-nowrap font-mono-num ${
                  selectedMinutes === mins
                    ? 'bg-blue-500 border-blue-500 text-white font-semibold'
                    : 'bg-zinc-950/80 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                }`}
              >
                {mins} min
              </button>
            ))}

            <form onSubmit={handleApplyCustom} className="flex items-center gap-1.5">
              <input
                type="number"
                min={1}
                max={180}
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                aria-label="Custom minutes"
                className="w-16 px-2.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 font-mono-num focus:outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                className="px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-medium text-zinc-300 hover:text-zinc-50 cursor-pointer whitespace-nowrap"
              >
                Set Custom
              </button>
            </form>
          </div>

          {/* Circular Progress Ring */}
          <div className="relative w-60 h-60 flex items-center justify-center my-2">
            <svg className="w-60 h-60 -rotate-90" viewBox="0 0 240 240">
              <circle
                cx="120"
                cy="120"
                r={radius}
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                className="text-zinc-800"
              />
              <circle
                cx="120"
                cy="120"
                r={radius}
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className="text-blue-500 transition-all duration-500"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
              <div className="text-xs text-indigo-400 font-medium">{category}</div>
              <div className="font-mono-num text-5xl font-bold text-zinc-50 tracking-tight mt-1">
                {minsDisplay}:{secsDisplay}
              </div>
              <div className="text-xs text-zinc-400 mt-1 line-clamp-1">
                {activeTask ? activeTask.title : isRunning ? 'Deep Focus Active' : 'Ready'}
              </div>
            </div>
          </div>

          {/* Subject Category Tagger */}
          <div className="w-full mt-6 space-y-2">
            <div className="text-xs text-zinc-400 text-center">Subject Category Tag</div>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer whitespace-nowrap ${
                    category === cat
                      ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300'
                      : 'bg-zinc-950/70 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Controls */}
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => {
                setStatusMessage('');
                setIsRunning((prev) => !prev);
              }}
              className="px-6 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-400 text-white font-semibold text-sm flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap"
            >
              {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isRunning ? 'Pause' : 'Start Focus'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setIsRunning(false);
                setSecondsLeft(selectedMinutes * 60);
                setStatusMessage('');
              }}
              className="px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-zinc-700 text-zinc-300 text-sm font-medium flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset</span>
            </button>

            {secondsLeft < selectedMinutes * 60 && (
              <button
                type="button"
                onClick={handleCompleteEarly}
                className="px-4 py-2.5 rounded-xl bg-indigo-500/15 border border-indigo-500/40 text-indigo-300 hover:bg-indigo-500/25 text-sm font-medium flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Finish &amp; Log</span>
              </button>
            )}
          </div>

          {statusMessage && (
            <p className="mt-4 text-xs text-blue-400 text-center">{statusMessage}</p>
          )}
        </div>

        {/* Session Log */}
        <div className="xl:col-span-5 rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-6 flex flex-col">
          <div className="flex items-center justify-between pb-4 border-b border-zinc-800/80">
            <div>
              <h2 className="font-display text-lg font-semibold text-zinc-100">
                Focus Session Log
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Today: <span className="font-mono-num text-blue-400 font-semibold">{todayTotal} min</span> · All-time: <span className="font-mono-num text-zinc-200">{sessions.length} blocks</span>
              </p>
            </div>
          </div>

          <div className="mt-4 flex-1 overflow-y-auto max-h-[420px] divide-y divide-zinc-800/60">
            {sessions.length === 0 ? (
              <div className="py-12 text-center text-sm text-zinc-500">
                No sessions logged yet. Start a focus block to build momentum.
              </div>
            ) : (
              sessions.slice(0, 20).map((s) => (
                <div key={s.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-zinc-200 truncate">
                      {s.taskTitle ? `${s.category} · ${s.taskTitle}` : s.category}
                    </div>
                    <div className="text-xs text-zinc-500 font-mono-num">
                      {new Date(s.completedAt).toLocaleString([], {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                  <div className="font-mono-num text-sm font-semibold text-blue-400 shrink-0">
                    +{s.minutes} min
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
