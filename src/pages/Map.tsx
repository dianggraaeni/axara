// src/pages/Map.tsx
// Diupdate: data provinsi dari backend API, bukan hardcode.

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Lock, CheckCircle, X, BookOpen, Music, Home, Utensils, Shirt, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useProvinces } from '../hooks/useBackendData';
import { provincesService } from '../services/provinces.service';

// Koordinat peta tetap hardcode (ini presentasi UI, bukan data bisnis)
const PROVINCE_COORDS: Record<string, { x: number; y: number }> = {
  'bali': { x: 60, y: 70 },
  'jawa-tengah': { x: 45, y: 65 },
  'sumatera-barat': { x: 20, y: 40 },
  'sulawesi-selatan': { x: 65, y: 50 },
  'papua': { x: 85, y: 45 },
};

export default function MapPage() {
  const navigate = useNavigate();
  const { provinces, isLoading, error, refetch } = useProvinces();
  const [selectedProv, setSelectedProv] = useState<any | null>(null);
  const [isVisiting, setIsVisiting] = useState(false);

  const handleSelectProvince = async (prov: any) => {
    if (!prov.userProgress?.isUnlocked) return;
    setSelectedProv(prov);

    // Catat visit jika belum pernah
    if (!prov.userProgress?.isVisited) {
      setIsVisiting(true);
      try {
        await provincesService.visit(prov.id);
        await refetch();
      } catch { /* ignore */ } finally {
        setIsVisiting(false);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 font-bold">{error}</p>
        <button onClick={refetch} className="mt-4 px-6 py-2 bg-primary text-white rounded-xl font-bold">Coba Lagi</button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="text-center md:text-left">
        <h1 className="text-3xl font-black text-text">AxaraWorld</h1>
        <p className="text-text-light font-medium mt-2">Jelajahi keajaiban budaya Nusantara, satu provinsi pada satu waktu.</p>
      </header>

      {/* Map Visualization */}
      <div className="relative w-full aspect-[4/3] md:aspect-[16/9] bg-cream rounded-3xl border-4 border-cream-dark overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#F04E36 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

        {provinces.map((prov: any) => {
          const coords = PROVINCE_COORDS[prov.id];
          if (!coords) return null;
          const isUnlocked = prov.userProgress?.isUnlocked;
          const isCompleted = prov.userProgress?.isCompleted;

          return (
            <motion.button
              key={prov.id}
              whileHover={isUnlocked ? { scale: 1.1 } : {}}
              whileTap={isUnlocked ? { scale: 0.95 } : {}}
              onClick={() => handleSelectProvince(prov)}
              className="absolute flex flex-col items-center gap-2 transform -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${coords.x}%`, top: `${coords.y}%` }}
            >
              <div className={`
                w-14 h-14 rounded-full flex items-center justify-center border-4 shadow-lg
                ${isCompleted ? 'bg-[#D4AF37] border-white text-white' :
                  isUnlocked ? 'bg-primary border-primary-hover text-white' :
                  'bg-cream-dark border-white text-text-light'}
              `}>
                {isCompleted ? <CheckCircle size={24} strokeWidth={3} /> :
                 isUnlocked ? <MapPin size={24} strokeWidth={3} /> :
                 <Lock size={24} strokeWidth={3} />}
              </div>
              <div className={`
                px-3 py-1 rounded-full text-xs font-bold shadow-sm
                ${isUnlocked ? 'bg-white text-text border-2 border-cream-dark' : 'bg-cream text-text-light border-2 border-transparent'}
              `}>
                {prov.name}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Province List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {provinces.map((prov: any) => {
          const progress = prov.userProgress ?? {};
          return (
            <div key={prov.id} className={`p-4 rounded-2xl border-2 ${progress.isUnlocked ? 'border-primary/20 bg-white' : 'border-cream-dark bg-cream opacity-70'}`}>
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg text-text">{prov.name}</h3>
                {progress.isUnlocked ? (
                  <span className="text-xs font-bold px-2 py-1 bg-cream text-primary rounded-full border border-primary/20">
                    {progress.quizzesCompleted ?? 0}/{progress.quizzesTotal ?? 3} Quest
                  </span>
                ) : (
                  <Lock size={16} className="text-text-light" />
                )}
              </div>
              <p className="text-sm text-text-light">{prov.description}</p>
              {progress.isUnlocked && (
                <button
                  onClick={() => handleSelectProvince(prov)}
                  className="mt-4 w-full py-2 bg-cream text-primary font-bold rounded-xl hover:bg-primary hover:text-white border border-primary/20 transition-colors"
                >
                  Eksplorasi Budaya
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Cultural Info Modal */}
      <AnimatePresence>
        {selectedProv && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col border-4 border-cream-dark shadow-2xl"
            >
              <div className="p-6 border-b-2 border-cream-dark flex justify-between items-center bg-cream">
                <div>
                  <h2 className="text-2xl font-black text-text">Eksplorasi {selectedProv.name}</h2>
                  <p className="text-text-light font-medium text-sm">
                    {isVisiting ? 'Mencatat kunjunganmu...' : 'Pelajari budaya sebelum memulai quest!'}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedProv(null)}
                  className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-text-light hover:text-primary hover:bg-cream-dark transition-colors border-2 border-cream-dark"
                >
                  <X size={20} strokeWidth={3} />
                </button>
              </div>

              <div className="p-6 overflow-y-auto flex-1 space-y-6 bg-white">
                {/* Cultural data dari backend (field culture disimpan di DB sebagai JSON) */}
                {selectedProv.culture && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedProv.culture.house && (
                      <div className="bg-cream p-4 rounded-2xl border-2 border-cream-dark">
                        <div className="flex items-center gap-2 mb-2 text-primary"><Home size={20} /><h3 className="font-bold text-text">Rumah Adat</h3></div>
                        <p className="text-text-light font-medium">{selectedProv.culture.house}</p>
                      </div>
                    )}
                    {selectedProv.culture.food && (
                      <div className="bg-cream p-4 rounded-2xl border-2 border-cream-dark">
                        <div className="flex items-center gap-2 mb-2 text-primary"><Utensils size={20} /><h3 className="font-bold text-text">Makanan Khas</h3></div>
                        <p className="text-text-light font-medium">{selectedProv.culture.food}</p>
                      </div>
                    )}
                    {selectedProv.culture.clothing && (
                      <div className="bg-cream p-4 rounded-2xl border-2 border-cream-dark">
                        <div className="flex items-center gap-2 mb-2 text-primary"><Shirt size={20} /><h3 className="font-bold text-text">Pakaian Adat</h3></div>
                        <p className="text-text-light font-medium">{selectedProv.culture.clothing}</p>
                      </div>
                    )}
                    {selectedProv.culture.music && (
                      <div className="bg-cream p-4 rounded-2xl border-2 border-cream-dark">
                        <div className="flex items-center gap-2 mb-2 text-primary"><Music size={20} /><h3 className="font-bold text-text">Alat Musik</h3></div>
                        <p className="text-text-light font-medium">{selectedProv.culture.music}</p>
                      </div>
                    )}
                  </div>
                )}

                {selectedProv.culture?.history && (
                  <div className="bg-cream p-5 rounded-2xl border-2 border-cream-dark">
                    <div className="flex items-center gap-2 mb-3 text-primary"><BookOpen size={20} /><h3 className="font-bold text-text">Sejarah Singkat</h3></div>
                    <p className="text-text-light font-medium leading-relaxed">{selectedProv.culture.history}</p>
                  </div>
                )}

                {/* Jika tidak ada data culture dari backend, tampilkan pesan */}
                {!selectedProv.culture && (
                  <div className="text-center py-8 text-text-light">
                    <p className="font-medium">Informasi budaya akan segera tersedia.</p>
                  </div>
                )}
              </div>

              <div className="p-6 border-t-2 border-cream-dark bg-white">
                <button
                  onClick={() => navigate(`/app/quest?province=${selectedProv.id}`)}
                  className="w-full py-4 bg-primary text-white font-bold text-lg rounded-2xl hover:bg-primary-hover transition-colors shadow-lg shadow-primary/30 flex items-center justify-center gap-2"
                >
                  Mulai Quest <MapPin size={20} />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
