
import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className = "", onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={`liquid-glass-card rounded-[2.5rem] p-6 transition-all duration-500 active:scale-[0.98] ${className}`}
    >
      {children}
    </div>
  );
};
