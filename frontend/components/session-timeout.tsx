'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useAuthStore } from '@/lib/auth-store';
import { useLogout } from '@/lib/hooks/use-auth';
import { toast } from 'sonner';

const IDLE_TIMEOUT = 60 * 60 * 1000; // 1 hour in milliseconds

export function SessionTimeout() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const logout = useLogout();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleLogout = useCallback(() => {
    if (isAuthenticated) {
      logout();
      toast.info('Session expired due to inactivity');
    }
  }, [isAuthenticated, logout]);

  const resetTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    if (isAuthenticated) {
      timerRef.current = setTimeout(handleLogout, IDLE_TIMEOUT);
    }
  }, [isAuthenticated, handleLogout]);

  useEffect(() => {
    if (!isAuthenticated) return;

    // Initial timer start
    resetTimer();

    // Events to listen for
    const events = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart'];

    // Add event listeners
    const handleActivity = () => {
      resetTimer();
    };

    // Throttle the activity handler to avoid performance issues
    let lastRun = 0;
    const throttledHandler = () => {
      const now = Date.now();
      if (now - lastRun > 1000) {
        handleActivity();
        lastRun = now;
      }
    };

    events.forEach((event) => {
      window.addEventListener(event, throttledHandler);
    });

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      events.forEach((event) => {
        window.removeEventListener(event, throttledHandler);
      });
    };
  }, [isAuthenticated, resetTimer]);

  return null;
}
