import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

const LoadingScreen: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Agar LCP cepat muncul, hilangkan layar segera setelah halaman merender, maksimal 200ms
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-background"
        >
          <div className="relative flex items-center justify-center">
            <div className="h-10 w-10 rounded-full border-t-2 border-primary animate-spin" />
            <div className="absolute h-10 w-10 rounded-full border-2 border-primary/10" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;
