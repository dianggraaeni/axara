import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
MapPin, Lock, CheckCircle, X, BookOpen, Music,
Home, Utensils, Shirt, Loader2, MousePointer2,
Plus, Minus, RotateCcw, Info
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';
import { useProvinces } from '../hooks/useBackendData';
import { provincesService } from '../services/provinces.service';

const geoUrl = "/indonesia-province-simple.json";

const normalizeId = (name: string) =>
name ? name.toLowerCase().trim().replace(/\s+/g, '-').replace(/\./g, '').replace('d.i.-', 'di-') : "";

export default function MapPage() {
const navigate = useNavigate();
const { provinces, isLoading, error, refetch } = useProvinces();

const [selectedId, setSelectedId] = useState<string>("");
const [position, setPosition] = useState({ coordinates: [118, -2] as [number, number], zoom: 1 });
const [hoveredName, setHoveredName] = useState<string | null>(null);

// Cari data provinsi terpilih
const selectedProv = useMemo(() => {
return provinces.find(p => p.id === selectedId);
}, [selectedId, provinces]);

// Fungsi Zoom
const handleZoomIn = () => setPosition(pos => ({ ...pos, zoom: pos.zoom * 1.2 }));
const handleZoomOut = () => setPosition(pos => ({ ...pos, zoom: pos.zoom / 1.2 }));
const handleReset = () => setPosition({ coordinates: [118, -2], zoom: 1 });

const handleSelectProvince = async (prov: any) => {
setSelectedId(prov.id);
if (prov.userProgress?.isUnlocked && !prov.userProgress?.isVisited) {
try {
await provincesService.visit(prov.id);
await refetch();
} catch (err) { console.error(err); }
}
};

if (isLoading) {
return (
<div className="flex flex-col items-center justify-center h-[80vh] gap-4">
<Loader2 className="w-16 h-16 text-primary animate-spin" />
<p className="text-xl font-serif italic text-text-light animate-pulse">Menyiapkan Ekspedisi Nusantara...</p>
</div>
);
}

return (
<div className="relative min-h-screen space-y-8 pb-20 px-4 md:px-8">
{/* HEADER */}
<header className="relative pt-8">
<h1 className="text-5xl md:text-7xl font-black text-text font-serif leading-tight italic">
Axara<span className="text-primary">World</span>
</h1>
<p className="text-text-light text-lg font-medium mt-2 max-w-2xl">
Jelajahi 38 Provinsi Nusantara. Klik wilayah untuk membuka catatan budaya.
</p>
</header>

<div className="relative grid grid-cols-1 gap-8">

{/* AREA PETA (FULL WIDTH) */}
<div className="relative w-full h-[600px] bg-[#fdfaf3] rounded-[4rem] border-4 border-cream-dark shadow-2xl overflow-hidden group">

{/* Legend & Tooltip */}
<div className="absolute top-8 left-10 z-20 space-y-4">
<div className="bg-white/90 backdrop-blur px-6 py-3 rounded-2xl border-2 border-cream-dark shadow-lg">
<p className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">Wilayah Terdeteksi</p>
<h2 className="text-2xl font-serif font-black text-text uppercase italic">
{hoveredName || (selectedProv?.name ?? "Pilih Provinsi")}
</h2>
</div>

{/* Status Legend */}
<div className="flex gap-3 bg-white/80 backdrop-blur p-3 rounded-xl border border-cream-dark text-[9px] font-black uppercase tracking-wider">
<div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-primary"/> Terbuka</div>
<div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-[#D4AF37]"/> Selesai</div>
<div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-gray-300"/> Terkunci</div>
</div>
</div>

{/* Zoom Controls */}
<div className="absolute right-8 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-2">
<button onClick={handleZoomIn} className="p-4 bg-white hover:bg-primary hover:text-white rounded-2xl border-2 border-cream-dark shadow-lg transition-all"><Plus size={24} /></button>
<button onClick={handleZoomOut} className="p-4 bg-white hover:bg-primary hover:text-white rounded-2xl border-2 border-cream-dark shadow-lg transition-all"><Minus size={24} /></button>
<button onClick={handleReset} className="p-4 bg-white hover:bg-primary hover:text-white rounded-2xl border-2 border-cream-dark shadow-lg transition-all"><RotateCcw size={24} /></button>
</div>

{/* SVG MAP */}
<ComposableMap
projection="geoMercator"
projectionConfig={{ scale: 1000 }}
className="w-full h-full cursor-grab active:cursor-grabbing"
>
<ZoomableGroup
zoom={position.zoom}
center={position.coordinates}
onMoveEnd={(pos) => setPosition(pos)}
>
<Geographies geography={geoUrl}>
{({ geographies }) =>
geographies.map((geo) => {
const rawName = geo.properties.Propinsi || geo.properties.NAME_1 || geo.properties.name;
const backendId = normalizeId(rawName);
const prov = provinces.find(p => p.id === backendId || normalizeId(p.name) === backendId);

const isSelected = selectedId === prov?.id;
const isUnlocked = prov?.userProgress?.isUnlocked;
const isCompleted = prov?.userProgress?.isCompleted;

let fillColor = "#E2E8F0";
if (isSelected) fillColor = "#F04E36";
else if (isCompleted) fillColor = "#D4AF37";
else if (isUnlocked) fillColor = "#fbc9c3";

return (
<Geography
key={geo.rsmKey}
geography={geo}
onMouseEnter={() => setHoveredName(rawName)}
onMouseLeave={() => setHoveredName(null)}
onClick={() => prov && handleSelectProvince(prov)}
style={{
default: { fill: fillColor, stroke: "#FFF", strokeWidth: 0.5, outline: "none", transition: "all 300ms" },
hover: { fill: prov ? "#F04E36" : "#CBD5E1", cursor: prov ? "pointer" : "not-allowed", outline: "none", strokeWidth: 1.5 },
pressed: { fill: "#A52A1A", outline: "none" }
}}
/>
);
})
}
</Geographies>
</ZoomableGroup>
</ComposableMap>
</div>

{/* DETAIL CARD (HANYA MUNCUL SAAT DIKLIK) */}
<AnimatePresence>
{selectedProv && (
<motion.div
initial={{ opacity: 0, y: 50 }}
animate={{ opacity: 1, y: 0 }}
exit={{ opacity: 0, y: 50 }}
className="grid md:grid-cols-12 gap-8 bg-white p-10 rounded-[4rem] border-4 border-cream-dark shadow-2xl relative overflow-hidden"
>
{/* Background Large Number */}
<div className="absolute right-10 bottom-0 text-[20rem] font-serif font-black text-cream-dark/30 leading-none select-none pointer-events-none italic">
{selectedProv.userProgress?.quizzesCompleted ?? 0}
</div>

{/* Info Section */}
<div className="md:col-span-5 space-y-8 relative z-10">
<div className="flex items-center gap-6">
<div className={`p-6 rounded-[2rem] shadow-2xl ${selectedProv.userProgress?.isUnlocked ? 'bg-primary text-white' : 'bg-gray-200 text-gray-400'}`}>
{selectedProv.userProgress?.isUnlocked ? <MapPin size={40} /> : <Lock size={40} />}
</div>
<div>
<h3 className="text-primary text-xs font-black uppercase tracking-[0.3em] mb-1">Eksplorasi Budaya</h3>
<p className="text-5xl font-serif text-text font-black italic">{selectedProv.name}</p>
</div>
</div>

<div className="p-8 bg-cream/50 rounded-[2.5rem] border-2 border-cream-dark">
<div className="flex items-center gap-3 mb-4 text-primary">
<Info size={24} />
<span className="font-black text-[10px] uppercase tracking-widest">Sekilas Wilayah</span>
</div>
<p className="text-text font-medium text-lg leading-relaxed italic">"{selectedProv.description}"</p>
</div>

{selectedProv.userProgress?.isUnlocked ? (
<button
onClick={() => navigate(`/app/quest?province=${selectedProv.id}`)}
className="w-full py-6 bg-primary text-white font-black text-sm uppercase tracking-[0.4em] rounded-[2rem] hover:bg-text transition-all shadow-2xl shadow-primary/30"
>
Mulai Quest Budaya
</button>
) : (
<div className="py-6 bg-gray-100 rounded-[2rem] text-center border-2 border-dashed border-gray-300 font-black text-gray-400 uppercase tracking-widest text-xs">
Selesaikan misi sebelumnya untuk membuka wilayah ini
</div>
)}
</div>

{/* Culture Details Section */}
<div className="md:col-span-7 grid grid-cols-2 gap-4 relative z-10">
{selectedProv.culture ? (
<>
<CultureCard icon={Home} label="Rumah Adat" value={selectedProv.culture.house} />
<CultureCard icon={Utensils} label="Kuliner" value={selectedProv.culture.food} />
<CultureCard icon={Shirt} label="Busana" value={selectedProv.culture.clothing} />
<CultureCard icon={Music} label="Musik" value={selectedProv.culture.music} />
</>
) : (
<div className="col-span-2 flex items-center justify-center p-20 border-2 border-dashed border-cream-dark rounded-[3rem] text-text-light italic">
Catatan kebudayaan belum ditemukan dalam arsip...
</div>
)}
</div>
</motion.div>
)}
</AnimatePresence>
</div>

{/* GRID 38 WILAYAH (DAFTAR KARTU KECIL) */}
<div className="pt-20">
<h2 className="text-3xl font-serif font-black italic text-text mb-10 border-b-4 border-cream-dark pb-4 inline-block">
Arsip 38 Provinsi Nusantara
</h2>
<div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
{provinces.map((prov: any) => (
<button
key={prov.id}
onClick={() => handleSelectProvince(prov)}
className={`p-4 rounded-2xl border-2 transition-all text-left ${
selectedId === prov.id ? 'bg-primary border-primary text-white' : 'bg-white border-cream-dark hover:border-primary'
}`}
>
<div className="flex justify-between items-center mb-1">
<span className="text-[9px] font-black uppercase tracking-tighter opacity-70">
{prov.userProgress?.isUnlocked ? 'Unlocked' : 'Locked'}
</span>
{prov.userProgress?.isCompleted && <CheckCircle size={10} className="text-yellow-500" />}
</div>
<p className="font-serif font-bold text-sm truncate">{prov.name}</p>
</button>
))}
</div>
</div>
</div>
);
}

function CultureCard({ icon: Icon, label, value }: { icon: any, label: string, value: string }) {
if (!value) return null;
return (
<div className="bg-white/80 backdrop-blur p-6 rounded-[2rem] border-2 border-cream-dark shadow-sm hover:shadow-md transition-shadow">
<div className="flex items-center gap-2 mb-2 text-primary">
<Icon size={18} />
<span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
</div>
<p className="text-text font-bold text-base leading-tight">{value}</p>
</div>
);
}