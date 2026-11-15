import { useCallback, useEffect, useRef, useState } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  serverTimestamp,
  writeBatch,
} from 'firebase/firestore';
import {
  INITIAL_ECAS,
  INITIAL_EQUIPMENT_CHECKLIST,
  INITIAL_EVENTS,
  INITIAL_SYLLABUS,
  INITIAL_VOCAB_VAULT,
  RESEARCH_TOPICS,
} from '../data/elevoraData';
import {
  OperationType,
  auth,
  db,
  googleProvider,
  handleFirestoreError,
} from '../firebase';
import {
  DetAttempt,
  EcaEntry,
  ElevoraState,
  FocusCategory,
  FocusSession,
  FocusTask,
  ReminderEvent,
  ResearchState,
  SkillSubmissionRecord,
  StudentProfile,
  SyllabusChapter,
  VocabItem,
  WaqtKey,
} from '../types';
import { getTodayDateKey } from '../utils/prayerTimes';

const CACHE_PREFIX = 'elevora_user_cache_v4_';
const DEFAULT_SYLLABUS_IDS = new Set(INITIAL_SYLLABUS.map((s) => s.id));
const DEFAULT_VOCAB_IDS = new Set(INITIAL_VOCAB_VAULT.map((v) => v.id));

export type CloudSyncStatus = 'idle' | 'loading' | 'syncing' | 'synced' | 'error';

export function createDefaultState(): ElevoraState {
  const today = getTodayDateKey();
  const targetDefault = new Date(Date.now() + 45 * 86400000).toISOString().slice(0, 10);

  return {
    profile: {
      name: '',
      hscYear: 'HSC 2nd Year',
      stream: 'Science',
      district: 'Dhaka',
      faithMode: 'Muslim',
      onboarded: false,
      email: '',
      phone: '',
      college: '',
      sscGpa: '',
      sscBoard: 'Dhaka Board',
      portfolioUrl: '',
      languages: 'Bangla (Native), English (Academic / DET Prep)',
      technicalSkills: ['Academic Writing', 'MS Excel / Google Sheets', 'Problem Solving'],
      objective:
        'Ambitious HSC student building strong academic, analytical, and leadership foundations for university admissions and merit scholarships.',
    },
    salah: {
      dateKey: today,
      completed: { fajr: false, dhuhr: false, asr: false, maghrib: false, isha: false },
      azanEnabled: { fajr: true, dhuhr: true, asr: true, maghrib: true, isha: true },
      streakDays: 1,
      quranMinutesCompletedToday: 0,
      lastQuranSurahId: 'pair-fatihah-asr',
    },
    focusSessions: [],
    focusTasks: [],
    syllabus: INITIAL_SYLLABUS.map((sub) => ({
      ...sub,
      chapters: sub.chapters.map((ch) => ({ ...ch })),
    })),
    completedBookPageKeys: [],
    completedChapterIds: [],
    chapterTakeaways: {},
    vocabVault: INITIAL_VOCAB_VAULT.map((v) => ({ ...v })),
    research: {
      selectedTopicId: RESEARCH_TOPICS[0].id,
      customTopicTitle: '',
      targetDate: targetDefault,
      checklist: INITIAL_EQUIPMENT_CHECKLIST.map((item) => ({ ...item })),
      draft: {
        abstract:
          'Microplastic pollution in Dhaka’s urban freshwater bodies poses an escalating ecological and public health hazard. This study investigates the filtration efficiency of chemically unmodified rice-husk biochar columns as an affordable, locally scalable remediation method.',
        introduction:
          'Bangladesh’s dense urban centers generate substantial polymer runoff into surrounding rivers such as the Buriganga and Turag. Existing membrane filtration methods remain cost-prohibitive for community-level water treatment.',
        methodology:
          '1. Prepare rice-husk biochar via pyrolysis at 450°C.\n2. Sieve into uniform 0.5–1.0 mm granules and pack vertical glass columns.\n3. Pass spiked polyethylene microsphere suspensions (50 mg/L) at controlled flow rates.\n4. Quantify turbidity and particle retention via optical microscopy and gravimetric analysis.',
        references:
          '[1] Rahman, M. et al. (2024). Urban Microplastic Pathways in South Asian Deltas. Environmental Monitoring Journal.\n[2] Ahmed, S. (2025). Agricultural Waste Biochar for Low-Cost Water Treatment. Dhaka University Science Review.',
      },
      lastSavedAt: new Date().toISOString(),
    },
    detHistory: [],
    skillSubmissions: [],
    ecas: INITIAL_ECAS,
    events: INITIAL_EVENTS,
  };
}

