import React, { createContext, useContext, useState, useEffect } from 'react';
import { sound } from '../utils/sound';

export type AppTheme = 'cyber' | 'editorial' | 'amber' | 'synthwave' | 'matrix' | 'oled';
export type PerspectiveMode = 'human' | 'terminal' | 'auditor';
export type CrtMode = 'off' | 'subtle' | 'retro';
export type LayoutDensity = 'bento' | 'compact';

interface CustomizationContextType {
  theme: AppTheme;
  setTheme: (theme: AppTheme) => void;
  perspective: PerspectiveMode;
  setPerspective: (mode: PerspectiveMode) => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  crtMode: CrtMode;
  setCrtMode: (mode: CrtMode) => void;
  showHologram: boolean;
  setShowHologram: (show: boolean) => void;
  layoutDensity: LayoutDensity;
  setLayoutDensity: (density: LayoutDensity) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isCustomizerOpen: boolean;
  setIsCustomizerOpen: (open: boolean) => void;
}

const CustomizationContext = createContext<CustomizationContextType | undefined>(undefined);

export const CustomizationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Read persisted preferences
  const [theme, setThemeState] = useState<AppTheme>(() => {
    return (localStorage.getItem('bm_theme') as AppTheme) || 'cyber';
  });

  const [perspective, setPerspectiveState] = useState<PerspectiveMode>(() => {
    return (localStorage.getItem('bm_perspective') as PerspectiveMode) || 'human';
  });

  const [soundEnabled, setSoundEnabledState] = useState<boolean>(() => {
    return sound.getEnabled();
  });

  const [crtMode, setCrtModeState] = useState<CrtMode>(() => {
    return (localStorage.getItem('bm_crt') as CrtMode) || 'subtle';
  });

  const [showHologram, setShowHologramState] = useState<boolean>(() => {
    const saved = localStorage.getItem('bm_hologram');
    return saved !== null ? saved === 'true' : true;
  });

  const [layoutDensity, setLayoutDensityState] = useState<LayoutDensity>(() => {
    return (localStorage.getItem('bm_density') as LayoutDensity) || 'bento';
  });

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isCustomizerOpen, setIsCustomizerOpen] = useState<boolean>(false);

  // Sync theme to root element attribute
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('bm_theme', theme);
  }, [theme]);

  const setTheme = (newTheme: AppTheme) => {
    setThemeState(newTheme);
    sound.playClick(850);
  };

  const setPerspective = (newMode: PerspectiveMode) => {
    setPerspectiveState(newMode);
    localStorage.setItem('bm_perspective', newMode);
    sound.playClick(950);
  };

  const setSoundEnabled = (enabled: boolean) => {
    setSoundEnabledState(enabled);
    sound.setEnabled(enabled);
    if (enabled) sound.playSuccess();
  };

  const setCrtMode = (mode: CrtMode) => {
    setCrtModeState(mode);
    localStorage.setItem('bm_crt', mode);
    sound.playClick(750);
  };

  const setShowHologram = (show: boolean) => {
    setShowHologramState(show);
    localStorage.setItem('bm_hologram', String(show));
    sound.playClick(900);
  };

  const setLayoutDensity = (density: LayoutDensity) => {
    setLayoutDensityState(density);
    localStorage.setItem('bm_density', density);
    sound.playClick(800);
  };

  return (
    <CustomizationContext.Provider
      value={{
        theme,
        setTheme,
        perspective,
        setPerspective,
        soundEnabled,
        setSoundEnabled,
        crtMode,
        setCrtMode,
        showHologram,
        setShowHologram,
        layoutDensity,
        setLayoutDensity,
        searchQuery,
        setSearchQuery,
        isCustomizerOpen,
        setIsCustomizerOpen,
      }}
    >
      {children}
    </CustomizationContext.Provider>
  );
};

export const useCustomization = () => {
  const context = useContext(CustomizationContext);
  if (!context) {
    throw new Error('useCustomization must be used within CustomizationProvider');
  }
  return context;
};
