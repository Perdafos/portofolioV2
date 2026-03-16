import { Mail, MapPin, Phone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";

export default function ContactSection() {
  const { t } = useTranslation();

  return (
    <motion.section
      id="contact"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      viewport={{ once: true }}
      className="w-full mx-auto px-4 md:px-10 flex flex-col scroll-mt-20 md:scroll-mt-32"
    >
      <div className="w-full flex flex-wrap justify-between items-end gap-3">
        <div className="flex flex-col gap-2">
          <p className="text-sm uppercase tracking-[0.3em] text-primary/90">{t("contact.title")}</p>
          <h2 className="text-4xl font-bold text-primary">{t("contact.getInTouch")}</h2>
        </div>
      </div>
      <hr className="my-4 w-1/4" />
      <div className="flex md:flex-row flex-col w-full justify-center items-start gap-8 mt-4">
        <div className="w-full flex flex-col">
          <p className="text-xl">{t("contact.desc")}</p>
          <a href="mailto:yogatamadafa9@gmail.com" target="_blank" className="mt-4 text-lg font-bold text-primary gap-2 flex items-center hover:text-blue-500">
            <div className="p-2 w-fit h-fit bg-linear-to-r from-blue-500 to-blue-400 hover:from-blue-400 hover:to-blue-500 animate-pulse-glow flex">
              <Mail className="size-6 text-white" />
            </div>
            <div className="flex flex-col gap-0 w-full">
              <p className="text-bold text-sm m-0">{t("contact.email")}</p>
              <p className="text-sm m-0">yogatamadafa9@gmail.com</p>
            </div>
          </a>
          <a href="tel:+62 812-3485-3434" target="_blank" className="mt-4 text-lg font-bold text-primary gap-2 flex items-center hover:text-blue-500">
            <div className="p-2 w-fit h-fit bg-linear-to-r from-blue-500 to-blue-400 hover:from-blue-400 hover:to-blue-500 animate-pulse-glow flex">
              <Phone className="size-6 text-white" />
            </div>
            <div className="flex flex-col gap-0 w-full">
              <p className="text-bold text-sm m-0">{t("contact.phone")}</p>
              <p className="text-sm m-0">+62 812-3485-3434</p>
            </div>
          </a>
          <a href="https://maps.app.goo.gl/oBdCpGTdHHbTp1oY9" target="_blank" className="mt-4 text-lg font-bold text-primary gap-2 flex items-center hover:text-blue-500">
            <div className="p-2 w-fit h-fit bg-linear-to-r from-blue-500 to-blue-400 hover:from-blue-400 hover:to-blue-500 animate-pulse-glow flex">
              <MapPin className="size-6 text-white" />
            </div>
            <div className="flex flex-col gap-0 w-full">
              <p className="text-bold text-sm m-0">{t("contact.location")}</p>
              <p className="text-sm m-0">Malang, Indonesia</p>
            </div>
          </a>
        </div>

        <div className="w-full flex flex-col p-0 md:p-6">
          <div className="flex flex-col px-4 py-6 w-full h-full border border-foreground rounded-md">
            <h1 className="font-bold text-xl">{t("contact.available")}</h1>
            <p className="text-xl ">{t("contact.availableDesc")}</p>
            <div className="mt-4 flex w-full flex-wrap gap-2 sm:gap-3 md:gap-4">
              <Badge variant="secondary" className="text-xs font-bold sm:text-sm">{t("contact.remote")}</Badge>
              <Badge variant="secondary" className="text-xs font-bold sm:text-sm">{t("contact.freelance")}</Badge>
              <Badge variant="secondary" className="text-xs font-bold sm:text-sm">{t("contact.fulltime")}</Badge>
              <Badge variant="secondary" className="text-xs font-bold sm:text-sm">{t("contact.contract")}</Badge>
            </div>
            <Button className="bg-linear-to-r from-blue-500 to-blue-400 hover:from-blue-400 hover:to-blue-500 animate-pulse-glow text-white px-8 py-6 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer mt-4"><Mail />{t("contact.sendMessage")}</Button>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
