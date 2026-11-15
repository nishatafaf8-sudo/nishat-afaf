import React from 'react';
import { User } from 'firebase/auth';
import {
  Award,
  BookOpen,
  Bot,
  CloudCheck,
  Compass,
  FileText,
  FlaskConical,
  GraduationCap,
  Home,
  Layers,
  LogOut,
  MessageSquarePlus,
  Moon,
  SlidersHorizontal,
  Sparkles,
  Timer,
  Wind,
  X,
} from 'lucide-react';
import { CloudSyncStatus } from '../hooks/useElevoraState';
import { ModuleId, StudentProfile } from '../types';

interface SidebarProps {
  activeModule: ModuleId;
  onSelectModule: (id: ModuleId) => void;
  onOpenReviewModal: () => void;
  onEditProfile: () => void;
  onSignOut: () => void;
  profile: StudentProfile;
  authUser: User | null;
  cloudSyncStatus: CloudSyncStatus;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeModule,
  onSelectModule,
  onOpenReviewModal,
  onEditProfile,
  onSignOut,
  profile,
  authUser,
  cloudSyncStatus,
  mobileOpen,
  onCloseMobile,
}) => {
  const isMuslim = profile.faithMode === 'Muslim';

  const navItems: Array<{
    id: ModuleId;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }> = [
    { id: 'dashboard', label: 'Home Dashboard', icon: Home },
    {
      id: 'salah',
      label: isMuslim ? 'Salah & Azan' : 'Mind Refresh & Breaks',
      icon: isMuslim ? Moon : Wind,
    },
    { id: 'focus', label: 'Focus Studio', icon: Timer },
    { id: 'syllabus', label: 'HSC Syllabus & Board Lab', icon: Layers },
    { id: 'tutor', label: 'AI Teacher (Photo & Visual)', icon: Bot },
    { id: 'books', label: 'Book Reader & Vocab', icon: BookOpen },
    { id: 'research', label: 'Research Suite', icon: FlaskConical },
    { id: 'det', label: 'DET Prep Hub', icon: GraduationCap },
    { id: 'skills', label: 'Skill Guide & AI Exam', icon: Sparkles },
    { id: 'eca', label: 'ECA & Reminders', icon: Award },
    { id: 'cv', label: 'My CV Builder', icon: FileText },
  ];

  const handleSelect = (id: ModuleId) => {
    onSelectModule(id);
    onCloseMobile();
  };

  const syncLabel =
    cloudSyncStatus === 'syncing'
      ? 'Saving to cloud...'
      : cloudSyncStatus === 'error'
        ? 'Sync paused'
        : 'Private Cloud Synced';

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`no-print fixed lg:sticky top-0 left-0 z-50 h-screen w-64 shrink-0 bg-zinc-950 border-r border-zinc-800/80 flex flex-col justify-between transition-transform duration-200 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col min-h-0 flex-1">
          {/* Brand Header */}
          <div className="px-5 py-5 border-b border-zinc-800/80 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <Compass className="w-4 h-4" />
              </div>
              <span className="font-display text-lg font-bold tracking-tight text-zinc-50">
                Elevora
              </span>
            </div>
            <button
              type="button"
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 text-zinc-400 hover:text-zinc-100 rounded-lg"
              aria-label="Close navigation"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Authenticated Student Context */}
          <div className="px-5 py-3.5 border-b border-zinc-800/60 bg-zinc-900/30 space-y-1.5">
            <div className="flex items-center gap-2.5">
              {authUser?.photoURL ? (
                <img
                  src={authUser.photoURL}
                  alt={profile.name}
                  className="w-8 h-8 rounded-full border border-blue-500/40 shrink-0"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-xs font-bold text-blue-300 shrink-0">
                  {(profile.name || 'S')[0].toUpperCase()}
                </div>
              )}
              <div className="min-w-0">
                <div className="text-sm font-semibold text-zinc-100 truncate">{profile.name}</div>
                <div className="text-[11px] text-zinc-400 truncate">
                  {profile.hscYear} · {profile.stream}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-blue-400">
              <CloudCheck className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{syncLabel}</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = activeModule === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelect(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${
                    active
                      ? 'bg-blue-500/12 text-blue-400 border border-blue-500/25'
                      : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/70 border border-transparent'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 ${active ? 'text-blue-400' : 'text-zinc-500'}`}
                  />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions: Leave Review + Edit Profile + Sign Out */}
        <div className="p-3 border-t border-zinc-800/80 space-y-1.5">
          <button
            type="button"
            onClick={() => {
              onOpenReviewModal();
              onCloseMobile();
            }}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/25 transition-colors cursor-pointer whitespace-nowrap"
          >
            <MessageSquarePlus className="w-3.5 h-3.5" />
            <span>Write a Review</span>
          </button>
          <button
            type="button"
            onClick={onEditProfile}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-zinc-300 bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 transition-colors cursor-pointer whitespace-nowrap"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-blue-400" />
            <span>Edit Profile &amp; Stream</span>
          </button>
          <button
            type="button"
            onClick={onSignOut}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-red-300 bg-red-500/10 hover:bg-red-500/20 border border-red-500/25 transition-colors cursor-pointer whitespace-nowrap"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};
