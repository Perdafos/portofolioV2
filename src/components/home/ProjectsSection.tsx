import { ExternalLink } from "lucide-react";
import GitHubFavoriteProjects from "@/components/GitHubFavoriteProjects";

interface ProjectsSectionProps {
  githubUsername: string;
}

export default function ProjectsSection({ githubUsername }: ProjectsSectionProps) {
  return (
    <section className="w-full flex-col flex">
      <div className="flex text-start gap-4 mt-6">
        <h2 className="text-4xl">Projects</h2>
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
