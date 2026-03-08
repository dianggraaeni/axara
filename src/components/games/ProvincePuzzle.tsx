// src/components/games/ProvincePuzzle.tsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, MapPin } from 'lucide-react';
import confetti from 'canvas-confetti';
import { generatePuzzleData, PuzzlePiece } from '../../services/ai.service';

interface PuzzleProps {
  provinceId: string;
  onExit: () => void;
  onWin: () => void;
}

// Warna khas AXARA
const COLORS =['#D4AF37', '#F04E36', '#10B981'];

// Bentuk (shape) untuk membuat siluet seperti sebuah pulau
const SHAPES = [
  'rounded-t-[3rem] rounded-b-md w-3/4 h-24', // Utara (Melengkung di atas, agak sempit)
  'rounded-xl w-full h-28',                   // Tengah (Lebar dan besar)
  'rounded-b-[3rem] rounded-t-md w-2/3 h-24'  // Selatan (Melengkung di bawah, paling sempit)
];

export default function ProvincePuzzle({ provinceId, onExit, onWin }: PuzzleProps) {
  const [pieces, setPieces] = useState<(PuzzlePiece & { color: string; shape: string })[]>([]);
  const [placed, setPlaced] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const formattedProvinceName = provinceId ? provinceId.replace(/-/g, ' ').toUpperCase() : 'PROVINSI';

  useEffect(() => {
    const loadPuzzle = async () => {
      setLoading(true);
      try {
        const data = await generatePuzzleData(provinceId);
        
        // Memastikan hanya 3 bagian dan menambahkan warna & bentuk
        const shapedPieces = data.slice(0, 3).map((item, index) => ({
          ...item,
          color: COLORS[index % COLORS.length],
          shape: SHAPES[index % SHAPES.length]
        }));
        
        setPieces(shapedPieces);
      } catch (e) {
        console.error("Gagal load puzzle", e);
      } finally {
        setLoading(false);
      }
    };
    if (provinceId) loadPuzzle();
  }, [provinceId]);

  const handlePlace = (id: string) => {
    if (!placed.includes(id)) {
      const newPlaced = [...placed, id];
      setPlaced(newPlaced);
      
      // Jika semua kepingan sudah disusun, MENANG!
      if (newPlaced.length === pieces.length) {
        confetti({ particleCount: 200, spread: 90, origin: { y: 0.5 } });
        setTimeout(onWin, 2000); // Jeda 2 detik biar bisa lihat hasil pulanya utuh
      }
    }
  };

  const handleRemove = (id: string) => {
    // Memungkinkan user membongkar lagi kepingan yang salah pasang
    setPlaced(placed.filter(pId => pId !== id));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-4xl p-6 md:p-8 w-full max-w-2xl shadow-2xl overflow-hidden"
      >
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-[#0a0a0a]">Menyusun {formattedProvinceName}</h2>
            <p className="text-gray-500 font-medium text-sm md:text-base">Satukan kembali wilayah ini menjadi satu kesatuan!</p>
          </div>
          <button onClick={onExit} className="p-3 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        {loading ? (
          <div className="h-80 flex flex-col items-center justify-center">
            <Loader2 className="w-16 h-16 text-[#D4AF37] animate-spin mb-4" />
            <p className="font-bold text-gray-500">AI sedang memotong peta {formattedProvinceName}...</p>
          </div>
        ) : (
          <div className="space-y-8">
            
            {/* AREA DROP: BENTUK SILUET PULAU */}
            <div className="bg-blue-50 border-4 border-blue-100 rounded-3xl p-6 flex flex-col items-center justify-center gap-1 min-h-87.5 relative overflow-hidden">
              <div className="absolute top-4 left-4 text-blue-300 opacity-50"><MapPin size={40} /></div>
              
              {pieces.map((p) => {
                const isPlaced = placed.includes(p.id);
                return (
                  <div 
                    key={`slot-${p.id}`} 
                    className={`border-2 border-dashed transition-all flex items-center justify-center ${p.shape} ${
                      isPlaced ? 'border-transparent' : 'border-gray-400 bg-gray-200/50'
                    }`}
                  >
                    {isPlaced ? (
                      // Kepingan yang sudah terpasang (Animasi Terbang masuk ke sini)
                      <motion.div
                        layoutId={`piece-${p.id}`}
                        onClick={() => handleRemove(p.id)}
                        className="w-full h-full flex flex-col items-center justify-center cursor-pointer text-white shadow-inner"
                        style={{ backgroundColor: p.color, borderRadius: 'inherit' }}
                      >
                        <span className="font-black text-lg md:text-xl drop-shadow-md">{p.name}</span>
                      </motion.div>
                    ) : (
                      <span className="text-gray-400 font-bold text-sm md:text-base">Area {p.name}</span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* KEPINGAN ACAK DI BAWAH */}
            <div className="flex flex-wrap justify-center gap-4 min-h-25]">
              <AnimatePresence>
                {pieces.map(p => {
                  // Sembunyikan kepingan dari bawah jika sudah terpasang
                  if (placed.includes(p.id)) return null; 
                  
                  return (
                    <motion.button
                      layoutId={`piece-${p.id}`}
                      key={`bank-${p.id}`}
                      onClick={() => handlePlace(p.id)}
                      whileHover={{ scale: 1.05, rotate: Math.random() * 6 - 3 }} // Efek miring dikit pas di-hover
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-4 rounded-2xl shadow-xl text-white flex flex-col items-center justify-center cursor-pointer border-b-4 border-black/20"
                      style={{ backgroundColor: p.color }}
                    >
                      <span className="font-black text-lg">{p.name}</span>
                      <span className="text-xs font-medium opacity-90 mt-1 max-w-37.5 truncate">{p.description}</span>
                    </motion.button>
                  )
                })}
              </AnimatePresence>
            </div>

          </div>
        )}
      </motion.div>
    </div>
  );
}