import React, { useMemo, useState } from 'react';
import { Download, Plus, Printer, X } from 'lucide-react';
import { RESEARCH_TOPICS } from '../data/elevoraData';
import { ElevoraState, StudentProfile } from '../types';

interface CvBuilderViewProps {
  state: ElevoraState;
  onUpdateProfile: (patch: Partial<StudentProfile>) => void;
}

export const CvBuilderView: React.FC<CvBuilderViewProps> = ({ state, onUpdateProfile }) => {
  const { profile, syllabus, detHistory, research, ecas, skillSubmissions } = state;
  const [newSkillInput, setNewSkillInput] = useState('');

  const hscStats = useMemo(() => {
    const relevant = syllabus.filter(
      (s) => s.stream === 'Both' || s.stream === profile.stream
    );
    const total = relevant.reduce((a, b) => a + b.chapters.length, 0);
    const done = relevant.reduce(
      (a, b) => a + b.chapters.filter((c) => c.completed).length,
      0
    );
    const pct = total > 0 ? Math.round((done / total) * 100) : 0;
    return {
      pct,
      subjectNames: relevant.map((s) => s.name.replace(/ 1st Paper| 2nd Paper/g, '')),
    };
  }, [syllabus, profile.stream]);

  const uniqueSubjects = Array.from(new Set(hscStats.subjectNames)).slice(0, 6);
  const bestDet = detHistory.length ? Math.max(...detHistory.map((d) => d.score)) : null;
  const activeResearchTitle =
    research.customTopicTitle.trim() ||
    RESEARCH_TOPICS.find((t) => t.id === research.selectedTopicId)?.title ||
    '';

  const cvEcas = ecas.filter((e) => e.includeInCv);
  const skillsList = profile.technicalSkills || [];

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newSkillInput.trim();
    if (!trimmed || skillsList.includes(trimmed)) return;
    onUpdateProfile({ technicalSkills: [...skillsList, trimmed] });
    setNewSkillInput('');
  };

  const handleRemoveSkill = (skill: string) => {
    onUpdateProfile({ technicalSkills: skillsList.filter((s) => s !== skill) });
  };

  const handleDownloadTxt = () => {
    const lines = [
      profile.name.toUpperCase(),
      `${profile.district}, Bangladesh | ${profile.email || 'email@example.com'} | ${profile.phone || '+880 1XXX-XXXXXX'}${profile.portfolioUrl ? ` | ${profile.portfolioUrl}` : ''}`,
      '',
      'PROFILE SUMMARY',
      profile.objective || '',
      '',
      'EDUCATION',
      `- Higher Secondary Certificate (HSC) — ${profile.stream} Track (${profile.hscYear})`,
      `  Institution: ${profile.college || 'College / High School (Bangladesh)'}`,
      `  Relevant Coursework: ${uniqueSubjects.join(', ')}`,
      ...(profile.sscGpa
        ? [`- Secondary School Certificate (SSC) — GPA ${profile.sscGpa} (${profile.sscBoard || 'Education Board'})`]
        : []),
      '',
      'RESEARCH & ACADEMIC PROJECTS',
      ...(activeResearchTitle
        ? [`- ${activeResearchTitle} (Target Completion: ${research.targetDate})`, `  ${research.draft.abstract}`]
        : ['- Independent HSC research project in progress']),
      '',
      'EXTRACURRICULAR LEADERSHIP & HONORS',
      ...(cvEcas.length
        ? cvEcas.map(
            (e) => `- ${e.title} | ${e.role} — ${e.organization} (${e.date}) · ${e.hoursOrImpact}`
          )
        : ['- Add extracurricular activities in the ECA & Reminders module to populate this section.']),
      '',
      'SKILLS, CERTIFICATIONS & LANGUAGES',
      `- Core & Technical Skills: ${skillsList.join(', ')}`,
      ...(bestDet ? [`- Standardized English (DET Practice Benchmark): ${bestDet} / 160`] : []),
      ...(skillSubmissions.length
        ? skillSubmissions.map(
            (s) => `- Verified Practical Assessment: ${s.skillTitle} (${s.evaluation.score}/100 — ${s.evaluation.verdict})`
          )
        : []),
      `- Languages: ${profile.languages || 'Bangla (Native), English (Fluent)'}`,
    ];

    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(profile.name || 'Student').replace(/\s+/g, '_')}_Academic_CV.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="no-print flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-zinc-50">
            My CV Builder (Real-Life Academic &amp; Scholarship Resume)
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Designed in a clean Harvard-style A4 resume format ready for university admissions, internships, and scholarships.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleDownloadTxt}
            className="px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-xs font-medium text-zinc-200 flex items-center gap-2 cursor-pointer whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export .TXT</span>
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="px-4 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-400 text-white text-xs font-semibold flex items-center gap-2 cursor-pointer whitespace-nowrap"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / Save as PDF</span>
          </button>
        </div>
      </div>

      {/* Real-Life CV Personal & Academic Details Editor */}
      <div className="no-print rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-6 space-y-5">
        <div className="text-sm font-semibold text-zinc-100">
          Personal &amp; Education Credentials
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label htmlFor="cv-college" className="text-xs text-zinc-400">
              College / Institution Name
            </label>
            <input
              id="cv-college"
              type="text"
              value={profile.college || ''}
              onChange={(e) => onUpdateProfile({ college: e.target.value })}
              placeholder="e.g., Notre Dame College, Dhaka"
              className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-zinc-100 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="cv-ssc-gpa" className="text-xs text-zinc-400">
              SSC GPA &amp; Year
            </label>
            <input
              id="cv-ssc-gpa"
              type="text"
              value={profile.sscGpa || ''}
              onChange={(e) => onUpdateProfile({ sscGpa: e.target.value })}
              placeholder="e.g., 5.00 / 5.00 (2025)"
              className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-zinc-100 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="cv-ssc-board" className="text-xs text-zinc-400">
              Education Board
            </label>
            <input
              id="cv-ssc-board"
              type="text"
              value={profile.sscBoard || ''}
              onChange={(e) => onUpdateProfile({ sscBoard: e.target.value })}
              placeholder="e.g., Dhaka Board"
              className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-zinc-100 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="cv-email" className="text-xs text-zinc-400">
              Professional Email
            </label>
            <input
              id="cv-email"
              type="email"
              value={profile.email || ''}
              onChange={(e) => onUpdateProfile({ email: e.target.value })}
              placeholder="firstname.lastname@gmail.com"
              className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-zinc-100 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="cv-phone" className="text-xs text-zinc-400">
              Phone Number
            </label>
            <input
              id="cv-phone"
              type="text"
              value={profile.phone || ''}
              onChange={(e) => onUpdateProfile({ phone: e.target.value })}
              placeholder="+880 1XXX-XXXXXX"
              className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-zinc-100 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="cv-portfolio" className="text-xs text-zinc-400">
              LinkedIn / GitHub / Portfolio URL
            </label>
            <input
              id="cv-portfolio"
              type="text"
              value={profile.portfolioUrl || ''}
              onChange={(e) => onUpdateProfile({ portfolioUrl: e.target.value })}
              placeholder="linkedin.com/in/yourname"
              className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-zinc-100 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label htmlFor="cv-languages" className="text-xs text-zinc-400">
              Languages
            </label>
            <input
              id="cv-languages"
              type="text"
              value={profile.languages || ''}
              onChange={(e) => onUpdateProfile({ languages: e.target.value })}
              placeholder="Bangla (Native), English (Fluent)"
              className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-zinc-100 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="cv-objective" className="text-xs text-zinc-400">
              Career / Academic Summary
            </label>
            <input
              id="cv-objective"
              type="text"
              value={profile.objective || ''}
              onChange={(e) => onUpdateProfile({ objective: e.target.value })}
              placeholder="Concise 1-2 line academic profile summary..."
              className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-zinc-100 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Editable Skills Tags */}
        <div className="space-y-2 pt-2 border-t border-zinc-800/80">
          <div className="text-xs text-zinc-400">Real-World Skills Listed on CV</div>
          <div className="flex flex-wrap items-center gap-2">
            {skillsList.map((sk) => (
              <span
                key={sk}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-200"
              >
                <span>{sk}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(sk)}
                  className="text-zinc-500 hover:text-red-400 cursor-pointer"
                  aria-label={`Remove ${sk}`}
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}

            <form onSubmit={handleAddSkill} className="inline-flex items-center gap-1.5">
              <input
                type="text"
                value={newSkillInput}
                onChange={(e) => setNewSkillInput(e.target.value)}
                placeholder="Add skill (e.g., Python, Public Speaking)"
                className="px-3 py-1 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                className="px-2.5 py-1 rounded-lg bg-indigo-500 hover:bg-indigo-400 text-white text-xs font-medium flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>Add</span>
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Classic Real-Life A4 Print-Ready Academic CV */}
      <article className="print-only-cv max-w-[820px] mx-auto rounded-xl border border-zinc-200 bg-white text-zinc-900 p-8 sm:p-12 shadow-xl space-y-5 leading-snug">
        {/* Header */}
        <header className="border-b-2 border-zinc-900 pb-3 text-center space-y-1">
          <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950 uppercase">
            {profile.name}
          </h2>
          <p className="text-xs text-zinc-700">
            {profile.district}, Bangladesh
            {profile.phone ? ` · ${profile.phone}` : ''}
            {profile.email ? ` · ${profile.email}` : ''}
            {profile.portfolioUrl ? ` · ${profile.portfolioUrl}` : ''}
          </p>
        </header>

        {/* Summary */}
        {profile.objective && (
          <section className="space-y-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 border-b border-zinc-300 pb-0.5">
              Summary
            </h3>
            <p className="text-xs text-zinc-800 leading-relaxed pt-1">{profile.objective}</p>
          </section>
        )}

        {/* Education */}
        <section className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 border-b border-zinc-300 pb-0.5">
            Education
          </h3>
          <div className="space-y-2 pt-1">
            <div>
              <div className="flex items-baseline justify-between gap-2">
                <div className="text-xs font-bold text-zinc-950">
                  {profile.college || `Higher Secondary Institution (${profile.district})`}
                </div>
                <div className="text-xs font-mono-num text-zinc-600 shrink-0">
                  {profile.hscYear} (Expected)
                </div>
              </div>
              <div className="text-xs text-zinc-800">
                Higher Secondary Certificate (HSC) — {profile.stream} Track
                {hscStats.pct > 0 ? ` · Syllabus Progress: ${hscStats.pct}%` : ''}
              </div>
              <div className="text-xs text-zinc-600 mt-0.5">
                Core Coursework: {uniqueSubjects.join(', ')}
              </div>
            </div>

            {profile.sscGpa && (
              <div className="flex items-baseline justify-between gap-2">
                <div className="text-xs text-zinc-900">
                  <span className="font-semibold">Secondary School Certificate (SSC)</span> —{' '}
                  {profile.sscBoard || 'Education Board'}
                </div>
                <div className="text-xs font-mono-num font-semibold text-zinc-800">
                  GPA {profile.sscGpa}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Research & Projects */}
        {activeResearchTitle && (
          <section className="space-y-1.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 border-b border-zinc-300 pb-0.5">
              Independent Research &amp; Academic Projects
            </h3>
            <div className="pt-1">
              <div className="flex items-baseline justify-between gap-2">
                <div className="text-xs font-bold text-zinc-950">{activeResearchTitle}</div>
                <span className="text-xs font-mono-num text-zinc-600 shrink-0">
                  Target: {research.targetDate}
                </span>
              </div>
              {research.draft.abstract && (
                <p className="text-xs text-zinc-700 leading-relaxed mt-1">
                  {research.draft.abstract}
                </p>
              )}
            </div>
          </section>
        )}

        {/* Extracurricular Activities & Leadership */}
        <section className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 border-b border-zinc-300 pb-0.5">
            Leadership, Extracurricular Activities &amp; Honors
          </h3>
          {cvEcas.length === 0 ? (
            <p className="text-xs text-zinc-500 italic pt-1">
              No extracurricular entries added yet. Log real clubs, competitions, or volunteering in the ECA &amp; Reminders tab to display them here.
            </p>
          ) : (
            <div className="space-y-2 pt-1">
              {cvEcas.map((e) => (
                <div key={e.id}>
                  <div className="flex items-baseline justify-between gap-2">
                    <div className="text-xs font-bold text-zinc-950">
                      {e.title} — <span className="font-semibold text-zinc-800">{e.role}</span>
                    </div>
                    <span className="text-xs font-mono-num text-zinc-600 shrink-0">
                      {e.date}
                    </span>
                  </div>
                  <div className="text-xs text-zinc-700">
                    {e.organization} · {e.hoursOrImpact}
                    {e.certificateNote ? ` (${e.certificateNote})` : ''}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Skills, Language & Standardized Tests */}
        <section className="space-y-1.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 border-b border-zinc-300 pb-0.5">
            Skills, Proficiency &amp; Certifications
          </h3>
          <div className="space-y-1 pt-1 text-xs text-zinc-800">
            <div>
              <span className="font-semibold text-zinc-950">Technical &amp; Core Skills:</span>{' '}
              {skillsList.length ? skillsList.join(', ') : 'Academic Research, MS Office, Critical Analysis'}
            </div>
            {bestDet && (
              <div>
                <span className="font-semibold text-zinc-950">English Proficiency (DET Prep):</span>{' '}
                {bestDet} / 160 Practice Benchmark
              </div>
            )}
            {skillSubmissions.length > 0 && (
              <div>
                <span className="font-semibold text-zinc-950">Verified Practical Skills:</span>{' '}
                {skillSubmissions
                  .map((s) => `${s.skillTitle} (${s.evaluation.score}/100)`)
                  .join(' · ')}
              </div>
            )}
            <div>
              <span className="font-semibold text-zinc-950">Languages:</span>{' '}
              {profile.languages || 'Bangla (Native), English (Fluent)'}
            </div>
          </div>
        </section>
      </article>
    </div>
  );
};
