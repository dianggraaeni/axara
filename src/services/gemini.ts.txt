import { GoogleGenAI, Type } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export const generateQuiz = async (province: string, difficulty: 'easy' | 'medium' | 'hard' = 'easy'): Promise<QuizQuestion[]> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a 3-question multiple-choice quiz about the culture, history, traditional food, or clothing of the Indonesian province: ${province}. Difficulty level: ${difficulty}. The language must be Indonesian.`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING, description: 'The quiz question.' },
              options: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: '4 possible answers.',
              },
              correctAnswerIndex: { type: Type.INTEGER, description: 'Index of the correct answer (0-3).' },
              explanation: { type: Type.STRING, description: 'Explanation of why the answer is correct.' },
            },
            required: ['question', 'options', 'correctAnswerIndex', 'explanation'],
          },
        },
      },
    });

    const text = response.text;
    if (!text) throw new Error('No response from AI');
    return JSON.parse(text);
  } catch (error) {
    console.error('Error generating quiz:', error);
    // Fallback quiz
    return [
      {
        question: `Apa ibukota dari ${province}?`,
        options: ['Opsi A', 'Opsi B', 'Opsi C', 'Opsi D'],
        correctAnswerIndex: 0,
        explanation: 'Ini adalah pertanyaan fallback karena AI gagal merespon.',
      }
    ];
  }
};

export const chatWithGuide = async (message: string, history: { role: 'user' | 'model', parts: { text: string }[] }[]) => {
  try {
    const chat = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: 'Kamu adalah Axara, pemandu budaya Nusantara yang ramah, interaktif, dan berpengetahuan luas. Kamu berbicara dengan gaya yang menyenangkan, seperti karakter di game edukasi. Gunakan bahasa Indonesia yang baik, asik, dan mudah dipahami. Berikan informasi menarik tentang budaya, sejarah, makanan, dan tradisi Indonesia.',
      },
      history: history,
    });

    const response = await chat.sendMessage({ message });
    return response.text;
  } catch (error) {
    console.error('Error chatting with guide:', error);
    return 'Maaf, Axara sedang istirahat sebentar. Coba lagi nanti ya!';
  }
};
