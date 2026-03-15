import { Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const dafaImage = "/images/dafa.webp";

export default function HeroSection() {
  return (
    <section
      className="flex min-h-[calc(100dvh-7rem)] md:min-h-[calc(100dvh-8rem)] flex-col justify-center items-center w-full mx-auto px-4 md:px-6"
    >
      <a href="#about" className="flex flex-col justify-center items-center gap-4">
        <div className="w-30 h-30 overflow-hidden rounded-full aspect-square bg-muted">
          <img 
            src={dafaImage} 
            className="w-full h-full object-cover" 
            alt="Dafa Ghaitsa" 
            width={120} 
            height={120}
            loading="eager"
            fetchPriority="high"
          />
        </div>
        <Badge variant="outline" className="text-sm px-8 py-2"><Sparkles className="mr-1" /> Discover More About Me</Badge>
      </a>
      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center mt-6">
        The World Without Art{" "}
        <span className="gradient-text">Its Just A Rock,</span>
      </h1>
      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center">
        <span className="gradient-text">building a website</span> is the same
      </h1>
      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center">
        as making <span className="gradient-text">a painting</span>
      </h1>
      <p className="text-lg text-muted-foreground text-center max-w-4xl mt-6">
        Welcome to my portfolio. This website is designed to showcase my expertise in web development and software engineering. Here, you&apos;ll find information about my skills, experience, and projects that demonstrate my passion for creating beautiful, functional, and user-centric digital solutions.
      </p>
      <div className="flex w-full justify-center items-center gap-4 mt-6">
        <a href="#project">
          <Button className="bg-linear-to-r from-blue-500 to-blue-400 hover:from-blue-400 hover:to-blue-500 animate-pulse-glow text-white px-8 py-6 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer">
            View My Work
          </Button>
        </a>
        <a href="#contact">
          <Button variant="outline" className="px-8 py-6 text-lg font-semibold shadow-xl cursor-pointer">
            Contact Me
          </Button>
        </a>
      </div>
    </section>
  );
}
