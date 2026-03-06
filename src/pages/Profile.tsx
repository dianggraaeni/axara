import { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Award, Star, MapPin, Shield, Edit2, Check } from 'lucide-react';
import { motion } from 'motion/react';

const AVATARS = [
  { id: 'boy1', emoji: '👦🏻', gender: 'male' },
  { id: 'boy2', emoji: '👦🏽', gender: 'male' },
  { id: 'girl1', emoji: '👧🏻', gender: 'female' },
  { id: 'girl2', emoji: '👧🏽', gender: 'female' },
  { id: 'neutral', emoji: '🤠', gender: 'neutral' },
];

export default function ProfilePage() {
  const { profile, updateProfile, xp, level, badges, provinces } = useAppStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(profile.name);
  const [editAvatar, setEditAvatar] = useState(profile.avatar);

  const unlockedProvincesCount = Object.values(provinces).filter(p => p.isUnlocked).length;
  const totalProvincesCount = Object.keys(provinces).length;

  const handleSave = () => {
    updateProfile({ name: editName, avatar: editAvatar });
    setIsEditing(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-text">AxaraProfile</h1>
          <p className="text-text-light font-medium mt-2">Atur profil dan lihat pencapaianmu.</p>
        </div>
        {!isEditing && (
          <button 
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-4 py-2 bg-cream hover:bg-cream-dark text-text rounded-xl font-bold transition-colors border-2 border-cream-dark"
          >
            <Edit2 size={16} /> Edit Profil
          </button>
        )}
      </header>

      {/* Profile Info / Edit Form */}
      <div className="bg-white border-2 border-cream-dark rounded-3xl p-6 shadow-sm">
        {isEditing ? (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-text mb-2">Pilih Avatar</label>
              <div className="flex flex-wrap gap-3">
                {AVATARS.map((a) => (
                  <button
                    key={a.id}
                    onClick={() => setEditAvatar(a.emoji)}
                    className={`w-16 h-16 text-3xl rounded-2xl flex items-center justify-center border-4 transition-all ${
                      editAvatar === a.emoji 
                        ? 'border-primary bg-cream scale-110' 
                        : 'border-cream-dark bg-cream hover:border-primary/50'
                    }`}
                  >
                    {a.emoji}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-text mb-2">Nama Panggilan</label>
              <input 
                type="text" 
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full px-4 py-3 bg-cream border-2 border-cream-dark rounded-xl focus:border-primary focus:outline-none font-bold text-text"
                placeholder="Masukkan namamu..."
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button 
                onClick={() => {
                  setIsEditing(false);
                  setEditName(profile.name);
                  setEditAvatar(profile.avatar);
                }}
                className="px-6 py-3 rounded-xl font-bold text-text-light hover:bg-cream transition-colors"
              >
                Batal
              </button>
              <button 
                onClick={handleSave}
                className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-hover text-white rounded-xl font-bold transition-colors shadow-lg shadow-primary/30"
              >
                <Check size={18} /> Simpan
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-cream border-4 border-primary/20 rounded-full flex items-center justify-center text-5xl">
              {profile.avatar}
            </div>
            <div>
              <h2 className="text-2xl font-black text-text">{profile.name}</h2>
              <div className="inline-flex items-center gap-1 px-3 py-1 bg-cream text-primary rounded-full text-sm font-bold mt-2 border border-primary/20">
                <Award size={14} /> Petualang Budaya
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border-2 border-cream-dark rounded-2xl p-4 flex flex-col items-center justify-center text-center">
          <Star className="w-8 h-8 text-primary mb-2" />
          <p className="text-sm font-bold text-primary">Level</p>
          <p className="text-2xl font-black text-text">{level}</p>
        </div>
        <div className="bg-white border-2 border-cream-dark rounded-2xl p-4 flex flex-col items-center justify-center text-center">
          <Award className="w-8 h-8 text-primary mb-2" />
          <p className="text-sm font-bold text-primary">Total XP</p>
          <p className="text-2xl font-black text-text">{xp}</p>
        </div>
        <div className="bg-white border-2 border-cream-dark rounded-2xl p-4 flex flex-col items-center justify-center text-center">
          <MapPin className="w-8 h-8 text-primary mb-2" />
          <p className="text-sm font-bold text-primary">Provinsi</p>
          <p className="text-2xl font-black text-text">{unlockedProvincesCount}/{totalProvincesCount}</p>
        </div>
        <div className="bg-white border-2 border-cream-dark rounded-2xl p-4 flex flex-col items-center justify-center text-center">
          <Shield className="w-8 h-8 text-primary mb-2" />
          <p className="text-sm font-bold text-primary">Badges</p>
          <p className="text-2xl font-black text-text">{badges.length}</p>
        </div>
      </div>

      {/* Badges Collection */}
      <div>
        <h2 className="text-2xl font-bold text-text mb-4">Koleksi Badge</h2>
        {badges.length === 0 ? (
          <div className="bg-cream border-2 border-dashed border-cream-dark rounded-3xl p-8 text-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 text-3xl shadow-sm">
              🏆
            </div>
            <p className="text-text-light font-medium">Belum ada badge yang terkumpul.</p>
            <p className="text-sm text-text-light mt-1">Selesaikan quest di AxaraWorld untuk mendapatkan badge!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {badges.map((badge) => (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white border-2 border-primary/20 rounded-2xl p-4 flex flex-col items-center text-center shadow-sm"
              >
                <div className="text-5xl mb-3">{badge.icon}</div>
                <h3 className="font-bold text-text leading-tight mb-1">{badge.name}</h3>
                <p className="text-xs text-text-light">{badge.description}</p>
                <div className="mt-3 text-[10px] font-bold text-primary uppercase tracking-wider">
                  Diperoleh {new Date(badge.unlockedAt).toLocaleDateString('id-ID')}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
