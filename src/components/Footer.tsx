import { useStore } from '../context/StoreContext';

export default function Footer() {
  const { settings } = useStore();

  return (
    <footer className="bg-stone-950 text-stone-400 py-6 border-t border-stone-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-right">
        <div>
          <span className="font-bold text-white">{settings.nameAr}</span>
          <span className="font-cinzel text-amber-400 font-bold mr-1.5 dir-ltr inline-block">({settings.nameEn})</span>
        </div>
        <div className="text-stone-500">
          <span>{settings.address}</span>
        </div>
      </div>
    </footer>
  );
}
