import aiMascotImg from '../assets/images/ai_teacher_blue_mascot_1794742068395.jpg';
import coverDiscipline from '../assets/images/book_atomic_discipline_1794739988574.jpg';
import coverFocus from '../assets/images/book_deep_focus_1794739988665.jpg';
import coverResilience from '../assets/images/book_resilient_mind_1794739989458.jpg';
import {
  BookItem,
  EcaEntry,
  EquipmentChecklistItem,
  ReminderEvent,
  SyllabusSubject,
  VocabItem,
} from '../types';
import { MindSoundscapeId } from '../utils/audio';
import {
  QURAN_DAILY_TRACKS,
  QuranAyah,
  QuranSurahPart,
  QuranTrack,
} from './quranSurahs';

export { QURAN_DAILY_TRACKS };
export type { QuranAyah, QuranSurahPart, QuranTrack };

export const AI_MASCOT_AVATAR = aiMascotImg;

export const MOTIVATION_QUOTES_MUSLIM: string[] = [
  'Be the richest and most successful person in your entire bloodline — work for it with Salah and discipline.',
  'Wake before Fajr, finish one HSC chapter before 8 AM, and let consistency silence every doubt.',
  'Barakah lives in early mornings and focused study blocks. Protect your waqt and your deep work.',
  'Every past paper solved today is one step closer to a world-class scholarship and financial freedom.',
  'Discipline is remembering what you prayed for after Salah and putting in the hours when no one is watching.',
];

export const MOTIVATION_QUOTES_OTHER: string[] = [
  'Be the richest and most successful person in your entire bloodline — work for it with clarity and relentless discipline.',
  'Rise early, refresh your mind, finish one HSC chapter before 8 AM, and let quiet consistency speak for you.',
  'True mastery lives in calm mornings and undivided focus. Guard your energy and honor your daily goals.',
  'Every past paper solved today brings you closer to top university scholarships and real-world independence.',
  'Strength is taking a 5-minute mental reset when stressed, then returning to your desk stronger than before.',
];


export interface MindRefreshTrack {
  id: string;
  soundId: MindSoundscapeId;
  title: string;
  category: string;
  durationLabel: string;
  promptHeadline: string;
  englishGuide: string;
  banglaGuide: string;
}

export const MIND_REFRESH_TRACKS: MindRefreshTrack[] = [
  {
    id: 'rain-calm',
    soundId: 'rain',
    title: 'Soft Monsoon Rain & Deep Breathing',
    category: 'Nature Soundscape · Gentle Rainfall',
    durationLabel: '5:00 Rain Reset',
    promptHeadline: 'Close your eyes · Listen to gentle rainfall · Breathe slowly',
    englishGuide:
      'Soft steady rain masks distracting background noise and lowers cortisol rapidly after intense Physics or Accounting problem sets.',
    banglaGuide:
      'মৃদু বৃষ্টির শব্দ আশেপাশের কোলাহল ঢেকে দেয় এবং কঠিন পড়াশোনার পর মস্তিষ্কের মানসিক চাপ দ্রুত কমিয়ে আনে।',
  },
  {
    id: 'ocean-waves',
    soundId: 'ocean',
    title: 'Bay Ocean Waves & Rhythmic Unwind',
    category: 'Nature Soundscape · Coastal Surf',
    durationLabel: '5:00 Ocean Reset',
    promptHeadline: 'Inhale as the wave rises · Exhale as the tide pulls back',
    englishGuide:
      'Match your breathing pace to the slow ocean swell to restore calm clarity between study blocks.',
    banglaGuide:
      'সাগরের ঢেউয়ের ছন্দের সাথে শ্বাস-প্রশ্বাস মিলিয়ে নিন; এটি দুটি পড়ার সেশনের মাঝে মনকে গভীরভাবে শান্ত করে।',
  },
  {
    id: 'forest-chimes',
    soundId: 'forest',
    title: 'Morning Forest Breeze & Wind Chimes',
    category: 'Nature Soundscape · Woodland Calm',
    durationLabel: '5:00 Forest Reset',
    promptHeadline: 'Relax your shoulders · Stretch neck · Look away from screens',
    englishGuide:
      'Gentle mountain wind paired with distant pentatonic chimes refreshes tired eyes and relieves screen fatigue.',
    banglaGuide:
      'হালকা বাতাস ও মৃদু উইন্ড-চাইমের সুর চোখের ক্লান্তি দূর করে এবং পড়াশোনার একঘেয়েমি কাটাতে সাহায্য করে।',
  },
  {
    id: 'tibetan-bowl',
    soundId: 'bowl',
    title: 'Resonant Tibetan Singing Bowl Meditation',
    category: 'Mindfulness · Harmonic Bell',
    durationLabel: '5:00 Meditation',
    promptHeadline: 'Let go of exam worry · Focus only on one calm breath',
    englishGuide:
      'Deep harmonic bowl overtones anchor scattered thoughts before high-stakes mock tests or DET speaking practice.',
    banglaGuide:
      'গভীর সিংইং বোলের সুর মক টেস্ট বা পরীক্ষার আগে ছড়িয়ে থাকা অস্থির চিন্তাগুলোকে এক বিন্দুতে শান্ত করে।',
  },
  {
    id: 'focus-432hz',
    soundId: 'focus432',
    title: '432Hz Deep Study Warm Ambient Pad',
    category: 'Pure Acoustics · Flow State Drone',
    durationLabel: '5:00 Flow Prep',
    promptHeadline: 'Clear mental clutter · Enter quiet deep concentration',
    englishGuide:
      'Smooth harmonic frequency pad ideal for reading books, drafting research papers, or calming exam nerves.',
    banglaGuide:
      'নিরবচ্ছিন্ন ৪৩২ হার্টজ সুর বই পড়া, রিসার্চ লেখা এবং গভীর একাগ্রতা তৈরিতে চমৎকার সহায়তা করে।',
  },
  {
    id: 'warm-fireplace',
    soundId: 'fireplace',
    title: 'Cozy Study Fireplace Crackle & Warmth',
    category: 'Cozy Ambience · Night Study Calm',
    durationLabel: '5:00 Cozy Reset',
    promptHeadline: 'Warm tea break · Unclench jaw · Slow steady exhale',
    englishGuide:
      'Subtle hearth crackle and warm bass hum bring quiet comfort during late-evening HSC revision sessions.',
    banglaGuide:
      'রাতের পড়াশোনা বা রিভিশনের সময় উষ্ণ ফায়ারপ্লেসের মৃদু শব্দ মনকে আরাম ও প্রশান্তি দেয়।',
  },
];

