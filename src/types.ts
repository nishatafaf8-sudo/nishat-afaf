export type HscYear = 'HSC 1st Year' | 'HSC 2nd Year';
export type HscStream = 'Science' | 'Commerce' | 'Arts';
export type FaithMode = 'Muslim' | 'Mind Refresh';

export type ModuleId =
  | 'dashboard'
  | 'salah'
  | 'focus'
  | 'syllabus'
  | 'tutor'
  | 'books'
  | 'research'
  | 'det'
  | 'skills'
  | 'eca'
  | 'cv';

export interface StudentReview {
  id: string;
  authorUid: string;
  authorName: string;
  hscContext: string;
  rating: number;
  comment: string;
  createdAtMs: number;
}

export interface StudentProfile {
  name: string;
  hscYear: HscYear;
  stream: HscStream;
  district: string;
  faithMode: FaithMode;
  onboarded: boolean;
  email?: string;
  phone?: string;
  college?: string;
  sscGpa?: string;
  sscBoard?: string;
  portfolioUrl?: string;
  languages?: string;
  technicalSkills?: string[];
  objective?: string;
}

export type WaqtKey = 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';

export interface SalahState {
  dateKey: string;
  completed: Record<WaqtKey, boolean>;
  azanEnabled: Record<WaqtKey, boolean>;
  streakDays: number;
  quranMinutesCompletedToday: number;
  lastQuranSurahId: string;
}

export type FocusCategory =
  | 'HSC 2nd Year'
  | 'HSC 1st Year'
  | 'DET English'
  | 'Research'
  | 'Reading'
  | 'Scholarship'
  | 'ECA';

export interface FocusSession {
  id: string;
  category: FocusCategory;
  minutes: number;
  taskTitle?: string;
  completedAt: string;
}

export interface FocusTask {
  id: string;
  title: string;
  category: FocusCategory;
  completed: boolean;
  proofNote?: string;
  focusMinutesSpent: number;
  createdAt: string;
  completedAt?: string;
}

export interface SyllabusChapter {
  id: string;
  title: string;
  completed: boolean;
}

export interface SyllabusSubject {
  id: string;
  name: string;
  paper: HscYear;
  stream: HscStream | 'Both';
  chapters: SyllabusChapter[];
}

export interface VocabItem {
  id: string;
  word: string;
  partOfSpeech: string;
  englishDef: string;
  banglaMeaning: string;
  exampleSentence: string;
  sourceBook: string;
  mastered: boolean;
  pinnedForHome?: boolean;
  addedDate?: string;
  itemType?: 'vocab' | 'lesson';
}

export interface BookQuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
}

export interface BookChapter {
  id: string;
  number: number;
  title: string;
  banglaTitle: string;
  readTimeMin: number;
  englishParagraphs: string[];
  banglaParagraphs: string[];
  featuredVocabIds: string[];
  quiz: BookQuizQuestion[];
}

export interface BookItem {
  id: string;
  title: string;
  subtitle: string;
  author: string;
  coverImage: string;
  chapters: BookChapter[];
}

export interface EquipmentChecklistItem {
  id: string;
  label: string;
  category: 'Equipment & Software' | 'Literature Source' | 'Methodology Step';
  checked: boolean;
}

export interface ResearchState {
  selectedTopicId: string;
  customTopicTitle: string;
  targetDate: string;
  checklist: EquipmentChecklistItem[];
  draft: {
    abstract: string;
    introduction: string;
    methodology: string;
    references: string;
  };
  lastSavedAt: string;
}

export type DetSegment = 'Literacy' | 'Comprehension' | 'Conversation' | 'Production';

export interface DetAttempt {
  id: string;
  segment: DetSegment;
  score: number;
  rawCorrect: string;
  timeSpentSec: number;
  date: string;
  notes: string;
}

export interface SkillEvaluationResult {
  score: number;
  verdict: string;
  strengths: string[];
  improvements: string[];
  nextAction: string;
  revisedExample: string;
}

export interface SkillSubmissionRecord {
  id: string;
  skillId: string;
  skillTitle: string;
  submission: string;
  evaluation: SkillEvaluationResult;
  submittedAt: string;
}

export type EcaCategory = 'Leadership' | 'Club' | 'Volunteering' | 'Competition' | 'Certificate';

export interface EcaEntry {
  id: string;
  title: string;
  role: string;
  organization: string;
  category: EcaCategory;
  date: string;
  hoursOrImpact: string;
  certificateNote: string;
  includeInCv: boolean;
}

export type EventPriority = 'High' | 'Normal';

export interface ReminderEvent {
  id: string;
  title: string;
  date: string;
  category: string;
  priority: EventPriority;
  reminderActive: boolean;
  notes: string;
}

export interface ElevoraState {
  profile: StudentProfile;
  salah: SalahState;
  focusSessions: FocusSession[];
  focusTasks: FocusTask[];
  syllabus: SyllabusSubject[];
  completedBookPageKeys: string[];
  completedChapterIds: string[];
  chapterTakeaways: Record<string, string>;
  vocabVault: VocabItem[];
  research: ResearchState;
  detHistory: DetAttempt[];
  skillSubmissions: SkillSubmissionRecord[];
  ecas: EcaEntry[];
  events: ReminderEvent[];
}