function normalizeDailySalah(salah: Partial<ElevoraState['salah']>, defaults: ElevoraState['salah']) {
  const today = getTodayDateKey();
  const merged = { ...defaults, ...salah };
  if (merged.dateKey !== today) {
    const prevCount = Object.values(merged.completed || {}).filter(Boolean).length;
    merged.dateKey = today;
    merged.completed = { fajr: false, dhuhr: false, asr: false, maghrib: false, isha: false };
    merged.quranMinutesCompletedToday = 0;
    merged.streakDays = prevCount >= 3 ? (merged.streakDays || 1) + 1 : merged.streakDays || 1;
  }
  return merged;
}

function hydrateStateFromCloudPayload(
  userData: Record<string, unknown> | undefined,
  privateData: Record<string, unknown> | undefined,
  workspaceData: Record<string, unknown> | undefined,
  firebaseUser: User
): ElevoraState {
  const defaults = createDefaultState();

  const profile: StudentProfile = {
    ...defaults.profile,
    name: typeof userData?.name === 'string' ? userData.name : firebaseUser.displayName || '',
    hscYear:
      userData?.hscYear === 'HSC 1st Year' || userData?.hscYear === 'HSC 2nd Year'
        ? userData.hscYear
        : defaults.profile.hscYear,
    stream:
      userData?.stream === 'Science' ||
      userData?.stream === 'Commerce' ||
      userData?.stream === 'Arts'
        ? userData.stream
        : defaults.profile.stream,
    district:
      typeof userData?.district === 'string' && userData.district.trim()
        ? userData.district
        : defaults.profile.district,
    faithMode:
      userData?.faithMode === 'Muslim' || userData?.faithMode === 'Mind Refresh'
        ? userData.faithMode
        : defaults.profile.faithMode,
    onboarded: typeof userData?.onboarded === 'boolean' ? userData.onboarded : false,
    college: typeof userData?.college === 'string' ? userData.college : '',
    sscGpa: typeof userData?.sscGpa === 'string' ? userData.sscGpa : '',
    sscBoard: typeof userData?.sscBoard === 'string' ? userData.sscBoard : defaults.profile.sscBoard,
    languages:
      typeof userData?.languages === 'string' ? userData.languages : defaults.profile.languages,
    technicalSkills: Array.isArray(userData?.technicalSkills)
      ? userData.technicalSkills.filter((s): s is string => typeof s === 'string')
      : defaults.profile.technicalSkills,
    objective:
      typeof userData?.objective === 'string' ? userData.objective : defaults.profile.objective,
    email:
      typeof privateData?.email === 'string' && privateData.email
        ? privateData.email
        : firebaseUser.email || '',
    phone: typeof privateData?.phone === 'string' ? privateData.phone : '',
    portfolioUrl:
      typeof privateData?.portfolioUrl === 'string' ? privateData.portfolioUrl : '',
  };

  if (!workspaceData) {
    return { ...defaults, profile };
  }

  const completedSet = new Set(
    Array.isArray(workspaceData.syllabusCompletedIds)
      ? workspaceData.syllabusCompletedIds.filter((id): id is string => typeof id === 'string')
      : []
  );
  const customMap =
    workspaceData.customSyllabusChapters &&
    typeof workspaceData.customSyllabusChapters === 'object'
      ? (workspaceData.customSyllabusChapters as Record<string, SyllabusChapter[]>)
      : {};

  const syllabus = defaults.syllabus.map((sub) => {
    const customList = Array.isArray(customMap[sub.id]) ? customMap[sub.id] : [];
    const combined = [...sub.chapters, ...customList];
    return {
      ...sub,
      chapters: combined.map((ch) => ({
        ...ch,
        completed: completedSet.has(ch.id) || Boolean(ch.completed),
      })),
    };
  });

  const masteredSet = new Set(
    Array.isArray(workspaceData.masteredVocabIds)
      ? workspaceData.masteredVocabIds.filter((id): id is string => typeof id === 'string')
      : []
  );
  const pinnedSet = new Set(
    Array.isArray(workspaceData.pinnedVocabIds)
      ? workspaceData.pinnedVocabIds.filter((id): id is string => typeof id === 'string')
      : []
  );
  const customVocab = Array.isArray(workspaceData.customVocab)
    ? (workspaceData.customVocab as VocabItem[])
    : [];

  const mergedDefaultVocab = defaults.vocabVault.map((v) => ({
    ...v,
    mastered: masteredSet.has(v.id),
    pinnedForHome: pinnedSet.has(v.id) ? true : v.pinnedForHome,
  }));

  const customIds = new Set(customVocab.map((v) => v.id));
  const vocabVault = [
    ...customVocab.map((v) => ({
      ...v,
      mastered: masteredSet.has(v.id) || v.mastered,
      pinnedForHome: pinnedSet.has(v.id) || v.pinnedForHome,
    })),
    ...mergedDefaultVocab.filter((v) => !customIds.has(v.id)),
  ];

  const salah = normalizeDailySalah(
    (workspaceData.salah as Partial<ElevoraState['salah']>) || {},
    defaults.salah
  );

  const rawResearch =
    workspaceData.research && typeof workspaceData.research === 'object'
      ? (workspaceData.research as Partial<ResearchState>)
      : {};

  return {
    profile,
    salah,
    focusSessions: Array.isArray(workspaceData.focusSessions)
      ? (workspaceData.focusSessions as FocusSession[])
      : [],
    focusTasks: Array.isArray(workspaceData.focusTasks)
      ? (workspaceData.focusTasks as FocusTask[])
      : [],
    syllabus,
    completedBookPageKeys: Array.isArray(workspaceData.completedBookPageKeys)
      ? (workspaceData.completedBookPageKeys as string[])
      : [],
    completedChapterIds: Array.isArray(workspaceData.completedChapterIds)
      ? (workspaceData.completedChapterIds as string[])
      : [],
    chapterTakeaways:
      workspaceData.chapterTakeaways && typeof workspaceData.chapterTakeaways === 'object'
        ? (workspaceData.chapterTakeaways as Record<string, string>)
        : {},
    vocabVault,
    research: {
      ...defaults.research,
      ...rawResearch,
      draft: {
        ...defaults.research.draft,
        ...(rawResearch.draft ?? {}),
      },
    },
    detHistory: Array.isArray(workspaceData.detHistory)
      ? (workspaceData.detHistory as DetAttempt[])
      : [],
    skillSubmissions: Array.isArray(workspaceData.skillSubmissions)
      ? (workspaceData.skillSubmissions as SkillSubmissionRecord[])
      : [],
    ecas: Array.isArray(workspaceData.ecas) ? (workspaceData.ecas as EcaEntry[]) : [],
    events: Array.isArray(workspaceData.events)
      ? (workspaceData.events as ReminderEvent[])
      : [],
  };
}

