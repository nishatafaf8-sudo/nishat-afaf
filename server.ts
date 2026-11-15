import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: '12mb' }));

const PORT = 3000;

function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured in environment secrets.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'elevora-server' });
});

app.post('/api/evaluate-skill', async (req, res) => {
  try {
    const {
      skillTitle,
      lessonObjective,
      promptQuestion,
      studentSubmission,
      studentName,
      studentClass,
    } = req.body ?? {};

    if (!studentSubmission || typeof studentSubmission !== 'string' || studentSubmission.trim().length < 10) {
      return res.status(400).json({
        error: 'Please write a complete practical submission (at least 10 characters) before submitting.',
      });
    }

    const ai = getGeminiClient();

    const prompt = [
      `Evaluate a practical skill exam submission from an HSC student in Bangladesh.`,
      `Student: ${studentName || 'HSC Student'} (${studentClass || 'HSC'})`,
      `Skill Module: ${skillTitle || 'Practical Skill'}`,
      `Lesson Objective: ${lessonObjective || ''}`,
      `Exam Prompt: ${promptQuestion || ''}`,
      `Student Submission:\n"""\n${studentSubmission.trim()}\n"""`,
      `Be honest, constructive, specific, and direct. Do not flatter vague or incomplete work. Identify concrete strengths, actionable weaknesses, and give one improved model example.`,
    ].join('\n\n');

    const response = await ai.models.generateContent({
      model: 'gemini-4-hydrogen',
      contents: prompt,
      config: {
        systemInstruction:
          'You are a strict yet supportive senior academic & career mentor for ambitious 11th and 12th grade HSC students. Grade fairly on a 0-100 scale. Give clear, concise, actionable critique with zero fluff.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: {
              type: Type.INTEGER,
              description: 'Numeric score from 0 to 100 reflecting accuracy, clarity, and execution.',
            },
            verdict: {
              type: Type.STRING,
              description: 'Short 2-4 word assessment label such as Needs Revision, Solid Foundation, or Distinction Ready.',
            },
            strengths: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: '2-3 specific things done well in the submission.',
            },
            improvements: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: '2-3 concrete flaws or gaps to fix immediately.',
            },
            nextAction: {
              type: Type.STRING,
              description: 'One immediate next practice step the student should do today.',
            },
            revisedExample: {
              type: Type.STRING,
              description: 'A concise improved version or reference solution snippet for comparison.',
            },
          },
          required: ['score', 'verdict', 'strengths', 'improvements', 'nextAction', 'revisedExample'],
        },
      },
    });

    const rawText = response.text;
    if (!rawText) {
      return res.status(502).json({ error: 'The AI Examiner returned an empty response. Please try again.' });
    }

    return res.json(JSON.parse(rawText));
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to evaluate submission.';
    console.error('Skill evaluation error:', err);
    return res.status(500).json({ error: message });
  }
});

