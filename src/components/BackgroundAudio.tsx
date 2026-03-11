// src/components/BackgroundAudio.tsx
import { useState, useEffect, MouseEvent } from 'react';
import useSound from 'use-sound';
import { Volume2, VolumeX } from 'lucide-react';
import { motion } from 'framer-motion';

export default function BackgroundAudio() {
  const [isPlaying, setIsPlaying] = useState(false);
  const[hasInteracted, setHasInteracted] = useState(false);

  // Load sound dari folder public
  const [play, { pause }] = useSound('/sounds/background.mp3', {
    volume: 0.3, // Volume 30% biar gak nutupin suara presentasi kalian nanti
    loop: true,  // Lagunya ngulang terus (autoplay)
  });

  // Trik untuk melewati sistem blokir Autoplay dari Browser
  useEffect(() => {
    const startAudio = () => {
      if (!hasInteracted) {
        setHasInteracted(true);
        setIsPlaying(true);
        play();
      }
    };

    window.addEventListener('click', startAudio);
    
    // Bersihkan event listener kalau komponen dihapus
    return () => window.removeEventListener('click', startAudio);
  }, [hasInteracted, play]);

  // REVISI: Hapus "React." dan gunakan MouseEvent secara langsung
  const togglePlay = (e: MouseEvent) => {
    e.stopPropagation(); // Biar klik tombol ini gak memicu trigger window click
    if (isPlaying) {
      pause();
    } else {
      play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <motion.button
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', delay: 1 }}
      onClick={togglePlay}
      className="fixed bottom-6 left-6 z-100 w-14 h-14 bg-white rounded-full shadow-2xl border-4 border-[#D4AF37] flex items-center justify-center text-primary hover:bg-cream transition-colors group"
      title={isPlaying ? "Matikan Musik" : "Nyalakan Musik"}
    >
      {isPlaying ? (
        // Icon nyala dengan efek animasi kecil
        <motion.div animate={{ scale:[1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 2 }}>
          <Volume2 size={24} className="text-[#D4AF37]" />
        </motion.div>
      ) : (
        <VolumeX size={24} className="text-gray-400" />
      )}
      
      {/* Tooltip Hover biar makin pro */}
      <span className="absolute left-16 opacity-0 group-hover:opacity-100 bg-white text-primary text-xs font-bold px-3 py-1 rounded-lg shadow-md transition-opacity whitespace-nowrap pointer-events-none">
        {isPlaying ? 'Matikan Musik' : 'Nyalakan Musik'}
      </span>
    </motion.button>
  );
}