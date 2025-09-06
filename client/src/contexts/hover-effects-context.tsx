import { createContext, useContext, useEffect, useState } from 'react';

interface HoverEffectsContextType {
  hoverEffectsEnabled: boolean;
  toggleHoverEffects: () => void;
}

const HoverEffectsContext = createContext<HoverEffectsContextType | undefined>(undefined);

export function HoverEffectsProvider({ children }: { children: React.ReactNode }) {
  const [hoverEffectsEnabled, setHoverEffectsEnabled] = useState<boolean>(true);

  const toggleHoverEffects = () => {
    setHoverEffectsEnabled(prev => !prev);
  };

  // Load preference from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('hoverEffectsEnabled');
    if (stored !== null) {
      setHoverEffectsEnabled(JSON.parse(stored));
    }
  }, []);

  // Save preference to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('hoverEffectsEnabled', JSON.stringify(hoverEffectsEnabled));
  }, [hoverEffectsEnabled]);

  return (
    <HoverEffectsContext.Provider value={{ hoverEffectsEnabled, toggleHoverEffects }}>
      {children}
    </HoverEffectsContext.Provider>
  );
}

export function useHoverEffects() {
  const context = useContext(HoverEffectsContext);
  if (context === undefined) {
    throw new Error('useHoverEffects must be used within a HoverEffectsProvider');
  }
  return context;
}