'use client';

import React, { useState, useEffect } from 'react';
import { HDate, Location, Zmanim } from '@hebcal/core';
import { useTheme } from '../context/ThemeContext';


type City = {
    name: string;
    displayName: string;
    lat: number;
    lon: number;
    il: boolean;
    tz: string;
  };

const cities: City[] = [
    { name: 'Tel Aviv', displayName: 'תל אביב', lat: 32.0853, lon: 34.7818, tz: 'Asia/Jerusalem' , il: true },
    { name: 'Jerusalem', displayName: 'ירושלים', lat: 31.7683, lon: 35.2137, tz: 'Asia/Jerusalem', il: true },
    { name: 'Haifa', displayName: 'חיפה', lat: 32.7940, lon: 34.9896, tz: 'Asia/Jerusalem', il: true },
    { name: 'Beersheba', displayName: 'באר שבע', lat: 31.2518, lon: 34.7913, tz: 'Asia/Jerusalem', il: true },
    { name: 'New York', displayName: 'ניו יורק', lat: 40.7128, lon: -74.0060, tz: 'America/New_York',il: false },
    { name: 'London', displayName: 'לונדון', lat: 51.5074, lon: -0.1278, tz: 'Europe/London', il: false },
    { name: 'Paris', displayName: 'פריז', lat: 48.8566, lon: 2.3522, tz: 'Europe/Paris', il: false },
  ];

export default function SunsetPicker() {
  const { setDuskTime } = useTheme();
  const [selectedCity, setSelectedCity] = useState<City>(cities[0]);

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
      const zmanim = new Zmanim( hdate, location.getLatitude(), location.getLongitude());

      setDuskTime(zmanim.sunset());
    };

    getDusk();
  }, [selectedCity]);

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
