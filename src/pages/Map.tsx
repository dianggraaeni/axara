import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppStore } from '../store/useAppStore';
import { MapPin, Lock, CheckCircle, X, BookOpen, Music, Home, Utensils, Shirt } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PROVINCES = [
  { 
    id: 'bali', 
    name: 'Bali', 
    description: 'Pulau Dewata dengan budaya Hindu yang kental.', 
    x: 60, y: 70,
    culture: {
      house: 'Gapura Candi Bentar',
      food: 'Ayam Betutu, Sate Lilit',
      clothing: 'Payas Agung',
      music: 'Gamelan Bali, Ceng-ceng',
      history: 'Bali memiliki sejarah panjang yang dipengaruhi oleh budaya Hindu-Buddha dari Jawa, terutama pada masa runtuhnya Kerajaan Majapahit abad ke-15.'
    }
  },
  { 
    id: 'jawa-tengah', 
    name: 'Jawa Tengah', 
    description: 'Pusat kebudayaan Jawa dan Candi Borobudur.', 
    x: 45, y: 65,
    culture: {
      house: 'Rumah Joglo',
      food: 'Gudeg, Lumpia, Tempe Mendoan',
      clothing: 'Kebaya, Jawi Jangkep',
      music: 'Gamelan Jawa, Siter',
      history: 'Jawa Tengah adalah pusat dari kerajaan-kerajaan besar Nusantara seperti Mataram Kuno, yang membangun mahakarya Candi Borobudur dan Prambanan.'
    }
  },
  { 
    id: 'sumatera-barat', 
    name: 'Sumatera Barat', 
    description: 'Rumah Gadang dan kuliner Rendang yang mendunia.', 
    x: 20, y: 40,
    culture: {
      house: 'Rumah Gadang',
      food: 'Rendang, Sate Padang',
      clothing: 'Bundo Kanduang',
      music: 'Saluang, Talempong',
      history: 'Wilayah ini dikenal dengan budaya Minangkabau yang menganut sistem kekerabatan matrilineal terbesar di dunia.'
    }
  },
  { 
    id: 'sulawesi-selatan', 
    name: 'Sulawesi Selatan', 
    description: 'Suku Bugis-Makassar dan kapal Pinisi.', 
    x: 65, y: 50,
    culture: {
      house: 'Rumah Tongkonan (Toraja), Balla (Makassar)',
      food: 'Coto Makassar, Sop Saudara',
      clothing: 'Baju Bodo',
      music: 'Kecapi, Kesok-Kesok',
      history: 'Terkenal dengan pelaut ulung dari suku Bugis dan Makassar yang menjelajah lautan dengan kapal Pinisi sejak berabad-abad lalu.'
    }
  },
  { 
    id: 'papua', 
    name: 'Papua', 
    description: 'Kekayaan alam dan budaya yang eksotis.', 
    x: 85, y: 45,
    culture: {
      house: 'Honai',
      food: 'Papeda, Ikan Kuah Kuning',
      clothing: 'Koteka, Rok Rumbai',
      music: 'Tifa, Pikon',
      history: 'Papua memiliki ratusan suku dengan bahasa dan tradisi yang unik, menjadikannya salah satu wilayah paling beragam secara budaya di dunia.'
    }
  },
];

