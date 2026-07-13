import { useRef, useEffect } from 'react';

export function useMagneticEffect(strength = 0.5) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if ('ontouchstart' in window) return;

    const element = ref.current;
    if (!element) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { left, top, width, height } = element.getBoundingClientRect();
      const centerX = left + width / 2;
      const centerY = top + height / 2;
      const distanceX = clientX - centerX;
      const distanceY = clientY - centerY;

      element.style.transform = `translate(${distanceX * strength}px, ${distanceY * strength}px)`;
    };

    const handleMouseLeave = () => {
      element.style.transform = 'translate(0px, 0px)';
      element.style.transition = 'transform 0.3s ease-out';
      setTimeout(() => {
        if (element) element.style.transition = '';
      }, 300);
    };

    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [strength]);

  return ref;
}