// Complete, Authentic Bangladesh NCTB Full HSC Syllabus across Science, Commerce, Arts & Compulsory Subjects
export const INITIAL_SYLLABUS: SyllabusSubject[] = [
  // ================= SCIENCE STREAM =================
  {
    id: 'phy-1',
    name: 'Physics 1st Paper (পদার্থবিজ্ঞান ১ম পত্র)',
    paper: 'HSC 1st Year',
    stream: 'Science',
    chapters: [
      { id: 'phy1-1', title: 'Ch 1: Physical World & Measurement (ভৌত জগৎ ও পরিমাপ)', completed: false },
      { id: 'phy1-2', title: 'Ch 2: Vectors (ভেক্টর)', completed: false },
      { id: 'phy1-3', title: 'Ch 3: Dynamics (গতিবিদ্যা)', completed: false },
      { id: 'phy1-4', title: 'Ch 4: Newtonian Mechanics (নিউটনিয়ান বলবিদ্যা)', completed: false },
      { id: 'phy1-5', title: 'Ch 5: Work, Energy & Power (কাজ, শক্তি ও ক্ষমতা)', completed: false },
      { id: 'phy1-6', title: 'Ch 6: Gravitation & Gravity (মহাকর্ষ ও অভিকর্ষ)', completed: false },
      { id: 'phy1-7', title: 'Ch 7: Structural Properties of Matter (পদার্থের গাঠনিক ধর্ম)', completed: false },
      { id: 'phy1-8', title: 'Ch 8: Periodic Motion (পর্যাবৃত্তিক গতি)', completed: false },
      { id: 'phy1-9', title: 'Ch 9: Waves (তরঙ্গ)', completed: false },
      { id: 'phy1-10', title: 'Ch 10: Ideal Gas & Kinetic Theory of Gases (আদর্শ গ্যাস ও গ্যাসের গতিতত্ত্ব)', completed: false },
    ],
  },
  {
    id: 'phy-2',
    name: 'Physics 2nd Paper (পদার্থবিজ্ঞান ২য় পত্র)',
    paper: 'HSC 2nd Year',
    stream: 'Science',
    chapters: [
      { id: 'phy2-1', title: 'Ch 1: Thermodynamics (তাপগতিবিদ্যা)', completed: false },
      { id: 'phy2-2', title: 'Ch 2: Static Electricity (স্থির তড়িৎ)', completed: false },
      { id: 'phy2-3', title: 'Ch 3: Current Electricity (চল তড়িৎ)', completed: false },
      { id: 'phy2-4', title: 'Ch 4: Magnetic Effect of Current & Magnetism (তড়িৎ প্রবাহের চৌম্বক ক্রিয়া ও চুম্বকত্ব)', completed: false },
      { id: 'phy2-5', title: 'Ch 5: Electromagnetic Induction & Alternating Current (তাড়িতচৌম্বক আবেশ ও পরিবর্তী প্রবাহ)', completed: false },
      { id: 'phy2-6', title: 'Ch 6: Geometrical Optics (জ্যামিতিক আলোকবিজ্ঞান)', completed: false },
      { id: 'phy2-7', title: 'Ch 7: Physical Optics (ভৌত আলোকবিজ্ঞান)', completed: false },
      { id: 'phy2-8', title: 'Ch 8: Introduction to Modern Physics (আধুনিক পদার্থবিজ্ঞানের সূচনা)', completed: false },
      { id: 'phy2-9', title: 'Ch 9: Atomic Model & Nuclear Physics (পরমাণুর মডেল ও নিউক্লিয়ার পদার্থবিজ্ঞান)', completed: false },
      { id: 'phy2-10', title: 'Ch 10: Semiconductor & Electronics (সেমিকন্ডাক্টর ও ইলেকট্রনিক্স)', completed: false },
      { id: 'phy2-11', title: 'Ch 11: Astronomy (জ্যোতির্বিজ্ঞান)', completed: false },
    ],
  },
  {
    id: 'chem-1',
    name: 'Chemistry 1st Paper (রসায়ন ১ম পত্র)',
    paper: 'HSC 1st Year',
    stream: 'Science',
    chapters: [
      { id: 'chem1-1', title: 'Ch 1: Safe Use of Laboratory (ল্যাবরেটরির নিরাপদ ব্যবহার)', completed: false },
      { id: 'chem1-2', title: 'Ch 2: Qualitative Chemistry (গুণগত রসায়ন)', completed: false },
      { id: 'chem1-3', title: 'Ch 3: Periodic Properties & Chemical Bonding (মৌলের পর্যায়বৃত্ত ধর্ম ও রাসায়নিক বন্ধন)', completed: false },
      { id: 'chem1-4', title: 'Ch 4: Chemical Changes (রাসায়নিক পরিবর্তন)', completed: false },
      { id: 'chem1-5', title: 'Ch 5: Vocational Chemistry (কর্মমুখী রসায়ন)', completed: false },
    ],
  },
  {
    id: 'chem-2',
    name: 'Chemistry 2nd Paper (রসায়ন ২য় পত্র)',
    paper: 'HSC 2nd Year',
    stream: 'Science',
    chapters: [
      { id: 'chem2-1', title: 'Ch 1: Environmental Chemistry (পরিবেশ রসায়ন)', completed: false },
      { id: 'chem2-2', title: 'Ch 2: Organic Chemistry (জৈব রসায়ন)', completed: false },
      { id: 'chem2-3', title: 'Ch 3: Quantitative Chemistry (পরিমাণগত রসায়ন)', completed: false },
      { id: 'chem2-4', title: 'Ch 4: Electrochemistry (তড়িৎ রসায়ন)', completed: false },
      { id: 'chem2-5', title: 'Ch 5: Economic Chemistry (অর্থনৈতিক রসায়ন)', completed: false },
    ],
  },
  {
    id: 'math-1',
    name: 'Higher Math 1st Paper (উচ্চতর গণিত ১ম পত্র)',
    paper: 'HSC 1st Year',
    stream: 'Science',
    chapters: [
      { id: 'math1-1', title: 'Ch 1: Matrices & Determinants (ম্যাট্রিক্স ও নির্ণায়ক)', completed: false },
      { id: 'math1-2', title: 'Ch 2: Vectors (ভেক্টর)', completed: false },
      { id: 'math1-3', title: 'Ch 3: Straight Lines (সরলরেখা)', completed: false },
      { id: 'math1-4', title: 'Ch 4: Circles (বৃত্ত)', completed: false },
      { id: 'math1-5', title: 'Ch 5: Permutations & Combinations (বিন্যাস ও সমাবেশ)', completed: false },
      { id: 'math1-6', title: 'Ch 6: Trigonometric Ratios (ত্রিকোণমিতিক অনুপাত)', completed: false },
      { id: 'math1-7', title: 'Ch 7: Trigonometric Ratios of Associated Angles (সংযুক্ত কোণের ত্রিকোণমিতিক অনুপাত)', completed: false },
      { id: 'math1-8', title: 'Ch 8: Functions & Graphs (ফাংশন ও ফাংশনের লেখচিত্র)', completed: false },
      { id: 'math1-9', title: 'Ch 9: Differentiation (অন্তরীকরণ)', completed: false },
      { id: 'math1-10', title: 'Ch 10: Integration (যোগজীকরণ)', completed: false },
    ],
  },
  {
    id: 'math-2',
    name: 'Higher Math 2nd Paper (উচ্চতর গণিত ২য় পত্র)',
    paper: 'HSC 2nd Year',
    stream: 'Science',
    chapters: [
      { id: 'math2-1', title: 'Ch 1: Real Numbers & Inequalities (বাস্তব সংখ্যা ও অসমতা)', completed: false },
      { id: 'math2-2', title: 'Ch 2: Linear Programming (যোগাশ্রয়ী প্রোগ্রাম)', completed: false },
      { id: 'math2-3', title: 'Ch 3: Complex Numbers (জটিল সংখ্যা)', completed: false },
      { id: 'math2-4', title: 'Ch 4: Polynomials & Polynomial Equations (বহুপদী ও বহুপদী সমীকরণ)', completed: false },
      { id: 'math2-5', title: 'Ch 5: Binomial Expansion (দ্বিপদী বিস্তৃতি)', completed: false },
      { id: 'math2-6', title: 'Ch 6: Conics (কণিক)', completed: false },
      { id: 'math2-7', title: 'Ch 7: Inverse Trigonometric Functions & Equations (বিপরীত ত্রিকোণমিতিক ফাংশন ও সমীকরণ)', completed: false },
      { id: 'math2-8', title: 'Ch 8: Statics (স্থিতিবিদ্যা)', completed: false },
      { id: 'math2-9', title: 'Ch 9: Motion of Particles in a Plane (সমতলে বস্তুকণার গতি)', completed: false },
      { id: 'math2-10', title: 'Ch 10: Measure of Dispersion & Probability (বিস্তার পরিমাপ ও সম্ভাবনা)', completed: false },
    ],
  },
  {
    id: 'bio-1',
    name: 'Biology 1st Paper — Botany (জীববিজ্ঞান ১ম পত্র)',
    paper: 'HSC 1st Year',
    stream: 'Science',
    chapters: [
      { id: 'bio1-1', title: 'Ch 1: Cell & Its Structure (কোষ ও এর গঠন)', completed: false },
      { id: 'bio1-2', title: 'Ch 2: Cell Division (কোষ বিভাজন)', completed: false },
      { id: 'bio1-3', title: 'Ch 3: Cell Chemistry (কোষ রসায়ন)', completed: false },
      { id: 'bio1-4', title: 'Ch 4: Microorganisms (অণুজীব)', completed: false },
      { id: 'bio1-5', title: 'Ch 5: Algae & Fungi (শৈবাল ও ছত্রাক)', completed: false },
      { id: 'bio1-6', title: 'Ch 6: Bryophyta & Pteridophyta (ব্রায়োফাইটা ও টেরিডোফাইটা)', completed: false },
      { id: 'bio1-7', title: 'Ch 7: Gymnosperms & Angiosperms (নগ্নবীজী ও আবৃতবীজী উদ্ভিদ)', completed: false },
      { id: 'bio1-8', title: 'Ch 8: Tissue & Tissue System (টিস্যু ও টিস্যুতন্ত্র)', completed: false },
      { id: 'bio1-9', title: 'Ch 9: Plant Physiology (উদ্ভিদ শারীরতত্ত্ব)', completed: false },
      { id: 'bio1-10', title: 'Ch 10: Plant Reproduction (উদ্ভিদ প্রজনন)', completed: false },
      { id: 'bio1-11', title: 'Ch 11: Biotechnology (জীবপ্রযুক্তি)', completed: false },
      { id: 'bio1-12', title: 'Ch 12: Environment, Distribution & Conservation of Organisms', completed: false },
    ],
  },
  {
    id: 'bio-2',
    name: 'Biology 2nd Paper — Zoology (জীববিজ্ঞান ২য় পত্র)',
    paper: 'HSC 2nd Year',
    stream: 'Science',
    chapters: [
      { id: 'bio2-1', title: 'Ch 1: Animal Diversity & Classification (প্রাণীর বিভিন্নতা ও শ্রেণিবিন্যাস)', completed: false },
      { id: 'bio2-2', title: 'Ch 2: Animal Identity — Hydra, Grasshopper, Rohu (প্রাণীর পরিচিতি)', completed: false },
      { id: 'bio2-3', title: 'Ch 3: Human Physiology: Digestion & Absorption (পরিপাক ও শোষণ)', completed: false },
      { id: 'bio2-4', title: 'Ch 4: Blood & Circulation (রক্ত ও সঞ্চালন)', completed: false },
      { id: 'bio2-5', title: 'Ch 5: Breathing & Respiration (শ্বসক্রিয়া ও শ্বসন)', completed: false },
      { id: 'bio2-6', title: 'Ch 6: Waste & Excretion (বর্জ্য ও নিষ্কাশন)', completed: false },
      { id: 'bio2-7', title: 'Ch 7: Locomotion & Organ Movement (চলন ও অঙ্গচালনা)', completed: false },
      { id: 'bio2-8', title: 'Ch 8: Coordination & Control (সমন্বয় ও নিয়ন্ত্রণ)', completed: false },
      { id: 'bio2-9', title: 'Ch 9: Continuity of Human Life (মানব জীবনের ধারাবাহিকতা)', completed: false },
      { id: 'bio2-10', title: 'Ch 10: Defense System of Human Body (মানবদেহের প্রতিরক্ষা)', completed: false },
      { id: 'bio2-11', title: 'Ch 11: Genetics & Evolution (জিনতত্ত্ব ও বিবর্তন)', completed: false },
      { id: 'bio2-12', title: 'Ch 12: Animal Behavior (প্রাণীর আচরণ)', completed: false },
    ],
  },

  // ================= COMMERCE STREAM =================
  {
    id: 'acc-1',
    name: 'Accounting 1st Paper (হিসাববিজ্ঞান ১ম পত্র)',
    paper: 'HSC 1st Year',
    stream: 'Commerce',
    chapters: [
      { id: 'acc1-1', title: 'Ch 1: Introduction to Accounting (হিসাববিজ্ঞান পরিচিতি)', completed: false },
      { id: 'acc1-2', title: 'Ch 2: Books of Accounts (হিসাবের বইসমূহ)', completed: false },
      { id: 'acc1-3', title: 'Ch 3: Bank Reconciliation Statement (ব্যাংক সমন্বয় বিবরণী)', completed: false },
      { id: 'acc1-4', title: 'Ch 4: Trial Balance (রেওয়ামিল)', completed: false },
      { id: 'acc1-5', title: 'Ch 5: Principles of Accounting (হিসাববিজ্ঞানের নীতিমালা)', completed: false },
      { id: 'acc1-6', title: 'Ch 6: Accounts Receivable (প্রাপ্য হিসাবসমূহের হিসাবরক্ষণ)', completed: false },
      { id: 'acc1-7', title: 'Ch 7: Worksheet (কার্যপত্র)', completed: false },
      { id: 'acc1-8', title: 'Ch 8: Accounting for Tangible & Intangible Assets (দৃশ্যমান ও অদৃশ্যমান সম্পদের হিসাবরক্ষণ)', completed: false },
      { id: 'acc1-9', title: 'Ch 9: Financial Statements (আর্থিক বিবরণী)', completed: false },
      { id: 'acc1-10', title: 'Ch 10: Single Entry System (একতরফা দাখিলা পদ্ধতি)', completed: false },
    ],
  },
  {
    id: 'acc-2',
    name: 'Accounting 2nd Paper (হিসাববিজ্ঞান ২য় পত্র)',
    paper: 'HSC 2nd Year',
    stream: 'Commerce',
    chapters: [
      { id: 'acc2-1', title: 'Ch 1: Accounts of Non-Trading Concerns (অব্যবসায়ী প্রতিষ্ঠানের হিসাব)', completed: false },
      { id: 'acc2-2', title: 'Ch 2: Partnership Business Accounts (অংশীদারি ব্যবসায়ের হিসাব)', completed: false },
      { id: 'acc2-3', title: 'Ch 3: Cash Flow Statement (নগদ প্রবাহ বিবরণী)', completed: false },
      { id: 'acc2-4', title: 'Ch 4: Joint Stock Company Capital (যৌথ মূলধনী কোম্পানির মূলধন)', completed: false },
      { id: 'acc2-5', title: 'Ch 5: Financial Statements of Joint Stock Company (যৌথ মূলধনী কোম্পানির আর্থিক বিবরণী)', completed: false },
      { id: 'acc2-6', title: 'Ch 6: Financial Statement Analysis (আর্থিক বিবরণী বিশ্লেষণ)', completed: false },
      { id: 'acc2-7', title: 'Ch 7: Cost Accounting & Wages (উৎপাদন ব্যয় হিসাব / বেতন ও মজুরি)', completed: false },
      { id: 'acc2-8', title: 'Ch 8: Accounting for Inventory — FIFO/LIFO (মজুদ পণ্যের হিসাবরক্ষণ পদ্ধতি)', completed: false },
      { id: 'acc2-9', title: 'Ch 9: Cost Sheet & Overhead (ব্যয় ও ব্যয়ের শ্রেণিবিভাগ)', completed: false },
      { id: 'acc2-10', title: 'Ch 10: Management Accounting Intro — CVP/BEP (ব্যবস্থাপনা হিসাববিজ্ঞান পরিচিতি)', completed: false },
    ],
  },
  {
    id: 'fin-1',
    name: 'Finance, Banking & Insurance 1st Paper (ফিন্যান্স ১ম পত্র)',
    paper: 'HSC 1st Year',
    stream: 'Commerce',
    chapters: [
      { id: 'fin1-1', title: 'Ch 1: Nature & Scope of Finance (অর্থায়নের সূচনা)', completed: false },
      { id: 'fin1-2', title: 'Ch 2: Financial Markets (আর্থিক বাজারের আইনগত দিক)', completed: false },
      { id: 'fin1-3', title: 'Ch 3: Time Value of Money (অর্থের সময়মূল্য)', completed: false },
      { id: 'fin1-4', title: 'Ch 4: Financial Analysis (আর্থিক বিশ্লেষণ)', completed: false },
      { id: 'fin1-5', title: 'Ch 5: Short-Term & Intermediate-Term Financing (স্বল্প ও মধ্যমেয়াদি অর্থায়ন)', completed: false },
      { id: 'fin1-6', title: 'Ch 6: Long-Term Financing (দীর্ঘমেয়াদি অর্থায়ন)', completed: false },
      { id: 'fin1-7', title: 'Ch 7: Cost of Capital (মূলধন ব্যয়)', completed: false },
      { id: 'fin1-8', title: 'Ch 8: Capital Budgeting & Investment Decisions (মূলধন বাজেটিং ও বিনিয়োগ সিদ্ধান্ত)', completed: false },
      { id: 'fin1-9', title: 'Ch 9: Risk & Return (ঝুঁকি ও মুনাফার হার)', completed: false },
    ],
  },
  {
    id: 'fin-2',
    name: 'Finance, Banking & Insurance 2nd Paper (ব্যাংকিং ও বিমা)',
    paper: 'HSC 2nd Year',
    stream: 'Commerce',
    chapters: [
      { id: 'fin2-1', title: 'Ch 1: Bank System & Structure (ব্যাংক ব্যবস্থার প্রাথমিক ধারণা)', completed: false },
      { id: 'fin2-2', title: 'Ch 2: Central Bank — Bangladesh Bank (কেন্দ্রীয় ব্যাংক)', completed: false },
      { id: 'fin2-3', title: 'Ch 3: Commercial Bank (বাণিজ্যিক ব্যাংক)', completed: false },
      { id: 'fin2-4', title: 'Ch 4: Bank Account & Cheques (ব্যাংক হিসাব ও চেক)', completed: false },
      { id: 'fin2-5', title: 'Ch 5: Negotiable Instruments & Bill of Exchange (হস্তান্তরযোগ্য ঋণের দলিল)', completed: false },
      { id: 'fin2-6', title: 'Ch 6: Electronic & Modern Banking (ইলেকট্রনিক ও আধুনিক ব্যাংকিং)', completed: false },
      { id: 'fin2-7', title: 'Ch 7: Fundamentals of Insurance (বিমা সম্পর্কে মৌলিক ধারণা)', completed: false },
      { id: 'fin2-8', title: 'Ch 8: Life Insurance (জীবন বিমা)', completed: false },
      { id: 'fin2-9', title: 'Ch 9: Marine & Fire Insurance (নৌ ও অগ্নি বিমা)', completed: false },
    ],
  },
  {
    id: 'bom-1',
    name: 'Business Org & Management 1st Paper (ব্যবসায় সংগঠন ১ম পত্র)',
    paper: 'HSC 1st Year',
    stream: 'Commerce',
    chapters: [
      { id: 'bom1-1', title: 'Ch 1: Basic Concepts of Business (ব্যবসায়ের মৌলিক ধারণা)', completed: false },
      { id: 'bom1-2', title: 'Ch 2: Business Environment (ব্যবসায় পরিবেশ)', completed: false },
      { id: 'bom1-3', title: 'Ch 3: Sole Proprietorship (একমালিকানা ব্যবসায়)', completed: false },
      { id: 'bom1-4', title: 'Ch 4: Partnership Business (অংশীদারি ব্যবসায়)', completed: false },
      { id: 'bom1-5', title: 'Ch 5: Joint Stock Company (যৌথ মূলধনী ব্যবসায়)', completed: false },
      { id: 'bom1-6', title: 'Ch 6: Cooperative Society (সমবায় সমিতি)', completed: false },
      { id: 'bom1-7', title: 'Ch 7: State Enterprise (রাষ্ট্রীয় ব্যবসায়)', completed: false },
      { id: 'bom1-8', title: 'Ch 8: Legal Aspects of Business (ব্যবসায়ের আইনগত দিক)', completed: false },
      { id: 'bom1-9', title: 'Ch 9: Business Support Services (ব্যবসায় সহায়ক সেবা)', completed: false },
      { id: 'bom1-10', title: 'Ch 10: Entrepreneurship Development (ব্যবসায় উদ্যোগ)', completed: false },
      { id: 'bom1-11', title: 'Ch 11: Use of ICT in Business (ব্যবসায়ে তথ্য ও যোগাযোগ প্রযুক্তি)', completed: false },
      { id: 'bom1-12', title: 'Ch 12: Business Ethics & Social Responsibility (ব্যবসায় নৈতিকতা ও সামাজিক দায়বদ্ধতা)', completed: false },
    ],
  },
  {
    id: 'bom-2',
    name: 'Business Org & Management 2nd Paper (ব্যবস্থাপনা ২য় পত্র)',
    paper: 'HSC 2nd Year',
    stream: 'Commerce',
    chapters: [
      { id: 'bom2-1', title: 'Ch 1: Concept of Management (ব্যবস্থাপনার ধারণা)', completed: false },
      { id: 'bom2-2', title: 'Ch 2: Principles of Management (ব্যবস্থাপনার নীতি)', completed: false },
      { id: 'bom2-3', title: 'Ch 3: Planning (পরিকল্পনা প্রণয়ন ও সিদ্ধান্ত গ্রহণ)', completed: false },
      { id: 'bom2-4', title: 'Ch 4: Organizing (সংগঠিতকরণ)', completed: false },
      { id: 'bom2-5', title: 'Ch 5: Staffing (কর্মীসংস্থান)', completed: false },
      { id: 'bom2-6', title: 'Ch 6: Leadership (নেতৃত্ব)', completed: false },
      { id: 'bom2-7', title: 'Ch 7: Motivation (প্রেষণা)', completed: false },
      { id: 'bom2-8', title: 'Ch 8: Communication (যোগাযোগ)', completed: false },
      { id: 'bom2-9', title: 'Ch 9: Coordination (সমন্বয়সাধন)', completed: false },
      { id: 'bom2-10', title: 'Ch 10: Controlling (নিয়ন্ত্রণ)', completed: false },
    ],
  },

  // ================= ARTS / HUMANITIES STREAM =================
  {
    id: 'econ-1',
    name: 'Economics 1st Paper (অর্থনীতি ১ম পত্র)',
    paper: 'HSC 1st Year',
    stream: 'Arts',
    chapters: [
      { id: 'econ1-1', title: 'Ch 1: Basic Economic Problems & Choice (মৌলিক অর্থনৈতিক সমস্যা ও সমাধান)', completed: false },
      { id: 'econ1-2', title: 'Ch 2: Consumer & Producer Behavior (ভোক্তা ও উৎপাদকের আচরণ)', completed: false },
      { id: 'econ1-3', title: 'Ch 3: Production, Cost & Revenue (উৎপাদন, উৎপাদন ব্যয় ও আয়)', completed: false },
      { id: 'econ1-4', title: 'Ch 4: Market (বাজার)', completed: false },
      { id: 'econ1-5', title: 'Ch 5: Labor Market (শ্রম বাজার)', completed: false },
      { id: 'econ1-6', title: 'Ch 6: Capital (মূলধন)', completed: false },
      { id: 'econ1-7', title: 'Ch 7: Organization (সংগঠন)', completed: false },
      { id: 'econ1-8', title: 'Ch 8: Rent, Interest & Profit (খাজনা, সুদ ও মুনাফা)', completed: false },
      { id: 'econ1-9', title: 'Ch 9: National Income & Expenditure (সামগ্রিক আয় ও ব্যয়)', completed: false },
      { id: 'econ1-10', title: 'Ch 10: Money & Banking (মুদ্রা ও ব্যাংক)', completed: false },
    ],
  },
  {
    id: 'econ-2',
    name: 'Economics 2nd Paper (অর্থনীতি ২য় পত্র)',
    paper: 'HSC 2nd Year',
    stream: 'Arts',
    chapters: [
      { id: 'econ2-1', title: 'Ch 1: Introduction to Bangladesh Economy (বাংলাদেশের অর্থনীতির পরিচয়)', completed: false },
      { id: 'econ2-2', title: 'Ch 2: Agriculture of Bangladesh (বাংলাদেশের কৃষি)', completed: false },
      { id: 'econ2-3', title: 'Ch 3: Industry of Bangladesh (বাংলাদেশের শিল্প)', completed: false },
      { id: 'econ2-4', title: 'Ch 4: Population, Human Resource & Self-Employment (জনসংখ্যা ও মানবসম্পদ)', completed: false },
      { id: 'econ2-5', title: 'Ch 5: Food Security (খাদ্য নিরাপত্তা)', completed: false },
      { id: 'econ2-6', title: 'Ch 6: Financing & Credit System (অর্থায়ন)', completed: false },
      { id: 'econ2-7', title: 'Ch 7: Inflation (মুদ্রাস্ফীতি)', completed: false },
      { id: 'econ2-8', title: 'Ch 8: International Trade (আন্তর্জাতিক বাণিজ্য)', completed: false },
      { id: 'econ2-9', title: 'Ch 9: Public Finance (সরকারি অর্থব্যবস্থা)', completed: false },
      { id: 'econ2-10', title: 'Ch 10: Development Planning (উন্নয়ন পরিকল্পনা)', completed: false },
    ],
  },
  {
    id: 'civics-1',
    name: 'Civics & Good Governance 1st Paper (পৌরনীতি ১ম পত্র)',
    paper: 'HSC 1st Year',
    stream: 'Arts',
    chapters: [
      { id: 'civ1-1', title: 'Ch 1: Introduction to Civics & Good Governance (পৌরনীতি ও সুশাসন পরিচিতি)', completed: false },
      { id: 'civ1-2', title: 'Ch 2: Good Governance (সুশাসন)', completed: false },
      { id: 'civ1-3', title: 'Ch 3: Values, Law, Liberty & Equality (মূল্যবোধ, আইন, স্বাধীনতা ও সাম্য)', completed: false },
      { id: 'civ1-4', title: 'Ch 4: E-Governance & Good Governance (ই-গভর্ন্যান্স ও সুশাসন)', completed: false },
      { id: 'civ1-5', title: 'Ch 5: Citizen Rights & Duties (নাগরিক অধিকার ও কর্তব্য এবং মানবাধিকার)', completed: false },
      { id: 'civ1-6', title: 'Ch 6: Political Parties, Leadership & Good Governance (রাজনৈতিক দল ও নেতৃত্ব)', completed: false },
      { id: 'civ1-7', title: 'Ch 7: Government Structure & Organs of Government (সরকার কাঠামো ও অঙ্গসমূহ)', completed: false },
      { id: 'civ1-8', title: 'Ch 8: Public Opinion & Political Culture (জনমত ও রাজনৈতিক সংস্কৃতি)', completed: false },
      { id: 'civ1-9', title: 'Ch 9: Public Service & Bureaucracy (জনসেবা ও আমলাতন্ত্র)', completed: false },
      { id: 'civ1-10', title: 'Ch 10: Patriotism & Nationality (দেশপ্রেম ও জাতীয়তা)', completed: false },
    ],
  },
  {
    id: 'civics-2',
    name: 'Civics & Good Governance 2nd Paper (পৌরনীতি ২য় পত্র)',
    paper: 'HSC 2nd Year',
    stream: 'Arts',
    chapters: [
      { id: 'civ2-1', title: 'Ch 1: Development of Representative Govt in British India (ব্রিটিশ ভারতে প্রতিনিধিত্বশীল সরকার)', completed: false },
      { id: 'civ2-2', title: 'Ch 2: Pakistan to Bangladesh 1947–1971 (পাকিস্তান থেকে বাংলাদেশ)', completed: false },
      { id: 'civ2-3', title: 'Ch 3: Political Personalities in Independence of Bangladesh (রাজনৈতিক ব্যক্তিত্ব)', completed: false },
      { id: 'civ2-4', title: 'Ch 4: Constitution of Bangladesh 1972 (বাংলাদেশের সংবিধান)', completed: false },
      { id: 'civ2-5', title: 'Ch 5: Government & Administrative Structure of Bangladesh (সরকার ও প্রশাসনিক কাঠামো)', completed: false },
      { id: 'civ2-6', title: 'Ch 6: Local Government (স্থানীয় শাসন)', completed: false },
      { id: 'civ2-7', title: 'Ch 7: Constitutional Bodies (সাংবিধানিক প্রতিষ্ঠান)', completed: false },
      { id: 'civ2-8', title: 'Ch 8: Election & Voting System in Bangladesh (বাংলাদেশের নির্বাচন ব্যবস্থা)', completed: false },
      { id: 'civ2-9', title: 'Ch 9: Foreign Policy & International Relations (বৈদেশিক নীতি)', completed: false },
      { id: 'civ2-10', title: 'Ch 10: Civic Problems & Possible Solutions (নাগরিক সমস্যা ও আমাদের করণীয়)', completed: false },
    ],
  },
  {
    id: 'hist-1',
    name: 'History 1st Paper (ইতিহাস ১ম পত্র — বাংলাদেশ ও দক্ষিণ এশিয়ার ইতিহাস)',
    paper: 'HSC 1st Year',
    stream: 'Arts',
    chapters: [
      { id: 'hist1-1', title: 'Ch 1: Advent of Europeans & British Rule in India (ইউরোপীয়দের আগমন ও ইংরেজ শাসন)', completed: false },
      { id: 'hist1-2', title: 'Ch 2: Rise of British Colonial Rule: Plassey to 1857 (পলাশী যুদ্ধ থেকে ১৮৫৭)', completed: false },
      { id: 'hist1-3', title: 'Ch 3: Socio-Religious Reform Movements & Bengal Renaissance (সংস্কার আন্দোলন ও নবজাগরণ)', completed: false },
      { id: 'hist1-4', title: 'Ch 4: Partition of Bengal 1905 & Swadeshi Movement (বঙ্গভঙ্গ ও স্বদেশী আন্দোলন)', completed: false },
      { id: 'hist1-5', title: 'Ch 5: Constitutional Politics 1906–1947 & Partition (ভারতীয় উপমহাদেশের স্বাধীনতা ও দেশভাগ)', completed: false },
      { id: 'hist1-6', title: 'Ch 6: Language Movement 1952 & Bengali Nationalism (ভাষা আন্দোলন ১৯৫২ ও জাতীয়তাবাদ)', completed: false },
      { id: 'hist1-7', title: 'Ch 7: Six-Point Demand 1966 & Mass Uprising 1969 (ছয় দফা ও ৬৯-এর গণঅভ্যুত্থান)', completed: false },
      { id: 'hist1-8', title: 'Ch 8: Liberation War 1971 & Emergence of Bangladesh (মহান মুক্তিযুদ্ধ ১৯৭১ ও বাংলাদেশের অভ্যুদয়)', completed: false },
    ],
  },
  {
    id: 'hist-2',
    name: 'History 2nd Paper (ইতিহাস ২য় পত্র — আধুনিক বিশ্বের ইতিহাস)',
    paper: 'HSC 2nd Year',
    stream: 'Arts',
    chapters: [
      { id: 'hist2-1', title: 'Ch 1: Industrial Revolution (শিল্প বিপ্লব)', completed: false },
      { id: 'hist2-2', title: 'Ch 2: French Revolution & Rise of Napoleon (ফরাসি বিপ্লব ও নেপোলিয়ন)', completed: false },
      { id: 'hist2-3', title: 'Ch 3: First World War & Treaty of Versailles (প্রথম বিশ্বযুদ্ধ ও ভার্সাই সন্ধি)', completed: false },
      { id: 'hist2-4', title: 'Ch 4: Bolshevik Revolution in Russia 1917 (রুশ বিপ্লব ১৯১৭)', completed: false },
      { id: 'hist2-5', title: 'Ch 5: Rise of Dictatorship & Fascism — Hitler & Mussolini (হিটলার ও মুসোলিনি)', completed: false },
      { id: 'hist2-6', title: 'Ch 6: Second World War & United Nations (দ্বিতীয় বিশ্বযুদ্ধ ও জাতিসংঘ)', completed: false },
      { id: 'hist2-7', title: 'Ch 7: Cold War Era & End of Cold War (স্নায়ুযুদ্ধ ও এর অবসান)', completed: false },
    ],
  },
  {
    id: 'ihc-1',
    name: 'Islamic History & Culture 1st Paper (ইসলামের ইতিহাস ও সংস্কৃতি ১ম পত্র)',
    paper: 'HSC 1st Year',
    stream: 'Arts',
    chapters: [
      { id: 'ihc1-1', title: 'Ch 1: Pre-Islamic Arabia — Geography & Socio-Political State (প্রাক-ইসলামি আরব)', completed: false },
      { id: 'ihc1-2', title: 'Ch 2: Prophet Hazrat Muhammad (SM): Makkah & Madinah Period (মহানবি হযরত মুহাম্মদ সা.)', completed: false },
      { id: 'ihc1-3', title: 'Ch 3: Khulafa-e-Rashideen — Abu Bakr, Umar, Uthman & Ali (RA) (খোলাফায়ে রাশেদীন)', completed: false },
      { id: 'ihc1-4', title: 'Ch 4: Umayyad Caliphate — Rise, Administration & Fall (উমাইয়া খিলাফত)', completed: false },
      { id: 'ihc1-5', title: 'Ch 5: Abbasid Caliphate — Golden Age of Science & Culture (আব্বাসীয় খিলাফত)', completed: false },
      { id: 'ihc1-6', title: 'Ch 6: Muslim Rule in Spain — Umayyads of Cordova (স্পেনে মুসলিম শাসন)', completed: false },
      { id: 'ihc1-7', title: 'Ch 7: Fatimid & Ayyubid Dynasties — Salahuddin Ayyubi (ফাতেমীয় ও আইয়ুবীয় বংশ)', completed: false },
    ],
  },
  {
    id: 'ihc-2',
    name: 'Islamic History & Culture 2nd Paper (ইসলামের ইতিহাস ও সংস্কৃতি ২য় পত্র)',
    paper: 'HSC 2nd Year',
    stream: 'Arts',
    chapters: [
      { id: 'ihc2-1', title: 'Ch 1: Advent of Muslims in India & Delhi Sultanate (ভারতে মুসলিম শাসন ও দিল্লি সালতানাত)', completed: false },
      { id: 'ihc2-2', title: 'Ch 2: Mughal Empire in India — Babur to Aurangzeb (ভারতে মোগল শাসন)', completed: false },
      { id: 'ihc2-3', title: 'Ch 3: Independent Sultanate of Bengal (বাংলার স্বাধীন সুলতানি আমল)', completed: false },
      { id: 'ihc2-4', title: 'Ch 4: British Rule in Bengal & Resistance Movements (ইংরেজ শাসন ও প্রতিরোধ আন্দোলন)', completed: false },
      { id: 'ihc2-5', title: 'Ch 5: Pakistan Period, 1952–1971 & Liberation War of Bangladesh (বাংলাদেশের অভ্যুদয়)', completed: false },
    ],
  },
  {
    id: 'soc-1',
    name: 'Sociology 1st Paper (সমাজবিজ্ঞান ১ম পত্র)',
    paper: 'HSC 1st Year',
    stream: 'Arts',
    chapters: [
      { id: 'soc1-1', title: 'Ch 1: Origin & Development of Sociology (সমাজবিজ্ঞানের উৎপত্তি ও বিকাশ)', completed: false },
      { id: 'soc1-2', title: 'Ch 2: Scientific Method & Sociological Research (সমাজবিজ্ঞানের বৈজ্ঞানিক মর্যাদা ও গবেষণা পদ্ধতি)', completed: false },
      { id: 'soc1-3', title: 'Ch 3: Pioneers of Sociology — Comte, Durkheim, Marx, Weber (সমাজবিজ্ঞানীদের অবদান)', completed: false },
      { id: 'soc1-4', title: 'Ch 4: Basic Concepts of Sociology (সমাজবিজ্ঞানের মৌল প্রত্যয়)', completed: false },
      { id: 'soc1-5', title: 'Ch 5: Social Institutions — Family, Marriage & Kinship (সামাজিক প্রতিষ্ঠান)', completed: false },
      { id: 'soc1-6', title: 'Ch 6: Culture & Civilization (সংস্কৃতি ও সভ্যতা)', completed: false },
      { id: 'soc1-7', title: 'Ch 7: Socialization Process (সামাজিকীকরণ প্রক্রিয়া)', completed: false },
      { id: 'soc1-8', title: 'Ch 8: Social Stratification & Inequality (সামাজিক স্তরবিন্যাস ও অসমতা)', completed: false },
      { id: 'soc1-9', title: 'Ch 9: Social System & Economy (সমাজ ব্যবস্থা)', completed: false },
      { id: 'soc1-10', title: 'Ch 10: Deviance & Social Control (বিচ্যুতিমূলক আচরণ ও সামাজিক নিয়ন্ত্রণ)', completed: false },
      { id: 'soc1-11', title: 'Ch 11: Social Change & Evolution (সামাজিক পরিবর্তন)', completed: false },
    ],
  },
  {
    id: 'soc-2',
    name: 'Sociology 2nd Paper (সমাজবিজ্ঞান ২য় পত্র — বাংলাদেশের সমাজ ও সংস্কৃতি)',
    paper: 'HSC 2nd Year',
    stream: 'Arts',
    chapters: [
      { id: 'soc2-1', title: 'Ch 1: Emergence of Sociology Study in Bangladesh (বাংলাদেশে সমাজবিজ্ঞান চর্চার ধারা)', completed: false },
      { id: 'soc2-2', title: 'Ch 2: Society & Culture of Bangladesh (বাংলাদেশের সমাজ ও সংস্কৃতি)', completed: false },
      { id: 'soc2-3', title: 'Ch 3: Archaeological Heritage & History of Bengal (প্রত্নতত্ত্বের ভিত্তিতে বাংলাদেশের সমাজ)', completed: false },
      { id: 'soc2-4', title: 'Ch 4: Ethnic Groups & Cultural Diversity of Bangladesh (বাংলাদেশের নৃ-গোষ্ঠীর জীবনধারা)', completed: false },
      { id: 'soc2-5', title: 'Ch 5: Emergence of Independent Bangladesh (বাংলাদেশের অভ্যুদয়ের সামাজিক প্রেক্ষাপট)', completed: false },
      { id: 'soc2-6', title: 'Ch 6: Rural & Urban Society of Bangladesh (বাংলাদেশের গ্রামীণ ও শহুরে সমাজ)', completed: false },
      { id: 'soc2-7', title: 'Ch 7: Marriage, Family & Kinship in Bangladesh (বাংলাদেশে বিবাহ, পরিবার ও জ্ঞাতি সম্পর্ক)', completed: false },
      { id: 'soc2-8', title: 'Ch 8: Social Change & Modernization in Bangladesh (বাংলাদেশে সামাজিক পরিবর্তন)', completed: false },
      { id: 'soc2-9', title: 'Ch 9: Social Problems & Remedial Measures (বাংলাদেশের সামাজিক সমস্যা ও প্রতিকার)', completed: false },
    ],
  },
  {
    id: 'logic-1',
    name: 'Logic 1st Paper (যুক্তিবিদ্যা ১ম পত্র — অবরোহ)',
    paper: 'HSC 1st Year',
    stream: 'Arts',
    chapters: [
      { id: 'log1-1', title: 'Ch 1: Introduction to Logic (যুক্তিবিদ্যা পরিচিতি)', completed: false },
      { id: 'log1-2', title: 'Ch 2: Scope & Utility of Logic (যুক্তিবিদ্যার প্রায়োগিক দিক)', completed: false },
      { id: 'log1-3', title: 'Ch 3: Elements of Logic — Term, Word & Denotation (যুক্তির উপাদান: পদ ও শব্দ)', completed: false },
      { id: 'log1-4', title: 'Ch 4: Predicables & Categories (বিধেয়ক)', completed: false },
      { id: 'log1-5', title: 'Ch 5: Inference — Deductive & Inductive (অনুমান)', completed: false },
      { id: 'log1-6', title: 'Ch 6: Categorical Syllogism & Fallacies (অবরোহ অনুমান ও সহানুমান)', completed: false },
      { id: 'log1-7', title: 'Ch 7: Symbolic Logic & Truth Tables (প্রতীকী যুক্তিবিদ্যা)', completed: false },
      { id: 'log1-8', title: 'Ch 8: Mill’s Methods & Scientific Proof Intro (যুক্তির বৈধতা যাচাই)', completed: false },
    ],
  },
  {
    id: 'logic-2',
    name: 'Logic 2nd Paper (যুক্তিবিদ্যা ২য় পত্র — আরোহ)',
    paper: 'HSC 2nd Year',
    stream: 'Arts',
    chapters: [
      { id: 'log2-1', title: 'Ch 1: Logical Definition (যৌক্তিক সংজ্ঞা)', completed: false },
      { id: 'log2-2', title: 'Ch 2: Logical Division (যৌক্তিক বিভাগ)', completed: false },
      { id: 'log2-3', title: 'Ch 3: Nature & Kinds of Induction (আরোহের প্রকৃতি ও প্রকারভেদ)', completed: false },
      { id: 'log2-4', title: 'Ch 4: Hypothesis — Nature, Uses & Verification (প্রকল্প)', completed: false },
      { id: 'log2-5', title: 'Ch 5: Causation & Uniformity of Nature (কার্যকারণ নিয়ম)', completed: false },
      { id: 'log2-6', title: 'Ch 6: Explanation — Scientific & Popular (ব্যাখ্যা)', completed: false },
      { id: 'log2-7', title: 'Ch 7: Classification (শ্রেণিকরণ)', completed: false },
      { id: 'log2-8', title: 'Ch 8: Probability & Chance (সম্ভাবনা)', completed: false },
    ],
  },
  {
    id: 'geo-1',
    name: 'Geography 1st Paper (ভূগোল ১ম পত্র — প্রাকৃতিক ভূগোল)',
    paper: 'HSC 1st Year',
    stream: 'Arts',
    chapters: [
      { id: 'geo1-1', title: 'Ch 1: Meaning & Scope of Physical Geography (প্রাকৃতিক ভূগোলের ধারণা)', completed: false },
      { id: 'geo1-2', title: 'Ch 2: Structure of Earth & Landforms (পৃথিবীর গঠন ও ভূমিরূপ)', completed: false },
      { id: 'geo1-3', title: 'Ch 3: Geomorphic Processes & Delta Formation (ভূমিরূপ পরিবর্তন প্রক্রিয়া)', completed: false },
      { id: 'geo1-4', title: 'Ch 4: Atmosphere — Weather, Monsoon & Climate (বায়ুমণ্ডল ও বায়ুদূষণ)', completed: false },
      { id: 'geo1-5', title: 'Ch 5: Climatic Regions & Climate Change (জলবায়ু অঞ্চল ও জলবায়ু পরিবর্তন)', completed: false },
      { id: 'geo1-6', title: 'Ch 6: Hydrosphere — Ocean Currents & Tides (বারিমণ্ডল ও সমুদ্রস্রোত)', completed: false },
      { id: 'geo1-7', title: 'Ch 7: Biosphere & Natural Ecosystems (জীবমণ্ডল)', completed: false },
    ],
  },
  {
    id: 'geo-2',
    name: 'Geography 2nd Paper (ভূগোল ২য় পত্র — মানব ভূগোল)',
    paper: 'HSC 2nd Year',
    stream: 'Arts',
    chapters: [
      { id: 'geo2-1', title: 'Ch 1: Human Geography — Concept & Scope (মানব ভূগোল পরিচিতি)', completed: false },
      { id: 'geo2-2', title: 'Ch 2: Population Distribution, Density & Migration (জনসংখ্যা ও অভিবাসন)', completed: false },
      { id: 'geo2-3', title: 'Ch 3: Rural & Urban Settlements (বসতি)', completed: false },
      { id: 'geo2-4', title: 'Ch 4: Agriculture & Food Production (কৃষি)', completed: false },
      { id: 'geo2-5', title: 'Ch 5: Mineral & Energy Resources (খনিজ ও শক্তি সম্পদ)', completed: false },
      { id: 'geo2-6', title: 'Ch 6: Industry — RMG & Manufacturing (শিল্প)', completed: false },
      { id: 'geo2-7', title: 'Ch 7: Transport & International Trade (পরিবহন ও বাণিজ্য)', completed: false },
      { id: 'geo2-8', title: 'Ch 8: Environmental Pollution & Disaster Management (দুর্যোগ ব্যবস্থাপনা)', completed: false },
    ],
  },
  {
    id: 'sw-1',
    name: 'Social Work 1st & 2nd Paper (সমাজকর্ম ১ম ও ২য় পত্র)',
    paper: 'HSC 1st Year',
    stream: 'Arts',
    chapters: [
      { id: 'sw1-1', title: 'Paper 1 — Concept, Scope & Historical Evolution of Social Work (সমাজকর্মের ধারণা ও ক্রমবিকাশ)', completed: false },
      { id: 'sw1-2', title: 'Paper 1 — Profession, Values & Social Reformers (সমাজকর্ম পেশা ও সমাজ সংস্কার)', completed: false },
      { id: 'sw1-3', title: 'Paper 1 — Methods of Social Work: Casework, Group & Community (সমাজকর্মের পদ্ধতি)', completed: false },
      { id: 'sw2-1', title: 'Paper 2 — Basic Human Needs & Social Problems in Bangladesh (মৌলিক মানবিক চাহিদা ও সামাজিক সমস্যা)', completed: false },
      { id: 'sw2-2', title: 'Paper 2 — Social Welfare Services, NGOs & Rural Development (সামাজিক নিরাপত্তা ও এনজিও কার্যক্রম)', completed: false },
    ],
  },

  // ================= COMPULSORY COMMON SUBJECTS (ALL 3 STREAMS) =================
  {
    id: 'ban-1',
    name: 'Bangla 1st Paper (বাংলা ১ম পত্র — সাহিত্যপাঠ ও সহপাঠ)',
    paper: 'HSC 1st Year',
    stream: 'Both',
    chapters: [
      { id: 'ban1-1', title: 'গদ্য (Prose): অপরিচিতা, বিলাসী, আমার পথ, মানব-কল্যাণ', completed: false },
      { id: 'ban1-2', title: 'গদ্য (Prose): মাসি-পিসি, বায়ান্নর দিনগুলো, রেইনকোট, নেকলেস', completed: false },
      { id: 'ban1-3', title: 'পদ্য (Poetry): সোনার তরী, বিদ্রোহী, প্রতিদান, তাহারেই পড়ে মনে', completed: false },
      { id: 'ban1-4', title: 'পদ্য (Poetry): আঠারো বছর বয়স, ফেব্রুয়ারি ১৯৬৯, আমি কিংবদন্তির কথা বলছি', completed: false },
      { id: 'ban1-5', title: 'উপন্যাস (Novel): লালসালু — সৈয়দ ওয়ালীউল্লাহ', completed: false },
      { id: 'ban1-6', title: 'নাটক (Drama): সিরাজউদ্দৌলা — সিকান্দার আবু জাফর', completed: false },
    ],
  },
  {
    id: 'ban-2',
    name: 'Bangla 2nd Paper (বাংলা ২য় পত্র — ব্যাকরণ ও নির্মিতি)',
    paper: 'HSC 2nd Year',
    stream: 'Both',
    chapters: [
      { id: 'ban2-1', title: 'বাংলা উচ্চারণের নিয়ম ও বাংলা বানানের নিয়ম', completed: false },
      { id: 'ban2-2', title: 'বাংলা ভাষার ব্যাকরণিক শব্দশ্রেণি (পদ প্রকরণ)', completed: false },
      { id: 'ban2-3', title: 'বাংলা শব্দ গঠন: উপসর্গ, প্রত্যয় ও সমাস', completed: false },
      { id: 'ban2-4', title: 'বাক্যতত্ত্ব: বাক্যের শ্রেণিবিভাগ ও বাক্য রূপান্তর', completed: false },
      { id: 'ban2-5', title: 'বাংলা ভাষার অপপ্রয়োগ ও শুদ্ধ প্রয়োগ', completed: false },
      { id: 'ban2-6', title: 'নির্মিতি: পারিভাষিক শব্দ, অনুবাদ, দিনলিপি, প্রতিবেদন, আবেদনপত্র ও প্রবন্ধ', completed: false },
    ],
  },
  {
    id: 'eng-1',
    name: 'English 1st Paper (English For Today — Units 1–12)',
    paper: 'HSC 1st Year',
    stream: 'Both',
    chapters: [
      { id: 'eng1-1', title: 'Unit 1–3: People & Institutions, Dreams, Lifestyle', completed: false },
      { id: 'eng1-2', title: 'Unit 4–6: Adolescence, Youthful Achievers, Relationships', completed: false },
      { id: 'eng1-3', title: 'Unit 7–9: Human Rights, Environment & Nature, Tours & Travels', completed: false },
      { id: 'eng1-4', title: 'Unit 10–12: Art & Craft, Myths & Literature, Peace & Conflict', completed: false },
      { id: 'eng1-5', title: 'Reading Skill: Flow Charts, Summary Writing & Cloze Tests', completed: false },
    ],
  },
  {
    id: 'eng-2',
    name: 'English 2nd Paper (Grammar & Composition)',
    paper: 'HSC 2nd Year',
    stream: 'Both',
    chapters: [
      { id: 'eng2-1', title: 'Prepositions, Special Phrases & Words, Completing Sentences', completed: false },
      { id: 'eng2-2', title: 'Right Form of Verbs, Narration & Changing Sentences', completed: false },
      { id: 'eng2-3', title: 'Pronoun Reference, Modifiers & Sentence Connectors', completed: false },
      { id: 'eng2-4', title: 'Synonym-Antonym & Punctuation Rules', completed: false },
      { id: 'eng2-5', title: 'Formal Application, Report Writing & Academic Essays', completed: false },
    ],
  },
  {
    id: 'ict-common',
    name: 'Information & Communication Technology (তথ্য ও যোগাযোগ প্রযুক্তি)',
    paper: 'HSC 2nd Year',
    stream: 'Both',
    chapters: [
      { id: 'ict-1', title: 'Ch 1: ICT — World & Bangladesh Perspective (বিশ্ব ও বাংলাদেশ প্রেক্ষিত)', completed: false },
      { id: 'ict-2', title: 'Ch 2: Communication Systems & Networking (কমিউনিকেশন সিস্টেমস ও নেটওয়ার্কিং)', completed: false },
      { id: 'ict-3', title: 'Ch 3: Number Systems & Digital Devices (সংখ্যা পদ্ধতি ও ডিজিটাল ডিভাইস)', completed: false },
      { id: 'ict-4', title: 'Ch 4: Web Design & HTML (ওয়েব ডিজাইন পরিচিতি ও HTML)', completed: false },
      { id: 'ict-5', title: 'Ch 5: Programming Language — C (প্রোগ্রামিং ভাষা)', completed: false },
      { id: 'ict-6', title: 'Ch 6: Database Management System — SQL (ডেটাবেজ ম্যানেজমেন্ট সিস্টেম)', completed: false },
    ],
  },
];

