export interface BoardTopicPriority {
  topic: string;
  priority: 'Very High' | 'High' | 'Medium';
  boardFrequency: string;
  recentBoards: string;
  questionPattern: string;
}

export interface ChapterMcqItem {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  boardTag: string;
  board?: string;
  year?: string;
  explanation: string;
}

export interface ChapterCqItem {
  id: string;
  boardTag: string;
  board?: string;
  year?: string;
  uddipok: string;
  ka: string;
  kha: string;
  ga: string;
  gha: string;
  modelSolution: string;
}

export interface ChapterBoardPack {
  importantTopics: BoardTopicPriority[];
  mcqs: ChapterMcqItem[];
  cqs: ChapterCqItem[];
}

export interface CqAiEvaluation {
  totalMarks: number;
  kaMark: number;
  khaMark: number;
  gaMark: number;
  ghaMark: number;
  strengths: string[];
  improvements: string[];
  boardTip: string;
}
