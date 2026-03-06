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
  { icon: '🦎', label: 'Komodo', delay: 0.2 },
  { icon: '🌺', label: 'Rafflesia', delay: 0.4 },
  { icon: '🎭', label: 'Wayang', delay: 0.6 },
  { icon: '👘', label: 'Batik', delay: 0.8 },
  { icon: '🏠', label: 'Rumah Gadang', delay: 1.0 },
  { icon: '🎋', label: 'Angklung', delay: 1.2 },
  { icon: '⛩️', label: 'Bali Temple', delay: 1.4 },
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
  { icon: Compass, label: 'Explore Province' },
  { icon: BookOpen, label: 'Learn Culture' },
  { icon: Target, label: 'Complete Quest' },
  { icon: Star, label: 'Earn XP' },
  { icon: Award, label: 'Unlock Badge' },
  { icon: Trophy, label: 'Climb Leaderboard' },
];

const testimonials = [
  {
    name: 'Budi S.',
    role: 'Student',
    text: 'This platform makes learning Indonesian culture feel like playing a game.',
    avatar: '👦🏽'
  },
  {
    name: 'Ibu Ratna',
    role: 'Teacher',
    text: 'A beautiful way to introduce Nusantara culture to the younger generation.',
    avatar: '👩🏽‍🏫'
  },
  {
    name: 'Sarah M.',
    role: 'Traveler',
    text: 'I discovered so many unique traditions I never knew existed.',
    avatar: '👱🏼‍♀️'
  }
];