export const INITIAL_VOCAB_VAULT: VocabItem[] = [
  {
    id: 'v-compounding',
    word: 'Compounding',
    partOfSpeech: 'noun / adj.',
    englishDef: 'Generating exponential results through small, consistent daily increments over time.',
    banglaMeaning: 'চক্রবৃদ্ধি বা ক্রমবর্ধমান প্রভাব',
    exampleSentence: 'Daily two-hour study blocks have a compounding effect on your HSC board rank.',
    sourceBook: 'Atomic Discipline',
    mastered: false,
    pinnedForHome: true,
    itemType: 'vocab',
  },
  {
    id: 'v-friction',
    word: 'Friction',
    partOfSpeech: 'noun',
    englishDef: 'Any obstacle or mental resistance that slows down starting a high-value task.',
    banglaMeaning: 'মানসিক বা পরিবেশগত বাধা / প্রতিবন্ধকতা',
    exampleSentence: 'Keeping your phone in another room reduces friction when entering deep study.',
    sourceBook: 'Atomic Discipline',
    mastered: false,
    pinnedForHome: true,
    itemType: 'vocab',
  },
  {
    id: 'v-keystone',
    word: 'Keystone Habit',
    partOfSpeech: 'noun phrase',
    englishDef: 'A foundational daily routine that naturally triggers multiple positive habits afterward.',
    banglaMeaning: 'মূল ভিত্তি অভ্যাস (যা অন্য ভালো অভ্যাস তৈরি করে)',
    exampleSentence: 'Waking before Fajr or planning at 9 PM acts as a keystone habit for academic success.',
    sourceBook: 'Atomic Discipline',
    mastered: false,
    pinnedForHome: false,
    itemType: 'lesson',
  },
  {
    id: 'v-cognitive-residue',
    word: 'Attention Residue',
    partOfSpeech: 'noun phrase',
    englishDef: 'Mental fragments left behind when you switch rapidly from one task to another.',
    banglaMeaning: 'মনোযোগের অবশিষ্টাংশ (কাজ বদলানোর পর আটকে থাকা চিন্তা)',
    exampleSentence: 'Checking notifications mid-chapter creates severe attention residue.',
    sourceBook: 'Deep Focus Protocol',
    mastered: false,
    pinnedForHome: true,
    itemType: 'vocab',
  },
  {
    id: 'v-deliberate',
    word: 'Deliberate Practice',
    partOfSpeech: 'noun phrase',
    englishDef: 'Effortful, targeted training designed specifically to repair your weakest topics.',
    banglaMeaning: 'সুচিন্তিত ও দুর্বলতা-কেন্দ্রিক অনুশীলন',
    exampleSentence: 'Deliberate practice on Physics numericals beats passive textbook rereading.',
    sourceBook: 'Deep Focus Protocol',
    mastered: false,
    pinnedForHome: false,
    itemType: 'lesson',
  },
  {
    id: 'v-retrieval',
    word: 'Active Recall',
    partOfSpeech: 'noun phrase',
    englishDef: 'Pulling concepts out of memory without looking at notes first, strengthening neural pathways.',
    banglaMeaning: 'সক্রিয়ভাবে মনে করার অনুশীলন (বই না দেখে উত্তর তৈরি করা)',
    exampleSentence: 'Testing yourself with a blank sheet is 3x stronger than highlighting paragraphs.',
    sourceBook: 'Deep Focus Protocol',
    mastered: false,
    pinnedForHome: false,
    itemType: 'lesson',
  },
  {
    id: 'v-equanimity',
    word: 'Equanimity',
    partOfSpeech: 'noun',
    englishDef: 'Mental calmness and composure, especially under academic or exam pressure.',
    banglaMeaning: 'মানসিক স্থিরতা ও ধৈর্য',
    exampleSentence: 'Approach mock exams with equanimity rather than panic.',
    sourceBook: 'The Resilient Scholar',
    mastered: false,
    pinnedForHome: true,
    itemType: 'vocab',
  },
  {
    id: 'v-ephemeral',
    word: 'Ephemeral',
    partOfSpeech: 'adjective',
    englishDef: 'Lasting for a very short time; temporary.',
    banglaMeaning: 'ক্ষণস্থায়ী',
    exampleSentence: 'Social media validation is ephemeral, whereas deep skills endure for decades.',
    sourceBook: 'The Resilient Scholar',
    mastered: false,
    pinnedForHome: false,
    itemType: 'vocab',
  },
  {
    id: 'v-antifragile',
    word: 'Antifragile',
    partOfSpeech: 'adjective',
    englishDef: 'Growing stronger and sharper when exposed to stress, mistakes, and tough feedback.',
    banglaMeaning: 'চাপ বা ভুল থেকে আরও শক্তিশালী হয়ে ওঠার ক্ষমতা',
    exampleSentence: 'Students who analyze every red mark in mock tests become antifragile before HSC finals.',
    sourceBook: 'The Resilient Scholar',
    mastered: false,
    pinnedForHome: false,
    itemType: 'vocab',
  },
];