app.post('/api/evaluate-det', async (req, res) => {
  try {
    const { mode, prompt, studentText, audioBase64, mimeType, timeSpentSec } = req.body ?? {};
    const ai = getGeminiClient();

    if (mode === 'speaking') {
      if (!audioBase64 && (!studentText || studentText.trim().length < 5)) {
        return res.status(400).json({
          error: 'Please record your spoken response (or provide a transcript) before submitting.',
        });
      }

      const instructionText = [
        `You are an official Duolingo English Test (DET) Speaking Examiner evaluating an HSC student.`,
        `Speaking Prompt: "${prompt}"`,
        `Time spoken: ${timeSpentSec || 30} seconds.`,
        studentText ? `Browser speech-to-text draft (may have minor transcription noise): "${studentText}"` : '',
        `Listen carefully to the student's spoken audio (if provided) and evaluate Pronunciation, Fluency, Grammar Accuracy, Lexical Range, and Relevance on the official 10–160 DET scale.`,
        `Be honest and realistic: short, hesitant, or off-topic responses should score lower (60-100); fluent, clear, well-structured answers should score 115-155.`,
      ]
        .filter(Boolean)
        .join('\n\n');

      const parts: Array<{ text: string } | { inlineData: { mimeType: string; data: string } }> = [];
      if (audioBase64 && mimeType) {
        parts.push({
          inlineData: {
            mimeType,
            data: audioBase64,
          },
        });
      }
      parts.push({ text: instructionText });

      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: { parts },
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              score: { type: Type.INTEGER, description: 'DET Speaking score from 10 to 160 (in multiples of 5 ideally).' },
              cefrLevel: { type: Type.STRING, description: 'CEFR level e.g. B1, B2, C1, or C2.' },
              transcriptDetected: { type: Type.STRING, description: 'Clean transcript of what the student actually said.' },
              fluencyAndPronunciation: { type: Type.STRING, description: 'Specific feedback on pace, pauses, intonation, and clarity.' },
              vocabularyAndGrammar: { type: Type.STRING, description: 'Specific feedback on sentence variety, word choice, and grammar mistakes.' },
              improvements: { type: Type.ARRAY, items: { type: Type.STRING }, description: '2-3 concrete tips to boost DET Speaking score.' },
              modelResponse: { type: Type.STRING, description: 'A concise Band 145+ model spoken response for comparison.' },
            },
            required: [
              'score',
              'cefrLevel',
              'transcriptDetected',
              'fluencyAndPronunciation',
              'vocabularyAndGrammar',
              'improvements',
              'modelResponse',
            ],
          },
        },
      });

      const raw = response.text;
      if (!raw) return res.status(502).json({ error: 'Empty AI response.' });
      return res.json(JSON.parse(raw));
    }

    // Writing / Production evaluation
    if (!studentText || typeof studentText !== 'string' || studentText.trim().length < 20) {
      return res.status(400).json({
        error: 'Please write at least 20 characters for an accurate DET Writing evaluation.',
      });
    }

    const writingPrompt = [
      `You are an official Duolingo English Test (DET) Writing Examiner.`,
      `Task Prompt: "${prompt}"`,
      `Time Spent: ${timeSpentSec || 180} seconds.`,
      `Student Essay:\n"""\n${studentText.trim()}\n"""`,
      `Grade honestly on the 10–160 DET scale based on grammatical accuracy, lexical sophistication, task relevance, coherence, and sentence complexity.`,
    ].join('\n\n');

    const response = await ai.models.generateContent({
      model: 'gemini-4-hydrogen',
      contents: writingPrompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.INTEGER, description: 'DET Writing score from 10 to 160.' },
            cefrLevel: { type: Type.STRING, description: 'CEFR level e.g. B1, B2, C1, C2.' },
            strengths: { type: Type.ARRAY, items: { type: Type.STRING }, description: '2-3 specific strengths.' },
            grammarFixes: { type: Type.ARRAY, items: { type: Type.STRING }, description: '2-3 exact grammar or phrasing corrections from the essay.' },
            feedback: { type: Type.STRING, description: 'Overall honest examiner assessment.' },
            improvedSample: { type: Type.STRING, description: 'A Band 145+ rewritten version of their argument.' },
          },
          required: ['score', 'cefrLevel', 'strengths', 'grammarFixes', 'feedback', 'improvedSample'],
        },
      },
    });

    const raw = response.text;
    if (!raw) return res.status(502).json({ error: 'Empty AI response.' });
    return res.json(JSON.parse(raw));
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to evaluate DET attempt.';
    console.error('DET evaluation error:', err);
    return res.status(500).json({ error: message });
  }
});

