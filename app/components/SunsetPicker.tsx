'use client';

import React from 'react';
import { useTheme } from '../context/ThemeContext';
import cities from 'lib/cities.json'; // Assuming you have a JSON file with city data


export default function SunsetPicker() {
  const { setDuskTime, selectedCity, setSelectedCity } = useTheme();

  return (
    <div className='flex w-full justify-between items-center text-gray-800 dark:text-gray-100'>
      <label htmlFor="city">
        בחר מיקום
      </label>
      <select
        id="city"
        value={selectedCity.name}
        onChange={(e) =>
          setSelectedCity(cities.find((c) => c.name === e.target.value)!)
        }
        className="py-2 px-4 rounded-lg shadow-md p-2 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-100 appearance-none pr-8"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='currentColor'%3E%3Cpath fill-rule='evenodd' d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z' clip-rule='evenodd'/%3E%3C/svg%3E")`,
          backgroundPosition: 'right 0.5rem center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: '1rem',
        }}
      >
        {cities.map((city) => (
          <option key={city.name} value={city.name}>
            {city.displayName}
          </option>
        ))}
      </select>
    </div>
  );
}
