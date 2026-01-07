
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
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setWeather({ temp: Math.round(18 + Math.random() * 10), condition: 'Gentle Breeze', city: 'Local' });
      }, () => {
        setWeather({ temp: 24, condition: 'Clear Sky', city: 'M.LIN' });
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
      console.error(err);
      setError(err.message || "Failed to brew magic. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const Slider = ({ label, value, icon: Icon, onChange }: any) => (
    <div className="space-y-4">
      <div className="flex justify-between items-center text-[9px] uppercase tracking-[0.3em] text-stone-400 font-bold px-1">
        <span className="flex items-center gap-2"><Icon size={12}/> {label}</span>
        <span className="opacity-50">{value}%</span>
      </div>
      <input 
        type="range" value={value} min="0" max="100" onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full"
      />
    </div>
  );

  if (view === 'home') {
    return (
      <div className="min-h-screen bg-[#fdfaf7] px-8 pt-20 pb-16 animate-fade-scale flex flex-col relative overflow-hidden">
        {/* Background Decorative Blobs */}
        <div className="absolute top-[-10%] left-[-15%] w-80 h-80 bg-stone-200/20 blur-[100px] rounded-full animate-float"></div>
        <div className="absolute bottom-[15%] right-[-10%] w-96 h-96 bg-stone-100/30 blur-[120px] rounded-full animate-float" style={{ animationDelay: '4s' }}></div>

        <header className="mb-14 flex justify-between items-start z-10">
          <div>
            <h1 className="text-xl font-bold serif text-stone-800 tracking-[0.2em]">M.LIN</h1>
            <p className="text-stone-400 font-medium text-[9px] uppercase tracking-[0.2em] mt-3 flex items-center gap-2 bg-white/30 backdrop-blur-xl px-4 py-2 rounded-full border border-white/40 w-fit shadow-sm">
              <ThermometerSun size={12} className="text-stone-300" />
              {weather.city} • {weather.temp}°C
            </p>
          </div>
          <button className="p-4 liquid-glass rounded-full text-stone-400 border-none transition-all active:scale-90">
            <Bookmark size={18} />
          </button>
        </header>

        <main className="space-y-12 flex-1 z-10">
          <section className="space-y-6">
            <h2 className="text-[9px] font-bold uppercase tracking-[0.4em] text-stone-300 px-2">Vibration</h2>
            <div className="space-y-10 liquid-glass !p-10 rounded-[3rem]">
              <Slider label="Joy" value={mood.joy} icon={Smile} onChange={(v: any) => setMood({...mood, joy: v})} />
              <Slider label="Energy" value={mood.energy} icon={Activity} onChange={(v: any) => setMood({...mood, energy: v})} />
              <Slider label="Calm" value={mood.calm} icon={Droplets} onChange={(v: any) => setMood({...mood, calm: v})} />
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-[9px] font-bold uppercase tracking-[0.4em] text-stone-300 px-2">Preference</h2>
            <div className="grid grid-cols-2 gap-5">
              <GlassCard className="!p-6 space-y-4">
                <span className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">Strength</span>
                <select 
                  className="bg-transparent border-none text-stone-700 font-serif text-lg italic focus:ring-0 w-full p-0 cursor-pointer"
                  value={taste.abv}
                  onChange={(e) => setTaste({...taste, abv: e.target.value as any})}
                >
                  <option>None</option><option>Low</option><option>Medium</option><option>High</option>
                </select>
              </GlassCard>
              <GlassCard className="!p-6 space-y-4">
                <span className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">Sweetness</span>
                <div className="flex gap-2.5 pt-1">
                   {[1,2,3,4,5].map(v => (
                     <button 
                       key={v}
                       onClick={() => setTaste({...taste, sweetness: v})}
                       className={`w-3.5 h-3.5 rounded-full transition-all duration-300 ${taste.sweetness >= v ? 'bg-stone-800 scale-110' : 'bg-white/40 border border-white/50'}`}
                     />
                   ))}
                </div>
              </GlassCard>
            </div>
          </section>

          {error && (
            <div className="flex items-center gap-3 p-4 bg-red-50/50 backdrop-blur-md border border-red-100 rounded-2xl text-red-800 text-xs animate-in fade-in slide-in-from-top-2">
              <AlertCircle size={14} className="shrink-0" />
              <p className="font-medium">{error}</p>
            </div>
          )}
        </main>

        <div className="flex justify-center mt-12 z-10">
          <button 
            onClick={handleRecommend}
            disabled={loading}
            className={`py-5 text-stone-50 rounded-full font-medium text-base flex items-center justify-center gap-3 active:scale-[0.96] transition-all shadow-xl w-full ${loading ? 'bg-stone-400 cursor-not-allowed' : 'bg-stone-900 hover:bg-black'}`}
          >
            {loading ? <RefreshCcw className="animate-spin" size={18} /> : <><span>Enjoy</span> <ArrowRight size={16}/></>}
          </button>
        </div>
      </div>
    );
  }

  if (view === 'results') {
    return (
      <div className="min-h-screen bg-[#fdfcfb] px-6 pt-16 animate-fade-scale flex flex-col relative overflow-hidden">
        <div className="flex flex-col items-center mb-10 text-center space-y-4 z-10">
           <span className="text-[9px] uppercase font-bold tracking-[0.5em] text-stone-300">Synthesis</span>
           <h2 className="text-3xl font-serif italic text-stone-800">Your Essence</h2>
           <div className="flex gap-4 text-[9px] text-stone-400 font-bold uppercase tracking-widest bg-white/40 backdrop-blur-2xl px-5 py-2.5 rounded-full border border-white/50 shadow-sm">
             <span>{weather.temp}°C</span>
             <span className="opacity-30">•</span>
             <span>Energy {mood.energy}%</span>
             <span className="opacity-30">•</span>
             <span>{taste.abv} ABV</span>
           </div>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto no-scrollbar pb-24 z-10 px-1">
          {recommendations.map((drink, idx) => (
            <div 
              key={drink.id}
              onClick={() => { setSelectedCocktail(drink); setView('detail'); }}
              className="animate-in fade-in slide-in-from-bottom-12 duration-1000"
              style={{ animationDelay: `${idx * 150}ms` }}
            >
              <GlassCard className="!p-0 border-none rounded-[2.5rem] overflow-hidden group">
                <div className="flex h-52">
                  <div className="w-1/3 overflow-hidden">
                    <img src={drink.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2000ms]" alt={drink.name} />
                  </div>
                  <div className="flex-1 p-6 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-bold serif leading-tight text-stone-800">{drink.name}</h3>
                        <Star size={10} className="fill-amber-400 text-amber-400 mt-1" />
                      </div>
                      <p className="text-[9px] text-stone-400 font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
                         <span>{drink.abv}</span>
                         <span className="w-1 h-1 bg-stone-100 rounded-full"></span>
                         <span className="text-orange-300/80 flex items-center gap-1 font-black tracking-normal"><Flame size={12}/> {drink.calories} KCAL</span>
                      </p>
                      <p className="text-[11px] text-stone-500 leading-relaxed italic line-clamp-2">"{drink.matchReason}"</p>
                    </div>
                    <div className="flex justify-between items-center text-stone-200 pt-4 border-t border-white/10">
                       <span className="text-[8px] uppercase font-bold tracking-widest">IBA Professional</span>
                       <div className="w-8 h-8 rounded-full liquid-glass flex items-center justify-center">
                         <ArrowRight size={14} className="text-stone-400" />
                       </div>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </div>
          ))}
        </div>

        <button 
          onClick={() => setView('home')}
          className="mb-10 py-5 liquid-glass border-white/40 text-stone-400 rounded-full font-bold text-[9px] uppercase tracking-[0.4em] transition-all"
        >
          Reset Session
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen animate-fade-scale bg-white overflow-y-auto">
      <div className="h-[55vh] relative overflow-hidden">
        <img src={selectedCocktail?.image} className="w-full h-full object-cover" alt={selectedCocktail?.name} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-white"></div>
        <button 
          onClick={() => setView('results')}
          className="absolute top-14 left-6 p-4 liquid-glass rounded-full shadow-lg text-stone-800 border-none transition-transform active:scale-90"
        >
          <ChevronLeft size={24} />
        </button>
      </div>

      <div className="px-10 -mt-24 relative space-y-16 pb-24 z-20">
        <div className="text-center space-y-4">
          <h2 className="text-5xl font-black serif text-stone-900 tracking-tighter leading-none">{selectedCocktail?.name}</h2>
          <div className="flex justify-center items-center gap-5 text-[9px] font-bold uppercase tracking-[0.3em] text-stone-300">
             <span className="flex items-center gap-2"><Wine size={14}/> {selectedCocktail?.glassType}</span>
             <span className="w-1 h-1 rounded-full bg-stone-100"></span>
             <span className="flex items-center gap-2 text-orange-200/60"><Flame size={14}/> {selectedCocktail?.calories} KCAL</span>
             <span className="w-1 h-1 rounded-full bg-stone-100"></span>
             <span>{selectedCocktail?.abv}</span>
          </div>
        </div>

        <GlassCard className="!bg-stone-50/10 !p-10 border-white/40 text-stone-600 text-lg leading-relaxed text-center font-medium italic backdrop-blur-3xl">
          "{selectedCocktail?.matchReason}"
        </GlassCard>

        {/* Flavor Intensity Bars */}
        <div className="grid grid-cols-4 gap-6 px-4">
          {Object.entries(selectedCocktail?.flavorProfile || {}).map(([key, val]) => (
            <div key={key} className="space-y-4 text-center">
              <div className="text-[8px] uppercase font-black text-stone-300 tracking-[0.4em]">{key}</div>
              <div className="h-32 liquid-glass rounded-full relative overflow-hidden flex flex-col justify-end p-1 border-white/30">
                <div className="bg-stone-800 w-full rounded-full transition-all duration-[2000ms] ease-out shadow-sm" style={{ height: `${(val as number) * 10}%` }}></div>
              </div>
              <div className="text-[10px] font-serif italic text-stone-400 font-bold opacity-40">{val}</div>
            </div>
          ))}
        </div>

        <div className="space-y-10">
          <h3 className="text-2xl font-bold serif border-b border-stone-50 pb-6 text-stone-800">Ingredients</h3>
          <div className="space-y-5">
            {selectedCocktail?.ingredients.map((ing, i) => (
              <div key={i} className="flex justify-between items-baseline py-2 group">
                <span className="text-stone-800 font-semibold text-lg">{ing.name}</span>
                <div className="flex-1 mx-6 border-b border-stone-100 border-dotted group-hover:border-stone-200 transition-colors"></div>
                <span className="text-stone-400 font-serif italic text-lg">{ing.amount}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-10">
          <h3 className="text-2xl font-bold serif border-b border-stone-100 pb-6 text-stone-800">The Ritual</h3>
          <div className="space-y-12">
            {selectedCocktail?.instructions.map((step, i) => (
              <div key={i} className="flex gap-10">
                <span className="text-6xl font-serif italic text-stone-100 shrink-0 leading-none">{(i+1).toString().padStart(2, '0')}</span>
                <p className="text-stone-500 leading-relaxed text-lg pt-2 font-medium opacity-90 italic">
                   {step}
                </p>
              </div>
            ))}
          </div>
        </div>

        <button className="w-full py-7 bg-stone-900 text-stone-50 rounded-full font-bold shadow-2xl active:scale-[0.98] transition-all text-lg tracking-tight">
          Scribe to Journal
        </button>
      </div>
    </div>
  );
};

export default App;
