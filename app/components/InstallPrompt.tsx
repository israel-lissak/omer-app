'use client';

import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

export default function InstallPrompt() {
  const { 
    deferredPrompt, 
    setDeferredPrompt, 
    isInstalled, 
    setIsInstalled
  } = useTheme();
  const [isPromptVisible, setIsPromptVisible] = useState(true); // State to control popup visibility

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setIsInstalled(true);
    }
    
    // Clear the deferred prompt after the user makes a choice
    setDeferredPrompt(null);
    setIsPromptVisible(false); // Close the popup
  };

  const handleDismiss = () => {
    setIsPromptVisible(false); // Close the popup
  };

  if (isInstalled || !deferredPrompt || !isPromptVisible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 dark:bg-black/70 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full mx-4 border border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">התקן את האפליקציה</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">התקן את האפליקציה על המכשיר שלך לגישה מהירה ונוחה יותר</p>
          <div className="flex flex-col space-y-3">
            <button
              onClick={handleInstallClick}
              className="bg-gray-800 dark:bg-gray-700 hover:bg-gray-700 dark:hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg shadow-md transition-all transform hover:scale-105 w-full"
            >
              התקן עכשיו
            </button>
            <button
              onClick={handleDismiss}
              className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-medium py-2 px-4 rounded-lg transition-colors"
            >
              לא עכשיו
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}