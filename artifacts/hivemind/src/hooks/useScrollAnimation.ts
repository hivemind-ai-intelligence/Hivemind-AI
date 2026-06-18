import { useEffect, useRef } from 'react';
import { useAnimation, useInView } from 'framer-motion';

export function useScrollAnimation() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const mainControls = useAnimation();

  useEffect(() => {
    if (isInView) {
      mainControls.start("visible");
    }
  }, [isInView, mainControls]);

  return { ref, mainControls };
}
