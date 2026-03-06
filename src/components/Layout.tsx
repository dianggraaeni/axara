import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Map, Swords, MessageCircle, User, Award } from 'lucide-react';
import { cn } from '../lib/utils';
import { useAppStore } from '../store/useAppStore';

const navItems = [
  { path: '/app', label: 'AxaraWorld', icon: Map },
  { path: '/app/quest', label: 'AxaraBattle', icon: Swords },
  { path: '/app/chat', label: 'AxaraVerse', icon: MessageCircle },
  { path: '/app/profile', label: 'AxaraBadge', icon: User },
];

export default function Layout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const { xp, level, profile } = useAppStore();

  return (
    <div className="flex h-screen bg-cream text-text font-sans overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r border-cream-dark bg-white p-4">
        <Link to="/" className="flex items-center gap-3 mb-8 px-2 hover:opacity-80 transition-opacity">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white font-bold text-xl">
            A
          </div>
          <h1 className="text-2xl font-black text-primary tracking-tight">AXARA</h1>
        </Link>

        <nav className="flex-1 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center gap-4 px-4 py-3 rounded-2xl font-bold transition-all',
                  isActive
                    ? 'bg-cream-dark text-primary border-2 border-primary/20'
                    : 'text-text-light hover:bg-cream hover:text-text border-2 border-transparent'
                )}
              >
                <Icon size={24} strokeWidth={isActive ? 3 : 2} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User Stats Summary */}
        <div className="mt-auto pt-4 border-t border-cream-dark">
          <Link to="/app/profile" className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-cream transition-colors group">
            <div className="w-12 h-12 rounded-full bg-cream flex items-center justify-center border-2 border-primary/30 text-2xl group-hover:border-primary/60 transition-colors">
              {profile.avatar}
            </div>
            <div>
              <p className="font-bold text-sm truncate max-w-[120px] text-text group-hover:text-primary transition-colors">{profile.name}</p>
              <div className="flex items-center gap-1 text-primary text-sm font-bold">
                <Award size={16} />
                <span>Lv.{level} • {xp} XP</span>
              </div>
            </div>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
        <div className="max-w-4xl mx-auto p-4 md:p-8 min-h-full">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-cream-dark pb-safe z-50">
        <div className="flex justify-around p-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex flex-col items-center p-2 rounded-xl min-w-[64px]',
                  isActive ? 'text-primary bg-cream' : 'text-text-light'
                )}
              >
                <Icon size={24} strokeWidth={isActive ? 3 : 2} />
                <span className="text-[10px] font-bold mt-1">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
