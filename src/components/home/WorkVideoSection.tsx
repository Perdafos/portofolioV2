import { useEffect, useState } from "react";
import { getWorkVideos } from "@/backend/services/workVideoService";
import type { WorkVideo } from "@/backend/types/video";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { translateText } from "@/lib/translator";
import { Card } from "@/components/ui/card";
import { Video, Youtube, Smartphone, Instagram } from "lucide-react";

export default function WorkVideoSection() {
  const [videos, setVideos] = useState<WorkVideo[]>([]);
  const [displayVideos, setDisplayVideos] = useState<WorkVideo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const { t, i18n } = useTranslation();

  useEffect(() => {
    let active = true;

    const loadVideos = async () => {
      try {
        const data = await getWorkVideos();
        if (!active) return;
        setVideos(data);
        setDisplayVideos(data);
        setErrorMessage("");
      } catch (error) {
        if (!active) return;
        console.error(error);
        setErrorMessage(t("videos.errorLoadList"));
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    loadVideos();

    return () => {
      active = false;
    };
  }, [t]);

  useEffect(() => {
    let active = true;
    const translateVideos = async () => {
      if (!videos.length) return;
      const targetLang = i18n.language;
      const translated = await Promise.all(
        videos.map(async (v) => ({
          ...v,
          title: await translateText(v.title, targetLang),
        }))
      );
      if (active) {
        setDisplayVideos(translated);
      }
    };
    translateVideos();
    return () => {
      active = false;
    };
  }, [videos, i18n.language]);

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "youtube":
        return <Youtube className="h-4 w-4 text-red-500" />;
      case "instagram":
        return <Instagram className="h-4 w-4 text-pink-500" />;
      case "tiktok":
      default:
        return <Smartphone className="h-4 w-4 text-primary" />;
    }
  };

  if (!isLoading && videos.length === 0) {
    return null;
  }

  return (
    <motion.section
      id="videos"
      className="w-full flex flex-col scroll-mt-20 md:scroll-mt-32"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      viewport={{ once: true }}
    >
      <div className="w-full flex flex-wrap justify-between items-end gap-3">
        <div className="flex flex-col gap-2">
          <p className="text-sm uppercase tracking-[0.3em] text-primary/90">{t("videos.title")}</p>
          <h2 className="text-4xl font-bold text-primary flex items-center gap-2">
            <Video className="h-8 w-8 text-primary" />
            {t("videos.workVideos")}
          </h2>
        </div>
      </div>

      <hr className="my-4 w-1/4" />

      {errorMessage ? (
        <p className="mb-4 text-sm text-destructive">{errorMessage}</p>
      ) : null}

      <div className="grid w-full grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {isLoading
          ? Array.from({ length: 4 }).map((_, index) => (
              <Card key={index} className="overflow-hidden border-primary/15 bg-card/70 aspect-[9/16] flex flex-col justify-between p-4">
                <div className="w-full h-4/5 animate-pulse rounded bg-primary/10" />
                <div className="h-4 w-2/3 animate-pulse rounded bg-primary/10 mt-3" />
                <div className="h-3 w-1/3 animate-pulse rounded bg-primary/10 mt-1" />
              </Card>
            ))
          : displayVideos.map((vid) => (
              <Card
                key={vid.id}
                className="group relative flex flex-col overflow-hidden border-primary/15 bg-card/70 transition-all hover:border-primary/30 aspect-[9/16] shadow-lg rounded-xl"
              >
                {/* Embed video container */}
                <div className="relative w-full h-[78%] bg-black overflow-hidden">
                  <iframe
                    src={vid.embedUrl}
                    className="absolute inset-0 w-full h-full border-0 pointer-events-none group-hover:pointer-events-auto"
                    title={vid.title}
                    allowFullScreen
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  />
                  {/* Platform Badge overlay */}
                  <div className="absolute top-3 right-3 z-10 bg-background/80 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-primary flex items-center gap-1 border border-primary/20 shadow-sm">
                    {getPlatformIcon(vid.platform)}
                    <span>{vid.platform}</span>
                  </div>
                </div>

                {/* Text and details */}
                <div className="p-4 flex-1 flex flex-col justify-between bg-gradient-to-b from-transparent to-card/50">
                  <p className="text-xs sm:text-sm font-medium line-clamp-2 text-foreground tracking-wide leading-snug" title={vid.title}>
                    {vid.title}
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground/80 mt-2 border-t border-primary/5 pt-2">
                    <span>Aspect Ratio 9:16</span>
                    <a
                      href={vid.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline font-semibold"
                    >
                      Buka Link
                    </a>
                  </div>
                </div>
              </Card>
            ))}
      </div>
    </motion.section>
  );
}
