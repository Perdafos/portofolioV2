import { lazy, Suspense } from "react";
import PublicLayout from "@/components/Layouts/PublicLayout";
import HeroSection from "@/components/home/HeroSection";
import { Skeleton } from "@/components/ui/skeleton";
import { SpeedInsights } from "@vercel/speed-insights/react"

const AboutSection = lazy(() => import("@/components/home/AboutSection"));
const ContactSection = lazy(() => import("@/components/home/ContactSection"));
const ProjectsSection = lazy(() => import("@/components/home/ProjectsSection"));
const BlogSection = lazy(() => import("@/components/home/BlogSection"));
const SetupSection = lazy(() => import("@/components/home/SetupSection"));
const SkillsSection = lazy(() => import("@/components/home/SkillsSection"));

const SectionSkeleton = () => (
  <div className="w-full h-96 flex flex-col gap-4 px-4 md:px-6">
    <Skeleton className="h-12 w-1/3" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-2/3" />
    <Skeleton className="h-64 w-full mt-8" />
  </div>
);

export default function App() {
  const githubUsername = import.meta.env.VITE_GITHUB_USERNAME ?? "Perdafos";

  return (
    <PublicLayout>
      <SpeedInsights />
      <div className="w-full flex flex-col gap-20 md:gap-32">
        <HeroSection />
        
        <Suspense fallback={<SectionSkeleton />}>
          <AboutSection />
        </Suspense>

        <Suspense fallback={<SectionSkeleton />}>
          <SkillsSection />
        </Suspense>

        <Suspense fallback={<SectionSkeleton />}>
          <ProjectsSection githubUsername={githubUsername} />
        </Suspense>

        <Suspense fallback={<SectionSkeleton />}>
          <BlogSection />
        </Suspense>

        <Suspense fallback={<SectionSkeleton />}>
          <SetupSection />
        </Suspense>

        <Suspense fallback={<SectionSkeleton />}>
          <ContactSection />
        </Suspense>
      </div>
    </PublicLayout>
  );
}