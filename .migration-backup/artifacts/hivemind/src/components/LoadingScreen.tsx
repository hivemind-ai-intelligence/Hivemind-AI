import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAdminData } from "@/hooks/useAdminData";

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [isVisible, setIsVisible] = useState(true);
  const { data } = useAdminData();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 1000); // Wait for fade out
    }, 2500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background overflow-hidden"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-neutral-200 via-background to-background dark:from-neutral-900 dark:via-black dark:to-black opacity-50"></div>
          
          {/* Black hole effect */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="relative w-48 h-48 rounded-full bg-background shadow-[0_0_60px_20px_rgba(0,0,0,0.1)] dark:shadow-[0_0_60px_20px_rgba(255,255,255,0.1)] flex items-center justify-center mb-8 border border-black/5 dark:border-white/5"
          >
            <div className="absolute inset-0 rounded-full border border-black/10 dark:border-white/10 animate-[spin_10s_linear_infinite]"></div>
            <div className="absolute inset-2 rounded-full border border-black/5 dark:border-white/5 animate-[spin_15s_linear_infinite_reverse]"></div>
            <div className="absolute inset-4 rounded-full border border-black/20 dark:border-white/20 animate-[spin_5s_linear_infinite]"></div>
            
            {data.logoDataUrl ? (
              <img src={data.logoDataUrl} alt="Logo" className="w-16 h-16 object-contain z-10" />
            ) : (
              <div className="w-16 h-16 rounded-full bg-foreground shadow-[0_0_20px_5px_rgba(0,0,0,0.2)] dark:shadow-[0_0_20px_5px_rgba(255,255,255,0.5)]"></div>
            )}
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-center z-10"
          >
            <h1 className="text-4xl font-bold text-foreground tracking-wider mb-2">{data.brandName || "Hivemind AI"}</h1>
            <p className="text-sm text-muted-foreground tracking-widest uppercase">{data.tagline}</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}