export const BOOKS_LIBRARY: BookItem[] = [
  {
    id: 'book-atomic-discipline',
    title: 'Atomic Discipline',
    subtitle: 'Complete 5-Chapter Field Guide to Unbreakable Academic Momentum',
    author: 'Elevora Editorial Press',
    coverImage: coverDiscipline,
    chapters: [
      {
        id: 'ch-ad-1',
        number: 1,
        title: 'The Mathematics of 1% Daily Gains',
        banglaTitle: 'প্রতিদিন ১% উন্নতির গাণিতিক রহস্য',
        readTimeMin: 6,
        featuredVocabIds: ['v-compounding', 'v-friction'],
        englishParagraphs: [
          'Page 1 — Most HSC students overestimate what one marathon cram session before board exams can achieve, and wildly underestimate what ninety focused minutes every single morning can build over twenty-four months. Just like financial interest, tiny improvements look invisible on Day 3, modest on Day 30, and extraordinary by Day 300. Habits are the compounding interest of self-improvement.',
          'Page 2 — When you lower the friction to starting — by laying out your textbook, past papers, and calculator on your desk the night before — you bypass willpower completely. Do not wait until you "feel motivated" to open Physics, Economics, or Accounting. Design your room so the right decision is always the easiest physical move within 5 seconds.',
          'Page 3 — You do not rise to the level of your grand goals; you fall to the level of your daily systems. Replace vague wishes like "I want an A+ in HSC" with a non-negotiable system: "Every day at 6:00 AM, I complete one Pomodoro block and verify one chapter task before checking my phone."',
        ],
        banglaParagraphs: [
          'পৃষ্ঠা ১ — বেশিরভাগ এইচএসসি শিক্ষার্থী পরীক্ষার আগের রাতের দীর্ঘ পড়াশোনাকে অতিরিক্ত গুরুত্ব দেয়, কিন্তু প্রতিদিন সকালে মাত্র ৯০ মিনিটের গভীর মনোযোগ ২৪ মাসে কী বিশাল পরিবর্তন আনতে পারে তা বুঝতে পারে না। অর্থনৈতিক সুদের মতোই, ৩য় দিনে উন্নতি চোখে পড়ে না, ৩০তম দিনে সামান্য বোঝা যায়, কিন্তু ৩০০তম দিনে তা অসাধারণ ফল দেয়। অভ্যাস হলো আত্ম-উন্নয়নের চক্রবৃদ্ধি সুদ।',
          'পৃষ্ঠা ২ — যখন আপনি পড়া শুরু করার মানসিক বাধা (friction) কমিয়ে দেন—যেমন আগের রাতেই টেবিলে বই, টেস্ট পেপার ও ক্যালকুলেটর গুছিয়ে রাখা—তখন আর আলাদা ইচ্ছাশক্তির ওপর নির্ভর করতে হয় না। পড়া শুরু করার জন্য "মুড" বা অনুপ্রেরণার অপেক্ষা করবেন না; আপনার পড়ার ঘর এমনভাবে সাজান যেন ৫ সেকেন্ডেই পড়া শুরু করা সবচেয়ে সহজ কাজ হয়।',
          'পৃষ্ঠা ৩ — আপনি আপনার বড় স্বপ্নের স্তরে নয়, বরং আপনার প্রতিদিনের সিস্টেমের স্তরেই পৌঁছে যান। "আমি জিপিএ-৫ পেতে চাই"—এমন অস্পষ্ট ইচ্ছার বদলে একটি সুনির্দিষ্ট সিস্টেম তৈরি করুন: "প্রতিদিন সকাল ৬টায় ফোন দেখার আগেই আমি ১টি ফোকাস ব্লক এবং ১টি অধ্যায়ের কাজ যাচাইসহ শেষ করব।"',
        ],
        quiz: [
          {
            question: 'What determines your consistent long-term academic outcome?',
            options: [
              'Last-minute 12-hour cram sessions',
              'Your daily repeatable systems and low-friction environment',
              'Waiting for sudden bursts of motivation',
            ],
            correctIndex: 1,
          },
          {
            question: 'How should you reduce "friction" before morning study?',
            options: [
              'Prepare your textbook and tools on your desk the night before',
              'Check social media for 20 minutes first',
              'Keep your phone beside your pillow',
            ],
            correctIndex: 0,
          },
        ],
      },
      {
        id: 'ch-ad-2',
        number: 2,
        title: 'Identity Over Outcome',
        banglaTitle: 'ফলাফলের চেয়ে আত্মপরিচয় নির্মাণ',
        readTimeMin: 6,
        featuredVocabIds: ['v-compounding', 'v-keystone'],
        englishParagraphs: [
          'Page 1 — An outcome-focused student says: "I want to get GPA-5 and a scholarship." When a mock exam goes poorly, outcome-focused students often quit because the prize feels too far away. An identity-focused student instead asks: "Who is the type of scholar who naturally earns mastery?"',
          'Page 2 — Every completed Pomodoro session, every mindful break, and every honest mock test is a vote cast for your new identity. You do not need unanimous votes to win an election — you simply need a steady majority of your daily hours voting for discipline over distraction.',
          'Page 3 — Choose one keystone habit that protects the rest of your day: whether it is waking early for Fajr or starting a 5-minute morning Mind Refresh, a single anchor habit sets a disciplined tone that carries smoothly into college lectures and evening practice.',
        ],
        banglaParagraphs: [
          'পৃষ্ঠা ১ — ফলাফল-কেন্দ্রিক শিক্ষার্থী বলে: "আমি জিপিএ-৫ এবং বৃত্তি পেতে চাই।" কোনো মক টেস্ট খারাপ হলে এরা হাল ছেড়ে দেয় কারণ লক্ষ্যটা দূরে মনে হয়। কিন্তু আত্মপরিচয়-কেন্দ্রিক শিক্ষার্থী প্রশ্ন করে: "কেমন ধরনের শিক্ষার্থী স্বভাবতই বিষয়ে দক্ষতা অর্জন করে?"',
          'পৃষ্ঠা ২ — প্রতিটি সম্পন্ন পোমোডোরো সেশন, প্রতিটি সচেতন বিরতি এবং প্রতিটি সৎ মক টেস্ট আপনার নতুন ব্যক্তিত্বের পক্ষে একটি করে ভোট। নির্বাচনে জিততে শতভাগ ভোট লাগে না—দিনের বেশিরভাগ সময় যেন আপনার শৃঙ্খলার পক্ষে ভোট দেয়, সেটাই যথেষ্ট।',
          'পৃষ্ঠা ৩ — এমন একটি মূল ভিত্তি অভ্যাস (Keystone Habit) বেছে নিন যা আপনার পুরো দিনকে সুরক্ষিত রাখে: তা ফজরের সময় ওঠা হোক বা সকালে ৫ মিনিটের মাইন্ড রিফ্রেশ, একটি দৃঢ় অভ্যাস সারাদিনের কলেজ ক্লাস ও রাতের পড়াশোনায় ছন্দ এনে দেয়।',
        ],
        quiz: [
          {
            question: 'What is the main advantage of identity-based discipline?',
            options: [
              'Every daily action reinforces who you are becoming',
              'You never need to take mock exams',
              'You study only when friends study',
            ],
            correctIndex: 0,
          },
          {
            question: 'What is a "Keystone Habit"?',
            options: [
              'Studying 14 hours once a month',
              'One anchor routine that triggers positive momentum all day',
              'Buying multiple colored highlighters',
            ],
            correctIndex: 1,
          },
        ],
      },
      {
        id: 'ch-ad-3',
        number: 3,
        title: 'The Two-Minute Start & Cue Design',
        banglaTitle: '২ মিনিটের শুরু ও পরিবেশের সংকেত',
        readTimeMin: 5,
        featuredVocabIds: ['v-friction'],
        englishParagraphs: [
          'Page 1 — Procrastination rarely comes from laziness; it comes from a task looking too huge for a tired brain. Telling yourself "I must finish all of Organic Chemistry tonight" triggers instant avoidance. Instead, scale the entry down to the Two-Minute Rule: "I will simply open page 1 and solve just the first example."',
          'Page 2 — Once you begin for two minutes, inertia flips onto your side. Physics teaches us that static friction is always stronger than kinetic friction — starting an object takes far more force than keeping an already moving object in motion.',
          'Page 3 — Pair every study block with an unmistakable cue: clear water bottle, closed door, and one single notebook open on the desk. Over two weeks, sitting at that clean desk automatically shifts your brain into concentration mode.',
        ],
        banglaParagraphs: [
          'পৃষ্ঠা ১ — গড়িমসি খুব কমই অলসতার কারণে হয়; বেশিরভাগ সময় ক্লান্ত মস্তিষ্কের সামনে কাজটিকে বিশাল মনে হওয়ায় তা হয়। "আজ রাতেই পুরো জৈব রসায়ন শেষ করতে হবে" বললে মস্তিষ্ক পালাতে চায়। এর বদলে "২ মিনিটের নিয়ম" মানুন: "আমি শুধু ১ম পৃষ্ঠা খুলে প্রথম উদাহরণটি সমাধান করব।"',
          'পৃষ্ঠা ২ — মাত্র দুই মিনিট শুরু করতে পারলেই জড়তা আপনার পক্ষে কাজ করতে শুরু করে। পদার্থবিজ্ঞান শেখায়, স্থিতি ঘর্ষণ সবসময় গতি ঘর্ষণের চেয়ে বেশি—একটি স্থির বস্তু চালু করতে যে শক্তি লাগে, চলমান বস্তু এগিয়ে নিতে তার চেয়ে অনেক কম শক্তি লাগে।',
          'পৃষ্ঠা ৩ — প্রতিটি পড়ার সেশনের সাথে একটি স্পষ্ট পরিবেশগত সংকেত (Cue) যুক্ত করুন: টেবিলে পানির বোতল, দরজা ভেজানো এবং খোলা একটিমাত্র খাতা। দুই সপ্তাহের মধ্যে ওই পরিষ্কার টেবিলে বসলেই মস্তিষ্ক স্বয়ংক্রিয়ভাবে মনোযোগের মোডে চলে যাবে।',
        ],
        quiz: [
          {
            question: 'How does the Two-Minute Rule defeat procrastination?',
            options: [
              'By making the entry step tiny enough that your brain stops resisting',
              'By finishing an entire syllabus in 120 seconds',
              'By skipping hard topics altogether',
            ],
            correctIndex: 0,
          },
          {
            question: 'Why is starting harder than continuing?',
            options: [
              'Because static resistance is stronger than momentum already in motion',
              'Because textbooks are heavier at night',
              'Because short breaks destroy memory',
            ],
            correctIndex: 0,
          },
        ],
      },
      {
        id: 'ch-ad-4',
        number: 4,
        title: 'Never Miss Twice & Evening Audit',
        banglaTitle: 'টানা দুই দিন বাদ না দেওয়া ও রাতের পর্যালোচনা',
        readTimeMin: 5,
        featuredVocabIds: ['v-keystone'],
        englishParagraphs: [
          'Page 1 — Even top national merit holders have days when illness, family guests, or college exams break their study streak. Missing once is a normal human accident. Missing twice in a row is the birth of a new negative habit.',
          'Page 2 — When a tough day hits, shrink the goal rather than abandoning it: instead of a 2-hour block, complete one honest 15-minute review and verify one small task. Keeping the streak alive mentally protects your confidence.',
          'Page 3 — Spend three minutes every night at 10:00 PM writing down tomorrow’s single highest-priority topic. Waking up without knowing what to study wastes your sharpest morning willpower.',
        ],
        banglaParagraphs: [
          'পৃষ্ঠা ১ — এমনকি বোর্ড স্ট্যান্ড করা সেরা শিক্ষার্থীদের জীবনেও অসুস্থতা, মেহমান বা কলেজের পরীক্ষার কারণে মাঝে মাঝে রুটিন ভেঙে যায়। একদিন বাদ পড়া স্বাভাবিক মানবিক দুর্ঘটনা; কিন্তু পরপর দুদিন বাদ পড়া মানে একটি নতুন নেতিবাচক অভ্যাসের জন্ম।',
          'পৃষ্ঠা ২ — কঠিন কোনো দিন এলে পুরোপুরি বাদ না দিয়ে লক্ষ্য ছোট করুন: ২ ঘণ্টার বদলে অন্তত ১৫ মিনিটের একটি সৎ রিভিশন এবং একটি ছোট কাজ যাচাই করে শেষ করুন। ধারাবাহিকতা বজায় থাকলে আত্মবিশ্বাস অটুট থাকে।',
          'পৃষ্ঠা ৩ — প্রতিদিন রাত ১০টায় মাত্র ৩ মিনিট সময় নিয়ে পরের দিনের সবচেয়ে গুরুত্বপূর্ণ একটি টপিক লিখে রাখুন। সকালে উঠে কী পড়ব তা ভাবতে গেলেই দিনের সেরা মানসিক শক্তি নষ্ট হয়।',
        ],
        quiz: [
          {
            question: 'What is the "Never Miss Twice" rule?',
            options: [
              'Never take two quizzes in one day',
              'If you break a habit once, return immediately—even for 15 minutes—the next day',
              'Always study two subjects simultaneously',
            ],
            correctIndex: 1,
          },
          {
            question: 'Why write down tomorrow’s top priority the night before?',
            options: [
              'To save your freshest morning energy for actual execution',
              'To impress your classmates',
              'To avoid using calculators',
            ],
            correctIndex: 0,
          },
        ],
      },
      {
        id: 'ch-ad-5',
        number: 5,
        title: 'Final Integration: Building Your Scholarship Blueprint',
        banglaTitle: 'চূড়ান্ত সমন্বয়: বৃত্তি ও স্বপ্নের ক্যারিয়ারের ব্লুপ্রিন্ট',
        readTimeMin: 6,
        featuredVocabIds: ['v-compounding'],
        englishParagraphs: [
          'Page 1 — True excellence is never loud. While social media rewards flashy study desk photos, real universities and employers reward documented proof: completed syllabi, real projects, clear English communication, and steady ethical character.',
          'Page 2 — Combine your four Elevora pillars weekly: 1) Finish HSC chapters step-by-step, 2) Practice authentic English speaking and writing for DET, 3) Document one genuine skill or research milestone, and 4) Guard your prayer or mental refresh routine.',
          'Page 3 — You have completed every page of Atomic Discipline. Keep your daily systems humble, honest, and verifiable — over two years of HSC, small daily victories compound into an extraordinary life.',
        ],
        banglaParagraphs: [
          'পৃষ্ঠা ১ — প্রকৃত শ্রেষ্ঠত্ব কখনো চিৎকার করে না। সোশ্যাল মিডিয়া সুন্দর পড়ার টেবিলের ছবি পছন্দ করে, কিন্তু সেরা বিশ্ববিদ্যালয় ও প্রতিষ্ঠানগুলো খোঁজে বাস্তব প্রমাণ: সম্পূর্ণ সিলেবাস দখল, আসল গবেষণা/প্রজেক্ট, স্পষ্ট ইংরেজি দক্ষতা এবং সৎ চরিত্র।',
          'পৃষ্ঠা ২ — প্রতি সপ্তাহে আপনার এলিভোরার চারটি স্তম্ভ সমন্বয় করুন: ১) ধাপে ধাপে এইচএসসি অধ্যায় শেষ করা, ২) ডিইটি-র জন্য বাস্তব ইংরেজি বলা ও লেখার অনুশীলন, ৩) একটি বাস্তব স্কিল বা গবেষণার মাইলফলক নথিভুক্ত করা এবং ৪) নামাজ বা মানসিক প্রশান্তির রুটিন রক্ষা করা।',
          'পৃষ্ঠা ৩ — আপনি "অ্যাটমিক ডিসিপ্লিন" বইয়ের সবকটি পৃষ্ঠা সফলভাবে শেষ করেছেন! আপনার প্রতিদিনের সিস্টেমকে সৎ ও যাচাইযোগ্য রাখুন—এইচএসসির দুই বছরে ছোট ছোট জয়ই এক অসাধারণ ভবিষ্যৎ গড়ে দেবে।',
        ],
        quiz: [
          {
            question: 'What do top universities and scholarships value most?',
            options: [
              'Aesthetic desk photos online',
              'Verified academic consistency, real skills, and strong character',
              'Last-minute shortcuts',
            ],
            correctIndex: 1,
          },
          {
            question: 'How does real growth happen across 2 years of HSC?',
            options: [
              'Through consistent weekly integration of study, skill, and rest',
              'By ignoring mental and spiritual breaks completely',
              'By changing books every two days',
            ],
            correctIndex: 0,
          },
        ],
      },
    ],
  },
  {
    id: 'book-deep-focus',
    title: 'Deep Focus Protocol',
    subtitle: 'Complete 5-Chapter Guide to Cognitive Mastery & Memory Retention',
    author: 'Caliber Research Collective',
    coverImage: coverFocus,
    chapters: [
      {
        id: 'ch-df-1',
        number: 1,
        title: 'Eliminating Attention Residue',
        banglaTitle: 'মনোযোগের বিভ্রান্তি ও অবশিষ্টাংশ দূর করা',
        readTimeMin: 6,
        featuredVocabIds: ['v-cognitive-residue', 'v-deliberate'],
        englishParagraphs: [
          'Page 1 — If you glance at a chat message for just fifteen seconds while solving a complex problem, your cognitive capacity stays fragmented for up to twenty minutes afterward. Scientists call this phenomenon attention residue.',
          'Page 2 — Multitasking is a myth; the human brain actually switches rapidly between contexts and pays a heavy energy tax on every switch. Three hours of distracted study with WhatsApp open yields less genuine mastery than 45 pure, isolated minutes.',
          'Page 3 — High-value academic performance follows a simple formula: Output = (Time Spent) × (Intensity of Focus). Keep your phone in another room during every Pomodoro block and watch your comprehension speed double.',
        ],
        banglaParagraphs: [
          'পৃষ্ঠা ১ — আপনি যদি কোনো জটিল অঙ্ক বা পড়া করার মাঝে মাত্র ১৫ সেকেন্ডের জন্য একটি চ্যাট মেসেজ দেখেন, তবে আপনার মস্তিষ্কের একাগ্রতা পরবর্তী প্রায় ২০ মিনিট ধরে বিভক্ত থাকে। বিজ্ঞানীরা একে বলেন "অ্যাটেনশন রেসিডিউ" বা মনোযোগের অবশিষ্টাংশ।',
          'পৃষ্ঠা ২ — মাল্টিটাস্কিং একটি ভ্রান্ত ধারণা; মানব মস্তিষ্ক আসলে দ্রুত কাজ বদলায় এবং প্রতিবার বদলানোর সময় প্রচুর মানসিক শক্তি খরচ করে। হোয়াটসঅ্যাপ খোলা রেখে ৩ ঘণ্টা পড়ার চেয়ে ফোন দূরে রেখে ৪৫ মিনিট গভীর পড়া অনেক বেশি কার্যকর।',
          'পৃষ্ঠা ৩ — উচ্চমানের একাডেমিক সাফল্যের সহজ সূত্র হলো: ফলাফল = (সময়) × (মনোযোগের তীব্রতা)। প্রতিটি ফোকাস ব্লকে ফোন অন্য ঘরে রাখুন এবং দেখুন কীভাবে আপনার বোঝার গতি দ্বিগুণ হয়।',
        ],
        quiz: [
          {
            question: 'What happens when you quickly check a notification mid-study?',
            options: [
              'Attention residue degrades focus for up to 20 minutes',
              'Your brain resets faster',
              'It improves long-term memory',
            ],
            correctIndex: 0,
          },
          {
            question: 'Which formula defines deep academic output?',
            options: [
              'Time Spent × Intensity of Unbroken Focus',
              'Browser tabs open × Pages skimmed',
              'Hours awake × Caffeine intake',
            ],
            correctIndex: 0,
          },
        ],
      },
      {
        id: 'ch-df-2',
        number: 2,
        title: 'Active Recall Beats Passive Reading',
        banglaTitle: 'সক্রিয় স্মরণশক্তি বনাম নিষ্ক্রিয় রিডিং পড়া',
        readTimeMin: 6,
        featuredVocabIds: ['v-retrieval', 'v-deliberate'],
        englishParagraphs: [
          'Page 1 — Highlighting neat yellow lines across a textbook feels productive, yet cognitive science proves passive rereading produces weak long-term exam recall. Your eyes recognize the sentence, tricking you into feeling you understand it.',
          'Page 2 — Real learning happens only when your brain struggles slightly to pull information out without looking. Close the book after reading two pages and write everything you remember on a blank sheet — that struggle builds permanent neural pathways.',
          'Page 3 — Use the 30/70 rule for HSC chapters: spend 30% of your block understanding the core concept, and 70% testing yourself with blank-page derivations, board CQ questions, and oral explanations.',
        ],
        banglaParagraphs: [
          'পৃষ্ঠা ১ — বইয়ে হলুদ হাইলাইটার দিয়ে দাগানো দেখতে দারুণ লাগে, কিন্তু জ্ঞানীয় বিজ্ঞান প্রমাণ করেছে বারবার রিডিং পড়লে পরীক্ষার হলে তা সহজে মনে থাকে না। আপনার চোখ বাক্যটি চিনে ফেলে, আর আপনি ভুল করে ভাবেন আপনি পড়াটা বুঝে গেছেন।',
          'পৃষ্ঠা ২ — প্রকৃত শেখা তখনই হয় যখন আপনার মস্তিষ্ক না দেখে তথ্য মনে করার জন্য একটু পরিশ্রম করে। দুই পৃষ্ঠা পড়ার পর বই বন্ধ করে একটি সাদা কাগজে যা মনে আছে লিখুন—এই চেষ্টাই মস্তিষ্কে স্থায়ী স্মৃতির পথ তৈরি করে।',
          'পৃষ্ঠা ৩ — এইচএসসি অধ্যায়ের জন্য ৩০/৭০ নিয়ম মানুন: সময়ের ৩০% ব্যয় করুন মূল ধারণা বুঝতে, আর ৭০% ব্যয় করুন না দেখে সূত্র প্রমাণ, সৃজনশীল (CQ) প্রশ্ন এবং নিজে নিজে মুখে বুঝিয়ে বলার অনুশীলনে।',
        ],
        quiz: [
          {
            question: 'Why can highlighting give an "illusion of competence"?',
            options: [
              'Recognizing words visually is much easier than recalling them in an exam',
              'Highlighters fade too fast',
              'Yellow ink slows down reading speed',
            ],
            correctIndex: 0,
          },
          {
            question: 'What is the 30/70 rule for mastering a chapter?',
            options: [
              '30% concept input, 70% active recall and problem-solving',
              '30% sleep, 70% scrolling',
              '70% passive reading, 30% copying notes',
            ],
            correctIndex: 0,
          },
        ],
      },
      {
        id: 'ch-df-3',
        number: 3,
        title: 'Spaced Repetition & The Forgetting Curve',
        banglaTitle: 'বিরতি দিয়ে রিভিশন ও ভুলে যাওয়ার কার্ভ',
        readTimeMin: 5,
        featuredVocabIds: ['v-retrieval'],
        englishParagraphs: [
          'Page 1 — Without review, the human brain forgets nearly 65% of newly memorized definitions, historical dates, or vocabulary within 48 hours. Cramming fights biology; spaced repetition works with biology.',
          'Page 2 — Review new flashcards and formulas at expanding intervals: Day 1 (right after learning), Day 3, Day 7, and Day 21. Each timely review flattens the forgetting curve dramatically.',
          'Page 3 — Keep your Home Page flashcard deck curated with the hardest words and concepts from your books so those critical 1-day and 3-day reviews happen effortlessly.',
        ],
        banglaParagraphs: [
          'পৃষ্ঠা ১ — রিভিশন না দিলে মানুষের মস্তিষ্ক ৪৮ ঘণ্টার মধ্যেই নতুন শেখা সংজ্ঞা, ঐতিহাসিক সাল বা ইংরেজি শব্দের প্রায় ৬৫% ভুলে যায়। এক রাতে মুখস্থ করা জীববিজ্ঞানের নিয়মের বিরুদ্ধে যায়; বিরতি দিয়ে রিভিশন মস্তিষ্কের সাথে তাল মিলিয়ে চলে।',
          'পৃষ্ঠা ২ — নতুন ফ্ল্যাশকার্ড ও সূত্র নির্দিষ্ট বিরতিতে রিভিশন দিন: ১ম দিন (শেখার পরপর), ৩য় দিন, ৭ম দিন এবং ২১তম দিন। প্রতিটি সঠিক সময়ের রিভিশন ভুলে যাওয়ার হার নাটকীয়ভাবে কমিয়ে দেয়।',
          'পৃষ্ঠা ৩ — আপনার বই থেকে শেখা সবচেয়ে জরুরি শব্দ ও মূল ধারণাগুলো হোম পেজের ফ্ল্যাশকার্ডে পিন করে রাখুন, যেন ১ম ও ৩য় দিনের রিভিশন অনায়াসে হয়ে যায়।',
        ],
        quiz: [
          {
            question: 'How much new rote material is typically forgotten within 48 hours without review?',
            options: ['About 5%', 'Roughly 65%', '0% if highlighted'],
            correctIndex: 1,
          },
          {
            question: 'Which review cadence follows Spaced Repetition?',
            options: [
              'Day 1, Day 3, Day 7, Day 21',
              'Only the night before the board exam',
              'Every 5 minutes nonstop',
            ],
            correctIndex: 0,
          },
        ],
      },
      {
        id: 'ch-df-4',
        number: 4,
        title: 'Deliberate Practice on Weak Spots',
        banglaTitle: 'দুর্বল টপিকগুলোতে সুচিন্তিত অনুশীলন',
        readTimeMin: 5,
        featuredVocabIds: ['v-deliberate'],
        englishParagraphs: [
          'Page 1 — Most students enjoy solving problems they already know how to solve because getting right answers feels comfortable. Yet comfort produces zero grade growth.',
          'Page 2 — Deliberate practice means keeping a dedicated "Mistake Log" notebook. Whenever you miss an MCQ, lose marks in an English essay, or stall on an Economics graph, write down why you missed it.',
          'Page 3 — Attack your bottom two chapters first during peak morning energy. Fixing one chronic weak spot raises your final HSC GPA faster than polishing five chapters you already dominate.',
        ],
        banglaParagraphs: [
          'পৃষ্ঠা ১ — বেশিরভাগ শিক্ষার্থী সেই অঙ্ক বা প্রশ্নই বারবার করে যেগুলো তারা আগে থেকেই পারে, কারণ সঠিক উত্তর পেলে মন ভালো লাগে। কিন্তু আরামদায়ক অনুশীলন পরীক্ষায় কোনো নম্বর বাড়ায় না।',
          'পৃষ্ঠা ২ — সুচিন্তিত অনুশীলন (Deliberate Practice) মানে একটি আলাদা "ভুলের খাতা" বা Mistake Log রাখা। যখনই কোনো এমসিকিউ ভুল হবে, ইংরেজি রচনায় নম্বর কমবে বা অর্থনীতির গ্রাফে আটকে যাবেন, ভুলের কারণটি লিখে রাখুন।',
          'পৃষ্ঠা ৩ — সকালের সবচেয়ে সতেজ শক্তিতে আপনার সবচেয়ে কঠিন দুটি অধ্যায় আগে ধরুন। একটি পুরোনো দুর্বলতা ঠিক করতে পারলে আগে থেকেই জানা পাঁচটি অধ্যায় ঝালাই করার চেয়ে দ্রুত জিপিএ বাড়ে।',
        ],
        quiz: [
          {
            question: 'What is the purpose of a "Mistake Log"?',
            options: [
              'To isolate and fix the exact reasons you lose marks',
              'To list your favorite chapters',
              'To replace your textbooks completely',
            ],
            correctIndex: 0,
          },
          {
            question: 'When should you tackle your hardest weak chapters?',
            options: [
              'At midnight when exhausted',
              'During your highest peak morning energy',
              'Only after all easy chapters are reviewed 10 times',
            ],
            correctIndex: 1,
          },
        ],
      },
      {
        id: 'ch-df-5',
        number: 5,
        title: 'Strategic Rest & Sleep Memory Consolidation',
        banglaTitle: 'কৌশলগত বিশ্রাম ও ঘুমে স্মৃতি সংরক্ষণ',
        readTimeMin: 5,
        featuredVocabIds: ['v-cognitive-residue'],
        englishParagraphs: [
          'Page 1 — Your brain does not wire new memories while you stare at notes; it consolidates them during deep sleep and screen-free breaks. Pulling all-nighters before exams actively erases memory transfer in the hippocampus.',
          'Page 2 — Between two intense 45-minute study blocks, avoid scrolling short videos. Reels and shorts flood dopamine and create heavy attention residue, leaving you mentally foggy for block two.',
          'Page 3 — Protect 7 hours of sleep and take genuine screen-free resets — drink water, walk outside, or breathe calmly. Congratulations on finishing Deep Focus Protocol!',
        ],
        banglaParagraphs: [
          'পৃষ্ঠা ১ — বইয়ের পাতার দিকে তাকিয়ে থাকার সময় মস্তিষ্ক স্মৃতি স্থায়ী করে না; বরং গভীর ঘুম এবং স্ক্রিনমুক্ত বিরতির সময় তা হিপোক্যাম্পাসে স্থায়ীভাবে সংরক্ষণ করে। পরীক্ষার আগে সারারাত জাগলে স্মৃতি সংরক্ষণ ক্ষমতা মারাত্মকভাবে ব্যাহত হয়।',
          'পৃষ্ঠা ২ — দুটি ৪৫ মিনিটের গভীর পড়ার সেশনের মাঝের বিরতিতে শর্ট ভিডিও বা রিলস দেখা থেকে বিরত থাকুন। এগুলো মস্তিষ্কে অপ্রয়োজনীয় ডোপামিন ও বিভ্রান্তি তৈরি করে পরের সেশনের মনোযোগ নষ্ট করে দেয়।',
          'পৃষ্ঠা ৩ — প্রতিদিন অন্তত ৭ ঘণ্টা ঘুম নিশ্চিত করুন এবং স্ক্রিনমুক্ত বিশ্রাম নিন—পানি পান করুন, একটু হাঁটুন বা শান্ত হয়ে শ্বাস নিন। "ডিপ ফোকাস প্রোটোকল" বইটি সম্পূর্ণ করার জন্য অভিনন্দন!',
        ],
        quiz: [
          {
            question: 'When does the brain biologically consolidate newly studied memories?',
            options: [
              'During deep sleep and quiet rest',
              'While scrolling short videos between chapters',
              'During 3 AM panic cramming',
            ],
            correctIndex: 0,
          },
          {
            question: 'Why should you avoid short-form video feeds during Pomodoro breaks?',
            options: [
              'They spike attention residue and tire your prefrontal cortex',
              'They speed up textbook reading',
              'They help you sleep deeper',
            ],
            correctIndex: 0,
          },
        ],
      },
    ],
  },
  {
    id: 'book-resilient-mind',
    title: 'The Resilient Scholar',
    subtitle: 'Complete 5-Chapter Playbook on Composure, Purpose & Antifragility',
    author: 'N. Rahman & Mentors',
    coverImage: coverResilience,
    chapters: [
      {
        id: 'ch-rs-1',
        number: 1,
        title: 'Equanimity Under Pressure',
        banglaTitle: 'চাপের মুখে মানসিক স্থিরতা',
        readTimeMin: 6,
        featuredVocabIds: ['v-equanimity', 'v-ephemeral'],
        englishParagraphs: [
          'Page 1 — Board exams, university admission tests, and international English exams like the DET test your nervous system as much as your memory. Panic narrows working memory; equanimity expands it.',
          'Page 2 — When you walk into an exam hall and see one unfamiliar question, your heart beats faster. Train a 10-second reset: exhale slowly, skip to the easiest question you know 100%, score momentum, and return with calm clarity.',
          'Page 3 — Separate what is ephemeral — a single bad mock score or someone else’s loud opinion — from what is permanent: your daily character, ethical integrity, and steady work ethic.',
        ],
        banglaParagraphs: [
          'পৃষ্ঠা ১ — বোর্ড পরীক্ষা, বিশ্ববিদ্যালয় ভর্তি পরীক্ষা এবং ডিইটি-র মতো আন্তর্জাতিক ইংরেজি পরীক্ষাগুলো আপনার স্মৃতিশক্তির পাশাপাশি আপনার স্নায়বিক স্থিরতাও যাচাই করে। আতঙ্ক মস্তিষ্কের কর্মক্ষমতা কমিয়ে দেয়, আর মানসিক স্থিরতা (equanimity) তা প্রসারিত করে।',
          'পৃষ্ঠা ২ — পরীক্ষার হলে গিয়ে একটি অচেনা প্রশ্ন দেখলে হৃদস্পন্দন বেড়ে যাওয়া স্বাভাবিক। তখন ১০ সেকেন্ডের একটি রিসেট অনুশীলন করুন: ধীরে শ্বাস ছাড়ুন, সবচেয়ে সহজ প্রশ্নটি দিয়ে উত্তর শুরু করে ছন্দ ফিরে পান এবং পরে কঠিনটিতে ফিরুন।',
          'পৃষ্ঠা ৩ — ক্ষণস্থায়ী বিষয়—যেমন একটি খারাপ মক টেস্টের নম্বর বা অন্যের সমালোচনা—থেকে স্থায়ী বিষয়গুলোকে আলাদা করতে শিখুন: আপনার চরিত্র, নৈতিকতা এবং নিরবচ্ছিন্ন পরিশ্রম।',
        ],
        quiz: [
          {
            question: 'How does panic affect your working memory during an exam?',
            options: [
              'It narrows working memory and hurts recall',
              'It expands working memory',
              'It has zero measurable effect',
            ],
            correctIndex: 0,
          },
          {
            question: 'What is "ephemeral" in a student’s journey?',
            options: [
              'A single disappointing mock score or temporary setback',
              'Long-term honesty and work ethic',
              'Problem-solving ability',
            ],
            correctIndex: 0,
          },
        ],
      },
      {
        id: 'ch-rs-2',
        number: 2,
        title: 'Controlling the Controllables',
        banglaTitle: 'নিয়ন্ত্রণযোগ্য বিষয়ে মনোনিবেশ',
        readTimeMin: 5,
        featuredVocabIds: ['v-equanimity'],
        englishParagraphs: [
          'Page 1 — Half of a student’s daily anxiety comes from obsessing over things outside their control: exam question difficulty, grading strictness, or how fast classmates seem to finish.',
          'Page 2 — Draw a simple circle. Inside the circle are your study hours, sleep hygiene, past-paper honesty, and attitude. Outside the circle are rumors, rankings, and exam leaks.',
          'Page 3 — Pour 100% of your energy inside the circle. When you control your preparation diligently, anxiety turns quietly into grounded self-respect.',
        ],
        banglaParagraphs: [
          'পৃষ্ঠা ১ — শিক্ষার্থীর অর্ধেক মানসিক চাপ আসে এমন বিষয় নিয়ে দুশ্চিন্তা করা থেকে যা তাদের হাতে নেই: প্রশ্নপত্র কঠিন হবে নাকি সহজ, খাতা কীভাবে দেখা হবে বা বন্ধুরা কতদূর এগিয়ে গেল।',
          'পৃষ্ঠা ২ — মনে মনে একটি বৃত্ত কল্পনা করুন। বৃত্তের ভেতরে রয়েছে আপনার পড়ার ঘণ্টা, ঘুমের সময়, সৎভাবে পরীক্ষা দেওয়া এবং মনোভাব। বৃত্তের বাইরে রয়েছে গুজব এবং অন্যের তুলনা।',
          'পৃষ্ঠা ৩ — আপনার শতভাগ শক্তি শুধু বৃত্তের ভেতরের কাজগুলোতে ব্যয় করুন। প্রস্তুতি সৎ হলে অহেতুক ভয় ধীরে ধীরে আত্মবিশ্বাস ও আত্মসম্মানে পরিণত হয়।',
        ],
        quiz: [
          {
            question: 'What belongs INSIDE a student’s circle of control?',
            options: [
              'Daily effort, sleep, honest practice, and attitude',
              'How hard the board examiner sets the paper',
              'What classmates post on social media',
            ],
            correctIndex: 0,
          },
          {
            question: 'What transforms exam anxiety into self-respect?',
            options: [
              'Focusing relentlessly on controllable daily preparation',
              'Comparing scores hourly with others',
              'Avoiding timed practice',
            ],
            correctIndex: 0,
          },
        ],
      },
      {
        id: 'ch-rs-3',
        number: 3,
        title: 'Becoming Antifragile Through Failure',
        banglaTitle: 'ভুল ও ব্যর্থতা থেকে আরও শক্তিশালী হওয়া',
        readTimeMin: 5,
        featuredVocabIds: ['v-antifragile'],
        englishParagraphs: [
          'Page 1 — Fragile things shatter when dropped; resilient things survive shock without changing; antifragile things actually grow stronger because of shock.',
          'Page 2 — When you score 95 instead of 130 on a DET speaking practice or miss 4 math problems, that red mark is free diagnostic gold showing you what to repair BEFORE the real exam day.',
          'Page 3 — Never hide from low practice scores. Thank every early mistake for exposing a gap while there is still time to fix it.',
        ],
        banglaParagraphs: [
          'পৃষ্ঠা ১ — ভঙ্গুর (Fragile) জিনিস আঘাতে ভেঙে যায়; সহনশীল (Resilient) জিনিস আঘাত সহ্য করে টিকে থাকে; আর অ্যান্টিফ্র্যাজাইল (Antifragile) জিনিস আঘাত ও চাপ পেলে আরও শক্তিশালী হয়ে ওঠে।',
          'পৃষ্ঠা ২ — যখন আপনি ডিইটি স্পিকিং প্র্যাকটিসে ১৩০-এর বদলে ৯৫ পান বা গণিতে ৪টি অঙ্ক ভুল করেন, ওই লাল দাগগুলো আসলে পরীক্ষার দিনের আগেই নিজেকে শুধরে নেওয়ার বিনামূল্যের সুবর্ণ সুযোগ।',
          'পৃষ্ঠা ৩ — প্র্যাকটিসে কম নম্বর দেখে লজ্জা পেয়ে পালিয়ে যাবেন না। প্রতিটি প্রাথমিক ভুলকে ধন্যবাদ দিন, কারণ এটি সময় থাকতেই আপনার দুর্বলতা ধরিয়ে দিয়েছে।',
        ],
        quiz: [
          {
            question: 'What does "Antifragile" mean?',
            options: [
              'Growing stronger and sharper as a result of stress and constructive feedback',
              'Breaking immediately under small pressure',
              'Never making any mistakes in practice',
            ],
            correctIndex: 0,
          },
          {
            question: 'How should you treat a low mock test score two months before finals?',
            options: [
              'As a diagnostic map showing exactly what to repair early',
              'As proof you should give up on the subject',
              'As something to hide and never review',
            ],
            correctIndex: 0,
          },
        ],
      },
      {
        id: 'ch-rs-4',
        number: 4,
        title: 'Gratitude, Purpose & Family Legacy',
        banglaTitle: 'কৃতজ্ঞতা, লক্ষ্য ও পরিবারের মর্যাদা',
        readTimeMin: 5,
        featuredVocabIds: ['v-ephemeral'],
        englishParagraphs: [
          'Page 1 — On exhausting nights when chapters feel endless, motivation fades unless it is anchored in a purpose larger than personal comfort.',
          'Page 2 — Remember the quiet sacrifices behind your education and the future impact your knowledge can create for your family and community in Bangladesh.',
          'Page 3 — Gratitude turns "I have to study today" into "I get the privilege to build a powerful mind today."',
        ],
        banglaParagraphs: [
          'পৃষ্ঠা ১ — ক্লান্তিকর রাতগুলোতে যখন মনে হয় সিলেবাস শেষ হচ্ছে না, তখন শুধু ব্যক্তিগত আরামের লক্ষ্য দিয়ে অনুপ্রেরণা ধরে রাখা যায় না; এর জন্য প্রয়োজন আরও বড় ও মহৎ উদ্দেশ্য।',
          'পৃষ্ঠা ২ — আপনার শিক্ষার পেছনে পরিবারের নীরব ত্যাগের কথা মনে করুন এবং ভাবুন আপনার অর্জিত জ্ঞান ভবিষ্যতে আপনার পরিবার ও বাংলাদেশের মানুষের জীবনে কত বড় ইতিবাচক পরিবর্তন আনতে পারে।',
          'পৃষ্ঠা ৩ — কৃতজ্ঞতাবোধ "আমাকে আজ পড়তেই হবে"—এই বাধ্যবাধকতাকে রূপান্তর করে "আজ আমি নিজেকে আরও দক্ষ মানুষ হিসেবে গড়ে তোলার সুযোগ পেয়েছি"—এই আনন্দে।',
        ],
        quiz: [
          {
            question: 'What sustains effort when short-term motivation disappears?',
            options: [
              'A deeper sense of purpose and gratitude',
              'Drinking five cups of coffee',
              'Endless distraction breaks',
            ],
            correctIndex: 0,
          },
          {
            question: 'How does gratitude reframe daily study?',
            options: [
              'From a burden ("have to") to an opportunity ("get to")',
              'It eliminates the need to take notes',
              'It shortens the syllabus automatically',
            ],
            correctIndex: 0,
          },
        ],
      },
      {
        id: 'ch-rs-5',
        number: 5,
        title: 'The Scholar’s Daily Oath',
        banglaTitle: 'একজন আদর্শ শিক্ষার্থীর দৈনিক অঙ্গীকার',
        readTimeMin: 5,
        featuredVocabIds: ['v-equanimity', 'v-antifragile'],
        englishParagraphs: [
          'Page 1 — Greatness is built in ordinary hours when nobody applauds: verifying your tasks honestly, finishing every page of a book rather than skimming summaries, and honoring your word to yourself.',
          'Page 2 — Carry four habits into every week ahead: steady preparation, courageous communication, lifelong reading, and a calm, grateful heart.',
          'Page 3 — You have completed the final page of The Resilient Scholar! Apply these principles inside your Focus Tasks, DET practice, and HSC syllabus starting right now.',
        ],
        banglaParagraphs: [
          'পৃষ্ঠা ১ — শ্রেষ্ঠত্ব গড়ে ওঠে সাধারণ মুহূর্তগুলোতে যখন কেউ হাততালি দেয় না: সৎভাবে কাজ যাচাই করা, কেবল সারাংশ না দেখে পুরো বই পৃষ্ঠা ধরে শেষ করা এবং নিজের কাছে দেওয়া কথা রাখা।',
          'পৃষ্ঠা ২ — সামনের প্রতিটি সপ্তাহে চারটি গুণ সাথে রাখুন: নিয়মিত প্রস্তুতি, আত্মবিশ্বাসী যোগাযোগ, আজীবন পাঠ্যাভ্যাস এবং প্রশান্ত ও কৃতজ্ঞ হৃদয়।',
          'পৃষ্ঠা ৩ — আপনি "দ্য রেজিলিয়েন্ট স্কলার" বইয়ের শেষ পৃষ্ঠাটিও সম্পন্ন করেছেন! এখন থেকেই আপনার ফোকাস টাস্ক, ডিইটি অনুশীলন ও এইচএসসি সিলেবাসে এই নীতিগুলো প্রয়োগ করুন।',
        ],
        quiz: [
          {
            question: 'Where is lasting academic greatness actually built?',
            options: [
              'In quiet, honest daily hours when no one is watching',
              'Only during public award ceremonies',
              'By skipping foundational pages',
            ],
            correctIndex: 0,
          },
          {
            question: 'What four habits form the Scholar’s Oath?',
            options: [
              'Preparation, communication, continuous reading, and calm gratitude',
              'Speed-skimming, multitasking, staying up all night, and comparison',
              'Waiting until exam week to begin',
            ],
            correctIndex: 0,
          },
        ],
      },
    ],
  },
];

