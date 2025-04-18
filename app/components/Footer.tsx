'use client';

import { useState, useRef, useEffect } from 'react';
import { IoSettingsOutline } from 'react-icons/io5';
import { useTheme } from '../context/ThemeContext';
import { getOmerCount } from '@/lib/omer';

interface OmerData {
  count: number;
  text: string;
  sefirah: string;
  date: string;
}

interface SettingsMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsMenu = ({ isOpen, onClose }: SettingsMenuProps) => {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        // Check if the click was on the settings button
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
                isDarkMode ? 'bg-gray-600' : 'bg-gray-200'
              }`}
            >
              <div className={`absolute right-1 top-1 w-4 h-4 rounded-full transition-transform duration-200 ${
                isDarkMode ? 'bg-white translate-x-[-1.5rem]' : 'bg-white'
              }`}></div>
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
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (buttonRef.current?.contains(event.target as Node)) {
        setIsSettingsOpen(prev => !prev);
        return;
      }
      
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsSettingsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-gray-100 dark:bg-gray-800 p-4 flex justify-between items-center shadow-md">
      <div className="text-xl text-gray-600 dark:text-gray-300 flex items-center w-full">
        <p className="text-xl text-center text-gray-600 dark:text-gray-300 w-full">{omer?.date}</p>
      </div>
      <button
        ref={buttonRef}
        className="text-gray-800 dark:text-gray-100 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
      >
        <IoSettingsOutline size={24} />
      </button>
      <SettingsMenu isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </footer>
  );
};

export default Footer; 