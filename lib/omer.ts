import { HDate } from '@hebcal/core';
import omerData from './omerData.json';
import { useTheme } from '../app/context/ThemeContext';

export type OmerInfo = {
  count: number;
  text: string;
  sefirah: string;
  date: string;
};

/**
 * Pure helper – returns the omer info for a given JS Date.
 * If `duskTime` is provided and the date is past dusk, the count
 * is bumped to the next Hebrew day (matches sefirat ha'omer halacha).
 *
 * Safe to call outside React (e.g. inside setTimeout / service worker).
 */
export function getOmerForDate(
  date: Date,
  duskTime?: Date | null
): OmerInfo | null {
  const today = new HDate(date);
  const omerStart = new HDate(16, 'Nisan', today.getFullYear());
  const dayDiff = today.abs() - omerStart.abs();

  if (dayDiff < 0 || dayDiff >= 49) return null;

  let omerDay = dayDiff;

  if (duskTime && duskTime < date) {
    // עבר זמן השקיעה – להוסיף יום
    omerDay++;
  }

  const omerInfo = (omerData as OmerInfo[] | any[])[omerDay];
  if (!omerInfo) return null;

  return {
    count: omerDay,
    text: omerInfo.count,
    sefirah: omerInfo.sefirah,
    date: omerInfo.date,
  };
}

/**
 * React-aware helper that pulls duskTime from ThemeContext.
 * Keep the original signature so existing callers (page.tsx, Footer) work.
 */
export function getOmerCount(): OmerInfo | null {
  const { duskTime } = useTheme();
  return getOmerForDate(new Date(), duskTime);
}
