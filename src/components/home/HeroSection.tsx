import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

// const dafaImage = "/images/dafa.webp";

export default function HeroSection() {
  const { t } = useTranslation();

  return (
    <section
      className="flex min-h-[calc(100dvh-7rem)] md:min-h-[calc(100dvh-8rem)] flex-col justify-center items-center w-full mx-auto px-4 md:px-6"
    >
      {/* <div className="w-30 h-30 overflow-hidden rounded-full aspect-square bg-muted">
        <img
          src={dafaImage}
          className="w-full h-full object-cover"
          alt="Dafa Ghaitsa"
          width={120}
          height={120}
          loading="eager"
          fetchPriority="high"
        />
      </div> */}
      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center mt-6">
        {t("hero.title1")}{" "}
        <span className="gradient-text">{t("hero.title2")}</span>
      </h1>
      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center">
        <span className="gradient-text">{t("hero.title3")}</span> {t("hero.title4")} {t("hero.title5")}
      </h1>
      <p className="text-lg text-muted-foreground text-center max-w-4xl mt-6">
        {t("hero.description")}
      </p>
      <div className="flex w-full justify-center items-center gap-4 mt-6">
        {/* <a href="#project">
          <Button className="bg-linear-to-r from-blue-500 to-blue-400 hover:from-blue-400 hover:to-blue-500 animate-pulse-glow text-white px-8 py-6 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer">
            {t("hero.viewWork")}
          </Button>
        </a> */}
        <a href="#contact">
          <Button variant="outline" className="px-8 py-6 text-lg font-semibold shadow-xl cursor-pointer">
            {t("hero.contactMe")}
          </Button>
        </a>
      </div>
    </section>
  );
}
