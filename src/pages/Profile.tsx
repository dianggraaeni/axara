import { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Award, Star, MapPin, Shield, Edit2, Check, User, UserPlus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const AVATARS = [
  { id: 'b1', url: '/avatars/boy1.jpg', gender: 'male' },
  { id: 'b2', url: '/avatars/boy2.jpg', gender: 'male' },
  { id: 'b3', url: '/avatars/boy3.jpg', gender: 'male' },
  { id: 'b4', url: '/avatars/boy4.jpg', gender: 'male' },
  { id: 'b5', url: '/avatars/boy5.jpg', gender: 'male' },
  { id: 'g1', url: '/avatars/girl1.jpg', gender: 'female' },
  { id: 'g2', url: '/avatars/girl2.jpg', gender: 'female' },
  { id: 'g3', url: '/avatars/girl3.jpg', gender: 'female' },
  { id: 'g4', url: '/avatars/girl4.jpg', gender: 'female' },
  { id: 'g5', url: '/avatars/girl5.jpg', gender: 'female' },
];

export default function ProfilePage() {
  const { profile, updateProfile, xp, level, badges, provinces } = useAppStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(profile.name);
  const [editAvatar, setEditAvatar] = useState(profile.avatar);
  const [genderFilter, setGenderFilter] = useState('male'); 

  const unlockedProvincesCount = Object.values(provinces).filter(p => p.isUnlocked).length;
  const totalProvincesCount = Object.keys(provinces).length;

  const handleSave = () => {
    updateProfile({ name: editName, avatar: editAvatar });
    setIsEditing(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-10">
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
              <label className="block text-sm font-bold text-text mb-3">Pilih Avatar Baru</label>
              
              {/* Tab Selector Gender */}
              <div className="flex gap-2 mb-4 bg-cream p-1 rounded-xl w-fit">
                <button
                  onClick={() => setGenderFilter('male')}
                  className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                    genderFilter === 'male' ? 'bg-primary text-white shadow-md' : 'text-text-light'
                  }`}
                >
                  Laki-laki
                </button>
                <button
                  onClick={() => setGenderFilter('female')}
                  className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                    genderFilter === 'female' ? 'bg-primary text-white shadow-md' : 'text-text-light'
                  }`}
                >
                  Perempuan
                </button>
              </div>

              {/* Avatar Grid */}
              <div className="grid grid-cols-5 gap-3">
                {AVATARS.filter(a => a.gender === genderFilter).map((a) => (
                  <button
                    key={a.id}
                    onClick={() => setEditAvatar(a.url)}
                    className={`relative aspect-square rounded-2xl overflow-hidden border-4 transition-all duration-200 ${
                      editAvatar === a.url 
                        ? 'border-primary scale-105 shadow-lg' 
                        : 'border-cream-dark grayscale hover:grayscale-0 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={a.url} alt="Avatar" className="w-full h-full object-cover" />
                    {editAvatar === a.url && (
                      <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                        <div className="bg-primary text-white rounded-full p-1">
                          <Check size={12} strokeWidth={4} />
                        </div>
                      </div>
                    )}
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
                maxLength={15}
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
                <Check size={18} /> Simpan Perubahan
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-cream border-4 border-primary/20 rounded-3xl overflow-hidden flex-shrink-0">
              <img 
                src={profile.avatar} 
                alt="Profile" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback jika gambar tidak ditemukan
                  e.target.src = "https://ui-avatars.com/api/?name=" + profile.name;
                }}
              />
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
        <StatCard icon={<Star />} label="Level" value={level} color="text-yellow-500" />
        <StatCard icon={<Award />} label="Total XP" value={xp} color="text-orange-500" />
        <StatCard icon={<MapPin />} label="Provinsi" value={`${unlockedProvincesCount}/${totalProvincesCount}`} color="text-red-500" />
        <StatCard icon={<Shield />} label="Badges" value={badges.length} color="text-blue-500" />
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
                  Diperoleh {badge.unlockedAt ? new Date(badge.unlockedAt).toLocaleDateString('id-ID') : 'Baru saja'}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }) {
  return (
    <div className="bg-white border-2 border-cream-dark rounded-2xl p-4 flex flex-col items-center justify-center text-center">
      <div className={`${color} mb-2`}>
        {icon}
      </div>
      <p className="text-xs font-bold text-text-light uppercase tracking-wider">{label}</p>
      <p className="text-2xl font-black text-text">{value}</p>
    </div>
  );
}