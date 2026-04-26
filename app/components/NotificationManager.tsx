'use client';

import { useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import { getOmerForDate } from '@/lib/omer';

const NOTIFY_HOUR = 21; // 9 PM
const NOTIFY_MINUTE = 0;
const STORAGE_KEY = 'omer-notifications-enabled';
const LAST_SHOWN_KEY = 'omer-notifications-last-shown';
const SYNC_TAG = 'omer-daily-reminder';

/**
 * Returns true if the user has opted in to daily notifications.
 */
export function isNotificationsEnabled(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(STORAGE_KEY) === 'true';
}

export function setNotificationsEnabled(value: boolean) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, value ? 'true' : 'false');
}

/** ms from now until the next 21:00 in the user's local time. */
function msUntilNext21() {
  const now = new Date();
  const next = new Date(now);
  next.setHours(NOTIFY_HOUR, NOTIFY_MINUTE, 0, 0);
  if (next.getTime() <= now.getTime()) {
    next.setDate(next.getDate() + 1);
  }
  return next.getTime() - now.getTime();
}

/** YYYY-MM-DD key used to make sure we only fire once per calendar day. */
function todayKey(d = new Date()) {
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

async function showOmerNotification(duskTime: Date | null) {
  if (typeof window === 'undefined') return;
  if (Notification.permission !== 'granted') return;

  const omer = getOmerForDate(new Date(), duskTime);
  if (!omer) return; // לא בתוך 49 ימי הספירה

  // Avoid double-firing on the same calendar day (e.g. focus + timer).
  const key = todayKey();
  if (localStorage.getItem(LAST_SHOWN_KEY) === key) return;
  localStorage.setItem(LAST_SHOWN_KEY, key);

  const title = 'ספירת העומר';
  const body = `${omer.text}\n${omer.sefirah}`;
  const options: NotificationOptions = {
    body,
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-192x192.png',
    lang: 'he',
    dir: 'rtl',
    tag: 'omer-daily',
    data: { url: '/', omerDay: omer.count },
  };

  try {
    const reg = await navigator.serviceWorker?.getRegistration();
    if (reg) {
      await reg.showNotification(title, options);
    } else {
      new Notification(title, options);
    }
  } catch (err) {
    console.error('Failed to show omer notification', err);
  }
}

export default function NotificationManager() {
  const { duskTime } = useTheme();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const duskRef = useRef<Date | null>(duskTime);

  // Keep latest duskTime accessible from the timer closure
  useEffect(() => {
    duskRef.current = duskTime;
  }, [duskTime]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!('Notification' in window)) return;
    if (!isNotificationsEnabled()) return;
    if (Notification.permission !== 'granted') return;

    const scheduleNext = () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      const delay = msUntilNext21();
      timerRef.current = setTimeout(async () => {
        await showOmerNotification(duskRef.current);
        scheduleNext();
      }, delay);
    };

    // If we missed today's 9 PM (e.g. opened the app at 22:30) – fire now.
    const now = new Date();
    const today9pm = new Date(now);
    today9pm.setHours(NOTIFY_HOUR, NOTIFY_MINUTE, 0, 0);
    if (
      now.getTime() >= today9pm.getTime() &&
      localStorage.getItem(LAST_SHOWN_KEY) !== todayKey()
    ) {
      showOmerNotification(duskRef.current);
    }

    scheduleNext();

    // Re-check when the tab becomes visible (timers don't always fire reliably
    // in background tabs).
    const onVisible = () => {
      if (document.visibilityState === 'visible') {
        const now = new Date();
        const today9pm = new Date(now);
        today9pm.setHours(NOTIFY_HOUR, NOTIFY_MINUTE, 0, 0);
        if (
          now.getTime() >= today9pm.getTime() &&
          localStorage.getItem(LAST_SHOWN_KEY) !== todayKey()
        ) {
          showOmerNotification(duskRef.current);
        }
        scheduleNext();
      }
    };
    document.addEventListener('visibilitychange', onVisible);

    // Listen for messages from the service worker (periodicsync wakeup).
    const onSwMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'omer-check') {
        const now = new Date();
        const today9pm = new Date(now);
        today9pm.setHours(NOTIFY_HOUR, NOTIFY_MINUTE, 0, 0);
        if (
          now.getTime() >= today9pm.getTime() &&
          localStorage.getItem(LAST_SHOWN_KEY) !== todayKey()
        ) {
          showOmerNotification(duskRef.current);
        }
      }
    };
    navigator.serviceWorker?.addEventListener('message', onSwMessage);

    // Best-effort: register a periodic background sync so the SW can fire
    // the notification even when the page is closed (Chrome/Edge only).
    (async () => {
      try {
        const reg = await navigator.serviceWorker?.getRegistration();
        // @ts-ignore – periodicSync is not in the standard TS lib yet
        if (reg && 'periodicSync' in reg) {
          // @ts-ignore
          const status = await navigator.permissions.query({
            name: 'periodic-background-sync' as PermissionName,
          });
          if (status.state === 'granted') {
            // @ts-ignore
            await reg.periodicSync.register(SYNC_TAG, {
              minInterval: 12 * 60 * 60 * 1000, // 12h – browser decides exact time
            });
          }
        }
      } catch {
        /* not supported – silently ignore */
      }
    })();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      document.removeEventListener('visibilitychange', onVisible);
      navigator.serviceWorker?.removeEventListener('message', onSwMessage);
    };
  }, []);

  return null;
}