function buildCloudPayloads(state: ElevoraState, uid: string) {
  const defaultChapterIdsBySubject = new Map(
    INITIAL_SYLLABUS.map((s) => [s.id, new Set(s.chapters.map((c) => c.id))])
  );

  const syllabusCompletedIds: string[] = [];
  const customSyllabusChapters: Record<string, SyllabusChapter[]> = {};

  state.syllabus.forEach((sub) => {
    if (!DEFAULT_SYLLABUS_IDS.has(sub.id)) return;
    const defIds = defaultChapterIdsBySubject.get(sub.id) || new Set<string>();
    const customChs: SyllabusChapter[] = [];
    sub.chapters.forEach((ch) => {
      if (ch.completed) syllabusCompletedIds.push(ch.id);
      if (!defIds.has(ch.id)) customChs.push(ch);
    });
    if (customChs.length > 0) {
      customSyllabusChapters[sub.id] = customChs.slice(0, 30);
    }
  });

  const masteredVocabIds = state.vocabVault.filter((v) => v.mastered).map((v) => v.id).slice(0, 500);
  const pinnedVocabIds = state.vocabVault
    .filter((v) => v.pinnedForHome)
    .map((v) => v.id)
    .slice(0, 500);
  const customVocab = state.vocabVault
    .filter((v) => !DEFAULT_VOCAB_IDS.has(v.id))
    .slice(0, 300);

  const profileFields = {
    name: (state.profile.name || '').slice(0, 120),
    hscYear: state.profile.hscYear,
    stream: state.profile.stream,
    district: (state.profile.district || 'Dhaka').slice(0, 64),
    faithMode: state.profile.faithMode,
    onboarded: Boolean(state.profile.onboarded),
    college: (state.profile.college || '').slice(0, 160),
    sscGpa: (state.profile.sscGpa || '').slice(0, 20),
    sscBoard: (state.profile.sscBoard || '').slice(0, 64),
    languages: (state.profile.languages || '').slice(0, 240),
    technicalSkills: (state.profile.technicalSkills || [])
      .filter((s) => typeof s === 'string')
      .slice(0, 30),
    objective: (state.profile.objective || '').slice(0, 800),
  };

  const privateFields = {
    email: (state.profile.email || '').slice(0, 160),
    phone: (state.profile.phone || '').slice(0, 40),
    portfolioUrl: (state.profile.portfolioUrl || '').slice(0, 240),
  };

  const workspaceFields = {
    salah: state.salah,
    focusSessions: state.focusSessions.slice(0, 500),
    focusTasks: state.focusTasks.slice(0, 300),
    syllabusCompletedIds: syllabusCompletedIds.slice(0, 500),
    customSyllabusChapters,
    completedBookPageKeys: state.completedBookPageKeys.slice(0, 300),
    completedChapterIds: state.completedChapterIds.slice(0, 100),
    chapterTakeaways: state.chapterTakeaways,
    masteredVocabIds,
    pinnedVocabIds,
    customVocab,
    research: state.research,
    detHistory: state.detHistory.slice(0, 300),
    skillSubmissions: state.skillSubmissions.slice(0, 200),
    ecas: state.ecas.slice(0, 200),
    events: state.events.slice(0, 200),
  };

  return { uid, profileFields, privateFields, workspaceFields };
}

