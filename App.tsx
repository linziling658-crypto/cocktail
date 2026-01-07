
import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  Bookmark, 
  Flame, 
  Wine,
  ChevronLeft,
  Star,
  RefreshCcw,
  Droplets,
  Activity,
  Smile,
  ThermometerSun,
  AlertCircle
} from 'lucide-react';
import { GlassCard } from './components/GlassCard';
import { Cocktail, WeatherInfo, MoodProfile, TastePreference } from './types';
import { getCocktailRecommendations } from './services/geminiService';

const App: React.FC = () => {
  const [view, setView] = useState<'home' | 'results' | 'detail'>('home');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [weather, setWeather] = useState<WeatherInfo>({ temp: 22, condition: 'Clear', city: 'London' });
  
  const [mood, setMood] = useState<MoodProfile>({ joy: 65, energy: 40, calm: 75 });
  const [taste, setTaste] = useState<TastePreference>({ abv: 'Medium', sweetness: 3, sourness: 3 });
  const [recommendations, setRecommendations] = useState<Cocktail[]>([]);
  const [selectedCocktail, setSelectedCocktail] = useState<Cocktail | null>(null);

  useEffect(() => {
    // 模拟地理位置获取
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setWeather({ temp: 26, condition: 'Sunny', city: 'Current Location' });
      }, () => {
        setWeather({ temp: 24, condition: 'Clear', city: 'M.LIN Lab' });
      });
    }
  }, []);

  const handleRecommend = async () => {
    setLoading(true);
    setError(null);
    try {
      const results = await getCocktailRecommendations(weather.temp, mood, taste);
      setRecommendations(results);
      setView('results');
    } catch (err: any) {
      console.error("API Error:", err);
      setError(err.message || "Something went wrong. Please check your API key.");
    } finally {
      setLoading(false);
    }
  };

  const Slider = ({ label, value, icon: Icon, onChange }: any) => (
    <div className="space-y-4">
      <div className="flex justify-between items-center text-[10px] uppercase tracking-[0.2em] text-stone-400 font-bold">
        <span className="flex items-center gap-2"><Icon size={14}/> {label}</span>
        <span>{value}%</span>
      </div>
      <input 
        type="range" value={value} min="0" max="100" onChange={(e) => onChange(parseInt(e.target.value))}
      />
    </div>
  );

  if (view === 'home') {
    return (
      <div className="h-full flex flex-col bg-[#fdfaf7] relative overflow-hidden animate-fade-scale">
        {/* Background blobs for 6.1" depth */}
        <div className="absolute top-[-5%] right-[-10%] w-72 h-72 bg-orange-100/30 blur-[80px] rounded-full animate-float"></div>
        <div className="absolute bottom-[20%] left-[-15%] w-80 h-80 bg-stone-200/40 blur-[100px] rounded-full animate-float" style={{ animationDelay: '3s' }}></div>

        {/* Content Header - iOS Standard Padding */}
        <header className="px-8 pt-[calc(env(safe-area-inset-top)+10px)] pb-6 flex justify-between items-end z-10 shrink-0">
          <div>
            <h1 className="text-2xl font-bold serif text-stone-900 tracking-wider">M.LIN</h1>
            <div className="mt-2 flex items-center gap-2 px-3 py-1.5 bg-white/40 backdrop-blur-xl border border-white/50 rounded-full w-fit">
               <ThermometerSun size={12} className="text-orange-300" />
               <span className="text-[10px] font-bold text-stone-500 uppercase tracking-tighter">{weather.city} • {weather.temp}°C</span>
            </div>
          </div>
          <button className="w-12 h-12 flex items-center justify-center liquid-glass rounded-full text-stone-500 border-none active:scale-90 transition-transform">
            <Bookmark size={20} />
          </button>
        </header>

        {/* Main Controls - Dynamic Height */}
        <main className="flex-1 px-8 overflow-y-auto no-scrollbar z-10 space-y-10 pb-32">
          <section className="space-y-6">
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-300 ml-1">Current Vibration</h2>
            <div className="space-y-12 liquid-glass !p-10 rounded-[2.5rem] shadow-sm">
              <Slider label="Joy" value={mood.joy} icon={Smile} onChange={(v: any) => setMood({...mood, joy: v})} />
              <Slider label="Energy" value={mood.energy} icon={Activity} onChange={(v: any) => setMood({...mood, energy: v})} />
              <Slider label="Calm" value={mood.calm} icon={Droplets} onChange={(v: any) => setMood({...mood, calm: v})} />
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-300 ml-1">Taste Profile</h2>
            <div className="grid grid-cols-2 gap-4">
              <GlassCard className="!p-6 flex flex-col justify-between h-32">
                <span className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">Alcohol</span>
                <select 
                  className="bg-transparent border-none text-stone-800 font-serif text-xl italic focus:ring-0 p-0 w-full"
                  value={taste.abv}
                  onChange={(e) => setTaste({...taste, abv: e.target.value as any})}
                >
                  <option>None</option><option>Low</option><option>Medium</option><option>High</option>
                </select>
              </GlassCard>
              <GlassCard className="!p-6 flex flex-col justify-between h-32">
                <span className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">Sweetness</span>
                <div className="flex gap-2">
                   {[1,2,3,4,5].map(v => (
                     <button 
                       key={v}
                       onClick={() => setTaste({...taste, sweetness: v})}
                       className={`w-3 h-3 rounded-full transition-all ${taste.sweetness >= v ? 'bg-stone-800 scale-110' : 'bg-stone-200'}`}
                     />
                   ))}
                </div>
              </GlassCard>
            </div>
          </section>
        </main>

        {/* Footer Action - Fixed at bottom safe area */}
        <div className="absolute bottom-0 left-0 w-full px-8 pb-[calc(env(safe-area-inset-bottom)+20px)] pt-6 bg-gradient-to-t from-[#fdfaf7] via-[#fdfaf7] to-transparent z-20">
          {error && (
            <div className="mb-4 flex items-center gap-3 p-4 bg-red-50/80 border border-red-100 rounded-2xl text-red-800 text-[11px] animate-in slide-in-from-bottom-2">
              <AlertCircle size={16} className="shrink-0" />
              <p className="font-semibold leading-tight">{error}</p>
            </div>
          )}
          <button 
            onClick={handleRecommend}
            disabled={loading}
            className={`w-full py-5 rounded-full font-bold text-base flex items-center justify-center gap-3 shadow-2xl transition-all active:scale-[0.97] ${loading ? 'bg-stone-300 text-stone-500' : 'bg-stone-900 text-white hover:bg-black'}`}
          >
            {loading ? <RefreshCcw className="animate-spin" size={20} /> : <><span>Mix Recommendation</span> <ArrowRight size={18}/></>}
          </button>
        </div>
      </div>
    );
  }

  if (view === 'results') {
    return (
      <div className="h-full flex flex-col bg-[#fdfcfb] animate-fade-scale overflow-hidden">
        <header className="px-6 pt-[calc(env(safe-area-inset-top)+20px)] pb-6 flex flex-col items-center text-center gap-2">
           <span className="text-[10px] uppercase font-bold tracking-[0.4em] text-stone-300">Synthesis Complete</span>
           <h2 className="text-3xl font-serif italic text-stone-800">Your Essence</h2>
        </header>

        <div className="flex-1 overflow-y-auto no-scrollbar px-6 space-y-5 pb-32">
          {recommendations.map((drink, idx) => (
            <div 
              key={drink.id}
              onClick={() => { setSelectedCocktail(drink); setView('detail'); }}
              className="animate-in fade-in slide-in-from-bottom-8 duration-700"
              style={{ animationDelay: `${idx * 150}ms` }}
            >
              <GlassCard className="!p-0 overflow-hidden border-none rounded-[2rem] shadow-sm active:scale-[0.98]">
                <div className="flex h-44">
                  <div className="w-32 shrink-0">
                    <img src={drink.image} className="w-full h-full object-cover" alt={drink.name} />
                  </div>
                  <div className="flex-1 p-5 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-bold serif text-stone-900 line-clamp-1">{drink.name}</h3>
                        <div className="flex gap-0.5 mt-1">
                          {[...Array(drink.matchScore)].map((_, i) => <Star key={i} size={8} className="fill-amber-400 text-amber-400" />)}
                        </div>
                      </div>
                      <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest mt-1 mb-2">{drink.abv} • {drink.calories} KCAL</p>
                      <p className="text-[11px] text-stone-500 italic line-clamp-2">"{drink.matchReason}"</p>
                    </div>
                    <div className="flex justify-end">
                      <div className="w-8 h-8 rounded-full bg-stone-900 flex items-center justify-center text-white">
                        <ArrowRight size={14} />
                      </div>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </div>
          ))}
        </div>

        <div className="absolute bottom-0 left-0 w-full px-8 pb-[calc(env(safe-area-inset-bottom)+20px)] pt-6 bg-gradient-to-t from-[#fdfcfb] via-[#fdfcfb] to-transparent">
          <button 
            onClick={() => setView('home')}
            className="w-full py-4 liquid-glass border-stone-200 text-stone-400 rounded-full font-bold text-[10px] uppercase tracking-[0.3em]"
          >
            Refine Search
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-white flex flex-col overflow-hidden animate-fade-scale">
      {/* Detail Image - Proportional for 6.1" */}
      <div className="h-[45%] relative shrink-0">
        <img src={selectedCocktail?.image} className="w-full h-full object-cover" alt={selectedCocktail?.name} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-white/90"></div>
        <button 
          onClick={() => setView('results')}
          className="absolute top-[calc(env(safe-area-inset-top)+10px)] left-6 w-12 h-12 flex items-center justify-center liquid-glass rounded-full text-stone-900"
        >
          <ChevronLeft size={24} />
        </button>
      </div>

      {/* Information Container */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-10 -mt-16 relative z-10 space-y-12 pb-24">
        <div className="text-center space-y-3">
          <h2 className="text-4xl font-black serif text-stone-900">{selectedCocktail?.name}</h2>
          <div className="flex justify-center items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-stone-400">
             <span className="flex items-center gap-1.5"><Wine size={12}/> {selectedCocktail?.glassType}</span>
             <span>•</span>
             <span>{selectedCocktail?.abv} Vol</span>
          </div>
        </div>

        <GlassCard className="!bg-stone-50/50 !p-8 border-stone-100/50 text-stone-600 text-base italic text-center font-medium leading-relaxed">
          "{selectedCocktail?.matchReason}"
        </GlassCard>

        <div className="grid grid-cols-4 gap-4">
           {Object.entries(selectedCocktail?.flavorProfile || {}).map(([key, val]) => (
             <div key={key} className="flex flex-col items-center gap-3">
               <div className="text-[8px] font-black uppercase text-stone-300 tracking-widest">{key}</div>
               <div className="h-24 w-full liquid-glass rounded-full flex flex-col justify-end p-1">
                 <div className="bg-stone-800 rounded-full transition-all duration-[1.5s]" style={{ height: `${(val as number) * 10}%` }}></div>
               </div>
             </div>
           ))}
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-bold serif border-b border-stone-50 pb-4">Components</h3>
          <div className="space-y-4">
            {selectedCocktail?.ingredients.map((ing, i) => (
              <div key={i} className="flex justify-between text-base">
                <span className="text-stone-800 font-semibold">{ing.name}</span>
                <span className="text-stone-400 italic">{ing.amount}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          <h3 className="text-xl font-bold serif border-b border-stone-50 pb-4">The Ritual</h3>
          <div className="space-y-8">
            {selectedCocktail?.instructions.map((step, i) => (
              <div key={i} className="flex gap-6 items-start">
                <span className="text-4xl font-serif italic text-stone-100 leading-none">{(i+1)}</span>
                <p className="text-stone-500 italic text-base leading-relaxed">{step}</p>
              </div>
            ))}
          </div>
        </div>

        <button className="w-full py-6 bg-stone-900 text-white rounded-full font-bold shadow-xl active:scale-95 transition-transform">
          Save to Collection
        </button>
      </div>
    </div>
  );
};

export default App;
