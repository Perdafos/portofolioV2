import { Brain, Database, Dot, Wallpaper, Wrench } from "lucide-react";
import { Card } from "@/components/ui/card";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";

export default function SkillsSection() {
  const { t } = useTranslation();

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      viewport={{ once: true }}
      className="w-full flex-col flex"
    >
      <div className="w-full flex flex-wrap justify-between items-end gap-3">
        <div className="flex flex-col gap-2">
          <p className="text-sm uppercase tracking-[0.3em] text-primary/90">{t("skills.title")}</p>
          <h2 className="text-4xl font-bold text-primary">{t("skills.techSkills")}</h2>
        </div>
      </div>
      <hr className="my-4 w-1/4" />
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 w-full">
        <Card className="py-6 px-4 flex flex-col gap-4 w-full">
          <div className="bg-foreground rounded-full p-2 w-fit h-fit ">
            <Wallpaper className="size-8 text-background" />
          </div>
          <h2 className="text-2xl font-bold">{t("skills.frontend")}</h2>
          <div className="flex flex-col ">
            <p className="text-xl flex justify-start items-center"><Dot />{" "}React</p>
            <p className="text-xl flex justify-start items-center"><Dot />{" "}Next.Js</p>
            <p className="text-xl flex justify-start items-center"><Dot />{" "}TypeScript</p>
            <p className="text-xl flex justify-start items-center"><Dot />{" "}Tailwind</p>
            <p className="text-xl flex justify-start items-center"><Dot />{" "}JavaScript</p>
          </div>
        </Card>

        <Card className="py-6 px-4 flex flex-col gap-4 w-full">
          <div className="bg-foreground rounded-full p-2 w-fit h-fit ">
            <Brain className="size-8 text-background" />
          </div>
          <h2 className="text-2xl font-bold">BackEnd</h2>
          <div className="flex flex-col ">
            <p className="text-xl flex justify-start items-center"><Dot />{" "}Laravel</p>
            <p className="text-xl flex justify-start items-center"><Dot />{" "}Node.js</p>
            <p className="text-xl flex justify-start items-center"><Dot />{" "}Hono</p>
          </div>
        </Card>
        <Card className="py-6 px-4 flex flex-col gap-4 w-full">
          <div className="bg-foreground rounded-full p-2 w-fit h-fit ">
            <Database className="size-8 text-background" />
          </div>
          <h2 className="text-2xl font-bold">DataBase</h2>
          <div className="flex flex-col ">
            <p className="text-xl flex justify-start items-center"><Dot />{" "}MySql</p>
            <p className="text-xl flex justify-start items-center"><Dot />{" "}PostgreSQL</p>
          </div>
        </Card>
        <Card className="py-6 px-4 flex flex-col gap-4 w-full">
          <div className="bg-foreground rounded-full p-2 w-fit h-fit ">
            <Wrench className="size-8 text-background" />
          </div>
          <h2 className="text-2xl font-bold">Tools</h2>
          <div className="flex flex-col ">
            <p className="text-xl flex justify-start items-center"><Dot />{" "}Git</p>
            <p className="text-xl flex justify-start items-center"><Dot />{" "}Docker</p>
            <p className="text-xl flex justify-start items-center"><Dot />{" "}Linux</p>
            <p className="text-xl flex justify-start items-center"><Dot />{" "}Ubuntu</p>
            <p className="text-xl flex justify-start items-center"><Dot />{" "}Jenkins</p>
            <p className="text-xl flex justify-start items-center"><Dot />{" "}Komodo</p>
          </div>
        </Card>
      </div>
    </motion.section>
  );
}
