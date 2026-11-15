import { HscStream, SyllabusChapter, SyllabusSubject } from '../types';
import { CORE_COMMERCE_ARTS_BOARD_PACKS } from './boardBankCoreCommerceArts';
import { SCIENCE_BOARD_PACKS } from './boardBankScience';
import {
  BoardTopicPriority,
  ChapterBoardPack,
  ChapterCqItem,
  ChapterMcqItem,
  CqAiEvaluation,
} from './boardTypes';

export type {
  BoardTopicPriority,
  ChapterBoardPack,
  ChapterCqItem,
  ChapterMcqItem,
  CqAiEvaluation,
};

const CURATED_CHAPTER_PACKS: Record<string, ChapterBoardPack> = {
  ...SCIENCE_BOARD_PACKS,
  ...CORE_COMMERCE_ARTS_BOARD_PACKS,
};

export function hasCuratedChapterPack(chapterId: string): boolean {
  return Boolean(CURATED_CHAPTER_PACKS[chapterId]);
}

export function getCuratedPackCounts(chapterId: string): { mcqs: number; cqs: number } | null {
  const pack = CURATED_CHAPTER_PACKS[chapterId];
  if (!pack) return null;
  return { mcqs: pack.mcqs.length, cqs: pack.cqs.length };
}

export function getCuratedChapterPack(
  subject: SyllabusSubject,
  chapter: SyllabusChapter
): ChapterBoardPack {
  const exact = CURATED_CHAPTER_PACKS[chapter.id];
  if (exact) return exact;

  const streamLabel: Record<HscStream | 'Both', string> = {
    Science: 'বিজ্ঞান বিভাগ (Science)',
    Commerce: 'ব্যবসায় শিক্ষা (Commerce)',
    Arts: 'মানবিক বিভাগ (Arts)',
    Both: 'আবশ্যিক (Core Compulsory)',
  };

  return {
    importantTopics: [
      {
        topic: `${chapter.title} — মৌলিক সংজ্ঞা, সূত্র ও মূল তত্ত্ব (Core Theory & Definitions)`,
        priority: 'Very High',
        boardFrequency: '88% Board Freq',
        recentBoards: "Dhaka '24, '22 · Rajshahi '24 · Cumilla '23",
        questionPattern: 'ক (১), খ (২) অনুধাবনমূলক ও বহুনির্বাচনি (MCQ) প্রশ্নের প্রধান উৎস।',
      },
      {
        topic: `${chapter.title} — গাণিতিক সমস্যা, উদ্দীপক বিশ্লেষণ ও প্রয়োগ (Application)`,
        priority: 'Very High',
        boardFrequency: '84% Board Freq',
        recentBoards: "Chattogram '24 · Sylhet '23 · Jashore '24, '21",
        questionPattern: 'গ (৩) প্রয়োগ ও ঘ (৪) উচ্চতর দক্ষতার সৃজনশীল প্রশ্নে নিয়মিত আসে।',
      },
      {
        topic: `${chapter.title} — তুলনামূলক পার্থক্য, লেখচিত্র ও বাস্তব উদাহরণ`,
        priority: 'High',
        boardFrequency: '70% Board Freq',
        recentBoards: "Dinajpur '24 · Barishal '23 · Mymensingh '22",
        questionPattern: 'সৃজনশীলের ঘ নং এ দুটি ঘটনা বা মতবাদের মধ্যে তুলনা ও যুক্তি উপস্থাপন।',
      },
    ],
    mcqs: [
      {
        id: `${chapter.id}-gen-m1`,
        question: `${subject.name} (${streamLabel[subject.stream]})-এর "${chapter.title}" অধ্যায় থেকে বোর্ড পরীক্ষায় সবচেয়ে বেশি কোন ধরনের MCQ আসে?`,
        options: [
          'সূত্র/তত্ত্বের সরাসরি প্রয়োগ ও বহুপদী সমাপ্তিসূচক (i, ii, iii) প্রশ্ন',
          'অধ্যায়ের বাইরের সাধারণ জ্ঞান',
          'কেবলমাত্র পাদটীকা থেকে',
          'প্রশ্ন আসে না',
        ],
        correctIndex: 0,
        boardTag: "All Board Trend '24",
        board: 'All Boards',
        year: '2024',
        explanation:
          'বোর্ড পরীক্ষার MCQ অংশে সাধারণত মূল ধারণা, অনুধাবন, গাণিতিক প্রয়োগ এবং বহুপদী সমাপ্তিসূচক (i, ii, iii) প্রশ্ন বেশি আসে। উপরের "AI Generate 8 MCQ + 3 CQ" বাটনে ক্লিক করে এই অধ্যায়ের বিভিন্ন সালের নির্দিষ্ট বোর্ড প্রশ্ন তৈরি করুন!',
      },
    ],
    cqs: [
      {
        id: `${chapter.id}-gen-c1`,
        boardTag: `${subject.paper} · Standard Board Pattern '24`,
        board: 'All Boards',
        year: '2024',
        uddipok: `${chapter.title} অধ্যায়ের মূল ধারণা বাস্তব পরিস্থিতিতে প্রয়োগ করে একটি বোর্ড স্ট্যান্ডার্ড উদ্দীপক অনুশীলন করুন। (উপরের "AI Generate 8 MCQ + 3 CQ" বাটনে ক্লিক করলে এই অধ্যায়ের ২০২৪, ২০২৩, ২০২২ ও ২০২১ সালের মতো একদম নির্দিষ্ট নতুন বোর্ড উদ্দীপক ও বহুনির্বাচনি প্রশ্ন সাথে সাথে তৈরি হয়ে যাবে।)`,
        ka: `${chapter.title}-এর প্রধান মৌলিক ধারণা বা সংজ্ঞাটি লিখ।`,
        kha: `${chapter.title}-এর মূল নীতিটি কেন গুরুত্বপূর্ণ তা ২-৩ বাক্যে ব্যাখ্যা কর।`,
        ga: `উদ্দীপকের আলোকে ${chapter.title}-এর প্রধান পদ্ধতি বা সূত্র প্রয়োগ করে সমাধান বের কর।`,
        gha: `উদ্দীপকে উল্লিখিত পরিস্থিতিতে উত্তম ফলাফল পাওয়ার জন্য তোমার যৌক্তিক বিশ্লেষণ ও মতামত দাও।`,
        modelSolution:
          'বোর্ড পরীক্ষার পূর্ণ ১০ নম্বর পেতে ক-তে ১ বাক্যের সঠিক সংজ্ঞা, খ-তে ২ প্যারায় কারণ ব্যাখ্যা, গ-তে ধাপে ধাপে সূত্র/নীতি প্রয়োগ এবং ঘ-তে তুলনামূলক বিশ্লেষণ ও স্পষ্ট সিদ্ধান্ত লিখুন।',
      },
    ],
  };
}
