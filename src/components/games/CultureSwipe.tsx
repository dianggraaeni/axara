// src/components/games/CultureSwipe.tsx
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { X, Loader2, Check, AlertCircle, Clock, Award } from 'lucide-react';
import confetti from 'canvas-confetti';
import { generateCultureSwipeData, SwipeCard } from '../../services/ai.service';

interface CultureSwipeProps {
  provinceId: string;
  onExit: () => void;
  onWin: (score: number, total: number) => void;
}

const SWIPE_THRESHOLD = 100;
const TIME_PER_CARD = 15;

export default function CultureSwipe({ provinceId, onExit, onWin }: CultureSwipeProps) {
  // ========== SEMUA HOOKS HARUS DI ATAS! ==========
  const [cards, setCards] = useState<SwipeCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; explanation: string } | null>(null);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_CARD);
  const [isGameOver, setIsGameOver] = useState(false);

  // SEMUA motion values & transforms HARUS di sini!
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0.5, 1, 1, 1, 0.5]);
  
  // Transforms untuk swipe indicators
  const mitosOpacity = useTransform(x, [-200, 0], [1, 0]);
  const faktaOpacity = useTransform(x, [0, 200], [0, 1]);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const formattedProvinceName = provinceId 
    ? provinceId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    : 'Indonesia';

  // Load data dari AI
  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      setLoading(true);
      try {
        const data = await generateCultureSwipeData(formattedProvinceName);
        if (isMounted) {
          setCards(data);
        }
      } catch (error) {
        console.error('Error loading culture swipe data:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [provinceId]);

  // Timer countdown
  useEffect(() => {
    if (loading || feedback || isGameOver || currentIndex >= cards.length || cards.length === 0) {
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          const currentCard = cards[currentIndex];
          setFeedback({
            isCorrect: false,
            explanation: `⏱️ Waktu habis! ${currentCard?.explanation || ''}`
          });
          if (timerRef.current) clearInterval(timerRef.current);
          return TIME_PER_CARD;
        }
        return t - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex, loading, feedback, isGameOver, cards]);

  // ========== FUNCTIONS ==========
  const handleAnswer = (userAnswerIsFact: boolean) => {
    if (feedback || currentIndex >= cards.length) return;

    const currentCard = cards[currentIndex];
    const isCorrect = userAnswerIsFact === currentCard.isFact;

    if (isCorrect) {
      setScore(s => s + 1);
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#10B981', '#34D399', '#6EE7B7']
      });
    }

    setFeedback({
      isCorrect,
      explanation: currentCard.explanation
    });

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  const handleDragEnd = (_e: any, info: any) => {
    if (feedback) return;

    const swipeDistance = info.offset.x;

    if (Math.abs(swipeDistance) > SWIPE_THRESHOLD) {
      const userAnswer = swipeDistance > 0;
      handleAnswer(userAnswer);
    } else {
      x.set(0);
    }
  };

  const nextCard = () => {
    setFeedback(null);
    setTimeLeft(TIME_PER_CARD);
    x.set(0);

    if (currentIndex < cards.length - 1) {
      setCurrentIndex(c => c + 1);
    } else {
      setIsGameOver(true);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.5 },
        colors: ['#F04E36', '#D4AF37', '#10B981']
      });

      setTimeout(() => {
        onWin(score, cards.length);
      }, 1500);
    }
  };

  // ========== CONDITIONAL RENDERING (AFTER ALL HOOKS!) ==========
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <p className="text-gray-500 font-bold animate-pulse">
          AI menyiapkan pernyataan budaya {formattedProvinceName}...
        </p>
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <AlertCircle className="w-16 h-16 text-red-500" />
        <p className="text-gray-600 font-bold">Gagal memuat data. Coba lagi nanti.</p>
        <button onClick={onExit} className="px-6 py-3 bg-primary text-white rounded-xl font-bold">
          Kembali
        </button>
      </div>
    );
  }

  if (isGameOver) {
    const percentage = Math.round((score / cards.length) * 100);

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center h-[70vh] text-center space-y-6"
      >
        <div className="w-32 h-32 bg-gray-50 rounded-full flex items-center justify-center mb-4 border-4 border-gray-100">
          <Award className="w-16 h-16 text-[#D4AF37]" />
        </div>
        
        <h1 className="text-4xl font-black text-[#0a0a0a]">Game Selesai! 🎊</h1>
        
        <p className="text-xl text-gray-500 font-medium">
          Skor: <span className="text-green-500 font-bold">{score}</span> dari {cards.length}
        </p>
        
        <div className="bg-gray-50 border-2 border-gray-200 rounded-2xl p-6 w-full max-w-md">
          <p className="text-gray-500 font-bold text-lg mb-1">Akurasi</p>
          <p className="text-4xl font-black text-primary">{percentage}%</p>
        </div>

        <button
          onClick={onExit}
          className="w-full max-w-md py-4 bg-primary text-white font-bold text-lg rounded-2xl hover:bg-red-600 transition-colors shadow-lg shadow-red-500/30"
        >
          Kembali ke Menu
        </button>
      </motion.div>
    );
  }

  const currentCard = cards[currentIndex];

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header Progress */}
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onExit} className="text-gray-400 hover:text-gray-600 transition-colors">
          <X size={24} strokeWidth={3} />
        </button>
        
        <div className="flex-1 h-4 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary"
            animate={{ width: `${((currentIndex + (feedback ? 1 : 0)) / cards.length) * 100}%` }}
            transition={{ type: 'spring', stiffness: 50 }}
          />
        </div>
        
        <div className="flex items-center gap-2 shrink-0">
          <Clock className="w-4 h-4 text-gray-400" />
          <span className={`text-sm font-bold ${timeLeft <= 5 ? 'text-red-500' : 'text-gray-500'}`}>
            {timeLeft}s
          </span>
        </div>
        
        <span className="text-sm font-bold text-gray-500 shrink-0">
          {currentIndex + 1}/{cards.length}
        </span>
      </div>

      {!feedback ? (
        <>
          {/* Question Title */}
          <h2 className="text-xl md:text-2xl font-bold text-[#0a0a0a] text-center mb-6">
            Mitos atau Fakta?
          </h2>

          {/* Swipeable Card */}
          <div className="relative h-100 mb-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                onDragEnd={handleDragEnd}
                style={{ x, rotate, opacity }}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                whileTap={{ cursor: 'grabbing' }}
                className="absolute inset-0 cursor-grab"
              >
                <div className="h-full bg-white border-2 border-gray-200 rounded-3xl p-8 flex items-center justify-center text-center shadow-lg hover:shadow-xl transition-shadow">
                  {/* Swipe Indicators - PAKAI VARIABLE YANG SUDAH DIDECLARE! */}
                  <div className="absolute top-6 left-6 right-6 flex justify-between pointer-events-none">
                    <motion.div
                      style={{ opacity: mitosOpacity }}
                      className="bg-red-100 text-red-500 px-4 py-2 rounded-xl font-black text-sm -rotate-12 border-2 border-red-300"
                    >
                      ❌ MITOS
                    </motion.div>
                    <motion.div
                      style={{ opacity: faktaOpacity }}
                      className="bg-green-100 text-green-500 px-4 py-2 rounded-xl font-black text-sm rotate-12 border-2 border-green-300"
                    >
                      ✅ FAKTA
                    </motion.div>
                  </div>

                  {/* Statement */}
                  <p className="text-lg md:text-xl font-bold text-gray-800 leading-relaxed px-4">
                    "{currentCard.statement}"
                  </p>

                  {/* Hint */}
                  <p className="absolute bottom-6 text-gray-400 font-medium text-sm">
                    💡 Geser kartu ke kiri atau kanan
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Answer Buttons */}
          <div className="flex gap-4">
            <button
              onClick={() => handleAnswer(false)}
              className="flex-1 py-4 bg-red-500 hover:bg-red-600 text-white rounded-2xl font-bold text-lg transition-all shadow-lg active:scale-95"
            >
              ❌ MITOS
            </button>
            <button
              onClick={() => handleAnswer(true)}
              className="flex-1 py-4 bg-green-500 hover:bg-green-600 text-white rounded-2xl font-bold text-lg transition-all shadow-lg active:scale-95"
            >
              ✅ FAKTA
            </button>
          </div>
        </>
      ) : (
        /* Feedback Screen */
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-6 rounded-3xl border-2 ${
              feedback.isCorrect ? 'bg-green-100 border-green-200' : 'bg-red-100 border-red-200'
            }`}
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center ${
                  feedback.isCorrect ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                }`}
              >
                {feedback.isCorrect ? <Check size={32} /> : <AlertCircle size={32} />}
              </div>

              <h3
                className={`text-2xl font-black ${
                  feedback.isCorrect ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {feedback.isCorrect ? 'Luar Biasa! 🎉' : 'Kurang Tepat 😅'}
              </h3>

              <p className={`font-medium text-base ${feedback.isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                {feedback.explanation}
              </p>

              <div className="bg-white/50 px-4 py-2 rounded-full">
                <span className="font-bold text-gray-700">
                  Skor: {score}/{currentIndex + 1}
                </span>
              </div>

              <button
                onClick={nextCard}
                className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-transform hover:scale-105 ${
                  feedback.isCorrect ? 'bg-green-500' : 'bg-red-500'
                }`}
              >
                {currentIndex < cards.length - 1 ? 'Lanjut' : 'Lihat Hasil'}
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}