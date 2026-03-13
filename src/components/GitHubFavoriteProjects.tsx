import { Card } from "@/components/ui/card";
import { useEffect, useMemo, useState } from "react";
import { Github, Loader2, Lock } from "lucide-react";

type GitHubFavoriteProjectsProps = {
  username?: string;
  maxProjects?: number;
};

type GitHubRepo = {
  id: number;
  name: string;
  owner: {
    login: string;
  };
  description: string | null;
  language: string | null;
};

const DEFAULT_GITHUB_USERNAME = "Perdafos";
const DEFAULT_MAX_PROJECTS = 6;
const STARRED_FETCH_LIMIT = 30;

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Go: "#00add8",
  Svelte: "#ff3e00",
  Shell: "#89e051",
  Python: "#3572a5",
  PHP: "#4f5d95",
  Rust: "#dea584",
  Java: "#b07219",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Vue: "#41b883",
  C: "#555555",
  "C++": "#f34b7d",
  "C#": "#178600",
};

function getLanguageColor(language: string | null): string {
  if (!language) return "#6b7280";
  return LANGUAGE_COLORS[language] ?? "#6b7280";
}

export default function GitHubFavoriteProjects({
  username,
  maxProjects = DEFAULT_MAX_PROJECTS,
}: GitHubFavoriteProjectsProps) {
  const githubUsername = username ?? import.meta.env.VITE_GITHUB_USERNAME ?? DEFAULT_GITHUB_USERNAME;

  const [projects, setProjects] = useState<GitHubRepo[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const [projectsError, setProjectsError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchFavoriteProjects() {
      setIsLoadingProjects(true);
      setProjectsError(null);

      try {
        const response = await fetch(
          `https://api.github.com/users/${githubUsername}/starred?per_page=${STARRED_FETCH_LIMIT}&sort=updated`,
          {
            headers: {
              Accept: "application/vnd.github+json",
              "X-GitHub-Api-Version": "2022-11-28",
            },
          },
        );

        if (!response.ok) {
          throw new Error(`GitHub API request failed (${response.status})`);
        }

        const data: unknown = await response.json();
        if (!Array.isArray(data)) {
          throw new Error("Unexpected API response");
        }

        if (isMounted) {
          const normalizedUsername = githubUsername.toLowerCase();
          const starredRepos = data as GitHubRepo[];
          const starredFromOtherOwners = starredRepos.filter(
            (repo) => repo.owner?.login.toLowerCase() !== normalizedUsername,
          );
          const starredFromOwnAccount = starredRepos.filter(
            (repo) => repo.owner?.login.toLowerCase() === normalizedUsername,
          );

          const prioritizedProjects = [...starredFromOtherOwners, ...starredFromOwnAccount].slice(
            0,
            maxProjects,
          );

          setProjects(prioritizedProjects);
        }
      } catch {
        if (isMounted) {
          setProjectsError("Gagal memuat project favorit dari GitHub.");
          setProjects([]);
        }
      } finally {
        if (isMounted) {
          setIsLoadingProjects(false);
        }
      }
    }

    void fetchFavoriteProjects();

    return () => {
      isMounted = false;
    };
  }, [githubUsername, maxProjects]);

  const hasProjects = useMemo(() => projects.length > 0, [projects]);
  const privatePreviewCount = useMemo(() => {
    if (isLoadingProjects || projectsError) return 0;
    return projects.length === 0 ? maxProjects : 0;
  }, [isLoadingProjects, projectsError, projects.length, maxProjects]);

  const hasDisplayCards = useMemo(
    () => hasProjects || privatePreviewCount > 0,
    [hasProjects, privatePreviewCount],
  );

  return (
    <>
      {isLoadingProjects ? (
        <div className="w-full flex items-center justify-center py-10 text-muted-foreground gap-2">
          <Loader2 className="size-4 animate-spin" />
          Memuat project favorit...
        </div>
      ) : null}

      {projectsError ? (
        <div className="w-full rounded-md border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {projectsError}
        </div>
      ) : null}

      {hasDisplayCards ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {projects.map((project) => {
            const repoUrl = `https://github.com/${project.owner.login}/${project.name}`;

            return (
              <a
                key={project.id}
                href={repoUrl}
                target="_blank"
                rel="noreferrer"
                className="block h-full rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
                aria-label={`Buka repository ${project.name}`}
              >
                <Card className="h-full p-5 border-border/70 hover:border-primary/40 hover:bg-muted/20 transition-colors cursor-pointer">
                  <div className="flex h-full flex-col">
                    <h3 className="font-semibold text-md break-all flex gap-2"><Github />{project.name}</h3>

                    <p className="text-md text-muted-foreground mt-3 line-clamp-3 min-h-15">
                      {project.description ?? "No description provided."}
                    </p>

                    <div className="mt-auto pt-4 flex items-center text-xs text-muted-foreground gap-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className="size-2.5 rounded-full"
                          style={{ backgroundColor: getLanguageColor(project.language) }}
                          aria-hidden="true"
                        />
                        <span className="truncate">{project.language ?? "Unknown"}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </a>
            );
          })}

          {Array.from({ length: privatePreviewCount }).map((_, index) => (
            <Card
              key={`private-preview-${index}`}
              className="h-full p-5 border-border/70 border-dashed bg-muted/20"
            >
              <div className="flex h-full flex-col">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-semibold text-base text-muted-foreground">Private Project</h3>
                  <Lock className="size-4 text-muted-foreground" />
                </div>

                <p className="text-sm text-muted-foreground mt-3 min-h-15">
                  Repository private tidak bisa dibaca dari API publik GitHub, jadi ditampilkan sebagai preview.
                </p>

                <div className="mt-auto pt-4 flex items-center text-xs text-muted-foreground gap-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="size-2.5 rounded-full bg-muted-foreground/50" aria-hidden="true" />
                    <span className="truncate">Private</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : null}
    </>
  );
}
