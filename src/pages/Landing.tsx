import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { 
  Map, Swords, MessageCircle, Award, 
  ChevronDown, Star, Send, Instagram, Linkedin, Mail,
  Compass, BookOpen, Target, Trophy, ArrowRight,
  Flame, Menu, X
} from 'lucide-react';
import { useState } from 'react';
import FloatingChat from '../components/FloatingChat';

const floatingIcons = [
  { icon: '🏛️', label: 'Borobudur', delay: 0 },
  { icon: '🦎', label: 'Komodo', delay: 0.1 },
  { icon: '🌺', label: 'Rafflesia', delay: 0.2 },
  { icon: '🎭', label: 'Wayang', delay: 0.3 },
  { icon: '👘', label: 'Batik', delay: 0.4 },
  { icon: '🏠', label: 'Rumah Gadang', delay: 0.5 },
  { icon: '🎋', label: 'Angklung', delay: 0.6 },
  { icon: '⛩️', label: 'Bali Temple', delay: 0.7 },
  { icon: '🌋', label: 'Bromo', delay: 0.8 },
  { icon: '🍛', label: 'Rendang', delay: 0.9 },
  { icon: '🐅', label: 'Harimau', delay: 1.0 },
  { icon: '🪘', label: 'Gamelan', delay: 1.1 },
  { icon: '🗡️', label: 'Keris', delay: 1.2 },
  { icon: '🦅', label: 'Garuda', delay: 1.3 },
  { icon: '🛶', label: 'Phinisi', delay: 1.4 },
];

const features = [
  {
    id: 'world',
    title: 'AxaraWorld — Explore Map',
    description: 'Buka peta Indonesia, klik provinsi, dan temukan budaya seperti rumah adat, makanan, pakaian, alat musik, hingga sejarah singkat. Selesaikan eksplorasi untuk membuka quest!',
    icon: Map,
    color: 'bg-primary',
    lightColor: 'bg-white',
    textColor: 'text-primary'
  },
  {
    id: 'battle',
    title: 'AxaraBattle — Mini Games',
    description: 'Uji pengetahuanmu di 3 game seru: Culture Memory Match (cocokkan kartu budaya), Guess The Culture (tebak gambar yang perlahan muncul), dan Province Puzzle (susun peta Indonesia).',
    icon: Swords,
    color: 'bg-primary',
    lightColor: 'bg-white',
    textColor: 'text-primary'
  },
  {
    id: 'verse',
    title: 'AxaraVerse — AI Story',
    description: 'Tanya AI tentang sejarah budaya atau mainkan mode "Story Adventure" di mana kamu menjadi karakter dalam cerita sejarah interaktif layaknya game RPG ringan.',
    icon: MessageCircle,
    color: 'bg-primary',
    lightColor: 'bg-white',
    textColor: 'text-primary'
  },
  {
    id: 'badge',
    title: 'AxaraBadge — Progress System',
    description: 'Kumpulkan XP dari menjelajah provinsi, menyelesaikan game, dan membaca budaya. Naikkan levelmu dan koleksi badge dari seluruh Nusantara!',
    icon: Award,
    color: 'bg-primary',
    lightColor: 'bg-white',
    textColor: 'text-primary'
  }
];

const steps = [
  { icon: Compass, label: 'Jelajahi Provinsi' },
  { icon: BookOpen, label: 'Pelajari Budaya' },
  { icon: Target, label: 'Selesaikan Quest' },
  { icon: Star, label: 'Dapatkan XP' },
  { icon: Award, label: 'Buka Badge' },
  { icon: Trophy, label: 'Naik Peringkat' },
];

const testimonials = [
  {
    name: 'Budi S.',
    role: 'Pelajar',
    text: 'Platform ini membuat belajar budaya Indonesia terasa seperti bermain game.',
    avatar: '/avatar-budi.png'
  },
  {
    name: 'Ibu Ratna',
    role: 'Guru',
    text: 'Cara yang indah untuk memperkenalkan budaya Nusantara kepada generasi muda.',
    avatar: '/avatar-ratna.png'
  },
  {
    name: 'Sarah M.',
    role: 'Wisatawan',
    text: 'Saya menemukan begitu banyak tradisi unik yang tidak pernah saya ketahui sebelumnya.',
    avatar: '/avatar-sarah.png'
  }
];

