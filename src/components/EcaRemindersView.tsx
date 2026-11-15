import React, { useState } from 'react';
import { Award, Bell, BellOff, Calendar, Plus, Trash2 } from 'lucide-react';
import { EcaCategory, EcaEntry, EventPriority, ReminderEvent } from '../types';

interface EcaRemindersViewProps {
  ecas: EcaEntry[];
  events: ReminderEvent[];
  onAddEca: (entry: Omit<EcaEntry, 'id'>) => void;
  onToggleEcaCv: (id: string) => void;
  onDeleteEca: (id: string) => void;
  onAddEvent: (evt: Omit<ReminderEvent, 'id'>) => void;
  onToggleEventReminder: (id: string) => void;
  onDeleteEvent: (id: string) => void;
}

export const EcaRemindersView: React.FC<EcaRemindersViewProps> = ({
  ecas,
  events,
  onAddEca,
  onToggleEcaCv,
  onDeleteEca,
  onAddEvent,
  onToggleEventReminder,
  onDeleteEvent,
}) => {
  const [segment, setSegment] = useState<'eca' | 'reminders'>('eca');

  // ECA Form
  const [ecaTitle, setEcaTitle] = useState('');
  const [ecaRole, setEcaRole] = useState('');
  const [ecaOrg, setEcaOrg] = useState('');
  const [ecaCat, setEcaCat] = useState<EcaCategory>('Leadership');
  const [ecaDate, setEcaDate] = useState(new Date().toISOString().slice(0, 10));
  const [ecaImpact, setEcaImpact] = useState('');
  const [ecaCert, setEcaCert] = useState('');

  // Event Form
  const [evtTitle, setEvtTitle] = useState('');
  const [evtDate, setEvtDate] = useState(
    new Date(Date.now() + 3 * 86400000).toISOString().slice(0, 10)
  );
  const [evtCat, setEvtCat] = useState('HSC Exam');
  const [evtPriority, setEvtPriority] = useState<EventPriority>('High');
  const [evtNotes, setEvtNotes] = useState('');

  const handleCreateEca = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ecaTitle.trim() || !ecaRole.trim()) return;
    onAddEca({
      title: ecaTitle.trim(),
      role: ecaRole.trim(),
      organization: ecaOrg.trim() || 'Independent / College',
      category: ecaCat,
      date: ecaDate,
      hoursOrImpact: ecaImpact.trim() || 'Active contribution',
      certificateNote: ecaCert.trim() || 'Verified student record',
      includeInCv: true,
    });
    setEcaTitle('');
    setEcaRole('');
    setEcaOrg('');
    setEcaImpact('');
    setEcaCert('');
  };

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!evtTitle.trim()) return;
    onAddEvent({
      title: evtTitle.trim(),
      date: evtDate,
      category: evtCat.trim() || 'Deadline',
      priority: evtPriority,
      reminderActive: true,
      notes: evtNotes.trim(),
    });
    setEvtTitle('');
    setEvtNotes('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-zinc-50">
            ECA &amp; Upcoming Event Reminders
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Start completely fresh and log your real achievements, club roles, and deadlines — everything syncs straight to your CV and Home dashboard.
          </p>
        </div>

        <div className="flex items-center gap-1 p-1 bg-zinc-900 border border-zinc-800 rounded-xl self-start">
          <button
            type="button"
            onClick={() => setSegment('eca')}
            className={`px-4 py-2 rounded-lg text-xs font-medium flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap ${
              segment === 'eca'
                ? 'bg-blue-500 text-white font-semibold'
                : 'text-zinc-400 hover:text-zinc-100'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>ECA Activities ({ecas.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setSegment('reminders')}
            className={`px-4 py-2 rounded-lg text-xs font-medium flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap ${
              segment === 'reminders'
                ? 'bg-indigo-500 text-white font-semibold'
                : 'text-zinc-400 hover:text-zinc-100'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Events &amp; Reminders ({events.length})</span>
          </button>
        </div>
      </div>

      {segment === 'eca' ? (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          <form
            onSubmit={handleCreateEca}
            className="xl:col-span-5 rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-6 space-y-4 self-start"
          >
            <h2 className="font-display text-lg font-semibold text-zinc-100">
              Add Real Extracurricular Activity
            </h2>
            <div className="space-y-3">
              <input
                type="text"
                required
                value={ecaTitle}
                onChange={(e) => setEcaTitle(e.target.value)}
                placeholder="Activity / Award Title (e.g., Science Club Fair)"
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-zinc-100 focus:outline-none focus:border-blue-500"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  value={ecaRole}
                  onChange={(e) => setEcaRole(e.target.value)}
                  placeholder="Your Role (e.g. Volunteer)"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-zinc-100 focus:outline-none focus:border-blue-500"
                />
                <select
                  value={ecaCat}
                  onChange={(e) => setEcaCat(e.target.value as EcaCategory)}
                  className="w-full px-3 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-zinc-100 focus:outline-none"
                >
                  <option value="Leadership">Leadership</option>
                  <option value="Club">Club Activity</option>
                  <option value="Volunteering">Volunteering</option>
                  <option value="Competition">Olympiad / Competition</option>
                  <option value="Certificate">Certificate</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  value={ecaOrg}
                  onChange={(e) => setEcaOrg(e.target.value)}
                  placeholder="Organization / College"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-zinc-100 focus:outline-none focus:border-blue-500"
                />
                <input
                  type="date"
                  value={ecaDate}
                  onChange={(e) => setEcaDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-zinc-100 font-mono-num focus:outline-none"
                />
              </div>
              <input
                type="text"
                value={ecaImpact}
                onChange={(e) => setEcaImpact(e.target.value)}
                placeholder="Impact or Hours (e.g., Organized 30+ student workshop)"
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-zinc-100 focus:outline-none focus:border-blue-500"
              />
              <input
                type="text"
                value={ecaCert}
                onChange={(e) => setEcaCert(e.target.value)}
                placeholder="Certificate / Proof Note (optional)"
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-zinc-100 focus:outline-none focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-blue-500 hover:bg-blue-400 text-white font-semibold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Save ECA &amp; Sync to CV</span>
            </button>
          </form>

          <div className="xl:col-span-7 space-y-3">
            {ecas.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/40 p-10 text-center space-y-2">
                <Award className="w-8 h-8 text-zinc-600 mx-auto" />
                <div className="text-sm font-medium text-zinc-300">
                  Your ECA Portfolio is Fresh &amp; Ready
                </div>
                <p className="text-xs text-zinc-500 max-w-md mx-auto leading-relaxed">
                  No pre-filled sample items here — add your first club role, Olympiad, volunteering effort, or certificate on the left and it will automatically appear in your real-life CV.
                </p>
              </div>
            ) : (
              ecas.map((entry) => (
                <div
                  key={entry.id}
                  className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="text-xs text-blue-400">
                      {entry.category} · {entry.organization} ·{' '}
                      <span className="font-mono-num">{entry.date}</span>
                    </div>
                    <h3 className="font-display text-base font-semibold text-zinc-100">
                      {entry.title}
                    </h3>
                    <div className="text-xs text-zinc-300">
                      Role: {entry.role} · {entry.hoursOrImpact}
                    </div>
                    <div className="text-xs text-zinc-500">
                      Credential: {entry.certificateNote}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => onToggleEcaCv(entry.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border cursor-pointer whitespace-nowrap ${
                        entry.includeInCv
                          ? 'bg-blue-500/15 border-blue-500/40 text-blue-300'
                          : 'bg-zinc-950 border-zinc-800 text-zinc-400'
                      }`}
                    >
                      {entry.includeInCv ? 'In CV ✓' : 'Hidden from CV'}
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteEca(entry.id)}
                      className="p-2 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 cursor-pointer"
                      aria-label="Delete ECA entry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          <form
            onSubmit={handleCreateEvent}
            className="xl:col-span-5 rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-6 space-y-4 self-start"
          >
            <h2 className="font-display text-lg font-semibold text-zinc-100">
              Add Event or Deadline Reminder
            </h2>
            <div className="space-y-3">
              <input
                type="text"
                required
                value={evtTitle}
                onChange={(e) => setEvtTitle(e.target.value)}
                placeholder="Event or Exam Deadline (e.g., HSC Pre-Test)"
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-zinc-100 focus:outline-none focus:border-indigo-500"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="date"
                  required
                  value={evtDate}
                  onChange={(e) => setEvtDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-zinc-100 font-mono-num focus:outline-none"
                />
                <select
                  value={evtPriority}
                  onChange={(e) => setEvtPriority(e.target.value as EventPriority)}
                  className="w-full px-3 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-zinc-100 focus:outline-none"
                >
                  <option value="High">High Priority</option>
                  <option value="Normal">Normal Priority</option>
                </select>
              </div>
              <input
                type="text"
                value={evtCat}
                onChange={(e) => setEvtCat(e.target.value)}
                placeholder="Category (HSC Exam, DET, Scholarship, Olympiad)"
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-zinc-100 focus:outline-none focus:border-indigo-500"
              />
              <textarea
                rows={2}
                value={evtNotes}
                onChange={(e) => setEvtNotes(e.target.value)}
                placeholder="Preparation checklist or reminder notes..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-zinc-100 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-semibold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Reminder &amp; Sync to Home</span>
            </button>
          </form>

          <div className="xl:col-span-7 space-y-3">
            {events.length === 0 ? (
              <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-10 text-center text-sm text-zinc-500">
                No upcoming events scheduled.
              </div>
            ) : (
              events.map((evt) => {
                const todayMs = new Date().setHours(0, 0, 0, 0);
                const diffDays = Math.ceil(
                  (new Date(evt.date + 'T00:00:00').getTime() - todayMs) / 86400000
                );

                return (
                  <div
                    key={evt.id}
                    className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="text-xs text-zinc-400">
                        <span
                          className={
                            evt.priority === 'High'
                              ? 'text-amber-400 font-semibold'
                              : 'text-indigo-400'
                          }
                        >
                          {evt.priority} Priority
                        </span>{' '}
                        · {evt.category} ·{' '}
                        <span className="font-mono-num">{evt.date}</span>
                        <span className="font-mono-num text-blue-400 ml-2">
                          ({diffDays >= 0 ? `${diffDays}d left` : `${Math.abs(diffDays)}d ago`})
                        </span>
                      </div>
                      <h3 className="font-display text-base font-semibold text-zinc-100">
                        {evt.title}
                      </h3>
                      {evt.notes && <p className="text-xs text-zinc-400">{evt.notes}</p>}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => onToggleEventReminder(evt.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                          evt.reminderActive
                            ? 'bg-blue-500/15 border-blue-500/40 text-blue-300'
                            : 'bg-zinc-950 border-zinc-800 text-zinc-500'
                        }`}
                      >
                        {evt.reminderActive ? (
                          <Bell className="w-3.5 h-3.5" />
                        ) : (
                          <BellOff className="w-3.5 h-3.5" />
                        )}
                        <span>{evt.reminderActive ? 'Dashboard Alert On' : 'Muted'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteEvent(evt.id)}
                        className="p-2 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 cursor-pointer"
                        aria-label="Delete event"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
