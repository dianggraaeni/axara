import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { generateQuiz, QuizQuestion } from '../services/gemini';
import { useAppStore } from '../store/useAppStore';
import { Loader2, ArrowRight, Check, X, Award, Brain, Image as ImageIcon, Puzzle } from 'lucide-react';

export default function QuestPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const provinceId = searchParams.get('province');
  
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [score, setScore] = useState(0);

  const { addXp, completeQuiz, unlockBadge } = useAppStore();

  const startGame = async (gameId: string) => {
    setSelectedGame(gameId);
    if (gameId === 'guess') {
      setLoading(true);
      try {
        const q = await generateQuiz(provinceId ? provinceId.replace('-', ' ') : 'Indonesia');
        setQuestions(q);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleAnswer = (index: number) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(index);
    const correct = index === questions[currentIndex].correctAnswerIndex;
    setIsCorrect(correct);
    setShowExplanation(true);
    
    if (correct) {
      setScore(s => s + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(c => c + 1);
      setSelectedAnswer(null);
      setIsCorrect(null);
      setShowExplanation(false);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    setIsFinished(true);
    const xpEarned = score * 50;
    addXp(xpEarned);
    if (provinceId) {
      completeQuiz(provinceId);
    }
    
    if (score === questions.length) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#F04E36', '#D4AF37', '#FFFFFF']
      });
      
      if (provinceId) {
        unlockBadge({
          id: `master-${provinceId}`,
          name: `Master of ${provinceId.replace('-', ' ')}`,
          description: `Menyelesaikan quest di ${provinceId.replace('-', ' ')} dengan sempurna.`,
          icon: '👑'
        });
      }
    }
  };

  if (!selectedGame) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="text-center md:text-left">
          <h1 className="text-3xl font-black text-text">AxaraBattle</h1>
          <p className="text-text-light font-medium mt-2">
            {provinceId ? `Pilih mini game untuk menguji pengetahuanmu tentang ${provinceId.replace('-', ' ')}.` : 'Pilih mini game untuk menguji pengetahuan budayamu.'}
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => startGame('guess')}
            className="bg-white border-2 border-cream-dark rounded-3xl p-6 text-left hover:border-primary transition-colors group"
          >
            <div className="w-16 h-16 bg-cream rounded-2xl flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors text-primary">
              <Brain size={32} />
            </div>
            <h3 className="text-xl font-bold text-text mb-2">Guess The Culture</h3>
            <p className="text-text-light font-medium text-sm">Tebak budaya, makanan, dan tradisi dari pertanyaan interaktif.</p>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => alert('Fitur Culture Memory Match akan segera hadir!')}
            className="bg-white border-2 border-cream-dark rounded-3xl p-6 text-left hover:border-primary transition-colors group opacity-70"
          >
            <div className="w-16 h-16 bg-cream rounded-2xl flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors text-primary">
              <ImageIcon size={32} />
            </div>
            <h3 className="text-xl font-bold text-text mb-2">Memory Match</h3>
            <p className="text-text-light font-medium text-sm">Cocokkan kartu gambar budaya dengan daerah asalnya.</p>
            <span className="inline-block mt-4 text-xs font-bold px-2 py-1 bg-cream text-primary rounded-full">Coming Soon</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => alert('Fitur Province Puzzle akan segera hadir!')}
            className="bg-white border-2 border-cream-dark rounded-3xl p-6 text-left hover:border-primary transition-colors group opacity-70"
          >
            <div className="w-16 h-16 bg-cream rounded-2xl flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors text-primary">
              <Puzzle size={32} />
            </div>
            <h3 className="text-xl font-bold text-text mb-2">Province Puzzle</h3>
            <p className="text-text-light font-medium text-sm">Susun potongan peta Indonesia menjadi utuh kembali.</p>
            <span className="inline-block mt-4 text-xs font-bold px-2 py-1 bg-cream text-primary rounded-full">Coming Soon</span>
          </motion.button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <p className="text-text-light font-bold animate-pulse">Axara sedang menyiapkan quest...</p>
      </div>
    );
  }

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
        <h1 className="text-4xl font-black text-text">Quest Selesai!</h1>
        <p className="text-xl text-text-light font-medium">
          Kamu menjawab <span className="text-green-500 font-bold">{score}</span> dari {questions.length} dengan benar.
        </p>
        <div className="bg-cream border-2 border-cream-dark rounded-2xl p-6 w-full max-w-md">
          <p className="text-primary font-bold text-lg mb-1">XP Diperoleh</p>
          <p className="text-4xl font-black text-primary">+{score * 50} XP</p>
        </div>
        <button 
          onClick={() => {
            setIsFinished(false);
            setSelectedGame(null);
            setScore(0);
            setCurrentIndex(0);
          }}
          className="w-full max-w-md py-4 bg-primary text-white font-bold text-lg rounded-2xl hover:bg-primary-hover transition-colors shadow-lg shadow-primary/30"
        >
          Pilih Game Lain
        </button>
      </motion.div>
    );
  }

  const question = questions[currentIndex];

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress Bar */}
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => setSelectedGame(null)} className="text-text-light hover:text-text transition-colors">
          <X size={24} strokeWidth={3} />
        </button>
        <div className="flex-1 h-4 bg-cream-dark rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-primary"
            initial={{ width: `${(currentIndex / questions.length) * 100}%` }}
            animate={{ width: `${((currentIndex + (selectedAnswer !== null ? 1 : 0)) / questions.length) * 100}%` }}
            transition={{ type: 'spring', stiffness: 50 }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-text leading-tight">
          {question?.question}
        </h2>
      </div>

      {/* Options */}
      <div className="space-y-3 mb-8">
        {question?.options.map((opt, idx) => {
          const isSelected = selectedAnswer === idx;
          const isCorrectOption = idx === question.correctAnswerIndex;
          
          let btnClass = "w-full p-4 rounded-2xl border-2 text-left font-bold text-lg transition-all ";
          
          if (selectedAnswer === null) {
            btnClass += "border-cream-dark bg-white hover:border-primary/50 hover:bg-cream text-text";
          } else if (isCorrectOption) {
            btnClass += "border-green-500 bg-green-50 text-green-700";
          } else if (isSelected && !isCorrectOption) {
            btnClass += "border-red-500 bg-red-50 text-red-700";
          } else {
            btnClass += "border-cream-dark bg-cream text-text-light opacity-50";
          }

          return (
            <button
              key={idx}
              onClick={() => handleAnswer(idx)}
              disabled={selectedAnswer !== null}
              className={btnClass}
            >
              <div className="flex justify-between items-center">
                <span>{opt}</span>
                {selectedAnswer !== null && isCorrectOption && <Check className="text-green-500" />}
                {selectedAnswer !== null && isSelected && !isCorrectOption && <X className="text-red-500" />}
              </div>
            </button>
          );
        })}
      </div>

      {/* Explanation & Next Button */}
      <AnimatePresence>
        {showExplanation && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className={`fixed bottom-0 left-0 right-0 md:static p-4 md:p-6 rounded-t-3xl md:rounded-3xl border-t-2 md:border-2 ${
              isCorrect ? 'bg-green-100 border-green-200' : 'bg-red-100 border-red-200'
            }`}
          >
            <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <div>
                <h3 className={`text-xl font-black mb-1 ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                  {isCorrect ? 'Luar Biasa!' : 'Kurang Tepat'}
                </h3>
                <p className={`font-medium ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                  {question.explanation}
                </p>
              </div>
              <button
                onClick={handleNext}
                className={`w-full md:w-auto px-8 py-3 rounded-xl font-bold text-white shadow-lg transition-transform hover:scale-105 active:scale-95 ${
                  isCorrect ? 'bg-green-500 shadow-green-500/30' : 'bg-red-500 shadow-red-500/30'
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
