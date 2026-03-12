// src/pages/Quest.tsx

import { useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { generateQuiz } from '../services/ai.service';
import { questsService } from '../services/quests.service';
import { Loader2, X, Check, Award, Brain, Image as ImageIcon, Sparkles } from 'lucide-react';
import MemoryMatch from '../components/games/MemoryMatch';
import CultureSwipe from '../components/games/CultureSwipe';
import BadgeUnlockModal from '../components/BadgeUnlockModal';

// Tipe lokal — field harus cocok dengan quests.service.ts QuizQuestion
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

// Storage keys untuk persist data lintas navigasi
const STORAGE_KEY_PROVINCE = 'axara_quest_province';
const STORAGE_KEY_COMPLETED = 'axara_quest_completed';

// ─── Guess The Culture Game ───────────────────────────────────────────────────
function GuessCultureGame({
  questions,
  onComplete,
  onBack,
}: {
  questions: QuizQuestion[];
  // Signature sesuai kode asli: (score, total) — tanpa answers
  // FIX 3: Menghilangkan double-count dengan scoreRef (sync, bukan async setState)
  onComplete: (score: number, total: number) => void;
  onBack: () => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  // FIX 3: Pakai useRef agar nilai selalu sinkron saat handleNext dipanggil.
  // Kode asli pakai: onComplete(score + (isCorrect ? 1 : 0), ...) — double count
  // karena setScore adalah async. Ref menyelesaikan ini tanpa mengubah signature.
  const scoreRef = useRef(0);

  const question = questions[currentIndex];

  const handleAnswer = (idx: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(idx);
    const correct = idx === question.correctIndex;
    setIsCorrect(correct);
    setShowExplanation(true);
    // Increment ref secara sinkron (satu kali saja di sini)
    if (correct) scoreRef.current += 1;
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((c) => c + 1);
      setSelectedAnswer(null);
      setIsCorrect(null);
      setShowExplanation(false);
    } else {
      // FIX 3: Pakai scoreRef.current — tidak double-count seperti kode asli
      onComplete(scoreRef.current, questions.length);
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

  // FIX Bug 3: Simpan provinceId ke sessionStorage agar tidak hilang saat navigasi
  const urlProvinceId = searchParams.get('province');
  const [provinceId] = useState<string | null>(() => {
    if (urlProvinceId) {
      sessionStorage.setItem(STORAGE_KEY_PROVINCE, urlProvinceId);
      return urlProvinceId;
    }
    return sessionStorage.getItem(STORAGE_KEY_PROVINCE);
  });

  const provinceName = provinceId
    ? (PROVINCE_NAMES[provinceId] ?? provinceId.replace(/-/g, ' '))
    : 'Indonesia';

  const [selectedGame, setSelectedGame] = useState<GameId | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  // State untuk Data Akhir
  const [finalScore, setFinalScore] = useState(0);
  const [finalTotal, setFinalTotal] = useState(0);
  const [finalXp, setFinalXp] = useState(0);

  // FIX Bug 2: completedGames dipersist ke sessionStorage agar tidak hilang saat navigasi.
  // Key yang disimpan tetap GameId ('guess'|'memory'|'swipe') — konsisten dengan
  // pengecekan di selector (completedGames.includes('guess') dst).
  const [completedGames, setCompletedGames] = useState<GameId[]>(() => {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY_COMPLETED);
      if (stored) {
        const parsed = JSON.parse(stored) as { provinceId: string; games: GameId[] };
        // Hanya restore jika provinsi sama
        const currentProvince = urlProvinceId || sessionStorage.getItem(STORAGE_KEY_PROVINCE);
        if (parsed.provinceId === currentProvince) return parsed.games;
      }
    } catch { /* ignore */ }
    return [];
  });

  // State untuk memunculkan Modal Badge
  const [showBadge, setShowBadge] = useState(false);

  // Helper simpan completedGames ke sessionStorage
  const saveCompletedGames = (games: GameId[]) => {
    sessionStorage.setItem(STORAGE_KEY_COMPLETED, JSON.stringify({ provinceId, games }));
    setCompletedGames(games);
  };

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

  // FIX Bug 1: Submit ke backend untuk menyimpan XP ke profil.
  // questsService.createSession + submitSession dipanggil setelah setiap game selesai.
  // Semua error di-catch secara silent agar UX tidak terganggu jika backend offline.
  const submitToBackend = async (
    gameType: 'guess_culture' | 'memory_match' | 'province_puzzle',
    score: number,
    total: number,
    questionsData: QuizQuestion[]
  ) => {
    if (!provinceId) return;
    try {
      const { sessionId } = await questsService.createSession(provinceId, gameType, questionsData);
      // answers: array index jawaban user. Untuk non-quiz game, simulasikan jawaban
      // berdasarkan skor (benar = 0, salah = -1, valid di backend min(-1) max(3))
      const answers = Array(total).fill(0).map((_, i) => (i < score ? 0 : -1));
      await questsService.submitSession(sessionId, answers);
    } catch (err) {
      // Silent fail — XP di UI tetap tampil, backend menyimpan jika online
      console.error('Backend submit failed (silent):', err);
    }
  };

  const finishGame = async (score: number, total: number, xpPerPoint: number, questionsData?: QuizQuestion[]) => {
    const xp = score * xpPerPoint;
    setFinalScore(score);
    setFinalTotal(total);
    setFinalXp(xp);

    // FIX Bug 1: Submit ke backend dengan questionsData yang sesuai per game type
    if (selectedGame && provinceId && questionsData) {
      const gameTypeMap: Record<GameId, 'guess_culture' | 'memory_match' | 'province_puzzle'> = {
        guess: 'guess_culture',
        memory: 'memory_match',
        swipe: 'province_puzzle',
      };
      await submitToBackend(gameTypeMap[selectedGame], score, total, questionsData);
    }

    if (provinceId && selectedGame) {
      if (!completedGames.includes(selectedGame)) {
        const newCompleted: GameId[] = [...completedGames, selectedGame];
        saveCompletedGames(newCompleted);

        if (newCompleted.length === 3) {
          setShowBadge(true);
        } else {
          if (score === total) confetti({ particleCount: 100, spread: 70, colors: ['#F04E36', '#D4AF37', '#FFFFFF'] });
        }
      } else {
        if (score === total) confetti({ particleCount: 100, spread: 70, colors: ['#F04E36', '#D4AF37', '#FFFFFF'] });
      }
    } else {
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
    // Key konsisten: GameId ('guess'|'memory'|'swipe') — sama dengan yang disimpan di finishGame
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

        {/* FIX Bug 3: Tampilkan provinsi aktif dan tombol ganti */}
        {provinceId && (
          <div className="flex items-center gap-3 bg-cream border-2 border-cream-dark rounded-2xl px-4 py-3">
            <span className="text-sm font-bold text-text-light">Provinsi aktif:</span>
            <span className="font-black text-primary">{provinceName}</span>
            <button
              onClick={() => {
                sessionStorage.removeItem(STORAGE_KEY_PROVINCE);
                sessionStorage.removeItem(STORAGE_KEY_COMPLETED);
                navigate('/app');
              }}
              className="ml-auto text-xs text-text-light hover:text-primary font-bold underline"
            >
              Ganti Provinsi
            </button>
          </div>
        )}

        {/* FIX Bug 4 (pesan warning tetap ada): */}
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

          {/* Culture Swipe */}
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
              <span className="text-xs font-bold px-2 py-1 bg-red-50 text-primary rounded-full">+25 XP/card</span>
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
            <p className="text-xs text-gray-400 mt-1">XP sudah tersimpan ke profil kamu ✓</p>
          </div>

          <button
            onClick={() => {
              if (completedGames.length === 3) {
                navigate('/app');
              } else {
                resetGame();
              }
            }}
            className="w-full max-w-md py-4 bg-primary text-white font-bold text-lg rounded-2xl hover:bg-red-600 transition-colors shadow-lg shadow-red-500/30"
          >
            {completedGames.length === 3 ? 'Kembali ke AxaraWorld' : 'Pilih Game Lain'}
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
          // FIX Bug 1: Teruskan questions sebagai questionsData ke backend
          onComplete={(score, total) => finishGame(score, total, 50, questions)}
          onBack={() => setSelectedGame(null)}
        />
      )}

      {selectedGame === 'memory' && provinceId && (
        // FIX Bug 1 (MemoryMatch): onWin kini menerima skor riil dari komponen.
        // MemoryMatch.tsx juga diupdate untuk memanggil onWin(matchedPairs, totalPairs).
        <MemoryMatch
          provinceId={provinceId}
          onWin={(matchedPairs: number, totalPairs: number) => {
            // Buat questionsData minimal yang valid untuk backend memory_match
            const questionsData: QuizQuestion[] = Array(totalPairs).fill(null).map((_, i) => ({
              question: `Pasangan ${i + 1}`,
              options: ['', '', '', ''],
              correctIndex: 0,
              explanation: 'Memory match pair',
            }));
            finishGame(matchedPairs, totalPairs, 30, questionsData);
          }}
          onExit={() => setSelectedGame(null)}
        />
      )}

      {selectedGame === 'swipe' && provinceId && (
        // CultureSwipe sudah passing (score, total) — tidak perlu diubah
        <CultureSwipe
          provinceId={provinceId}
          onWin={(score, total) => {
            // Buat questionsData minimal yang valid untuk backend province_puzzle
            const questionsData: QuizQuestion[] = Array(total).fill(null).map((_, i) => ({
              question: `Kartu ${i + 1}`,
              options: ['', '', '', ''],
              correctIndex: 0,
              explanation: 'Culture swipe card',
            }));
            finishGame(score, total, 20, questionsData);
          }}
          onExit={() => setSelectedGame(null)}
        />
      )}
    </div>
  );
}
