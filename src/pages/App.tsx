import PublicLayout from "@/components/PublicLayout";
import AboutSection from "@/components/home/AboutSection";
import ContactSection from "@/components/home/ContactSection";
import HeroSection from "@/components/home/HeroSection";
import ProjectsSection from "@/components/home/ProjectsSection";
import BlogSection from "@/components/home/BlogSection";
import SetupSection from "@/components/home/SetupSection";
import SkillsSection from "@/components/home/SkillsSection";

export default function App() {
  const githubUsername = import.meta.env.VITE_GITHUB_USERNAME ?? "Perdafos";

  return (
    <PublicLayout>
      <div className="w-full flex flex-col gap-20 md:gap-32">
        <HeroSection />
        <AboutSection />
        <SkillsSection />
        <ProjectsSection githubUsername={githubUsername} />
        <BlogSection />
        <SetupSection />
        <ContactSection />
      </div>
    </PublicLayout>
  );
}