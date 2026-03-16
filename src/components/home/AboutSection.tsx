const dafaImage = "/images/dafa.webp";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";

export default function AboutSection() {
  const { t } = useTranslation();

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      viewport={{ once: true }}
      className="text-muted-foreground flex flex-col md:flex-row w-full mx-auto justify-between items-center gap-8"
    >
      <div id="about" className="flex-col w-full">
        <div className="w-full flex flex-wrap justify-between items-end gap-3">
          <div className="flex flex-col gap-2">
            <p className="text-sm uppercase tracking-[0.3em] text-primary/90">{t("about.title")}</p>
            <h2 className="text-4xl font-bold text-primary">{t("about.journey")}</h2>
          </div>
        </div>
        <hr className="my-4 w-1/2" />
        <p className="w-full text-lg md:text-2xl">
          {t("about.content")}
        </p>
      </div>
      <div className="w-full flex justify-center items-center">
        <div className="relative h-64 md:h-98 aspect-square overflow-hidden rounded-sm bg-muted">
          <img
            src={dafaImage}
            alt="Dafa Ghaitsa"
            width={392}
            height={392}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-300 cursor-pointer"
          />
        </div>
      </div>
    </motion.section>
  );
}