export default function MapPage() {
  const { provinces } = useAppStore();
  const navigate = useNavigate();
  const [selectedProv, setSelectedProv] = useState<typeof PROVINCES[0] | null>(null);

  return (
    <div className="space-y-8">
      <header className="text-center md:text-left">
        <h1 className="text-3xl font-black text-text">AxaraWorld</h1>
        <p className="text-text-light font-medium mt-2">Jelajahi keajaiban budaya Nusantara, satu provinsi pada satu waktu.</p>
      </header>

      {/* Map Visualization */}
      <div className="relative w-full aspect-[4/3] md:aspect-[16/9] bg-cream rounded-3xl border-4 border-cream-dark overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#F04E36 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
        
        {PROVINCES.map((prov) => {
          const progress = provinces[prov.id] || { isUnlocked: false, completedQuizzes: 0, totalQuizzes: 3 };
          const isUnlocked = progress.isUnlocked;
          const isCompleted = progress.completedQuizzes >= progress.totalQuizzes;

          return (
            <motion.button
              key={prov.id}
              whileHover={isUnlocked ? { scale: 1.1 } : {}}
              whileTap={isUnlocked ? { scale: 0.95 } : {}}
              onClick={() => isUnlocked && setSelectedProv(prov)}
              className="absolute flex flex-col items-center gap-2 transform -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${prov.x}%`, top: `${prov.y}%` }}
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {PROVINCES.map((prov) => {
          const progress = provinces[prov.id] || { isUnlocked: false, completedQuizzes: 0, totalQuizzes: 3 };
          return (
            <div key={prov.id} className={`p-4 rounded-2xl border-2 ${progress.isUnlocked ? 'border-primary/20 bg-white' : 'border-cream-dark bg-cream opacity-70'}`}>
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg text-text">{prov.name}</h3>
                {progress.isUnlocked ? (
                  <span className="text-xs font-bold px-2 py-1 bg-cream text-primary rounded-full border border-primary/20">
                    {progress.completedQuizzes}/{progress.totalQuizzes} Quest
                  </span>
                ) : (
                  <Lock size={16} className="text-text-light" />
                )}
              </div>
              <p className="text-sm text-text-light">{prov.description}</p>
              {progress.isUnlocked && (
                <button 
                  onClick={() => setSelectedProv(prov)}
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
                  <p className="text-text-light font-medium text-sm">Pelajari budaya sebelum memulai quest!</p>
                </div>
                <button 
                  onClick={() => setSelectedProv(null)}
                  className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-text-light hover:text-primary hover:bg-cream-dark transition-colors border-2 border-cream-dark"
                >
                  <X size={20} strokeWidth={3} />
                </button>
              </div>

              <div className="p-6 overflow-y-auto flex-1 space-y-6 bg-white">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-cream p-4 rounded-2xl border-2 border-cream-dark">
                    <div className="flex items-center gap-2 mb-2 text-primary">
                      <Home size={20} /> <h3 className="font-bold text-text">Rumah Adat</h3>
                    </div>
                    <p className="text-text-light font-medium">{selectedProv.culture.house}</p>
                  </div>
                  <div className="bg-cream p-4 rounded-2xl border-2 border-cream-dark">
                    <div className="flex items-center gap-2 mb-2 text-primary">
                      <Utensils size={20} /> <h3 className="font-bold text-text">Makanan Khas</h3>
                    </div>
                    <p className="text-text-light font-medium">{selectedProv.culture.food}</p>
                  </div>
                  <div className="bg-cream p-4 rounded-2xl border-2 border-cream-dark">
                    <div className="flex items-center gap-2 mb-2 text-primary">
                      <Shirt size={20} /> <h3 className="font-bold text-text">Pakaian Adat</h3>
                    </div>
                    <p className="text-text-light font-medium">{selectedProv.culture.clothing}</p>
                  </div>
                  <div className="bg-cream p-4 rounded-2xl border-2 border-cream-dark">
                    <div className="flex items-center gap-2 mb-2 text-primary">
                      <Music size={20} /> <h3 className="font-bold text-text">Alat Musik</h3>
                    </div>
                    <p className="text-text-light font-medium">{selectedProv.culture.music}</p>
                  </div>
                </div>

                <div className="bg-cream p-5 rounded-2xl border-2 border-cream-dark">
                  <div className="flex items-center gap-2 mb-3 text-primary">
                    <BookOpen size={20} /> <h3 className="font-bold text-text">Sejarah Singkat</h3>
                  </div>
                  <p className="text-text-light font-medium leading-relaxed">{selectedProv.culture.history}</p>
                </div>
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
