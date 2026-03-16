import { useTranslation } from "react-i18next";
import { Languages } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [spin, setSpin] = useState(0);

  const toggleLanguage = () => {
    const newLang = i18n.language === "id" ? "en" : "id";
    i18n.changeLanguage(newLang);
    // Simpan pilihan ke localStorage
    localStorage.setItem("language", newLang);
    // Tambah nilai rotasi 360 derajat untuk animasi
    setSpin((prev) => prev + 360);
  };

  return (
    <motion.button
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.85 }}
      onClick={toggleLanguage}
      className="fixed bottom-6 left-6 z-[99] p-2 text-gray-500/50 hover:text-white bg-transparent transition-colors duration-300 rounded-full border-none outline-none cursor-pointer flex items-center justify-center"
      title={i18n.language === "id" ? "Switch to English" : "Ganti ke Bahasa Indonesia"}
      aria-label="Toggle language"
    >
      <motion.div
        animate={{ rotate: spin }}
        transition={{ duration: 0.5, type: "spring", stiffness: 260, damping: 20 }}
      >
        <Languages className="w-5 h-5 md:w-6 md:h-6" />
      </motion.div>
    </motion.button>
  );
}
