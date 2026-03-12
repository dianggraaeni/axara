// src/pages/Quest.tsx
// Soal quiz diambil langsung dari Gemini (konsisten dengan FloatingChat yang sudah bekerja).

import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { generateQuiz } from '../services/ai.service';
import { Loader2, X, Check, Award, Brain, Image as ImageIcon, Sparkles } from 'lucide-react';
import MemoryMatch from '../components/games/MemoryMatch';
import CultureSwipe from '../components/games/CultureSwipe';
import BadgeUnlockModal from '../components/BadgeUnlockModal';

// Tipe lokal
interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  category?: string;
}

type GameId = 'guess' | 'memory' | 'swipe';

// Peta nama provinsi untuk prompt AI yang lebih akurat
const PROVINCE_NAMES: Record<string, string> = {
  'bali': 'Bali',
  'jawa-tengah': 'Jawa Tengah',
  'sumatera-barat': 'Sumatera Barat',
  'sulawesi-selatan': 'Sulawesi Selatan',
  'papua': 'Papua',
  'dki-jakarta': 'DKI Jakarta',
  'jawa-barat': 'Jawa Barat',
  'jawa-timur': 'Jawa Timur',
  'kalimantan-timur': 'Kalimantan Timur',
  'sulawesi-utara': 'Sulawesi Utara',
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
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
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
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((c) => c + 1);
      setSelectedAnswer(null);
      setIsCorrect(null);
      setShowExplanation(false);
    } else {
      // Score akhir dikalkulasi saat soal terakhir dijawab
      onComplete(score + (isCorrect ? 1 : 0), questions.length);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress bar + back */}
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onBack} className="text-gray-400 hover:text-gray-600 transition-colors">
          <X size={24} strokeWidth={3} />
        </button>
        <div className="flex-1 h-4 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary"
            animate={{ width: `${((currentIndex + (selectedAnswer !== null ? 1 : 0)) / questions.length) * 100}%` }}
            transition={{ type: 'spring', stiffness: 50 }}
          />
        </div>
        <span className="text-sm font-bold text-gray-500 shrink-0">
          {currentIndex + 1}/{questions.length}
        </span>
      </div>

      <h2 className="text-2xl md:text-3xl font-bold text-[#0a0a0a] leading-tight mb-8">
        {question?.question}
      </h2>

      <div className="space-y-3 mb-8">
        {question?.options.map((opt, idx) => {
          const isSelected = selectedAnswer === idx;
          const isCorrectOption = idx === question.correctIndex;
          let btnClass = 'w-full p-4 rounded-2xl border-2 text-left font-bold text-lg transition-all ';
          
          if (selectedAnswer === null) {
            btnClass += 'border-gray-200 bg-white hover:border-[#F04E36]/50 hover:bg-red-50 text-[#0a0a0a]';
          } else if (isCorrectOption) {
            btnClass += 'border-green-500 bg-green-50 text-green-700';
          } else if (isSelected && !isCorrectOption) {
            btnClass += 'border-red-500 bg-red-50 text-red-700';
          } else {
            btnClass += 'border-gray-200 bg-gray-50 text-gray-400 opacity-50';
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
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  
  // State untuk Data Akhir
  const [finalScore, setFinalScore] = useState(0);
  const [finalTotal, setFinalTotal] = useState(0);
  const [finalXp, setFinalXp] = useState(0);
  
  // STATE BARU: Menyimpan daftar game apa saja yang sudah diselesaikan
  const [completedGames, setCompletedGames] = useState<string[]>([]);
  
  // State untuk memunculkan Modal Badge
  const [showBadge, setShowBadge] = useState(false);

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
    
    if (provinceId && selectedGame && score > 0) {
      // 1. Masukkan game ini ke daftar "Selesai" (Jika belum ada)
      if (!completedGames.includes(selectedGame)) {
        const newCompleted = [...completedGames, selectedGame];
        setCompletedGames(newCompleted);
        
        // 2. Cek apakah user sudah MENAMATKAN KE-3 GAME?
        if (newCompleted.length === 3) {
          // Buka Master Badge!
          setShowBadge(true);
        } else {
          // Kalau belum 3, ledakkan confetti biasa aja sbg hadiah mini
          if (score === total) confetti({ particleCount: 100, spread: 70, colors: ['#F04E36', '#D4AF37', '#FFFFFF'] });
        }
      } else {
        // Jika game ini sudah pernah dimainkan sebelumnya, kasih confetti aja
        if (score === total) confetti({ particleCount: 100, spread: 70, colors: ['#F04E36', '#D4AF37', '#FFFFFF'] });
      }
    } else {
      // Logic fallback
      if (score === total) confetti({ particleCount: 100, spread: 70, colors: ['#F04E36', '#D4AF37', '#FFFFFF'] });
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
    // Mengecek status tiap game untuk mengubah tampilan tombol
    const isGuessDone = completedGames.includes('guess');
    const isMemoryDone = completedGames.includes('memory');
    const isSwipeDone = completedGames.includes('swipe');

    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="text-center md:text-left">
          <h1 className="text-3xl font-black text-[#0a0a0a]">AxaraBattle</h1>
          <p className="text-gray-500 font-medium mt-2">
            {provinceId
              ? `Selesaikan ke-3 quest untuk mendapatkan Badge Master ${provinceName}!`
              : 'Pilih provinsi di AxaraWorld terlebih dahulu untuk memulai.'}
          </p>
        </header>

        {!provinceId && (
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-4 text-yellow-700 font-medium text-sm">
            ⚠️ Kamu belum memilih provinsi. Kembali ke{' '}
            <button onClick={() => navigate('/app')} className="font-bold underline">AxaraWorld</button>{' '}
            untuk memilih provinsi.
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Guess The Culture */}
          <motion.button
            whileHover={{ scale: 1.02 }} 
            whileTap={{ scale: 0.98 }}
            onClick={startGuessCulture}
            disabled={!provinceId}
            className={`border-2 rounded-3xl p-6 text-left transition-all group disabled:opacity-50 disabled:cursor-not-allowed ${
              isGuessDone ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200 hover:border-primary'
            }`}
          >
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-colors ${
              isGuessDone ? 'bg-green-500 text-white' : 'bg-red-50 text-primary group-hover:bg-primary group-hover:text-white'
            }`}>
              <Brain size={32} />
            </div>
            <h3 className="text-xl font-bold text-[#0a0a0a] mb-2">Guess The Culture</h3>
            <p className="text-gray-500 font-medium text-sm">Tebak budaya, makanan, dan tradisi dari pertanyaan interaktif berbasis AI.</p>
            <div className="mt-4 flex gap-2">
              <span className="text-xs font-bold px-2 py-1 bg-red-50 text-primary rounded-full">+50 XP/soal</span>
              {isGuessDone ? (
                <span className="text-xs font-bold px-2 py-1 bg-green-500 text-white rounded-full">✅ Selesai</span>
              ) : (
                <span className="text-xs font-bold px-2 py-1 bg-green-100 text-green-700 rounded-full">🟢 Live</span>
              )}
            </div>
          </motion.button>

          {/* Memory Match */}
          <motion.button
            whileHover={{ scale: 1.02 }} 
            whileTap={{ scale: 0.98 }}
            onClick={() => provinceId && setSelectedGame('memory')}
            disabled={!provinceId}
            className={`border-2 rounded-3xl p-6 text-left transition-all group disabled:opacity-50 disabled:cursor-not-allowed ${
              isMemoryDone ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200 hover:border-[#D4AF37]'
            }`}
          >
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-colors ${
              isMemoryDone ? 'bg-green-500 text-white' : 'bg-yellow-50 text-[#D4AF37] group-hover:bg-[#D4AF37] group-hover:text-white'
            }`}>
              <ImageIcon size={32} />
            </div>
            <h3 className="text-xl font-bold text-[#0a0a0a] mb-2">Memory Match</h3>
            <p className="text-gray-500 font-medium text-sm">Cocokkan budaya daerah dengan pasangannya yang tepat!</p>
            <div className="mt-4 flex gap-2">
              <span className="text-xs font-bold px-2 py-1 bg-red-50 text-primary rounded-full">+30 XP/pasang</span>
              {isMemoryDone ? (
                <span className="text-xs font-bold px-2 py-1 bg-green-500 text-white rounded-full">✅ Selesai</span>
              ) : (
                <span className="text-xs font-bold px-2 py-1 bg-green-100 text-green-700 rounded-full">🟢 Live</span>
              )}
            </div>
          </motion.button>

          {/* Culture Swipe (BARU!) */}
          <motion.button
            whileHover={{ scale: 1.02 }} 
            whileTap={{ scale: 0.98 }}
            onClick={() => provinceId && setSelectedGame('swipe')}
            disabled={!provinceId}
            className={`border-2 rounded-3xl p-6 text-left transition-all group disabled:opacity-50 disabled:cursor-not-allowed ${
              isSwipeDone ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200 hover:border-[#8B5CF6]'
            }`}
          >
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-colors ${
              isSwipeDone ? 'bg-green-500 text-white' : 'bg-purple-50 text-[#8B5CF6] group-hover:bg-[#8B5CF6] group-hover:text-white'
            }`}>
              <Sparkles size={32} />
            </div>
            <h3 className="text-xl font-bold text-[#0a0a0a] mb-2">Culture Swipe</h3>
            <p className="text-gray-500 font-medium text-sm">Swipe kartu budaya: Mitos atau Fakta? Kayak Quizizz tapi lebih asik!</p>
            <div className="mt-4 flex gap-2">
              <span className="text-xs font-bold px-2 py-1 bg-red-50 text-primary rounded-full">+20 XP/card</span>
              {isSwipeDone ? (
                <span className="text-xs font-bold px-2 py-1 bg-green-500 text-white rounded-full">✅ Selesai</span>
              ) : (
                <span className="text-xs font-bold px-2 py-1 bg-purple-100 text-purple-700 rounded-full">🔥 NEW!</span>
              )}
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
        <p className="text-gray-500 font-bold animate-pulse">AI sedang menyiapkan soal tentang {provinceName}...</p>
      </div>
    );
  }

  // ── Finish Screen ────────────────────────────────────────────────────────
  if (isFinished) {
    return (
      <>
        {/* Tampilkan Modal Badge HANYA SAAT TAMAT 3 GAME */}
        <BadgeUnlockModal 
          isOpen={showBadge} 
          onClose={() => setShowBadge(false)} 
          badgeName={`Master ${provinceName}`} 
          badgeIcon="👑" 
        />
      
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center h-[70vh] text-center space-y-6"
        >
          <div className="w-32 h-32 bg-gray-50 rounded-full flex items-center justify-center mb-4 border-4 border-gray-100">
            <Award className="w-16 h-16 text-[#D4AF37]" />
          </div>
          <h1 className="text-4xl font-black text-[#0a0a0a]">Quest Selesai! 🎊</h1>
          
          <p className="text-xl text-gray-500 font-medium">
            Skor: <span className="text-green-500 font-bold">{finalScore}</span> dari {finalTotal}
          </p>
          
          <div className="bg-gray-50 border-2 border-gray-200 rounded-2xl p-6 w-full max-w-md">
            <p className="text-gray-500 font-bold text-lg mb-1">XP Diperoleh</p>
            <p className="text-4xl font-black text-primary">+{finalXp} XP</p>
          </div>

          <button
            onClick={() => {
              if (completedGames.length === 3) {
                navigate('/app'); // Pindah ke halaman Peta (AxaraWorld)
              } else {
                resetGame(); // Reset layar untuk pilih game lain
              }
            }}
            className="w-full max-w-md py-4 bg-primary text-white font-bold text-lg rounded-2xl hover:bg-red-600 transition-colors shadow-lg shadow-red-500/30"
          >
            {completedGames.length === 3 ? "Kembali ke AxaraWorld" : "Pilih Game Lain"}
          </button>
        </motion.div>
      </>
    );
  }

  // ── Active Games ─────────────────────────────────────────────────────────
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

      {selectedGame === 'swipe' && provinceId && (
        <CultureSwipe
          provinceId={provinceId}
          onWin={(score, total) => finishGame(score, total, 20)}
          onExit={() => setSelectedGame(null)}
        />
      )}
    </div>
  );
}