'use client';

import { useState, useRef, useEffect } from 'react';
import { IoSettingsOutline } from 'react-icons/io5';
import { useTheme } from '../context/ThemeContext';
import { getOmerCount } from '@/lib/omer';

interface SettingsMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsMenu = ({ isOpen, onClose }: SettingsMenuProps) => {
  const { 
    isDarkMode, 
    toggleDarkMode,
    deferredPrompt,
    isInstalled,
    canInstall
  } = useTheme();
  const [isInstalling, setIsInstalling] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        const settingsButton = document.querySelector('button[aria-label="Settings"]');
        if (settingsButton && settingsButton.contains(event.target as Node)) {
          return;
        }
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleInstall = async () => {
    if (!deferredPrompt) {
      console.error('Deferred prompt is not available.');
      return;
    }

    if (isInstalled) {
      console.log('The app is already installed.');
      return;
    }

    if (!canInstall) {
      console.log('Installation is not supported on this device.');
      return;
    }

    try {
      setIsInstalling(true);
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;

      if (choiceResult.outcome === 'accepted') {
      console.log('User accepted the install prompt');
      } else {
      console.log('User dismissed the install prompt');
      }
    } catch (error) {
      console.error('Error during installation:', error);
    } finally {
      setIsInstalling(false);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div ref={menuRef} className="fixed bottom-12 left-0 right-0 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-lg-top p-4 w-full z-50">
      <div className="flex flex-col space-y-4">
        <div className="text-gray-800 dark:text-gray-100 text-lg font-semibold mb-2">הגדרות</div>
        
        <div className="flex items-center justify-between text-gray-800 dark:text-gray-100">
          <span>מצב כהה</span>
          <div className="flex items-center">
            <button 
              onClick={toggleDarkMode}
              className={`w-12 h-6 rounded-full relative transition-colors duration-200 ${
                isDarkMode ? 'bg-gray-600' : 'bg-gray-300'
              }`}
              aria-label="Toggle dark mode"
            >
              <div className={`absolute right-1 top-1 w-4 h-4 rounded-full transition-transform duration-200 ${
                isDarkMode ? 'bg-white translate-x-[-1.5rem]' : 'bg-white'
              }`}></div>
            </button>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-gray-800 dark:text-gray-100">
          <span>התקן אפליקציה</span>
          <div className="flex items-center">
            <button 
              onClick={handleInstall}
              className={`py-2 px-4 rounded-lg shadow-md transition-all transform hover:scale-105 ${
                isInstalled || !canInstall
                  ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                  : isInstalling
                  ? 'bg-gray-400 dark:bg-gray-500 text-white cursor-wait'
                  : 'bg-gray-700 dark:bg-gray-600 hover:bg-gray-600 dark:hover:bg-gray-500 text-white'
              }`}
              disabled={isInstalled || !canInstall || isInstalling}
              aria-label="Install app"
            >
              {isInstalling ? 'מתקין...' : isInstalled ? 'מותקן' : canInstall ? 'התקן' : 'לא נתמך'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Footer = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const omer = getOmerCount();
  const buttonRef = useRef<HTMLButtonElement>(null);

  const toggleSettings = () => {
    setIsSettingsOpen(prev => !prev);
  };

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-gray-100 dark:bg-gray-800 p-4 flex justify-between items-center shadow-md">
      <div className="text-xl text-gray-600 dark:text-gray-300 flex items-center w-full">
        <p className="text-xl text-center text-gray-600 dark:text-gray-300 w-full">{omer?.date}</p>
      </div>
      <button
        ref={buttonRef}
        onClick={toggleSettings}
        className="text-gray-800 dark:text-gray-100 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        aria-label="Settings"
      >
        <IoSettingsOutline size={24} />
      </button>
      <SettingsMenu isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </footer>
  );
};

export default Footer; 