const faqs = [
  { q: 'What is AXARA?', a: 'AXARA is a gamified platform where you explore Indonesian culture through interactive maps, quests, and AI-powered storytelling.' },
  { q: 'How does the XP system work?', a: 'You earn XP by completing cultural quests, mini-games, and interacting with the AI guide. Accumulate XP to level up and unlock badges.' },
  { q: 'Is the platform free?', a: 'Yes! AXARA is completely free to use for anyone who wants to learn about Indonesian culture.' },
  { q: 'Can I explore all provinces?', a: 'We are continuously adding more provinces. Currently, you can explore several major regions, with more coming soon!' },
  { q: 'Does AXARA use AI?', a: 'Yes, AXARA uses AI to generate dynamic quizzes and power the AxaraVerse cultural storyteller guide.' },
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
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-display font-bold text-2xl shadow-lg shadow-primary/30">
                A
              </div>
              <span className="font-display font-bold text-2xl tracking-tight text-primary">AXARA</span>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="font-bold text-text-light hover:text-primary transition-colors">Features</a>
              <a href="#how-it-works" className="font-bold text-text-light hover:text-primary transition-colors">How it Works</a>
              <a href="#faq" className="font-bold text-text-light hover:text-primary transition-colors">FAQ</a>
              
              {/* Gamification UI in Navbar */}
              <div className="flex items-center gap-4 bg-cream px-4 py-2 rounded-2xl border border-cream-dark">
                <div className="flex items-center gap-2">
                  <Flame className="text-primary" size={20} />
                  <span className="font-bold text-text">Day 1</span>
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
                Play Now
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
      <section className="relative pt-32 pb-16 bg-primary overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div className="inline-block bg-white/20 text-white px-4 py-2 rounded-full font-bold text-sm mb-2 backdrop-blur-sm border border-white/30">
                🎮 Gamified Cultural Learning
              </div>
              <h1 className="text-5xl md:text-6xl font-display font-extrabold leading-tight text-white">
                Explore the <span className="text-[#D4AF37]">Eternal Culture</span> of Nusantara
              </h1>
              <p className="text-lg text-white/90 font-medium leading-relaxed">
                AXARA is a gamified platform where you explore Indonesian culture through interactive maps, quests, and AI-powered storytelling.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <Link to="/app" className="bg-white text-primary px-8 py-4 rounded-2xl font-bold text-lg hover:bg-cream transition-all shadow-xl hover:-translate-y-1 flex items-center gap-2">
                  Start Exploring <ArrowRight size={20} />
                </Link>
                <a href="#features" className="bg-transparent text-white border-2 border-white/50 px-8 py-4 rounded-2xl font-bold text-lg hover:border-white hover:bg-white/10 transition-all">
                  See Features
                </a>
              </div>
              
              {/* Daily Quest Notification */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-8 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 flex items-center gap-4 shadow-sm inline-flex"
              >
                <div className="w-12 h-12 bg-[#D4AF37]/20 rounded-xl flex items-center justify-center text-[#D4AF37]">
                  <Target size={24} />
                </div>
                <div>
                  <p className="text-xs font-bold text-white/70 uppercase tracking-wider">Daily Quest</p>
                  <p className="font-bold text-white">Identify 3 traditional instruments</p>
                </div>
              </motion.div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="relative h-[400px] flex items-center justify-center"
            >
              {/* Mascot Placeholder */}
              <div className="relative z-10 w-72 h-80 bg-white rounded-[3rem] border-4 border-white/50 shadow-2xl flex flex-col items-center justify-center p-6 transform rotate-3">
                <div className="text-8xl mb-4">🤠</div>
                <div className="text-center">
                  <h3 className="font-display font-bold text-2xl text-primary">Axara Explorer</h3>
                  <p className="text-sm text-text-light font-medium">Ready for adventure!</p>
                </div>
                <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-[#D4AF37] rounded-full flex items-center justify-center text-white shadow-lg border-4 border-white">
                  <Map size={24} />
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Strip for Floating Icons */}
        <div className="w-full bg-white/10 py-6 border-t border-white/20 overflow-hidden relative">
          <div className="flex justify-center gap-8 md:gap-16 px-4 max-w-7xl mx-auto flex-wrap">
            {floatingIcons.map((item, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.2, y: -5 }}
                className="flex flex-col items-center gap-2 group cursor-pointer"
              >
                <div className="w-14 h-14 bg-white rounded-full shadow-lg flex items-center justify-center text-3xl border-2 border-white/50">
                  {item.icon}
                </div>
                <span className="text-white/90 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {item.label}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-cream text-text">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl font-display font-extrabold mb-4 text-primary">
              Discover Indonesia Like a <span className="text-[#D4AF37]">Cultural Adventure</span>
            </h2>
            <p className="text-text-light font-medium text-lg">
              Learn, play, and explore through our interactive gamified features.
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
            <h2 className="text-4xl font-display font-extrabold mb-4">How the Adventure Works</h2>
            <p className="text-white/80 font-medium text-lg">Your journey to becoming a Culture Master.</p>
          </div>

          <div className="relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-white/20 -translate-y-1/2"></div>
            
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
            <h2 className="text-4xl font-display font-extrabold text-primary mb-4">What Explorers Say</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-8 rounded-3xl border-2 border-cream-dark shadow-sm"
              >
                <div className="flex text-[#D4AF37] mb-4">
                  {[...Array(5)].map((_, j) => <Star key={j} size={20} fill="currentColor" />)}
                </div>
                <p className="text-text font-medium mb-6 leading-relaxed">"{t.text}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-cream rounded-full flex items-center justify-center text-2xl border border-cream-dark">
                    {t.avatar}
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
            <h2 className="text-4xl font-display font-extrabold text-primary mb-4">Frequently Asked Questions</h2>
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
              <div className="flex items-center gap-2 mb-6">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-display font-bold text-2xl">
                  A
                </div>
                <span className="font-display font-bold text-3xl tracking-tight text-primary">AXARA</span>
              </div>
              <p className="text-text font-medium mb-8 max-w-md leading-relaxed">
                Preserving Culture Through Exploration. Join us in making Indonesian history and traditions accessible and fun for everyone.
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
              <h3 className="text-2xl font-display font-bold mb-6 text-primary">Get in Touch</h3>
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <input 
                  type="text" 
                  placeholder="Your Name" 
                  className="w-full bg-cream border-2 border-cream-dark rounded-xl px-4 py-3 text-text focus:outline-none focus:border-primary transition-colors font-bold placeholder:text-text-light"
                />
                <input 
                  type="email" 
                  placeholder="Your Email" 
                  className="w-full bg-cream border-2 border-cream-dark rounded-xl px-4 py-3 text-text focus:outline-none focus:border-primary transition-colors font-bold placeholder:text-text-light"
                />
                <textarea 
                  placeholder="Your Message" 
                  rows={4}
                  className="w-full bg-cream border-2 border-cream-dark rounded-xl px-4 py-3 text-text focus:outline-none focus:border-primary transition-colors resize-none font-bold placeholder:text-text-light"
                ></textarea>
                <button className="w-full bg-primary text-white font-bold py-4 rounded-xl hover:bg-primary-hover transition-colors flex justify-center items-center gap-2 shadow-lg shadow-primary/20">
                  Send Message <Send size={18} />
                </button>
              </form>
            </div>
          </div>

          <div className="border-t border-cream pt-8 text-center text-text-light font-bold text-sm">
            &copy; {new Date().getFullYear()} AXARA. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Floating Chatbot */}
      <FloatingChat />
    </div>
  );
}