export interface ResearchTopicOption {
  id: string;
  title: string;
  field: string;
  summary: string;
}

export const RESEARCH_TOPICS: ResearchTopicOption[] = [
  {
    id: 'topic-microplastics',
    title: 'Low-Cost Biochar Filtration of Microplastics in Dhaka Urban Water Sources',
    field: 'Environmental Chemistry & Engineering',
    summary:
      'Evaluate locally sourced rice-husk biochar columns for removing microplastic particulates from urban runoff.',
  },
  {
    id: 'topic-solar-cold',
    title: 'Solar-Powered IoT Cold Storage Unit for Smallholder Vegetable Farmers in Bangladesh',
    field: 'Physics, Electronics & AgTech',
    summary:
      'Design a low-wattage Peltier/phase-change thermal box monitored via microcontroller sensors to curb post-harvest loss.',
  },
  {
    id: 'topic-mfs-youth',
    title: 'Financial Literacy & Mobile Financial Services (MFS) Adoption Among Bangladeshi HSC Youth',
    field: 'Economics & Behavioral Finance',
    summary:
      'Empirical survey analysis measuring savings behavior, digital fraud awareness, and budgeting habits among college students.',
  },
  {
    id: 'topic-bangla-ocr',
    title: 'Error Pattern Analysis of Open-Source Bangla OCR on Handwritten Historical Manuscripts',
    field: 'Computer Science & Linguistics',
    summary:
      'Benchmark ligature (যুক্তবর্ণ) recognition failure modes and propose synthetic augmentation heuristics.',
  },
];

