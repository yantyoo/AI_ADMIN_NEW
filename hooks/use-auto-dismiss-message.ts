"use client";

import { useCallback, useEffect, useState } from "react";

export function useAutoDismissMessage(delay = 3000) {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!message) {
      return;
    }

    const timer = window.setTimeout(() => setMessage(null), delay);
    return () => window.clearTimeout(timer);
  }, [delay, message]);

  const showMessage = useCallback((nextMessage: string) => {
    setMessage(nextMessage);
  }, []);

  const clearMessage = useCallback(() => {
    setMessage(null);
  }, []);

  return {
    message,
    showMessage,
    clearMessage
  };
}
