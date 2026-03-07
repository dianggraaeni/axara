// src/pages/Profile.tsx
// Diupdate: data dari backend API, update profil dan avatar lewat API.

import { useState } from 'react';
import { Award, Star, MapPin, Shield, Edit2, Check, Loader2, LogOut, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { useUserStats, useUserBadges } from '../hooks/useBackendData';
import { usersService } from '../services/users.service';

export default function ProfilePage() {
  const { user, logout, updateUser } = useAuth();
  const { stats, isLoading: statsLoading, refetch: refetchStats } = useUserStats();
  const { badges, isLoading: badgesLoading, refetch: refetchBadges } = useUserBadges();

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user?.username ?? '');
  const [editGender, setEditGender] = useState<'male' | 'female'>(user?.gender ?? 'male');
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  const handleSave = async () => {
    setIsSaving(true);
    setSaveError('');
    try {
      const updated = await usersService.updateProfile({ username: editName, gender: editGender });
      updateUser({ username: updated.username, gender: updated.gender });
      await refetchStats();
      setIsEditing(false);
    } catch (e: any) {
      setSaveError(e?.response?.data?.error ?? 'Gagal menyimpan profil.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const result = await usersService.uploadAvatar(file);
      updateUser({ avatarUrl: result.avatarUrl });
    } catch (e: any) {
      alert(e?.response?.data?.error ?? 'Gagal upload avatar.');
    }
  };

  const handleLogout = async () => {
    if (confirm('Yakin ingin keluar?')) {
      await logout();
    }
  };

  const name = user?.username ?? 'Petualang';
  const avatarUrl = user?.avatarUrl;
  const xp = stats?.xp ?? user?.xp ?? 0;
  const level = stats?.level ?? user?.level ?? 1;
  const xpToNext = stats?.xpToNext ?? 0;
  const levelProgress = stats?.levelProgress ?? 0;
  const streakDays = stats?.streakDays ?? user?.streakDays ?? 0;
  const provincesUnlocked = stats?.provincesUnlocked ?? 0;
  const provincesCompleted = stats?.provincesCompleted ?? 0;
  const badgeCount = stats?.badges ?? badges.length;

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-text">AxaraProfile</h1>
          <p className="text-text-light font-medium mt-2">Atur profil dan lihat pencapaianmu.</p>
        </div>
        <div className="flex gap-2">
          {!isEditing && (
            <button
              onClick={() => { setIsEditing(true); setEditName(name); }}
              className="flex items-center gap-2 px-4 py-2 bg-cream hover:bg-cream-dark text-text rounded-xl font-bold transition-colors border-2 border-cream-dark"
            >
              <Edit2 size={16} /> Edit Profil
            </button>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-500 rounded-xl font-bold transition-colors border-2 border-red-100"
          >
            <LogOut size={16} /> Keluar
          </button>
        </div>
      </header>

      {/* Profile Card */}
      <div className="bg-white border-2 border-cream-dark rounded-3xl p-6 shadow-sm">
        {isEditing ? (
          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <label className="relative cursor-pointer group">
                <div className="w-20 h-20 rounded-2xl bg-cream border-2 border-primary/20 overflow-hidden">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl font-black text-primary">
                      {name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center">
                    <span className="text-white text-xs font-bold">Ubah</span>
                  </div>
                </div>
                <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
              </label>
              <p className="text-sm text-text-light font-medium">Klik foto untuk upload avatar baru</p>
            </div>

            <div>
              <label className="block text-sm font-bold text-text mb-2">Username</label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full px-4 py-3 bg-cream border-2 border-cream-dark rounded-xl focus:border-primary focus:outline-none font-bold text-text"
                maxLength={50}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-text mb-2">Gender</label>
              <div className="flex gap-3">
                {(['male', 'female'] as const).map((g) => (
                  <button
                    key={g}
                    onClick={() => setEditGender(g)}
                    className={`flex-1 py-2.5 rounded-xl font-bold text-sm border-2 transition-all ${
                      editGender === g ? 'border-primary bg-primary/5 text-primary' : 'border-cream-dark text-text-light'
                    }`}
                  >
                    {g === 'male' ? '👦 Laki-laki' : '👧 Perempuan'}
                  </button>
                ))}
              </div>
            </div>

            {saveError && <p className="text-red-500 text-sm font-medium">{saveError}</p>}

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsEditing(false)}
                className="px-6 py-3 rounded-xl font-bold text-text-light hover:bg-cream transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-hover text-white rounded-xl font-bold transition-colors shadow-lg shadow-primary/30 disabled:opacity-60"
              >
                {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                Simpan
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-cream border-4 border-primary/20 rounded-3xl overflow-hidden flex-shrink-0">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl font-black text-primary">
                  {name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div>
              <h2 className="text-2xl font-black text-text">{name}</h2>
              <p className="text-text-light text-sm font-medium">{user?.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <div className="inline-flex items-center gap-1 px-3 py-1 bg-cream text-primary rounded-full text-sm font-bold border border-primary/20">
                  <Award size={14} /> Petualang Budaya
                </div>
                {streakDays > 0 && (
                  <div className="inline-flex items-center gap-1 px-3 py-1 bg-orange-50 text-orange-500 rounded-full text-sm font-bold border border-orange-200">
                    🔥 {streakDays} hari
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Level Progress */}
      {!statsLoading && stats && (
        <div className="bg-white border-2 border-cream-dark rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="text-primary" size={20} />
              <span className="font-bold text-text">Level {level}</span>
            </div>
            <span className="text-sm font-bold text-text-light">{xpToNext > 0 ? `${xpToNext} XP lagi ke Level ${level + 1}` : 'Level Maksimum!'}</span>
          </div>
          <div className="h-4 bg-cream-dark rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${levelProgress}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
          <p className="text-right text-xs font-bold text-text-light mt-1">{levelProgress}%</p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={<Star />} label="Level" value={level} color="text-yellow-500" />
        <StatCard icon={<Award />} label="Total XP" value={xp} color="text-orange-500" />
        <StatCard icon={<MapPin />} label="Provinsi" value={`${provincesCompleted}/${provincesUnlocked}`} color="text-red-500" />
        <StatCard icon={<Shield />} label="Badges" value={badgeCount} color="text-blue-500" />
      </div>

      {/* Badges */}
      <div>
        <h2 className="text-2xl font-bold text-text mb-4">Koleksi Badge</h2>
        {badgesLoading ? (
          <div className="flex justify-center py-8"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>
        ) : badges.length === 0 ? (
          <div className="bg-cream border-2 border-dashed border-cream-dark rounded-3xl p-8 text-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 text-3xl shadow-sm">🏆</div>
            <p className="text-text-light font-medium">Belum ada badge yang terkumpul.</p>
            <p className="text-sm text-text-light mt-1">Selesaikan quest di AxaraWorld untuk mendapatkan badge!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {badges.map((ub: any) => {
              const badge = ub.badge ?? ub;
              return (
                <motion.div
                  key={ub.id ?? badge.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white border-2 border-primary/20 rounded-2xl p-4 flex flex-col items-center text-center shadow-sm"
                >
                  <div className="text-5xl mb-3">{badge.icon ?? '🏅'}</div>
                  <h3 className="font-bold text-text leading-tight mb-1">{badge.name}</h3>
                  <p className="text-xs text-text-light">{badge.description}</p>
                  <div className="mt-3 text-[10px] font-bold text-primary uppercase tracking-wider">
                    {ub.unlockedAt ? new Date(ub.unlockedAt).toLocaleDateString('id-ID') : 'Baru saja'}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: any; color: string }) {
  return (
    <div className="bg-white border-2 border-cream-dark rounded-2xl p-4 flex flex-col items-center justify-center text-center">
      <div className={`${color} mb-2`}>{icon}</div>
      <p className="text-xs font-bold text-text-light uppercase tracking-wider">{label}</p>
      <p className="text-2xl font-black text-text">{value}</p>
    </div>
  );
}