export const INITIAL_EQUIPMENT_CHECKLIST: EquipmentChecklistItem[] = [
  {
    id: 'eq-1',
    label: 'Google Scholar & Zotero / Mendeley reference manager configured',
    category: 'Equipment & Software',
    checked: true,
  },
  {
    id: 'eq-2',
    label: 'Python / Excel / Google Sheets statistical analysis template ready',
    category: 'Equipment & Software',
    checked: false,
  },
  {
    id: 'eq-3',
    label: 'LaTeX (Overleaf) or structured academic paper template initialized',
    category: 'Equipment & Software',
    checked: false,
  },
  {
    id: 'eq-4',
    label: 'Measurement instruments / digital survey form calibrated & tested',
    category: 'Equipment & Software',
    checked: false,
  },
  {
    id: 'lit-1',
    label: 'Collect 8–12 peer-reviewed papers from 2020–2026 on target problem',
    category: 'Literature Source',
    checked: true,
  },
  {
    id: 'lit-2',
    label: 'Extract Bangladesh local datasets (BBS / DoE / Bangladesh Bank reports)',
    category: 'Literature Source',
    checked: false,
  },
  {
    id: 'lit-3',
    label: 'Identify clear research gap that existing papers have not solved',
    category: 'Literature Source',
    checked: false,
  },
  {
    id: 'meth-1',
    label: 'Define independent, dependent, and control variables clearly',
    category: 'Methodology Step',
    checked: false,
  },
  {
    id: 'meth-2',
    label: 'Draft ethics & consent checklist (if human survey or lab sample)',
    category: 'Methodology Step',
    checked: false,
  },
];