app.post('/api/board-practice', async (req, res) => {
  try {
    const { action, subjectName, chapterTitle, stream, paper, cq, studentAnswer } = req.body ?? {};
    const ai = getGeminiClient();

    if (action === 'evaluate-cq') {
      if (!studentAnswer || typeof studentAnswer !== 'string' || studentAnswer.trim().length < 15) {
        return res.status(400).json({
          error: 'Please write your CQ answer (ক, খ, গ, ঘ) before requesting AI grading.',
        });
      }

      const evalPrompt = [
        `Evaluate an HSC Bangladesh Board Creative Question (সৃজনশীল প্রশ্ন - 10 marks) answer.`,
        `Subject: ${subjectName} (${stream || 'HSC'} · ${paper || ''})`,
        `Chapter: ${chapterTitle}`,
        `Uddipok / Stem: ${cq?.uddipok || ''}`,
        `Questions:\nক (1): ${cq?.ka || ''}\nখ (2): ${cq?.kha || ''}\nগ (3): ${cq?.ga || ''}\nঘ (4): ${cq?.gha || ''}`,
        `Student Answer:\n"""\n${studentAnswer.trim()}\n"""`,
        `Grade strictly using NCTB Bangladesh Board rubric: ক=1, খ=2, গ=3, ঘ=4 (Total 10). Respond clearly in helpful Bangla + English academic style.`,
      ].join('\n\n');

      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: evalPrompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              totalMarks: { type: Type.INTEGER, description: 'Total marks out of 10.' },
              kaMark: { type: Type.INTEGER, description: 'Mark for ক (0 or 1).' },
              khaMark: { type: Type.INTEGER, description: 'Mark for খ (0 to 2).' },
              gaMark: { type: Type.INTEGER, description: 'Mark for গ (0 to 3).' },
              ghaMark: { type: Type.INTEGER, description: 'Mark for ঘ (0 to 4).' },
              strengths: { type: Type.ARRAY, items: { type: Type.STRING }, description: '2 specific things done well.' },
              improvements: { type: Type.ARRAY, items: { type: Type.STRING }, description: '2-3 specific gaps to get full 10/10.' },
              boardTip: { type: Type.STRING, description: 'One concise NCTB board examiner tip.' },
            },
            required: ['totalMarks', 'kaMark', 'khaMark', 'gaMark', 'ghaMark', 'strengths', 'improvements', 'boardTip'],
          },
        },
      });

      const raw = response.text;
      if (!raw) return res.status(502).json({ error: 'Empty AI response.' });
      return res.json(JSON.parse(raw));
    }

    const { existingCount = 0, focusBoard = 'All', focusYear = 'All' } = req.body ?? {};

    const boardHint =
      focusBoard && focusBoard !== 'All'
        ? `Prioritize ${focusBoard} Board style questions.`
        : `Spread questions across diverse Bangladesh Education Boards (Dhaka, Rajshahi, Chattogram, Cumilla, Sylhet, Jashore, Dinajpur, Barishal, Mymensingh).`;

    const yearHint =
      focusYear && focusYear !== 'All'
        ? `Prioritize HSC ${focusYear} style questions.`
        : `Spread questions across multiple HSC exam years ('24, '23, '22, '21, '19, '18).`;

    const mcqCount = Number(existingCount) > 0 ? 6 : 8;
    const cqCount = Number(existingCount) > 0 ? 2 : 3;

    // Default action: generate rich chapter-specific multi-year board analysis + MCQs + CQs
    const genPrompt = [
      `You are a senior Bangladesh NCTB HSC Board Question Analyst & Examiner.`,
      `Generate a chapter-wise, multi-year authentic Board Question Bank & Analysis strictly for:`,
      `Subject: ${subjectName}`,
      `Chapter: ${chapterTitle}`,
      `Stream: ${stream || 'HSC'} | Level: ${paper || 'HSC'}`,
      Number(existingCount) > 0
        ? `NOTE: The student already practiced ${existingCount} questions in this chapter — create ${mcqCount} COMPLETELY NEW non-overlapping MCQs and ${cqCount} NEW CQs from different sub-topics and years.`
        : '',
      `Requirements:`,
      `1. Identify 3-4 highest-yield Board Exam topics specifically inside "${chapterTitle}" (ranked by board exam frequency, including recent board references and whether they appear in গ/ঘ CQ or MCQ).`,
      `2. Create ${mcqCount} authentic HSC Board-level MCQs strictly from "${chapterTitle}". ${boardHint} ${yearHint} Include 4 distinct options, exact correctIndex (0-3), exact board (one of: Dhaka, Rajshahi, Chattogram, Cumilla, Sylhet, Jashore, Dinajpur, Barishal, Mymensingh), exact 4-digit year (e.g., "2024", "2023", "2022", "2021", "2019", "2018"), formatted boardTag (e.g., "Dhaka Board '24"), and clear explanation (Bangla/English matching subject medium).`,
      `3. Create ${cqCount} authentic HSC Board-standard Creative Questions (সৃজনশীল প্রশ্ন) strictly from "${chapterTitle}" across different years/boards, each with board, year, boardTag, realistic Uddipok (উদ্দীপক), ক (১), খ (২), গ (৩), ঘ (৪), and a detailed step-by-step model solution.`,
    ]
      .filter(Boolean)
      .join('\n');

    const response = await ai.models.generateContent({
      model: 'gemini-4-hydrogen',
      contents: genPrompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            importantTopics: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  topic: { type: Type.STRING },
                  priority: { type: Type.STRING, description: 'Very High, High, or Medium' },
                  boardFrequency: { type: Type.STRING, description: 'e.g., 92% Board Freq' },
                  recentBoards: { type: Type.STRING, description: "e.g., Dhaka '24, '23 · Rajshahi '22" },
                  questionPattern: { type: Type.STRING, description: 'Which CQ/MCQ questions come from this topic.' },
                },
                required: ['topic', 'priority', 'boardFrequency', 'recentBoards', 'questionPattern'],
              },
            },
            mcqs: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING },
                  options: { type: Type.ARRAY, items: { type: Type.STRING } },
                  correctIndex: { type: Type.INTEGER },
                  board: { type: Type.STRING },
                  year: { type: Type.STRING },
                  boardTag: { type: Type.STRING },
                  explanation: { type: Type.STRING },
                },
                required: ['question', 'options', 'correctIndex', 'board', 'year', 'boardTag', 'explanation'],
              },
            },
            cqs: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  board: { type: Type.STRING },
                  year: { type: Type.STRING },
                  boardTag: { type: Type.STRING },
                  uddipok: { type: Type.STRING },
                  ka: { type: Type.STRING },
                  kha: { type: Type.STRING },
                  ga: { type: Type.STRING },
                  gha: { type: Type.STRING },
                  modelSolution: { type: Type.STRING },
                },
                required: ['board', 'year', 'boardTag', 'uddipok', 'ka', 'kha', 'ga', 'gha', 'modelSolution'],
              },
            },
          },
          required: ['importantTopics', 'mcqs', 'cqs'],
        },
      },
    });

    const raw = response.text;
    if (!raw) return res.status(502).json({ error: 'Empty AI response.' });
    return res.json(JSON.parse(raw));
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to process board practice request.';
    console.error('Board practice error:', err);
    return res.status(500).json({ error: message });
  }
});

