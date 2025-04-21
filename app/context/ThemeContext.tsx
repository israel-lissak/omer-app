'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { Location, HDate, Zmanim } from '@hebcal/core';
import cities from 'lib/cities.json'; // Assuming you have a JSON file with city data


type City = {
  name: string;
  displayName: string;
  lat: number;
  lon: number;
  il: boolean;
  tz: string;
};

type ThemeContextType = {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  deferredPrompt: BeforeInstallPromptEvent | null;
  setDeferredPrompt: (prompt: BeforeInstallPromptEvent | null) => void;
  isInstalled: boolean;
  setIsInstalled: (installed: boolean) => void;
  canInstall: boolean;
  duskTime: Date | null;
  setDuskTime: (time: Date | null) => void;
  selectedCity: City;
  setSelectedCity: (city: City) => void;
};

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [canInstall, setCanInstall] = useState(false);
  const [duskTime, setDuskTime] = useState<Date | null>(null);

  // Initialize selectedCity with a default value
  const [selectedCity, setSelectedCity] = useState<City>(() => {
    if (typeof window !== 'undefined') {
      const savedCity = localStorage.getItem('selectedCity');
      return savedCity ? JSON.parse(savedCity) : cities[0];
    }
    return cities[0]; // Fallback for SSR
  });

  // Update selectedCity from localStorage on the client side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCity = localStorage.getItem('selectedCity');
      if (savedCity) {
        setSelectedCity(JSON.parse(savedCity));
      }
    }
  }, []);

  // Save selectedCity to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('selectedCity', JSON.stringify(selectedCity));
    }
  }, [selectedCity]);

  // useEffect to calculate dusk time based on selected city
  useEffect(() => {
    const getDusk = () => {
      const location = new Location(
        selectedCity.lat,
        selectedCity.lon,
        false,
        selectedCity.tz,
        selectedCity.name,
      );
      const hdate = new HDate(new Date());
      const zmanim = new Zmanim(hdate, location.getLatitude(), location.getLongitude());

      setDuskTime(zmanim.dusk());
    };

    getDusk();
  }, [selectedCity]);


  // useEffect to check theme preference on initial load
  useEffect(() => {
    // Check if user has a theme preference in localStorage
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    if (newTheme) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <ThemeContext.Provider value={{ 
      isDarkMode, 
      toggleDarkMode,
      deferredPrompt,
      setDeferredPrompt,
      isInstalled,
      setIsInstalled,
      canInstall,
      duskTime,
      setDuskTime,
      selectedCity,
      setSelectedCity
    }}>
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