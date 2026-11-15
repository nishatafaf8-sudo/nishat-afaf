import React, { useState } from 'react';
import { ExternalLink, Loader2, PlayCircle, Send, Sparkles } from 'lucide-react';
import { AI_MASCOT_AVATAR, DAILY_SKILLS_LIBRARY } from '../data/elevoraData';
import { SkillEvaluationResult, SkillSubmissionRecord, StudentProfile } from '../types';

interface SkillExaminerViewProps {
  profile: StudentProfile;
  submissions: SkillSubmissionRecord[];
  onSaveSubmission: (record: SkillSubmissionRecord) => void;
}

export const SkillExaminerView: React.FC<SkillExaminerViewProps> = ({
  profile,
  submissions,
  onSaveSubmission,
}) => {
  const [selectedSkillId, setSelectedSkillId] = useState(DAILY_SKILLS_LIBRARY[0].id);
  const activeSkill =
    DAILY_SKILLS_LIBRARY.find((s) => s.id === selectedSkillId) || DAILY_SKILLS_LIBRARY[0];

  const [answerText, setAnswerText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [latestResult, setLatestResult] = useState<SkillEvaluationResult | null>(null);

  const handleSubmitExam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (answerText.trim().length < 15) {
      setError('Please write a complete practical response (at least 15 characters) for evaluation.');
      return;
    }

    setError('');
    setLoading(true);
    setLatestResult(null);

    try {
      const res = await fetch('/api/evaluate-skill', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          skillTitle: activeSkill.title,
          lessonObjective: activeSkill.objective,
          promptQuestion: activeSkill.examPrompt,
          studentSubmission: answerText,
          studentName: profile.name,
          studentClass: `${profile.hscYear} (${profile.stream})`,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to evaluate your practical submission.');
      }

      const evaluation = data as SkillEvaluationResult;
      setLatestResult(evaluation);
      onSaveSubmission({
        id: `skill-sub-${Date.now()}`,
        skillId: activeSkill.id,
        skillTitle: activeSkill.title,
        submission: answerText.trim(),
        evaluation,
        submittedAt: new Date().toISOString(),
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unable to reach AI Examiner.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-zinc-50">
          Daily Skill Guide &amp; AI Examiner
        </h1>
        <p className="text-sm text-zinc-400 mt-1">
          Master one practical micro-skill daily, review video tutorials, and get honest feedback from Professor Mochi.
        </p>
      </div>

      {/* Skill Lesson Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {DAILY_SKILLS_LIBRARY.map((skill) => {
          const active = skill.id === activeSkill.id;
          const completed = submissions.some((s) => s.skillId === skill.id);
          return (
            <button
              key={skill.id}
              type="button"
              onClick={() => {
                setSelectedSkillId(skill.id);
                setLatestResult(null);
                setError('');
              }}
              className={`text-left p-4 rounded-2xl border transition-colors cursor-pointer ${
                active
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-zinc-800/80 bg-zinc-900/60 hover:border-zinc-700'
              }`}
            >
              <div className="text-xs text-indigo-400 truncate">{skill.category}</div>
              <div className="text-sm font-semibold text-zinc-100 mt-1 line-clamp-2">
                {skill.title}
              </div>
              <div className="mt-2.5 font-mono-num text-xs text-zinc-400">
                {skill.durationMin} min {completed ? '· Evaluated ✓' : ''}
              </div>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left: Step-by-step Guide + YouTube Integration */}
        <div className="xl:col-span-5 rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-6 space-y-5 self-start">
          <div>
            <div className="text-xs text-blue-400 font-medium">{activeSkill.category}</div>
            <h2 className="font-display text-xl font-bold text-zinc-50 mt-1">
              {activeSkill.title}
            </h2>
            <p className="text-xs text-zinc-400 mt-2 leading-relaxed">{activeSkill.objective}</p>
          </div>

          <div className="space-y-2.5">
            <div className="text-xs font-semibold text-zinc-300">Step-by-Step Execution</div>
            <ol className="space-y-2.5">
              {activeSkill.steps.map((step, i) => (
                <li
                  key={i}
                  className="p-3 rounded-xl bg-zinc-950/75 border border-zinc-800/70 text-xs text-zinc-200 flex gap-3 leading-relaxed"
                >
                  <span className="font-mono-num font-bold text-blue-400 shrink-0">
                    0{i + 1}.
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>

          <a
            href={activeSkill.youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-xl border border-zinc-800 bg-zinc-950/90 hover:border-indigo-500/50 p-4 transition-colors group"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <PlayCircle className="w-8 h-8 text-red-400 shrink-0" />
                <div className="min-w-0">
                  <div className="text-xs text-zinc-400">YouTube Video Guide</div>
                  <div className="text-sm font-medium text-zinc-100 truncate group-hover:text-indigo-300">
                    {activeSkill.youtubeTitle}
                  </div>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-zinc-500 shrink-0" />
            </div>
          </a>
        </div>

        {/* Right: Practical Exam Submission Box + Cute AI Teacher Character */}
        <div className="xl:col-span-7 space-y-6">
          <form
            onSubmit={handleSubmitExam}
            className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-6 space-y-4"
          >
            <div className="flex items-center gap-3.5 pb-3 border-b border-zinc-800/70">
              <img
                src={AI_MASCOT_AVATAR}
                alt="Professor Mochi AI Teacher"
                className="w-12 h-12 rounded-xl object-cover border border-blue-500/35 shrink-0"
              />
              <div>
                <div className="flex items-center gap-1.5 text-xs font-medium text-indigo-400">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Professor Mochi · AI Examiner</span>
                </div>
                <div className="text-xs text-zinc-400 mt-0.5">
                  “Submit your real work below — I’ll grade it strictly and tell you exactly how to improve!”
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-zinc-200 leading-relaxed">
              {activeSkill.examPrompt}
            </div>

            <textarea
              rows={8}
              value={answerText}
              onChange={(e) => setAnswerText(e.target.value)}
              placeholder={activeSkill.samplePlaceholder}
              className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-zinc-100 leading-relaxed placeholder:text-zinc-600 focus:outline-none focus:border-blue-500"
            />

            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300">
                {error}
              </div>
            )}

            <div className="flex items-center justify-between gap-4">
              <span className="font-mono-num text-xs text-zinc-500">
                {answerText.trim() ? answerText.trim().split(/\s+/).length : 0} words
              </span>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-400 disabled:opacity-60 text-white font-semibold text-xs flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Professor Mochi is grading...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit to AI Examiner</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {latestResult && (
            <div className="rounded-2xl border border-blue-500/30 bg-zinc-900/80 p-6 space-y-5">
              <div className="flex items-center justify-between gap-4 pb-4 border-b border-zinc-800">
                <div className="flex items-center gap-3">
                  <img
                    src={AI_MASCOT_AVATAR}
                    alt="AI Teacher Verdict"
                    className="w-10 h-10 rounded-lg object-cover border border-blue-500/30"
                  />
                  <div>
                    <div className="text-xs text-blue-400 font-medium">
                      Professor Mochi’s Assessment
                    </div>
                    <div className="font-display text-lg font-bold text-zinc-50">
                      {latestResult.verdict}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono-num text-3xl font-bold text-blue-400">
                    {latestResult.score}/100
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-blue-400">What Worked Well</div>
                  <ul className="space-y-1.5 text-xs text-zinc-300 list-disc pl-4">
                    {latestResult.strengths.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2">
                  <div className="text-xs font-semibold text-amber-400">Honest Gaps to Fix</div>
                  <ul className="space-y-1.5 text-xs text-zinc-300 list-disc pl-4">
                    {latestResult.improvements.map((imp, i) => (
                      <li key={i}>{imp}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
                <div className="text-xs font-semibold text-indigo-400">
                  Reference Improved Example
                </div>
                <pre className="text-xs text-zinc-300 whitespace-pre-wrap font-sans leading-relaxed">
                  {latestResult.revisedExample}
                </pre>
              </div>

              <div className="text-xs text-zinc-300">
                <span className="font-semibold text-zinc-100">Next Action Today:</span>{' '}
                {latestResult.nextAction}
              </div>
            </div>
          )}

          {submissions.length > 0 && (
            <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-6 space-y-3">
              <div className="text-sm font-semibold text-zinc-100">
                Verified Skill Evaluations ({submissions.length})
              </div>
              <div className="divide-y divide-zinc-800/60">
                {submissions.slice(0, 5).map((sub) => (
                  <div key={sub.id} className="py-3 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-zinc-200 truncate">
                        {sub.skillTitle}
                      </div>
                      <div className="text-xs text-zinc-500">
                        {sub.evaluation.verdict} ·{' '}
                        {new Date(sub.submittedAt).toLocaleDateString()}
                      </div>
                    </div>
                    <span className="font-mono-num text-sm font-bold text-blue-400 shrink-0">
                      {sub.evaluation.score}/100
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
