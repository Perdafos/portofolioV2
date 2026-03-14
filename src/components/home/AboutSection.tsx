import dafaImage from "@/assets/images/dafa.webp";
import { motion } from "motion/react";

export default function AboutSection() {
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
            <p className="text-sm uppercase tracking-[0.3em] text-primary/90">About Me</p>
            <h2 className="text-4xl font-bold text-primary">My Journey</h2>
          </div>
        </div>
        <hr className="my-4 w-1/2" />
        <p className="w-full text-lg md:text-2xl">
          Hello my name is Dafa Ghaitsa, I am a website developer with a passion for creating beautiful and functional websites. I have experience in both frontend and backend development, and I am always looking for new challenges to improve my skills. This website is a showcase of my work and a place where I share my thoughts on web development and design.
        </p>
      </div>
      <div className="w-full flex justify-center items-center">
        <img
          src={dafaImage}
          alt="Dafa Ghaitsa"
          width={392}
          height={392}
          loading="lazy"
          className="h-64 md:h-98 rounded-sm grayscale hover:grayscale-0 transition-all duration-300 cursor-pointer"
        />
      </div>
    </motion.section>
  );
}
