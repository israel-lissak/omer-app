import { HDate } from '@hebcal/core';
import  omerData  from './omerData.json'; // היבוא של הנתונים מתוך הקובץ

export function getOmerCount(): { count: number; text: string; sefirah: string, date: string } | null {
  const today = new HDate(new Date());
  const omerStart = new HDate(16, 'Nisan', today.getFullYear());

  const dayDiff = today.abs() - omerStart.abs();

  if (dayDiff < 0 || dayDiff >= 49) return null;

  const omerDay = dayDiff;

  // חיפוש הנתונים של היום מתוך ה־JSON
  const omerInfo = omerData[omerDay];

  if (!omerInfo) return null;

  return { count: omerDay, text: omerInfo.count, sefirah: omerInfo.sefirah, date: omerInfo.date };
}