export function useElevoraState() {
  const [state, setState] = useState<ElevoraState>(() => createDefaultState());
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [cloudSyncStatus, setCloudSyncStatus] = useState<CloudSyncStatus>('idle');
  const [authError, setAuthError] = useState('');

  const cloudExistsRef = useRef(false);
  const hydratedUidRef = useRef<string | null>(null);
  const skipNextSyncRef = useRef(false);
  const syncTimerRef = useRef<number | null>(null);

  const persistToFirestore = useCallback(
    async (targetState: ElevoraState, uid: string) => {
      const userDocPath = `users/${uid}`;
      const privateDocPath = `users/${uid}/private/info`;
      const workspaceDocPath = `users/${uid}/workspace/state`;

      const userRef = doc(db, 'users', uid);
      const privateRef = doc(db, 'users', uid, 'private', 'info');
      const workspaceRef = doc(db, 'users', uid, 'workspace', 'state');

      const { profileFields, privateFields, workspaceFields } = buildCloudPayloads(targetState, uid);
      setCloudSyncStatus('syncing');

      try {
        const batch = writeBatch(db);
        if (!cloudExistsRef.current) {
          batch.set(userRef, {
            uid,
            ...profileFields,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
          batch.set(privateRef, {
            uid,
            ...privateFields,
            updatedAt: serverTimestamp(),
          });
          batch.set(workspaceRef, {
            uid,
            ...workspaceFields,
            updatedAt: serverTimestamp(),
          });
          await batch.commit();
          cloudExistsRef.current = true;
        } else {
          batch.update(userRef, {
            ...profileFields,
            updatedAt: serverTimestamp(),
          });
          batch.update(privateRef, {
            ...privateFields,
            updatedAt: serverTimestamp(),
          });
          batch.update(workspaceRef, {
            ...workspaceFields,
            updatedAt: serverTimestamp(),
          });
          await batch.commit();
        }
        setCloudSyncStatus('synced');
      } catch (err) {
        setCloudSyncStatus('error');
        handleFirestoreError(err, OperationType.WRITE, `${userDocPath} | ${privateDocPath} | ${workspaceDocPath}`);
      }
    },
    []
  );

  // Listen to Firebase Auth state & load user's private cloud profile + workspace
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (syncTimerRef.current) {
        window.clearTimeout(syncTimerRef.current);
        syncTimerRef.current = null;
      }

      if (!user) {
        setAuthUser(null);
        cloudExistsRef.current = false;
        hydratedUidRef.current = null;
        skipNextSyncRef.current = true;
        setState(createDefaultState());
        setCloudSyncStatus('idle');
        setAuthLoading(false);
        return;
      }

      setAuthUser(user);
      setAuthError('');
      setCloudSyncStatus('loading');

      // Show per-UID cached snapshot instantly if available
      try {
        const cachedRaw = localStorage.getItem(`${CACHE_PREFIX}${user.uid}`);
        if (cachedRaw) {
          const parsed = JSON.parse(cachedRaw) as ElevoraState;
          skipNextSyncRef.current = true;
          setState(parsed);
        }
      } catch {
        // ignore cache error
      }

      const userPath = `users/${user.uid}`;
      try {
        const [userSnap, privateSnap, workspaceSnap] = await Promise.all([
          getDoc(doc(db, 'users', user.uid)),
          getDoc(doc(db, 'users', user.uid, 'private', 'info')),
          getDoc(doc(db, 'users', user.uid, 'workspace', 'state')),
        ]);

        if (userSnap.exists()) {
          cloudExistsRef.current = true;
          const hydrated = hydrateStateFromCloudPayload(
            userSnap.data(),
            privateSnap.exists() ? privateSnap.data() : undefined,
            workspaceSnap.exists() ? workspaceSnap.data() : undefined,
            user
          );
          skipNextSyncRef.current = true;
          setState(hydrated);
          hydratedUidRef.current = user.uid;
          setCloudSyncStatus('synced');
        } else {
          // New user: clean slate personalized with their Google displayName & email
          cloudExistsRef.current = false;
          const fresh = createDefaultState();
          fresh.profile.name = user.displayName || '';
          fresh.profile.email = user.email || '';
          skipNextSyncRef.current = true;
          setState(fresh);
          hydratedUidRef.current = user.uid;
          setCloudSyncStatus('idle');
        }
      } catch (err) {
        setCloudSyncStatus('error');
        try {
          handleFirestoreError(err, OperationType.GET, userPath);
        } catch (wrapped) {
          setAuthError(
            wrapped instanceof Error
              ? 'Could not load your secure cloud workspace. Please check your connection.'
              : 'Cloud load failed.'
          );
        }
      } finally {
        setAuthLoading(false);
      }
    });

    return () => unsub();
  }, []);

  // Cache locally per UID and debounce sync to Firestore whenever authenticated user updates state
  useEffect(() => {
    if (!authUser || hydratedUidRef.current !== authUser.uid) return;

    try {
      localStorage.setItem(`${CACHE_PREFIX}${authUser.uid}`, JSON.stringify(state));
    } catch {
      // ignore storage quota errors
    }

    if (skipNextSyncRef.current) {
      skipNextSyncRef.current = false;
      return;
    }

    // Only auto-create Firestore documents once user is onboarded (or already exists in cloud)
    if (!cloudExistsRef.current && !state.profile.onboarded) return;

    if (syncTimerRef.current) {
      window.clearTimeout(syncTimerRef.current);
    }

    syncTimerRef.current = window.setTimeout(() => {
      void persistToFirestore(state, authUser.uid).catch((err) => {
        console.error('Background cloud sync error:', err);
      });
    }, 800);

    return () => {
      if (syncTimerRef.current) {
        window.clearTimeout(syncTimerRef.current);
      }
    };
  }, [state, authUser, persistToFirestore]);

  const signInWithGoogle = async () => {
    setAuthError('');
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : 'Google Sign-In was cancelled or blocked.';
      setAuthError(
        msg.includes('popup-closed-by-user')
          ? 'Sign-in popup was closed before completing. Please try again.'
          : msg
      );
    }
  };

  const signOutAccount = async () => {
    if (syncTimerRef.current) {
      window.clearTimeout(syncTimerRef.current);
      syncTimerRef.current = null;
    }
    if (authUser && (cloudExistsRef.current || state.profile.onboarded)) {
      try {
        await persistToFirestore(state, authUser.uid);
      } catch {
        // continue sign out even if offline
      }
    }
    await signOut(auth);
  };

  const completeOnboarding = async (patch: Partial<StudentProfile>) => {
    const nextState: ElevoraState = {
      ...state,
      profile: {
        ...state.profile,
        ...patch,
        email: state.profile.email || authUser?.email || '',
        onboarded: true,
      },
    };
    skipNextSyncRef.current = true;
    setState(nextState);
    if (authUser) {
      try {
        localStorage.setItem(`${CACHE_PREFIX}${authUser.uid}`, JSON.stringify(nextState));
      } catch {
        // ignore
      }
      await persistToFirestore(nextState, authUser.uid);
    }
  };

  const updateProfile = (patch: Partial<StudentProfile>) => {
    setState((prev) => ({
      ...prev,
      profile: { ...prev.profile, ...patch },
    }));
  };

  const toggleWaqtCompleted = (waqt: WaqtKey) => {
    setState((prev) => ({
      ...prev,
      salah: {
        ...prev.salah,
        completed: {
          ...prev.salah.completed,
          [waqt]: !prev.salah.completed[waqt],
        },
      },
    }));
  };

  const toggleWaqtAzan = (waqt: WaqtKey) => {
    setState((prev) => ({
      ...prev,
      salah: {
        ...prev.salah,
        azanEnabled: {
          ...prev.salah.azanEnabled,
          [waqt]: !prev.salah.azanEnabled[waqt],
        },
      },
    }));
  };

  const logQuranReflection = (minutes: number, surahId: string) => {
    setState((prev) => ({
      ...prev,
      salah: {
        ...prev.salah,
        quranMinutesCompletedToday: prev.salah.quranMinutesCompletedToday + minutes,
        lastQuranSurahId: surahId,
      },
    }));
  };

  const addFocusSession = (session: FocusSession, taskId?: string) => {
    setState((prev) => ({
      ...prev,
      focusSessions: [session, ...prev.focusSessions],
      focusTasks: taskId
        ? prev.focusTasks.map((t) =>
            t.id === taskId
              ? { ...t, focusMinutesSpent: t.focusMinutesSpent + session.minutes }
              : t
          )
        : prev.focusTasks,
    }));
  };

  const addFocusTask = (title: string, category: FocusCategory) => {
    const trimmed = title.trim();
    if (!trimmed) return;
    const newTask: FocusTask = {
      id: `ftask-${Date.now()}`,
      title: trimmed,
      category,
      completed: false,
      focusMinutesSpent: 0,
      createdAt: new Date().toISOString(),
    };
    setState((prev) => ({
      ...prev,
      focusTasks: [newTask, ...prev.focusTasks],
    }));
  };

  const verifyAndCompleteFocusTask = (taskId: string, proofNote: string) => {
    const trimmed = proofNote.trim();
    if (!trimmed) return;
    setState((prev) => ({
      ...prev,
      focusTasks: prev.focusTasks.map((t) =>
        t.id === taskId
          ? {
              ...t,
              completed: true,
              proofNote: trimmed,
              completedAt: new Date().toISOString(),
            }
          : t
      ),
    }));
  };

  const reopenFocusTask = (taskId: string) => {
    setState((prev) => ({
      ...prev,
      focusTasks: prev.focusTasks.map((t) =>
        t.id === taskId ? { ...t, completed: false } : t
      ),
    }));
  };

  const deleteFocusTask = (taskId: string) => {
    setState((prev) => ({
      ...prev,
      focusTasks: prev.focusTasks.filter((t) => t.id !== taskId),
    }));
  };

  const toggleSyllabusChapter = (subjectId: string, chapterId: string) => {
    setState((prev) => ({
      ...prev,
      syllabus: prev.syllabus.map((sub) =>
        sub.id === subjectId
          ? {
              ...sub,
              chapters: sub.chapters.map((ch) =>
                ch.id === chapterId ? { ...ch, completed: !ch.completed } : ch
              ),
            }
          : sub
      ),
    }));
  };

  const incrementSubjectChapter = (subjectId: string) => {
    setState((prev) => ({
      ...prev,
      syllabus: prev.syllabus.map((sub) => {
        if (sub.id !== subjectId) return sub;
        const firstIncomplete = sub.chapters.find((c) => !c.completed);
        if (!firstIncomplete) return sub;
        return {
          ...sub,
          chapters: sub.chapters.map((c) =>
            c.id === firstIncomplete.id ? { ...c, completed: true } : c
          ),
        };
      }),
    }));
  };

  const addSyllabusChapter = (subjectId: string, title: string) => {
    const trimmed = title.trim();
    if (!trimmed) return;
    setState((prev) => ({
      ...prev,
      syllabus: prev.syllabus.map((sub) =>
        sub.id === subjectId
          ? {
              ...sub,
              chapters: [
                ...sub.chapters,
                { id: `ch-custom-${Date.now()}`, title: trimmed, completed: false },
              ],
            }
          : sub
      ),
    }));
  };

  const markBookPageDone = (pageKey: string) => {
    setState((prev) => ({
      ...prev,
      completedBookPageKeys: prev.completedBookPageKeys.includes(pageKey)
        ? prev.completedBookPageKeys
        : [...prev.completedBookPageKeys, pageKey],
    }));
  };

  const completeBookChapter = (chapterId: string, takeaway: string) => {
    setState((prev) => ({
      ...prev,
      completedChapterIds: prev.completedChapterIds.includes(chapterId)
        ? prev.completedChapterIds
        : [...prev.completedChapterIds, chapterId],
      chapterTakeaways: {
        ...prev.chapterTakeaways,
        [chapterId]: takeaway,
      },
    }));
  };

  const toggleVocabMastered = (vocabId: string) => {
    setState((prev) => ({
      ...prev,
      vocabVault: prev.vocabVault.map((v) =>
        v.id === vocabId ? { ...v, mastered: !v.mastered } : v
      ),
    }));
  };

  const toggleVocabPinHome = (vocabId: string) => {
    const today = getTodayDateKey();
    setState((prev) => ({
      ...prev,
      vocabVault: prev.vocabVault.map((v) =>
        v.id === vocabId
          ? {
              ...v,
              pinnedForHome: !v.pinnedForHome,
              addedDate: !v.pinnedForHome ? today : v.addedDate,
            }
          : v
      ),
    }));
  };

  const addVocabItem = (item: Omit<VocabItem, 'id' | 'mastered'>) => {
    const today = getTodayDateKey();
    const newItem: VocabItem = {
      ...item,
      id: `v-custom-${Date.now()}`,
      mastered: false,
      pinnedForHome: true,
      addedDate: today,
    };
    setState((prev) => ({
      ...prev,
      vocabVault: [newItem, ...prev.vocabVault],
    }));
  };

  const updateResearch = (updater: (prev: ResearchState) => ResearchState) => {
    setState((prev) => ({
      ...prev,
      research: {
        ...updater(prev.research),
        lastSavedAt: new Date().toISOString(),
      },
    }));
  };

  const addDetAttempt = (attempt: DetAttempt) => {
    setState((prev) => ({
      ...prev,
      detHistory: [...prev.detHistory, attempt],
    }));
  };

  const addSkillSubmission = (record: SkillSubmissionRecord) => {
    setState((prev) => ({
      ...prev,
      skillSubmissions: [record, ...prev.skillSubmissions],
    }));
  };

  const addEca = (entry: Omit<EcaEntry, 'id'>) => {
    setState((prev) => ({
      ...prev,
      ecas: [{ ...entry, id: `eca-${Date.now()}` }, ...prev.ecas],
    }));
  };

  const toggleEcaInCv = (id: string) => {
    setState((prev) => ({
      ...prev,
      ecas: prev.ecas.map((e) => (e.id === id ? { ...e, includeInCv: !e.includeInCv } : e)),
    }));
  };

  const deleteEca = (id: string) => {
    setState((prev) => ({
      ...prev,
      ecas: prev.ecas.filter((e) => e.id !== id),
    }));
  };

  const addEvent = (evt: Omit<ReminderEvent, 'id'>) => {
    setState((prev) => ({
      ...prev,
      events: [{ ...evt, id: `evt-${Date.now()}` }, ...prev.events],
    }));
  };

  const toggleEventReminder = (id: string) => {
    setState((prev) => ({
      ...prev,
      events: prev.events.map((e) =>
        e.id === id ? { ...e, reminderActive: !e.reminderActive } : e
      ),
    }));
  };

  const deleteEvent = (id: string) => {
    setState((prev) => ({
      ...prev,
      events: prev.events.filter((e) => e.id !== id),
    }));
  };

  return {
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
  };
}
