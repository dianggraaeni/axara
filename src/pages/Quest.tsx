// src/pages/Quest.tsx
// Soal quiz diambil langsung dari Gemini (konsisten dengan FloatingChat yang sudah bekerja).
// XP disimpan lokal di Zustand — sinkronisasi ke backend bisa ditambahkan nanti.

import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { generateQuiz } from '../services/ai.service';
import { Loader2, X, Check, Award, Brain, Image as ImageIcon, Puzzle } from 'lucide-react';
import MemoryMatch from '../components/games/MemoryMatch';
import ProvincePuzzle from '../components/games/ProvincePuzzle';

// Tipe lokal (tidak perlu import dari quests.service lagi)
interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  category?: string;
}

type GameId = 'guess' | 'memory' | 'puzzle';

// Peta nama provinsi untuk prompt AI yang lebih akurat
const PROVINCE_NAMES: Record<string, string> = {
  'bali': 'Bali',
  'jawa-tengah': 'Jawa Tengah',
  'sumatera-barat': 'Sumatera Barat',
  'sulawesi-selatan': 'Sulawesi Selatan',
  'papua': 'Papua',
};

// ─── Guess The Culture Game ───────────────────────────────────────────────────
function GuessCultureGame({
  questions,
  onComplete,
  onBack,
}: {
  questions: QuizQuestion[];
  onComplete: (score: number, total: number) => void;
  onBack: () => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const[selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);

  const question = questions[currentIndex];

  const handleAnswer = (idx: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(idx);
    const correct = idx === question.correctIndex;
    setIsCorrect(correct);
    setShowExplanation(true);
    if (correct) setScore((s) => s + 1);
  };

  const handleNext = () => {
    const currentScore = score + (isCorrect ? 0 : 0); // score sudah terupdate
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((c) => c + 1);
      setSelectedAnswer(null);
      setIsCorrect(null);
      setShowExplanation(false);
    } else {
      onComplete(score + (isCorrect ? 1 : 0), questions.length);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress bar + back */}
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onBack} className="text-text-light hover:text-text transition-colors">
          <X size={24} strokeWidth={3} />
        </button>
        <div className="flex-1 h-4 bg-cream-dark rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary"
            animate={{ width: `${((currentIndex + (selectedAnswer !== null ? 1 : 0)) / questions.length) * 100}%` }}
            transition={{ type: 'spring', stiffness: 50 }}
          />
        </div>
        <span className="text-sm font-bold text-text-light shrink-0">
          {currentIndex + 1}/{questions.length}
        </span>
      </div>

      <h2 className="text-2xl md:text-3xl font-bold text-text leading-tight mb-8">
        {question?.question}
      </h2>

      <div className="space-y-3 mb-8">
        {question?.options.map((opt, idx) => {
          const isSelected = selectedAnswer === idx;
          const isCorrectOption = idx === question.correctIndex;
          let btnClass = 'w-full p-4 rounded-2xl border-2 text-left font-bold text-lg transition-all ';
          if (selectedAnswer === null) {
            btnClass += 'border-cream-dark bg-white hover:border-primary/50 hover:bg-cream text-text';
          } else if (isCorrectOption) {
            btnClass += 'border-green-500 bg-green-50 text-green-700';
          } else if (isSelected && !isCorrectOption) {
            btnClass += 'border-red-500 bg-red-50 text-red-700';
          } else {
            btnClass += 'border-cream-dark bg-cream text-text-light opacity-50';
          }
          return (
            <button key={idx} onClick={() => handleAnswer(idx)} disabled={selectedAnswer !== null} className={btnClass}>
              <div className="flex justify-between items-center">
                <span>{opt}</span>
                {selectedAnswer !== null && isCorrectOption && <Check className="text-green-500" />}
                {selectedAnswer !== null && isSelected && !isCorrectOption && <X className="text-red-500" />}
              </div>
            </button>
          );
        })}
      </div>

      <AnimatePresence>
        {showExplanation && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`fixed bottom-0 left-0 right-0 md:static p-4 md:p-6 rounded-t-3xl md:rounded-3xl border-t-2 md:border-2 ${
              isCorrect ? 'bg-green-100 border-green-200' : 'bg-red-100 border-red-200'
            }`}
          >
            <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <div>
                <h3 className={`text-xl font-black mb-1 ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                  {isCorrect ? 'Luar Biasa! 🎉' : 'Kurang Tepat 😅'}
                </h3>
                <p className={`font-medium ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                  {question.explanation}
                </p>
              </div>
              <button
                onClick={handleNext}
                className={`w-full md:w-auto px-8 py-3 rounded-xl font-bold text-white shadow-lg transition-transform hover:scale-105 ${
                  isCorrect ? 'bg-green-500' : 'bg-red-500'
                }`}
              >
                {currentIndex < questions.length - 1 ? 'Lanjut' : 'Selesai'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main Quest Page ──────────────────────────────────────────────────────────
export default function QuestPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const provinceId = searchParams.get('province');
  const provinceName = provinceId ? (PROVINCE_NAMES[provinceId] ?? provinceId.replace(/-/g, ' ')) : 'Indonesia';

  const [selectedGame, setSelectedGame] = useState<GameId | null>(null);
  const[questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const[finalScore, setFinalScore] = useState(0);
  const [finalTotal, setFinalTotal] = useState(0);
  const [finalXp, setFinalXp] = useState(0);

  const startGuessCulture = async () => {
    if (!provinceId) { alert('Pilih provinsi dahulu di AxaraWorld!'); return; }
    setSelectedGame('guess');
    setLoading(true);
    try {
      const qs = await generateQuiz(provinceName, 3, 'easy');
      setQuestions(qs);
    } catch {
      alert('Gagal memuat soal. Pastikan VITE_GEMINI_API_KEY sudah diset di .env.local');
      setSelectedGame(null);
    } finally {
      setLoading(false);
    }
  };

  const finishGame = (score: number, total: number, xpPerPoint: number) => {
    const xp = score * xpPerPoint;
    setFinalScore(score);
    setFinalTotal(total);
    setFinalXp(xp);
    if (score === total) {
      confetti({ particleCount: 150, spread: 70, colors:['#F04E36', '#D4AF37', '#FFFFFF'] });
    }
    setIsFinished(true);
  };

  const resetGame = () => {
    setIsFinished(false);
    setSelectedGame(null);
    setQuestions([]);
    setFinalXp(0);
    setFinalScore(0);
    setFinalTotal(0);
  };

  // ── Game Selector ────────────────────────────────────────────────────────
  if (!selectedGame) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="text-center md:text-left">
          <h1 className="text-3xl font-black text-text">AxaraBattle</h1>
          <p className="text-text-light font-medium mt-2">
            {provinceId
              ? `Uji pengetahuanmu tentang ${provinceName}.`
              : 'Pilih provinsi di AxaraWorld terlebih dahulu untuk memulai.'}
          </p>
        </header>

        {!provinceId && (
          <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-4 text-amber-700 font-medium text-sm">
            ⚠️ Kamu belum memilih provinsi. Kembali ke{' '}
            <button onClick={() => navigate('/app')} className="font-bold underline">AxaraWorld</button>{' '}
            untuk memilih provinsi.
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Guess The Culture */}
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={startGuessCulture}
            disabled={!provinceId}
            className="bg-white border-2 border-cream-dark rounded-3xl p-6 text-left hover:border-primary transition-colors group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="w-16 h-16 bg-cream rounded-2xl flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors text-primary">
              <Brain size={32} />
            </div>
            <h3 className="text-xl font-bold text-text mb-2">Guess The Culture</h3>
            <p className="text-text-light font-medium text-sm">Tebak budaya, makanan, dan tradisi dari pertanyaan interaktif berbasis AI.</p>
            <div className="mt-4 flex gap-2">
              <span className="text-xs font-bold px-2 py-1 bg-primary/10 text-primary rounded-full">+50 XP/soal</span>
              <span className="text-xs font-bold px-2 py-1 bg-green-100 text-green-700 rounded-full">✅ Live</span>
            </div>
          </motion.button>

          {/* Memory Match */}
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={() => provinceId && setSelectedGame('memory')}
            disabled={!provinceId}
            className="bg-white border-2 border-cream-dark rounded-3xl p-6 text-left hover:border-primary transition-colors group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="w-16 h-16 bg-cream rounded-2xl flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors text-primary">
              <ImageIcon size={32} />
            </div>
            <h3 className="text-xl font-bold text-text mb-2">Memory Match</h3>
            <p className="text-text-light font-medium text-sm">Cocokkan emoji budaya dengan namanya. Temukan semua pasangan!</p>
            <div className="mt-4 flex gap-2">
              <span className="text-xs font-bold px-2 py-1 bg-primary/10 text-primary rounded-full">+30 XP/pasang</span>
              <span className="text-xs font-bold px-2 py-1 bg-green-100 text-green-700 rounded-full">✅ Live</span>
            </div>
          </motion.button>

          {/* Province Puzzle */}
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedGame('puzzle')}
            className="bg-white border-2 border-cream-dark rounded-3xl p-6 text-left hover:border-primary transition-colors group"
          >
            <div className="w-16 h-16 bg-cream rounded-2xl flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors text-primary">
              <Puzzle size={32} />
            </div>
            <h3 className="text-xl font-bold text-text mb-2">Province Puzzle</h3>
            <p className="text-text-light font-medium text-sm">Cocokkan nama provinsi ke posisinya di peta Indonesia.</p>
            <div className="mt-4 flex gap-2">
              <span className="text-xs font-bold px-2 py-1 bg-primary/10 text-primary rounded-full">+25 XP/provinsi</span>
              <span className="text-xs font-bold px-2 py-1 bg-green-100 text-green-700 rounded-full">✅ Live</span>
            </div>
          </motion.button>
        </div>
      </div>
    );
  }

  // ── Loading ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <p className="text-text-light font-bold animate-pulse">AI sedang menyiapkan soal tentang {provinceName}...</p>
      </div>
    );
  }

  // ── Finish Screen ────────────────────────────────────────────────────────
  if (isFinished) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center h-[70vh] text-center space-y-6"
      >
        <div className="w-32 h-32 bg-cream rounded-full flex items-center justify-center mb-4 border-4 border-primary/20">
          <Award className="w-16 h-16 text-primary" />
        </div>
        <h1 className="text-4xl font-black text-text">Quest Selesai! 🎊</h1>
        <p className="text-xl text-text-light font-medium">
          Skor: <span className="text-green-500 font-bold">{finalScore}</span> dari {finalTotal}
        </p>
        <div className="bg-cream border-2 border-cream-dark rounded-2xl p-6 w-full max-w-md">
          <p className="text-primary font-bold text-lg mb-1">XP Diperoleh</p>
          <p className="text-4xl font-black text-primary">+{finalXp} XP</p>
        </div>
        <button
          onClick={resetGame}
          className="w-full max-w-md py-4 bg-primary text-white font-bold text-lg rounded-2xl hover:bg-primary-hover transition-colors shadow-lg shadow-primary/30"
        >
          Main Game Lain
        </button>
      </motion.div>
    );
  }

  // ── Active Games ─────────────────────────────────────────────────────────
  // INI BAGIAN YANG AKU REVISI (Dari onComplete -> onWin, onBack -> onExit)
  return (
    <div className="max-w-4xl mx-auto">
      {selectedGame === 'guess' && questions.length > 0 && (
        <GuessCultureGame
          questions={questions}
          onComplete={(score, total) => finishGame(score, total, 50)}
          onBack={() => setSelectedGame(null)}
        />
      )}

      {selectedGame === 'memory' && provinceId && (
        <MemoryMatch
          provinceId={provinceId}
          onWin={() => finishGame(10, 10, 30)}
          onExit={() => setSelectedGame(null)}
        />
      )}

      {selectedGame === 'puzzle' && (
        <ProvincePuzzle provinceId={provinceId || ''} onExit={resetGame} onWin={() => finishGame(4, 4, 25)} />
      )}
    </div>
  );
}