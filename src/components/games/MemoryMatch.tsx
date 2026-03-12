// src/components/games/MemoryMatch.tsx
// FIX Bug 1: onWin(matchedPairs, totalPairs) — kirim skor riil ke Quest.tsx.
// Sebelumnya: onWin() tanpa argumen, Quest hardcode finishGame(10, 10, 30).

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Loader2, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { generateMemoryMatchData } from '../../services/ai.service';

interface Card {
  id: number;
  content: string;
  isFlipped: boolean;
  isMatched: boolean;
}

interface MemoryMatchProps {
  provinceId: string;
  // FIX: Sekarang menerima (matchedPairs, totalPairs) sebagai skor riil
  onWin: (matchedPairs: number, totalPairs: number) => void;
  onExit: () => void;
}

export default function MemoryMatch({ provinceId, onExit, onWin }: MemoryMatchProps) {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  // FIX: Simpan jumlah total pasang dari AI response
  const [totalPairs, setTotalPairs] = useState(0);

  const formattedProvinceName = provinceId
    ? provinceId.replace(/-/g, ' ').toUpperCase()
    : 'PROVINSI';

  const initGame = async () => {
    setLoading(true);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    try {
      const data = await generateMemoryMatchData(provinceId || 'Indonesia');

      // FIX: Simpan jumlah pasang riil dari AI
      setTotalPairs(data.length);

      let deck: Card[] = [];
      data.forEach((item: any, index: number) => {
        deck.push({ id: index, content: item.term, isFlipped: false, isMatched: false });
        deck.push({ id: index, content: item.hint || item.deskripsi, isFlipped: false, isMatched: false });
      });

      setCards(deck.sort(() => Math.random() - 0.5));
    } catch (error) {
      console.error('Gagal load AI data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initGame();
  }, [provinceId]);

  const handleFlip = (index: number) => {
    if (flipped.length === 2 || flipped.includes(index) || matched.includes(index)) return;

    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      if (cards[newFlipped[0]].id === cards[newFlipped[1]].id) {
        setMatched((prev) => [...prev, ...newFlipped]);
        setFlipped([]);
      } else {
        setTimeout(() => setFlipped([]), 1000);
      }
    }
  };

  // FIX: Hitung pasang riil lalu kirim ke onWin(matchedPairs, totalPairs)
  useEffect(() => {
    if (cards.length > 0 && matched.length === cards.length) {
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.5 },
        colors: ['#F04E36', '#D4AF37', '#10B981'],
      });

      // matched.length / 2 = jumlah pasang yang berhasil (tiap pasang = 2 kartu)
      const matchedPairs = matched.length / 2;

      setTimeout(() => {
        // FIX: Kirim skor riil ke Quest.tsx
        onWin(matchedPairs, totalPairs);
      }, 1500);
    }
  }, [matched, cards, onWin, totalPairs]);

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
        <div className="bg-white rounded-3xl p-8 shadow-2xl flex flex-col items-center">
          <Loader2 className="w-16 h-16 text-[#D4AF37] animate-spin mb-4" />
          <p className="font-bold text-gray-600">AI menyiapkan kartu Memory untuk {formattedProvinceName}...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white p-6 md:p-8 rounded-4xl border-2 border-cream-dark shadow-2xl max-w-4xl w-full"
      >
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-[#D4AF37]">Memory Match</h2>
            <p className="text-gray-500 font-medium">Cocokkan budaya khas {formattedProvinceName}</p>
          </div>
          <div className="flex gap-2">
            {/* Pakai initGame() bukan window.location.reload() agar state tidak rusak */}
            <button onClick={initGame} className="p-3 hover:bg-gray-100 rounded-full transition-colors">
              <RefreshCw size={24} />
            </button>
            <button onClick={onExit} className="p-3 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors">
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
          {cards.map((card, i) => {
            const isFlipped = flipped.includes(i) || matched.includes(i);
            return (
              <motion.div
                key={i}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleFlip(i)}
                className={`h-36 md:h-48 flex items-center justify-center p-3 md:p-4 rounded-2xl cursor-pointer text-center font-bold shadow-md transition-all duration-300 text-xs md:text-sm leading-snug overflow-hidden ${
                  matched.includes(i)
                    ? 'bg-green-500 text-white'
                    : isFlipped
                    ? 'bg-[#D4AF37] text-white'
                    : 'bg-gray-100 text-transparent hover:bg-gray-200'
                }`}
              >
                <span className="line-clamp-6">
                  {isFlipped ? card.content : '?'}
                </span>
              </motion.div>
            );
          })}
        </div>

        <div className="text-center font-bold text-gray-500 bg-gray-50 py-3 rounded-xl border-2 border-dashed border-gray-200">
          Total Langkah: <span className="text-primary text-xl">{moves}</span>
          {totalPairs > 0 && (
            <span className="ml-4 text-green-600">
              Pasang: {matched.length / 2}/{totalPairs}
            </span>
          )}
        </div>
      </motion.div>
    </div>
  );
}
