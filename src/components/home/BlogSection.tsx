import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CalendarDays, Clock3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getPublishedBlogPosts } from "@/backend/services/blogService";
import type { BlogPostPreview } from "@/backend/types/blog";

function formatDate(dateValue: string | null): string {
  if (!dateValue) {
    return "Draft";
  }

  const date = new Date(dateValue);
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export default function BlogSection() {
  const [posts, setPosts] = useState<BlogPostPreview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let active = true;

    const loadPosts = async () => {
      try {
        const latestPosts = await getPublishedBlogPosts(3);
        if (!active) {
          return;
        }

        setPosts(latestPosts);
        setErrorMessage("");
      } catch (error) {
        if (!active) {
          return;
        }

        if (error instanceof Error) {
          setErrorMessage(error.message);
        } else {
          setErrorMessage("Gagal memuat artikel blog.");
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    loadPosts();

    return () => {
      active = false;
    };
  }, []);

  return (
    <section id="blog" className="w-full flex flex-col">
      <div className="w-full flex flex-wrap justify-between items-end gap-3">
        <div className="flex flex-col gap-2">
          <p className="text-sm uppercase tracking-[0.3em] text-primary/90">Blog</p>
          <h2 className="text-4xl font-bold text-primary">Latest Articles</h2>
        </div>
      </div>

      <hr className="my-4 w-1/4" />

      <p className="text-muted-foreground text-lg mb-8 max-w-2xl">
        Catatan teknis tentang performa backend, React, dan ekosistem tooling yang saya pakai sehari-hari.
      </p>

      {errorMessage ? (
        <p className="mb-4 text-sm text-destructive">{errorMessage}</p>
      ) : null}

      <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {isLoading
          ? Array.from({ length: 3 }).map((_, index) => (
              <Card key={index} className="overflow-hidden border-primary/15 bg-card/70">
                <div className="h-52 animate-pulse bg-primary/10" />
                <div className="space-y-3 px-5 py-5">
                  <div className="h-5 w-2/3 animate-pulse rounded bg-primary/10" />
                  <div className="h-4 w-full animate-pulse rounded bg-primary/10" />
                  <div className="h-4 w-5/6 animate-pulse rounded bg-primary/10" />
                </div>
              </Card>
            ))
          : posts.map((post) => (
              <Card
                key={post.id}
                className="group overflow-hidden border-primary/20 bg-card/65 transition-all duration-300 hover:-translate-y-1 hover:border-primary/50"
              >
                <Link to={`/blog/${post.slug}`} className="flex h-full flex-col">
                  {post.coverImageUrl ? (
                    <img
                      src={post.coverImageUrl}
                      alt={post.title}
                      className="h-52 w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      loading="lazy"
                    />
                  ) : (
                    <div className="h-52 w-full bg-[radial-gradient(circle_at_10%_10%,rgba(59,130,246,0.45),transparent_50%),linear-gradient(130deg,rgba(11,20,54,1),rgba(7,12,33,1))]" />
                  )}

                  <div className="flex h-full flex-col px-5 py-5">
                    <div className="mb-3 flex flex-wrap gap-2">
                      {post.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="outline" className="border-primary/40 text-[11px] uppercase tracking-wider">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <h3 className="line-clamp-2 text-xl font-bold uppercase tracking-[0.08em] text-primary">
                      {post.title}
                    </h3>

                    <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">{post.excerpt}</p>

                    <div className="mt-auto pt-6 text-xs text-muted-foreground">
                      <div className="flex items-center gap-4">
                        <span className="inline-flex items-center gap-1.5">
                          <CalendarDays className="h-3.5 w-3.5" />
                          {formatDate(post.publishedAt)}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <Clock3 className="h-3.5 w-3.5" />
                          {post.readingMinutes ?? 1} min read
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </Card>
            ))}
      </div>

      {!isLoading && posts.length === 0 ? (
        <p className="mt-6 text-sm text-muted-foreground">Belum ada artikel yang dipublikasikan.</p>
      ) : null}

      <div className="mt-8 flex justify-center">
        <Button variant="ghost" asChild>
          <Link to="/blog" className="uppercase tracking-[0.18em]">
            View All Articles
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
