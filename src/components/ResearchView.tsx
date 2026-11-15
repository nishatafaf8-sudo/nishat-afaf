import React, { useMemo, useState } from 'react';
import { Calendar, Check, Download, FlaskConical, Plus } from 'lucide-react';
import { RESEARCH_TOPICS } from '../data/elevoraData';
import { EquipmentChecklistItem, ResearchState } from '../types';

interface ResearchViewProps {
  research: ResearchState;
  onUpdateResearch: (updater: (prev: ResearchState) => ResearchState) => void;
}

type DraftSectionKey = 'abstract' | 'introduction' | 'methodology' | 'references';

export const ResearchView: React.FC<ResearchViewProps> = ({ research, onUpdateResearch }) => {
  const [activeDraftTab, setActiveDraftTab] = useState<DraftSectionKey>('abstract');
  const [newChecklistLabel, setNewChecklistLabel] = useState('');
  const [newChecklistCat, setNewChecklistCat] =
    useState<EquipmentChecklistItem['category']>('Equipment & Software');

  const selectedTopic =
    RESEARCH_TOPICS.find((t) => t.id === research.selectedTopicId) || RESEARCH_TOPICS[0];

  const activeTitle = research.customTopicTitle.trim() || selectedTopic.title;

  const daysRemaining = useMemo(() => {
    if (!research.targetDate) return null;
    const todayMs = new Date().setHours(0, 0, 0, 0);
    const targetMs = new Date(research.targetDate + 'T00:00:00').getTime();
    return Math.ceil((targetMs - todayMs) / 86400000);
  }, [research.targetDate]);

  const checklistDone = research.checklist.filter((c) => c.checked).length;
  const checklistPct = research.checklist.length
    ? Math.round((checklistDone / research.checklist.length) * 100)
    : 0;

  const totalWordCount = useMemo(() => {
    const combined = Object.values(research.draft).join(' ').trim();
    if (!combined) return 0;
    return combined.split(/\s+/).length;
  }, [research.draft]);

  const handleToggleChecklist = (id: string) => {
    onUpdateResearch((prev) => ({
      ...prev,
      checklist: prev.checklist.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      ),
    }));
  };

  const handleAddChecklistItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChecklistLabel.trim()) return;
    onUpdateResearch((prev) => ({
      ...prev,
      checklist: [
        ...prev.checklist,
        {
          id: `eq-custom-${Date.now()}`,
          label: newChecklistLabel.trim(),
          category: newChecklistCat,
          checked: false,
        },
      ],
    }));
    setNewChecklistLabel('');
  };

  const handleExportMarkdown = () => {
    const md = [
      `# ${activeTitle}`,
      `Target Finish Date: ${research.targetDate}`,
      ``,
      `## Abstract`,
      research.draft.abstract,
      ``,
      `## Introduction`,
      research.draft.introduction,
      ``,
      `## Methodology`,
      research.draft.methodology,
      ``,
      `## References`,
      research.draft.references,
    ].join('\n');

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'elevora_research_draft.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-zinc-50">
            Research &amp; Paper Drafting Suite
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Select a high-impact topic, verify equipment &amp; methodology readiness, and draft your manuscript.
          </p>
        </div>

        {/* Target Finish Date Countdown */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 px-4 py-2.5 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-indigo-400" />
            <label htmlFor="research-target-date" className="text-xs text-zinc-400">
              Target Date
            </label>
            <input
              id="research-target-date"
              type="date"
              value={research.targetDate}
              onChange={(e) =>
                onUpdateResearch((prev) => ({ ...prev, targetDate: e.target.value }))
              }
              className="px-2.5 py-1 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 font-mono-num focus:outline-none focus:border-blue-500"
            />
          </div>
          {daysRemaining !== null && (
            <div className="font-mono-num text-sm font-bold text-blue-400 whitespace-nowrap">
              {daysRemaining >= 0 ? `${daysRemaining} days left` : `${Math.abs(daysRemaining)}d overdue`}
            </div>
          )}
        </div>
      </div>

      {/* Topic Selector */}
      <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-6 space-y-4">
        <div className="flex items-center gap-2 text-xs font-medium text-blue-400">
          <FlaskConical className="w-4 h-4" />
          <span>Research Topic Selector</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {RESEARCH_TOPICS.map((topic) => {
            const active =
              research.selectedTopicId === topic.id && !research.customTopicTitle.trim();
            return (
              <button
                key={topic.id}
                type="button"
                onClick={() =>
                  onUpdateResearch((prev) => ({
                    ...prev,
                    selectedTopicId: topic.id,
                    customTopicTitle: '',
                  }))
                }
                className={`text-left p-4 rounded-xl border transition-colors cursor-pointer ${
                  active
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-zinc-800 bg-zinc-950/70 hover:border-zinc-700'
                }`}
              >
                <div className="text-xs text-indigo-400">{topic.field}</div>
                <div className="text-sm font-semibold text-zinc-100 mt-1">{topic.title}</div>
                <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">{topic.summary}</p>
              </button>
            );
          })}
        </div>

        <div className="pt-2">
          <label htmlFor="custom-topic" className="block text-xs text-zinc-400 mb-1.5">
            Or Enter Your Custom Research Paper Title
          </label>
          <input
            id="custom-topic"
            type="text"
            value={research.customTopicTitle}
            onChange={(e) =>
              onUpdateResearch((prev) => ({ ...prev, customTopicTitle: e.target.value }))
            }
            placeholder="Type a custom title to override the preset topic..."
            className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Main Split: Equipment & Methodology Guide | Paper Draft Workspace */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Equipment & Methodology Guide */}
        <div className="xl:col-span-5 rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-6 flex flex-col justify-between gap-5">
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <div>
                <h2 className="font-display text-lg font-semibold text-zinc-100">
                  Equipment &amp; Methodology Guide
                </h2>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Pre-draft readiness checklist before running experiments
                </p>
              </div>
              <span className="font-mono-num text-sm font-bold text-blue-400">
                {checklistPct}%
              </span>
            </div>

            <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden mb-5">
              <div
                className="h-full bg-blue-500 transition-all"
                style={{ width: `${checklistPct}%` }}
              />
            </div>

            <div className="space-y-4 max-h-[420px] overflow-y-auto pr-1">
              {(
                ['Equipment & Software', 'Literature Source', 'Methodology Step'] as const
              ).map((cat) => {
                const items = research.checklist.filter((i) => i.category === cat);
                return (
                  <div key={cat} className="space-y-1.5">
                    <div className="text-xs font-medium text-indigo-400">{cat}</div>
                    <div className="divide-y divide-zinc-800/60 rounded-xl border border-zinc-800/70 bg-zinc-950/60 px-3">
                      {items.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => handleToggleChecklist(item.id)}
                          className="w-full py-2.5 flex items-start gap-2.5 text-left cursor-pointer"
                        >
                          <span
                            className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                              item.checked
                                ? 'bg-blue-500 border-blue-500 text-white'
                                : 'border-zinc-700 bg-zinc-900 text-transparent'
                            }`}
                          >
                            <Check className="w-3 h-3" />
                          </span>
                          <span
                            className={`text-xs leading-relaxed ${
                              item.checked ? 'text-zinc-500 line-through' : 'text-zinc-200'
                            }`}
                          >
                            {item.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <form onSubmit={handleAddChecklistItem} className="space-y-2 pt-3 border-t border-zinc-800/80">
            <div className="flex gap-2">
              <select
                value={newChecklistCat}
                onChange={(e) =>
                  setNewChecklistCat(e.target.value as EquipmentChecklistItem['category'])
                }
                className="px-2.5 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 focus:outline-none"
              >
                <option value="Equipment & Software">Equipment</option>
                <option value="Literature Source">Literature</option>
                <option value="Methodology Step">Methodology</option>
              </select>
              <input
                type="text"
                value={newChecklistLabel}
                onChange={(e) => setNewChecklistLabel(e.target.value)}
                placeholder="Add lab tool or step..."
                className="flex-1 px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                className="px-3 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-100 flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>
          </form>
        </div>

        {/* Paper Draft Workspace */}
        <div className="xl:col-span-7 rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-6 flex flex-col justify-between gap-4">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="font-display text-lg font-semibold text-zinc-100">
                  Paper Draft Workspace
                </h2>
                <p className="text-xs text-zinc-400 mt-0.5 truncate max-w-md">
                  Working Title: {activeTitle}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="font-mono-num text-xs text-zinc-400">
                  {totalWordCount} total words
                </span>
                <button
                  type="button"
                  onClick={handleExportMarkdown}
                  className="px-3 py-1.5 rounded-lg bg-indigo-500 hover:bg-indigo-400 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export .MD</span>
                </button>
              </div>
            </div>

            {/* Section Tabs */}
            <div className="flex flex-wrap items-center gap-1 p-1 bg-zinc-950 border border-zinc-800 rounded-xl">
              {(
                [
                  { key: 'abstract', label: 'Abstract' },
                  { key: 'introduction', label: 'Introduction' },
                  { key: 'methodology', label: 'Methodology' },
                  { key: 'references', label: 'References' },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveDraftTab(tab.key)}
                  className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                    activeDraftTab === tab.key
                      ? 'bg-blue-500 text-white font-semibold'
                      : 'text-zinc-400 hover:text-zinc-100'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <textarea
              rows={15}
              value={research.draft[activeDraftTab]}
              onChange={(e) => {
                const val = e.target.value;
                onUpdateResearch((prev) => ({
                  ...prev,
                  draft: {
                    ...prev.draft,
                    [activeDraftTab]: val,
                  },
                }));
              }}
              placeholder={`Write your paper's ${activeDraftTab} section here...`}
              className="w-full px-4 py-3.5 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-zinc-100 leading-relaxed placeholder:text-zinc-600 focus:outline-none focus:border-blue-500 resize-y"
            />
          </div>

          <div className="flex items-center justify-between text-xs text-zinc-500 pt-2 border-t border-zinc-800/70">
            <span>Auto-saved to LocalStorage</span>
            <span className="font-mono-num">
              Last edit:{' '}
              {new Date(research.lastSavedAt).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