const faqs = [
  { q: 'Apa itu AXARA?', a: 'AXARA adalah platform gamifikasi di mana Anda menjelajahi budaya Indonesia melalui peta interaktif, quest, dan cerita berbasis AI.' },
  { q: 'Bagaimana sistem XP bekerja?', a: 'Anda mendapatkan XP dengan menyelesaikan quest budaya, mini-game, dan berinteraksi dengan panduan AI. Kumpulkan XP untuk naik level dan membuka badge.' },
  { q: 'Apakah platform ini gratis?', a: 'Ya! AXARA sepenuhnya gratis digunakan bagi siapa saja yang ingin belajar tentang budaya Indonesia.' },
  { q: 'Bisakah saya menjelajahi semua provinsi?', a: 'Kami terus menambahkan lebih banyak provinsi. Saat ini, Anda dapat menjelajahi beberapa wilayah utama, dan lebih banyak lagi akan segera hadir!' },
  { q: 'Apakah AXARA menggunakan AI?', a: 'Ya, AXARA menggunakan AI untuk menghasilkan kuis dinamis dan menggerakkan panduan cerita budaya AxaraVerse.' },
];

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-cream text-text font-sans overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md z-50 border-b border-cream-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 flex items-center justify-center overflow-hidden">
                <img 
                  src="/logo.png" 
                  alt="Axara Logo" 
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer" 
                />
              </div>
              <span className="font-display font-bold text-2xl tracking-tight text-primary">AXARA</span>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="font-bold text-text-light hover:text-primary transition-colors">Fitur</a>
              <a href="#how-it-works" className="font-bold text-text-light hover:text-primary transition-colors">Cara Bermain</a>
              <a href="#faq" className="font-bold text-text-light hover:text-primary transition-colors">FAQ</a>
              
              {/* Gamification UI in Navbar */}
              <div className="flex items-center gap-4 bg-cream px-4 py-2 rounded-2xl border border-cream-dark">
                <div className="flex items-center gap-2">
                  <Flame className="text-primary" size={20} />
                  <span className="font-bold text-text">Hari 1</span>
                </div>
                <div className="w-px h-6 bg-cream-dark"></div>
                <div className="flex items-center gap-2">
                  <Star className="text-[#D4AF37]" size={20} />
                  <div className="w-24 h-3 bg-white rounded-full overflow-hidden border border-cream-dark">
                    <div className="h-full bg-[#D4AF37] w-1/3 rounded-full"></div>
                  </div>
                </div>
              </div>

              <Link to="/app" className="bg-primary text-white px-6 py-3 rounded-2xl font-bold hover:bg-primary-hover transition-colors shadow-lg shadow-primary/30 hover:-translate-y-1 transform duration-200">
                Mulai Main
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button className="md:hidden text-text" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-0 bg-primary overflow-hidden flex flex-col justify-between min-h-[90vh]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex-1 flex items-center">
          <div className="grid md:grid-cols-2 gap-12 items-center w-full pb-16">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <h1 className="text-5xl md:text-6xl font-display font-extrabold leading-tight text-white">
                Jelajahi <span className="text-[#D4AF37]">Budaya Abadi</span> Nusantara
              </h1>
              <p className="text-lg text-white/90 font-medium leading-relaxed">
                AXARA adalah platform gamifikasi di mana Anda menjelajahi budaya Indonesia melalui peta interaktif, quest, dan cerita berbasis AI.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <Link to="/app" className="bg-white text-primary px-8 py-4 rounded-2xl font-bold text-lg hover:bg-cream transition-all shadow-xl hover:-translate-y-1 flex items-center gap-2">
                  Mulai Menjelajah <ArrowRight size={20} />
                </Link>
                <a href="#features" className="bg-transparent text-white border-2 border-white/50 px-8 py-4 rounded-2xl font-bold text-lg hover:border-white hover:bg-white/10 transition-all">
                  Lihat Fitur
                </a>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1, y: [0, -20, 0] }} // Float lebih tinggi biar terasa hidup
              transition={{ duration: 0.6, y: { duration: 4, repeat: Infinity, ease: "easeInOut" } }}
              className="relative h-[500px] flex items-center justify-center" // Container ditinggikan
            >
              {/* Glow Effect Utama */}
              <div className="absolute w-[450px] h-[450px] bg-primary/40 blur-[120px] rounded-full z-0 opacity-70 animate-pulse"></div>
              
              {/* Glow */}
              <div className="absolute w-[300px] h-[300px] bg-[#D4AF37]/30 blur-[80px] rounded-full z-0"></div>

              {/* Maskot Container */}
              <div className="relative z-10 w-[400px] h-[480px] flex items-center justify-center overflow-visible">
    
              {/* Welcome Bubble */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1, 
                  y: [0, -10, 0] 
                }}
                transition={{ 
                  duration: 0.5,
                  y: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                }}
                /* Nilai top bubble */
                className="absolute top-4 -right-16 z-40 drop-shadow-2xl" 
              >
                <div className="relative flex items-center justify-center">
                  <svg 
                    width="220" 
                    height="80" 
                    viewBox="0 0 220 80" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path 
                      d="M30 10C15 10 5 20 5 35C5 50 15 60 30 60H40L35 75C45 70 55 60 60 60H190C205 60 215 50 215 35C215 20 205 10 190 10H30Z" 
                      fill="white" 
                      stroke="#E2E8F0" 
                      strokeWidth="1"
                    />
                  </svg>
                  
                  <div className="absolute inset-0 flex items-center justify-center pb-4 pr-2">
                    <span className="text-primary font-bold text-lg tracking-tight">
                      Selamat Datang! ✨
                    </span>
                  </div>
                </div>
              </motion.div>

            {/* Gambar Maskot */}
            <img 
              src="/mascot.png" 
              alt="Axara Explorer" 
              className="w-full h-full object-contain drop-shadow-2xl" 
              referrerPolicy="no-referrer" 
            />
          </div>
        </motion.div>
          </div>
        </div>

        {/* Bottom Strip*/}
        <div className="w-full bg-white/10 border-t border-white/20 overflow-hidden py-4">
          <div className="relative flex">
            {/* Animasi Bergerak Terus Menerus */}
            <motion.div 
              className="flex flex-nowrap gap-12 items-center"
              animate={{
                x: [0, -1000], 
              }}
              transition={{
                x: {
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 30, 
                  ease: "linear",
                },
              }}
            >
              {/* Kita Render dua kali agar loopingnya tidak putus (seamless) */}
              {[...floatingIcons, ...floatingIcons, ...floatingIcons].map((item, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center gap-2 shrink-0 select-none group cursor-pointer"
                >
                  <div className="w-12 h-12 md:w-14 md:h-14 bg-white rounded-full shadow-lg flex items-center justify-center text-2xl md:text-3xl border border-white/50 transition-transform duration-300 group-hover:scale-110">
                    {item.icon}
                  </div>
                  <span className="text-white text-[9px] font-bold uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.label}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-cream text-text">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl font-display font-extrabold mb-4 text-primary">
              Jelajahi Indonesia Layaknya <span className="text-[#D4AF37]">Petualangan Budaya</span>
            </h2>
            <p className="text-text-light font-medium text-lg">
              Belajar, bermain, dan menjelajah melalui fitur gamifikasi interaktif kami.
            </p>
          </div>

          <div className="space-y-32">
            {features.map((feature, i) => {
              const isEven = i % 2 === 0;
              return (
                <div key={feature.id} className={`flex flex-col md:flex-row items-center gap-12 ${!isEven ? 'md:flex-row-reverse' : ''}`}>
                  
                  {/* Text Content */}
                  <div className="flex-1 space-y-6">
                    <div className={`w-16 h-16 bg-white text-primary rounded-2xl flex items-center justify-center shadow-md border-2 border-primary/10`}>
                      <feature.icon size={32} strokeWidth={2.5} />
                    </div>
                    <h3 className="text-3xl font-display font-bold text-primary">{feature.title}</h3>
                    <p className="text-text font-medium leading-relaxed text-lg">{feature.description}</p>
                  </div>

                  {/* Window UI Animation */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, rotateX: 45 }}
                    whileInView={{ opacity: 1, scale: 1, rotateX: 0 }}
                    viewport={{ margin: "-20%" }}
                    transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
                    className="flex-1 w-full perspective-1000"
                  >
                    <div className="bg-white rounded-xl border-2 border-primary/20 overflow-hidden shadow-xl shadow-primary/10">
                      {/* Window Header */}
                      <div className="bg-cream-dark px-4 py-3 flex items-center gap-2 border-b border-primary/10">
                        <div className="w-3 h-3 rounded-full bg-primary"></div>
                        <div className="w-3 h-3 rounded-full bg-[#D4AF37]"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <span className="text-xs text-text-light ml-2 font-mono font-bold">{feature.id}.exe</span>
                      </div>
                      {/* Window Content */}
                      <div className="aspect-video flex items-center justify-center bg-cream relative overflow-hidden">
                        {/* Decorative background grid */}
                        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#F04E36 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                        
                        <motion.div 
                          animate={{ y: [0, -10, 0] }}
                          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                          className={`w-32 h-32 rounded-full bg-white flex items-center justify-center shadow-lg relative z-10 border-4 border-primary/10`}
                        >
                          <feature.icon size={64} className="text-primary" />
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>

                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Gamification System */}
      <section id="how-it-works" className="py-24 bg-primary text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-extrabold mb-4">Cara Bermain</h2>
            <p className="text-white/80 font-medium text-lg">Perjalananmu menjadi Master Budaya.</p>
          </div>

          <div className="relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-[32px] left-0 w-full h-1 bg-white/20 -translate-y-1/2"></div>
            
            <div className="grid grid-cols-2 md:grid-cols-6 gap-8 relative z-10">
              {steps.map((step, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex flex-col items-center text-center"
                >
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-4 border-2 border-white shadow-lg hover:scale-110 transition-transform">
                    <step.icon size={28} className="text-primary" />
                  </div>
                  <h4 className="font-bold text-sm md:text-base text-white">{step.label}</h4>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-extrabold text-primary mb-4">Kata Penjelajah</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-8 rounded-3xl border-2 border-cream-dark shadow-sm flex flex-col h-full"
              >
                <div className="flex text-[#D4AF37] mb-4">
                  {[...Array(5)].map((_, j) => <Star key={j} size={20} fill="currentColor" />)}
                </div>
                <p className="text-text font-medium mb-6 leading-relaxed flex-1">"{t.text}"</p>
                <div className="flex items-center gap-4 mt-auto">
                  <div className="w-12 h-12 bg-cream rounded-full flex items-center justify-center text-2xl border border-cream-dark overflow-hidden shrink-0">
                    <img src={t.avatar} alt={t.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div>
                    <h4 className="font-bold text-primary">{t.name}</h4>
                    <p className="text-sm text-text-light font-medium">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-extrabold text-primary mb-4">Pertanyaan yang Sering Diajukan</h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="border-2 border-cream-dark rounded-2xl overflow-hidden">
                <button 
                  className="w-full px-6 py-4 text-left flex justify-between items-center bg-white hover:bg-cream transition-colors"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="font-bold text-lg text-text">{faq.q}</span>
                  <ChevronDown 
                    className={`transform transition-transform ${openFaq === i ? 'rotate-180 text-primary' : 'text-text-light'}`} 
                  />
                </button>
                {openFaq === i && (
                  <div className="px-6 py-4 bg-cream border-t-2 border-cream-dark">
                    <p className="text-text font-medium">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact & Footer */}
      <footer className="bg-cream-dark text-text pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 mb-16">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 flex items-center justify-center overflow-hidden">
                  <img 
                    src="/logo.png" 
                    alt="Axara Logo" 
                    className="w-full h-full object-contain" 
                    referrerPolicy="no-referrer" 
                  />
                </div>
                <span className="font-display font-bold text-2xl tracking-tight text-primary">AXARA</span>
              </div>
              <p className="text-text font-medium mb-8 max-w-md leading-relaxed">
                Melestarikan Budaya Melalui Eksplorasi. Bergabunglah bersama kami dalam membuat sejarah dan tradisi Indonesia dapat diakses dan menyenangkan bagi semua orang.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors shadow-sm border border-cream">
                  <Instagram size={20} />
                </a>
                <a href="#" className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors shadow-sm border border-cream">
                  <Linkedin size={20} />
                </a>
                <a href="#" className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors shadow-sm border border-cream">
                  <Mail size={20} />
                </a>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl border-2 border-cream shadow-sm">
              <h3 className="text-2xl font-display font-bold mb-6 text-primary">Hubungi Kami</h3>
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <input 
                  type="text" 
                  placeholder="Nama Anda" 
                  className="w-full bg-cream border-2 border-cream-dark rounded-xl px-4 py-3 text-text focus:outline-none focus:border-primary transition-colors font-bold placeholder:text-text-light"
                />
                <input 
                  type="email" 
                  placeholder="Email Anda" 
                  className="w-full bg-cream border-2 border-cream-dark rounded-xl px-4 py-3 text-text focus:outline-none focus:border-primary transition-colors font-bold placeholder:text-text-light"
                />
                <textarea 
                  placeholder="Pesan Anda" 
                  rows={4}
                  className="w-full bg-cream border-2 border-cream-dark rounded-xl px-4 py-3 text-text focus:outline-none focus:border-primary transition-colors resize-none font-bold placeholder:text-text-light"
                ></textarea>
                <button className="w-full bg-primary text-white font-bold py-4 rounded-xl hover:bg-primary-hover transition-colors flex justify-center items-center gap-2 shadow-lg shadow-primary/20">
                  Kirim Pesan <Send size={18} />
                </button>
              </form>
            </div>
          </div>

          <div className="border-t border-cream pt-8 text-center text-text-light font-bold text-sm">
            &copy; {new Date().getFullYear()} AXARA. Hak Cipta Dilindungi.
          </div>
        </div>
      </footer>

      {/* Floating Chatbot */}
      <FloatingChat />
    </div>
  );
}
