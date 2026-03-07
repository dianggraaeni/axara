export default function MemoryMatch({ provinceId, onComplete, onBack }: any) {
  return (
    <div className="text-center py-20 bg-white rounded-3xl border-2 border-cream-dark">
      <h2 className="text-2xl font-bold mb-4 text-text">Memory Match</h2>
      <p className="text-text-light mb-8">Game untuk provinsi {provinceId} sedang dalam pengembangan.</p>
      <div className="flex justify-center gap-4">
        <button onClick={onBack} className="px-6 py-3 bg-cream text-primary rounded-xl font-bold">Kembali</button>
        <button onClick={() => onComplete(6, 6, 120)} className="px-6 py-3 bg-primary text-white rounded-xl font-bold">Simulasi Menang</button>
      </div>
    </div>
  );
}