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
    const chat = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction:
          'Kamu adalah pembuat soal kuis budaya Indonesia. Kamu HANYA membalas dengan JSON murni, tanpa penjelasan, tanpa markdown, tanpa backtick.',
      },
      history:[],
    });

    const prompt = `Buat ${count} soal pilihan ganda tentang budaya, sejarah, makanan, atau pakaian adat dari ${provinceName}.
Tingkat kesulitan: ${difficulty}.
Balas HANYA dengan JSON array, tidak ada teks lain. Format:
[{"question":"...","options":["A","B","C","D"],"correctIndex":0,"explanation":"...","category":"food"}]`;

    const response = await chat.sendMessage({ message: prompt });
    const text = response.text ?? '';

    const cleaned = text.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(cleaned) as QuizQuestion[];

    if (!Array.isArray(parsed) || parsed.length === 0) throw new Error('Invalid quiz format');
    return parsed;
  } catch (error) {
    console.error('Quiz generation error:', error);
    return[
      {
        question: `Apa tarian tradisional yang terkenal dari ${provinceName}?`,
        options:['Tari Kecak', 'Tari Saman', 'Tari Piring', 'Tari Reog'],
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
      history:[],
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

// ─── Memory Match Generator ───────────────────────────────────────────────────
export interface MemoryPair {
  term: string;
  hint: string;
}

export const generateMemoryMatchData = async (provinceName: string): Promise<MemoryPair[]> => {
  try {
    const chat = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: 'Kamu adalah ahli budaya Indonesia. Balas HANYA dengan JSON array murni tanpa penjelasan tambahan.',
      },
      history:[],
    });

    // PROMPT DIPERBAIKI BIAR AI KASIH DATA ASLI YANG SPESIFIK
    const prompt = `Berikan 4 pasang budaya asli yang SANGAT SPESIFIK (bukan nama generik) dari provinsi ${provinceName}. 
Gunakan nama asli daerah tersebut (Contoh: "Tari Pendet", "Ayam Betutu", "Pura Besakih").
Balas WAJIB dalam format JSON array murni. Format:[
  {"term": "Nama Budaya Asli", "hint": "Deskripsi singkat"}
]`;

    const response = await chat.sendMessage({ message: prompt });
    let text = response.text ?? '';
    
    // Pembersihan JSON yang lebih kuat
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    return JSON.parse(text) as MemoryPair[];
  } catch (error) {
    console.error('Memory match data error (AI Limit/Error):', error);
    // Data cadangan jika AI limit/error
    const name = provinceName || 'Nusantara';
    return[
      { term: `Tarian Khas ${name}`, hint: `Seni tari tradisional dari ${name}` },
      { term: `Kuliner ${name}`, hint: `Makanan khas dari ${name}` },
      { term: `Pusaka ${name}`, hint: `Senjata tradisional dari ${name}` },
      { term: `Adat ${name}`, hint: `Tradisi asli dari ${name}` }
    ];
  }
};

// ─── Province Puzzle Generator ────────────────────────────────────────────────
export interface PuzzlePiece {
  id: string;
  name: string;
  description: string;
}

export const generatePuzzleData = async (provinceName: string): Promise<PuzzlePiece[]> => {
  try {
    const chat = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: 'Kamu adalah pembuat data puzzle provinsi Indonesia. Balas HANYA dengan JSON array murni.',
      },
      history:[],
    });

    const prompt = `Buat 3 bagian/wilayah/ikon penting dari provinsi ${provinceName} yang bisa dijadikan kepingan puzzle.
    Balas HANYA dengan JSON array:[{"id": "bagian1", "name": "...", "description": "..."}, ...]`;

    const response = await chat.sendMessage({ message: prompt });
    const text = response.text ?? '';
    const cleaned = text.replace(/```json|```/g, '').trim();
    return JSON.parse(cleaned) as PuzzlePiece[];
  } catch (error) {
    console.error('Puzzle data error:', error);
    // REVISI FALLBACK
    const name = provinceName || 'Nusantara';
    return[
      { id: "p1", name: `Ikon ${name}`, description: `Bagian tengah ${name}` },
      { id: "p2", name: `Wilayah Adat`, description: `Bagian utara ${name}` },
      { id: "p3", name: `Situs Sejarah`, description: `Bagian selatan ${name}` }
    ];
  }
};