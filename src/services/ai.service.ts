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
    let text = response.text ?? '';
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();

    const parsed = JSON.parse(text) as QuizQuestion[];

    if (!Array.isArray(parsed) || parsed.length === 0) throw new Error('Invalid quiz format');
    return parsed;
  } catch (error) {
    console.error('Quiz generation error:', error);
    // REVISI FALLBACK: Menggunakan nama provinsi secara dinamis agar logis
    const name = provinceName || 'Nusantara';
    return[
      {
        question: `[SOAL DARURAT] Saat ini AI sedang terkena limit server. Namun coba tebak, Semboyan negara Indonesia adalah...`,
        options:['Tut Wuri Handayani', 'Bhinneka Tunggal Ika', 'Pancasila', 'Kartika Eka Paksi'],
        correctIndex: 1,
        explanation: 'Bhinneka Tunggal Ika berarti berbeda-beda tetapi tetap satu jua. (Tunggu sekitar 1 menit agar AI normal kembali).',
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

    const prompt = `Berikan 4 pasang budaya asli yang SANGAT SPESIFIK (bukan nama generik) dari provinsi ${provinceName}. 
Gunakan nama asli daerah tersebut (Contoh: "Tari Pendet", "Ayam Betutu", "Pura Besakih").
ATURAN KERAS: Isi "hint" MAKSIMAL 5 KATA.
Balas WAJIB dalam format JSON array murni. Format:[
  {"term": "Nama Budaya Asli", "hint": "Deskripsi singkat"}
]`;

    const response = await chat.sendMessage({ message: prompt });
    let text = response.text ?? '';
    
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    return JSON.parse(text) as MemoryPair[];
  } catch (error) {
    console.error('Memory match data error (AI Limit/Error):', error);
    const name = provinceName || 'Nusantara';
    return[
      { term: `Tarian Khas ${name}`, hint: `Seni tari tradisional dari ${name}` },
      { term: `Kuliner ${name}`, hint: `Makanan khas dari ${name}` },
      { term: `Pusaka ${name}`, hint: `Senjata tradisional dari ${name}` },
      { term: `Adat ${name}`, hint: `Tradisi asli dari ${name}` }
    ];
  }
};

// ─── Province Puzzle Generator (SUDAH DIGANTI CULTURE SWIPE DI QUEST) ─────────
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
    let text = response.text ?? '';
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(text) as PuzzlePiece[];
  } catch (error) {
    console.error('Puzzle data error:', error);
    const name = provinceName || 'Nusantara';
    return[
      { id: "p1", name: `Ikon ${name}`, description: `Bagian tengah ${name}` },
      { id: "p2", name: `Wilayah Adat`, description: `Bagian utara ${name}` },
      { id: "p3", name: `Situs Sejarah`, description: `Bagian selatan ${name}` }
    ];
  }
};

// ─── Culture Swipe Generator (MITOS ATAU FAKTA) ────────────────────────────────
export interface SwipeCard {
  statement: string;
  isFact: boolean;
  explanation: string;
}

export const generateCultureSwipeData = async (provinceName: string): Promise<SwipeCard[]> => {
  try {
    const chat = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: 'Kamu adalah pembuat soal trivia budaya. Balas HANYA dengan JSON array murni tanpa backticks.',
      },
      history:[],
    });

    const prompt = `Buat 5 pernyataan (Mitos atau Fakta) tentang budaya, sejarah, atau tradisi KHUSUS DARI PROVINSI ${provinceName}.
Pastikan ada pernyataan yang BENAR (Fakta) dan ada yang SALAH (Mitos/mengecoh).
Balas HANYA dalam format JSON array murni. Format:[{"statement": "...", "isFact": true/false, "explanation": "Penjelasan singkat maks 15 kata"}]`;

    const response = await chat.sendMessage({ message: prompt });
    let text = response.text ?? '';
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    return JSON.parse(text) as SwipeCard[];
  } catch (error) {
    console.error('Culture swipe error:', error);
    // Data darurat jika AI kena Limit
    const name = provinceName || 'Nusantara';
    return[
      { statement: `Semua penduduk asli ${name} tinggal di rumah panggung.`, isFact: false, explanation: "Bentuk rumah adat beragam, tidak semuanya panggung." },
      { statement: `${name} memiliki tradisi yang diwariskan turun-temurun.`, isFact: true, explanation: "Tradisi lisan sangat kuat di seluruh wilayah Nusantara." },
      { statement: `Pakaian adat ${name} hanya boleh dipakai oleh bangsawan.`, isFact: false, explanation: "Pakaian adat kini bisa dipakai oleh semua kalangan." }
    ];
  }
};