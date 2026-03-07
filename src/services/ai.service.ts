// src/services/ai.service.ts
// Semua fitur AI menggunakan Gemini SDK langsung dari frontend.
// Pola yang dipakai IDENTIK dengan FloatingChat yang sudah terbukti bekerja.

import { GoogleGenAI } from '@google/genai';

const geminiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!geminiKey) {
  console.error('❌ VITE_GEMINI_API_KEY tidak ditemukan di .env.local');
}

const ai = new GoogleGenAI({ apiKey: geminiKey ?? '' });

// ─── Chat (dipakai ChatPage dan FloatingChat) ─────────────────────────────────
export const chatWithGuide = async (
  message: string,
  history: { role: 'user' | 'model'; parts: { text: string }[] }[],
  contextProvince?: string
): Promise<string> => {
  try {
    const systemInstruction = contextProvince
      ? `Kamu adalah Axara, pemandu budaya Nusantara yang ramah. Jawab dalam bahasa Indonesia yang asik. Fokus pada budaya, sejarah, dan tradisi Indonesia. Saat ini pengguna sedang mengeksplorasi provinsi: ${contextProvince}.`
      : 'Kamu adalah Axara, pemandu budaya Nusantara yang ramah. Jawab dalam bahasa Indonesia yang asik. Fokus pada budaya, sejarah, dan tradisi Indonesia.';

    const chat = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: { systemInstruction },
      history,
    });

    const response = await chat.sendMessage({ message });
    return response.text ?? 'Maaf, tidak ada respons dari AI.';
  } catch (error) {
    console.error('Chat AI error:', error);
    return 'Maaf, Axara sedang istirahat sebentar. Coba lagi nanti ya! 😊';
  }
};

// Alias untuk FloatingChat
export const chatWithGuideFallback = chatWithGuide;

// ─── Quiz Generator ───────────────────────────────────────────────────────────
export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  category?: string;
}

export const generateQuiz = async (
  provinceName: string,
  count: number = 3,
  difficulty: 'easy' | 'medium' | 'hard' = 'easy'
): Promise<QuizQuestion[]> => {
  try {
    // Pakai chats.create() — IDENTIK dengan pola FloatingChat yang bekerja
    const chat = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction:
          'Kamu adalah pembuat soal kuis budaya Indonesia. Kamu HANYA membalas dengan JSON murni, tanpa penjelasan, tanpa markdown, tanpa backtick.',
      },
      history: [],
    });

    const prompt = `Buat ${count} soal pilihan ganda tentang budaya, sejarah, makanan, atau pakaian adat dari ${provinceName}.
Tingkat kesulitan: ${difficulty}.
Balas HANYA dengan JSON array, tidak ada teks lain. Format:
[{"question":"...","options":["A","B","C","D"],"correctIndex":0,"explanation":"...","category":"food"}]`;

    const response = await chat.sendMessage({ message: prompt });
    const text = response.text ?? '';

    // Bersihkan markdown jika ada
    const cleaned = text.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(cleaned) as QuizQuestion[];

    if (!Array.isArray(parsed) || parsed.length === 0) throw new Error('Invalid quiz format');
    return parsed;
  } catch (error) {
    console.error('Quiz generation error:', error);
    return [
      {
        question: `Apa tarian tradisional yang terkenal dari ${provinceName}?`,
        options: ['Tari Kecak', 'Tari Saman', 'Tari Piring', 'Tari Reog'],
        correctIndex: 1,
        explanation: 'AI gagal merespons. Pastikan VITE_GEMINI_API_KEY sudah benar di .env.local dan coba refresh halaman.',
        category: 'culture',
      },
    ];
  }
};

// ─── Story Generator ──────────────────────────────────────────────────────────
export const generateStory = async (
  provinceName: string,
  theme: string = 'adventure'
): Promise<string> => {
  try {
    const chat = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: 'Kamu adalah penulis cerita petualangan budaya Indonesia yang kreatif.',
      },
      history: [],
    });

    const response = await chat.sendMessage({
      message: `Buat cerita petualangan singkat (150-200 kata) tentang ${provinceName} dengan tema "${theme}". Sudut pandang orang kedua (kamu). Bahasa Indonesia yang asik untuk remaja. Sertakan fakta budaya nyata.`,
    });

    return response.text ?? 'Cerita tidak tersedia saat ini.';
  } catch (error) {
    console.error('Story generation error:', error);
    return `Petualanganmu di ${provinceName} dimulai! Sayangnya panduan cerita sedang beristirahat. Coba lagi nanti.`;
  }
};