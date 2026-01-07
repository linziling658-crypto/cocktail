
import React from 'react';
import { Mood } from './types';
import { 
  CloudSun, 
  Wind, 
  Heart, 
  Zap, 
  Moon, 
  PartyPopper 
} from 'lucide-react';

export const MOODS = [
  { id: Mood.CHILL, icon: <Moon size={20} />, color: 'bg-[#e2e8f0]', textColor: 'text-slate-600' },
  { id: Mood.ENERGETIC, icon: <Zap size={20} />, color: 'bg-[#fef3c7]', textColor: 'text-amber-700' },
  { id: Mood.ROMANTIC, icon: <Heart size={20} />, color: 'bg-[#fce7f3]', textColor: 'text-rose-700' },
  { id: Mood.STRESSED, icon: <Wind size={20} />, color: 'bg-[#f1f5f9]', textColor: 'text-slate-500' },
  { id: Mood.CELEBRATORY, icon: <PartyPopper size={20} />, color: 'bg-[#ffedd5]', textColor: 'text-orange-700' },
  { id: Mood.MELANCHOLY, icon: <CloudSun size={20} />, color: 'bg-[#e0f2fe]', textColor: 'text-sky-700' },
];

export const DEFAULT_COCKTAILS = []; // Clean start