app.post('/api/ai-teacher', async (req, res) => {
  try {
    const {
      subject,
      stream,
      question,
      imageBase64,
      mimeType,
      visualMode,
      history,
    } = req.body ?? {};

    const cleanQuestion = typeof question === 'string' ? question.trim() : '';
    if (!cleanQuestion && !imageBase64) {
      return res.status(400).json({
        error: 'Please ask a question or upload a photo of your problem.',
      });
    }

    const ai = getGeminiClient();

    const historyText = Array.isArray(history)
      ? history
          .slice(-4)
          .map(
            (h: { role?: string; text?: string }) =>
              `${h.role === 'user' ? 'Student' : 'Professor Mochi'}: ${String(h.text || '').slice(0, 400)}`
          )
          .join('\n')
      : '';

    const instructionText = [
      `You are Professor Mochi, an expert, friendly HSC teacher in Bangladesh covering Science, Commerce, Arts, ICT, English, and Bangla.`,
      `Active Subject: ${subject || 'General HSC'} (${stream || 'All Streams'})`,
      historyText ? `Recent Context:\n${historyText}` : '',
      `Student Question: ${cleanQuestion || 'Please analyze the uploaded problem image and explain the complete step-by-step solution.'}`,
      visualMode
        ? `VISUAL EXPLANATION MODE IS ON: Generate a crisp, educational dark-mode SVG diagram (valid <svg viewBox="0 0 600 320" xmlns="http://www.w3.org/2000/svg"> with dark slate background #09090b, bright readable strokes #38bdf8, #818cf8, #facc15, #34d399, clear labels with font-size="13" fill="#f4f4f5", arrows/curves/boxes/axes illustrating the concept, geometry, circuit, graph, flow, or T-account cleanly without any <script> tags).`
        : `Visual mode is optional; leave visualSvg empty string unless helpful.`,
      `Reply clearly in the student's preferred style (Bangla/Banglish/English mix matching how Bangladeshi HSC students study). Break formulas and steps clearly.`,
    ]
      .filter(Boolean)
      .join('\n\n');

    const parts: Array<{ text: string } | { inlineData: { mimeType: string; data: string } }> = [];
    if (imageBase64 && mimeType) {
      parts.push({
        inlineData: {
          mimeType,
          data: imageBase64,
        },
      });
    }
    parts.push({ text: instructionText });

    const response = await ai.models.generateContent({
      model: 'gemini-4-hydrogen',
      contents: { parts },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            answer: {
              type: Type.STRING,
              description: 'Clear, thorough teacher explanation addressing the student doubt or uploaded image.',
            },
            keyFormulaOrRule: {
              type: Type.STRING,
              description: 'The core formula, theorem, grammar rule, or accounting principle to remember.',
            },
            stepByStep: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: '3-5 clear sequential solution or concept breakdown steps.',
            },
            visualSvg: {
              type: Type.STRING,
              description:
                'Complete self-contained dark-mode <svg viewBox="0 0 600 320" ...>...</svg> diagram string when visualMode is true, or empty string.',
            },
            visualCaption: {
              type: Type.STRING,
              description: 'Short caption explaining what the visual diagram illustrates.',
            },
            followUpQuestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: '2-3 smart follow-up questions the student might want to ask next.',
            },
          },
          required: [
            'answer',
            'keyFormulaOrRule',
            'stepByStep',
            'visualSvg',
            'visualCaption',
            'followUpQuestions',
          ],
        },
      },
    });

    const raw = response.text;
    if (!raw) return res.status(502).json({ error: 'Empty AI Teacher response.' });
    return res.json(JSON.parse(raw));
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'AI Teacher failed to respond.';
    console.error('AI Teacher error:', err);
    return res.status(500).json({ error: message });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Elevora server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
