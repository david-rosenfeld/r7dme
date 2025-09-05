import { createContext, useContext, useEffect, useState } from 'react';

type ColorTheme = 'cyan' | 'green';

interface ThemeContextType {
  colorTheme: ColorTheme;
  toggleColorTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [colorTheme, setColorTheme] = useState<ColorTheme>('cyan');

  const toggleColorTheme = () => {
    setColorTheme(prev => prev === 'cyan' ? 'green' : 'cyan');
  };

  useEffect(() => {
    const root = document.documentElement;
    
    if (colorTheme === 'cyan') {
      // Cyan theme colors (original)
      root.style.setProperty('--primary', 'hsl(196, 75%, 65%)'); // #42B8DD
      root.style.setProperty('--accent', 'hsl(196, 75%, 65%)');
      root.style.setProperty('--ring', 'hsl(196, 75%, 65%)');
      root.style.setProperty('--sidebar-primary', 'hsl(196, 75%, 65%)');
      root.style.setProperty('--sidebar-accent-foreground', 'hsl(196, 75%, 65%)');
      root.style.setProperty('--sidebar-ring', 'hsl(196, 75%, 65%)');
      root.style.setProperty('--chart-1', 'hsl(196, 75%, 65%)');
      // Title text colors for cyan theme
      root.style.setProperty('--foreground', 'hsl(196, 75%, 65%)');
    } else {
      // Green theme colors
      root.style.setProperty('--primary', 'hsl(158, 77%, 57%)'); // #3BEDB7
      root.style.setProperty('--accent', 'hsl(158, 77%, 57%)');
      root.style.setProperty('--ring', 'hsl(158, 77%, 57%)');
      root.style.setProperty('--sidebar-primary', 'hsl(158, 77%, 57%)');
      root.style.setProperty('--sidebar-accent-foreground', 'hsl(158, 77%, 57%)');
      root.style.setProperty('--sidebar-ring', 'hsl(158, 77%, 57%)');
      root.style.setProperty('--chart-1', 'hsl(158, 77%, 57%)');
      // Title text colors for green theme
      root.style.setProperty('--foreground', 'hsl(158, 77%, 57%)');
    }
  }, [colorTheme]);

  return (
    <ThemeContext.Provider value={{ colorTheme, toggleColorTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}