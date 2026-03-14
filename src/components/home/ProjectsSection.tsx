import { ExternalLink } from "lucide-react";
import GitHubFavoriteProjects from "@/components/GitHubFavoriteProjects";

interface ProjectsSectionProps {
  githubUsername: string;
}

export default function ProjectsSection({ githubUsername }: ProjectsSectionProps) {
  return (
    <section className="w-full flex-col flex">
      <div className="w-full flex flex-wrap justify-between items-end gap-3">
        <div className="flex flex-col gap-2">
          <p className="text-sm uppercase tracking-[0.3em] text-primary/90">Projects</p>
          <h2 className="text-4xl font-bold text-primary">My Work</h2>
        </div>
      </div>
      <hr className="my-4 w-1/4" />
      <GitHubFavoriteProjects username={githubUsername} />
      <div className="flex justify-center">
        <a
          href={`https://github.com/${githubUsername}`}
          target="_blank"
          rel="noreferrer"
          className="mt-6 text-sm text-muted-foreground hover:text-primary transition-colors flex gap-2 justify-center items-center"
        >
          See More On Github
          <ExternalLink className="text-mute" />
        </a>
      </div>
    </section>
  );
}
