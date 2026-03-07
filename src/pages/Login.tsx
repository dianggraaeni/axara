// src/pages/Login.tsx
// Halaman Login & Register dengan tab switcher.

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, User, Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

type Tab = 'login' | 'register';

export default function LoginPage() {
  const [tab, setTab] = useState<Tab>('login');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!email || !password) { setError('Email dan password wajib diisi.'); return; }
    if (tab === 'register' && !username) { setError('Username wajib diisi.'); return; }

    setError('');
    setIsLoading(true);
    try {
      if (tab === 'login') {
        await login(email, password);
      } else {
        await register(email, username, password, gender);
      }
      navigate('/app');
    } catch (e: any) {
      setError(e?.response?.data?.error ?? 'Terjadi kesalahan. Coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center p-4">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl border-4 border-white/20"
      >
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 mb-8 justify-center group">
          <div className="w-12 h-12 overflow-hidden">
            <img src="/logo.png" alt="Axara" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
          </div>
          <span className="font-display font-black text-3xl text-primary tracking-tight">AXARA</span>
        </Link>

        {/* Tab switcher */}
        <div className="flex bg-cream rounded-2xl p-1 mb-8">
          {(['login', 'register'] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => { setTab(t); setError(''); }}
              className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all ${
                tab === t ? 'bg-white text-primary shadow-sm' : 'text-text-light'
              }`}
            >
              {t === 'login' ? 'Masuk' : 'Daftar'}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, x: tab === 'login' ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            {/* Error message */}
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border-2 border-red-200 rounded-xl text-red-600 text-sm font-medium">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            {/* Email */}
            <div className="relative">
              <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-light" />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                className="w-full pl-11 pr-4 py-3.5 bg-cream border-2 border-cream-dark rounded-xl focus:border-primary focus:outline-none font-medium text-text placeholder:text-text-light transition-colors"
              />
            </div>

            {/* Username (register only) */}
            {tab === 'register' && (
              <div className="relative">
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-light" />
                <input
                  type="text"
                  placeholder="Username (min. 3 karakter)"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-cream border-2 border-cream-dark rounded-xl focus:border-primary focus:outline-none font-medium text-text placeholder:text-text-light transition-colors"
                />
              </div>
            )}

            {/* Password */}
            <div className="relative">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-light" />
              <input
                type={showPass ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                className="w-full pl-11 pr-12 py-3.5 bg-cream border-2 border-cream-dark rounded-xl focus:border-primary focus:outline-none font-medium text-text placeholder:text-text-light transition-colors"
              />
              <button
                onClick={() => setShowPass(!showPass)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-text-light hover:text-primary transition-colors"
              >
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Gender (register only) */}
            {tab === 'register' && (
              <div>
                <p className="text-sm font-bold text-text-light mb-2">Gender</p>
                <div className="flex gap-3">
                  {(['male', 'female'] as const).map((g) => (
                    <button
                      key={g}
                      onClick={() => setGender(g)}
                      className={`flex-1 py-2.5 rounded-xl font-bold text-sm border-2 transition-all ${
                        gender === g
                          ? 'border-primary bg-primary/5 text-primary'
                          : 'border-cream-dark text-text-light'
                      }`}
                    >
                      {g === 'male' ? '👦 Laki-laki' : '👧 Perempuan'}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full py-4 bg-primary text-white font-bold text-lg rounded-2xl hover:bg-primary-hover disabled:opacity-60 transition-colors shadow-lg shadow-primary/30 flex items-center justify-center gap-2 mt-2"
            >
              {isLoading ? <Loader2 size={20} className="animate-spin" /> : null}
              {tab === 'login' ? 'Masuk ke AXARA' : 'Buat Akun'}
            </button>
          </motion.div>
        </AnimatePresence>

        <p className="text-center text-sm text-text-light font-medium mt-6">
          {tab === 'login' ? 'Belum punya akun? ' : 'Sudah punya akun? '}
          <button
            onClick={() => { setTab(tab === 'login' ? 'register' : 'login'); setError(''); }}
            className="text-primary font-bold hover:underline"
          >
            {tab === 'login' ? 'Daftar sekarang' : 'Masuk'}
          </button>
        </p>
      </motion.div>
    </div>
  );
}