export interface SkillLesson {
  id: string;
  title: string;
  category: string;
  durationMin: number;
  objective: string;
  steps: string[];
  youtubeTitle: string;
  youtubeUrl: string;
  examPrompt: string;
  samplePlaceholder: string;
}

export const DAILY_SKILLS_LIBRARY: SkillLesson[] = [
  {
    id: 'skill-cold-email',
    title: 'Cold-Emailing Professors for High School Research Mentorship',
    category: 'Academic Networking & Scholarships',
    durationMin: 15,
    objective:
      'Write a concise, high-signal 120–160 word outreach email that gets opened and answered by university faculty.',
    steps: [
      'Use a specific, non-generic subject line referencing their exact recent paper or lab topic.',
      'State who you are (HSC student in Bangladesh) and one genuine detail you read in their work.',
      'Propose a tiny, zero-burden ask (e.g., 10-minute feedback on your 1-page research proposal or a specific technical question).',
      'Keep total length under 160 words with zero flattery or attached heavy PDFs on email #1.',
    ],
    youtubeTitle: 'How to Cold Email Professors for Research (Step-by-Step Breakdown)',
    youtubeUrl:
      'https://www.youtube.com/results?search_query=how+to+cold+email+professors+for+research+high+school',
    examPrompt:
      'Write a real cold email (100–170 words) to Dr. Tanvir Ahmed (Environmental Engineering Lab, BUET) asking for brief guidance on your HSC research idea about low-cost biochar water filtration. Include a Subject line.',
    samplePlaceholder:
      'Subject: Question on your 2024 Dhaka water filtration study — HSC student\n\nDear Dr. Ahmed,\n...',
  },
  {
    id: 'skill-latex-math',
    title: 'Writing Clean Scientific Equations & Abstracts in LaTeX',
    category: 'Research & STEM Publishing',
    durationMin: 15,
    objective:
      'Format multi-variable physics/math equations and write a crisp structured scientific abstract.',
    steps: [
      'Separate inline math ($E = mc^2$) from display equations (\\begin{equation}...\\end{equation}).',
      'Use \\frac{num}{den}, \\int_{a}^{b}, and proper Greek symbols (\\Delta, \\theta, \\lambda).',
      'Follow the 4-sentence Abstract formula: Context -> Problem Gap -> Method -> Expected/Measured Result.',
      'Always define units and every symbol used in an equation.',
    ],
    youtubeTitle: 'LaTeX in 15 Minutes for STEM Students & Research Papers',
    youtubeUrl:
      'https://www.youtube.com/results?search_query=latex+tutorial+for+beginners+scientific+papers',
    examPrompt:
      'Write a 4-sentence scientific abstract (around 90–130 words) on any HSC Physics/Chemistry/Economics experiment, AND include at least one properly formatted LaTeX equation (using $...$ or \\frac, \\Delta, etc.) with variables defined.',
    samplePlaceholder:
      'Abstract: Urban heat islands accelerate cooling energy demand...\n\nUsing $Q = m c \\Delta T$, where $m$ is mass...',
  },
  {
    id: 'skill-det-argument',
    title: 'High-Scoring DET & Scholarship Persuasive Essay Hook + Thesis',
    category: 'English Writing & Communication',
    durationMin: 12,
    objective:
      'Craft an authoritative opening paragraph with a nuanced thesis and zero generic clichés ("In today’s modern world...").',
    steps: [
      'Ban filler openers like "Since the dawn of civilization" or "Nowadays technology has many pros and cons."',
      'Start with a concrete tension, statistic, or sharp contrast in 1–2 sentences.',
      'Present a clear, defensible thesis that states both your stance and two supporting pillars.',
      'Use precise academic verbs (mitigate, exacerbate, catalyze, substantiate).',
    ],
    youtubeTitle: 'Duolingo English Test Writing 145+ Strategy & Essay Structure',
    youtubeUrl:
      'https://www.youtube.com/results?search_query=duolingo+english+test+writing+sample+high+score',
    examPrompt:
      'Write an opening paragraph (70–110 words) responding to this prompt: "Should secondary schools replace traditional timed board exams with continuous project-based assessment?" Avoid clichés and end with a clear two-pillar thesis.',
    samplePlaceholder:
      'While standardized board exams offer uniform benchmarking across millions of students, ...',
  },
  {
    id: 'skill-python-pandas',
    title: 'Data Cleaning & Hypothesis Testing Mindset with Python / Sheets',
    category: 'Data Literacy & Analysis',
    durationMin: 15,
    objective:
      'Design a clean data-validation pipeline for survey or lab data before plotting charts.',
    steps: [
      'Inspect missing values, duplicate IDs, and impossible outliers (e.g., negative study hours).',
      'Standardize categorical labels (e.g., "Dhaka", "dhaka ", "DHK" -> "Dhaka").',
      'Separate raw untouched data from cleaned analysis tabs/dataframes.',
      'State both your null hypothesis (H0) and alternative hypothesis (H1) before running comparisons.',
    ],
    youtubeTitle: 'Python Pandas Data Cleaning for Research Beginners',
    youtubeUrl:
      'https://www.youtube.com/results?search_query=python+pandas+data+cleaning+tutorial',
    examPrompt:
      'Suppose you collected 120 survey responses from HSC students about daily phone screen time vs. mock test scores, but 14 rows have blank scores, inconsistent district spellings ("ctg", "Chattogram"), and one entry says "29 hours/day". Describe the exact 4-step cleaning & validation plan (or Python/Sheets logic) you would run before calculating correlation.',
    samplePlaceholder:
      'Step 1: Preserve raw CSV backup...\nStep 2: Normalize district strings...',
  },
];

export const INITIAL_ECAS: EcaEntry[] = [];

export const INITIAL_EVENTS: ReminderEvent[] = [
  {
    id: 'evt-1',
    title: 'HSC Chapter Revision Checkpoint',
    date: new Date(Date.now() + 2 * 86400000).toISOString().slice(0, 10),
    category: 'HSC Exam',
    priority: 'High',
    reminderActive: true,
    notes: 'Complete one full past-paper question set under timed conditions.',
  },
];
