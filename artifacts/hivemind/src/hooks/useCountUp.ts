import { useState, useEffect, useRef } from 'react';

export function useCountUp(end: number, duration: number = 2000, triggerRef: React.RefObject<HTMLElement | null>) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (!triggerRef.current || hasAnimated) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          let startTimestamp: number | null = null;
          const step = (timestamp: number) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            setCount(Math.floor(progress * end));
            if (progress < 1) {
              window.requestAnimationFrame(step);
            } else {
              setHasAnimated(true);
            }
          };
          window.requestAnimationFrame(step);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(triggerRef.current);
    return () => observer.disconnect();
  }, [end, duration, triggerRef, hasAnimated]);

  return count;
}
