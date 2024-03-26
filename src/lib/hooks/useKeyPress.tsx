import React from 'react';

interface KeyPressOptions {
  event?: string;
  target?: HTMLElement | Window | Document | null;
  eventOptions?: boolean | AddEventListenerOptions;
}

export function useKeyPress(
  key: string,
  callback: (event: KeyboardEvent) => void,
  options: KeyPressOptions = {}
): void {
  const { event = 'keydown', target = window, eventOptions } = options;

  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === key) {
        callback(e);
      }
    };

    target?.addEventListener(event, handler as EventListener, eventOptions);

    return () => {
      target?.removeEventListener(
        event,
        handler as EventListener,
        eventOptions
      );
    };
  }, [key, callback, target, event, eventOptions]);
}
