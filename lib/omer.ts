import { HDate } from '@hebcal/core';
import  omerData  from './omerData.json';
import { useTheme } from '../app/context/ThemeContext';

export function getOmerCount(): { count: number; text: string; sefirah: string, date: string } | null {
  const today = new HDate(new Date());
  const { duskTime } = useTheme();
  const omerStart = new HDate(16, 'Nisan', today.getFullYear());

  const dayDiff = today.abs() - omerStart.abs();

  if (dayDiff < 0 || dayDiff >= 49) return null;

  let omerDay = dayDiff;

  
  if (duskTime && duskTime < new Date()) {
    // אם עבר זמן השקיעה, נוריד יום מהספירה
    omerDay--;
  }
  // חיפוש הנתונים של היום מתוך ה־JSON
  const omerInfo = omerData[omerDay];

  if (!omerInfo) return null;

  return { count: omerDay, text: omerInfo.count, sefirah: omerInfo.sefirah, date: omerInfo.date };
}
