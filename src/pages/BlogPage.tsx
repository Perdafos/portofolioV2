import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CalendarDays, Clock3 } from "lucide-react";
import PublicLayout from "@/components/PublicLayout";
import { Badge } from "@/components/ui/badge";
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
    month: "long",
    year: "numeric",
  }).format(date);
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPostPreview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let active = true;

    const loadPosts = async () => {
      try {
        const data = await getPublishedBlogPosts();

        if (!active) {
          return;
        }

        setPosts(data);
        setErrorMessage("");
      } catch (error) {
        if (!active) {
          return;
        }

        if (error instanceof Error) {
          setErrorMessage(error.message);
        } else {
          setErrorMessage("Gagal memuat daftar blog.");
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
    <PublicLayout>
      <section className="w-full flex flex-col">
        <div className="flex flex-col gap-2">
          <p className="text-sm uppercase tracking-[0.35em] text-primary/80">Journal</p>
          <h1 className="text-4xl font-bold text-primary md:text-5xl">All Articles</h1>
        </div>

        <p className="mt-5 max-w-2xl text-muted-foreground">
          Semua artikel yang sudah saya publikasikan. Klik salah satu artikel untuk membaca versi lengkap.
        </p>

        {errorMessage ? <p className="mt-4 text-sm text-destructive">{errorMessage}</p> : null}

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {isLoading
            ? Array.from({ length: 6 }).map((_, index) => (
                <Card key={index} className="overflow-hidden border-primary/15 bg-card/65">
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
                        {post.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="outline" className="border-primary/40 text-[11px] uppercase tracking-wider">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <h2 className="line-clamp-2 text-xl font-bold uppercase tracking-[0.08em] text-primary">
                        {post.title}
                      </h2>

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

                      <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                        Read Article
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    </div>
                  </Link>
                </Card>
              ))}
        </div>

        {!isLoading && posts.length === 0 ? (
          <p className="mt-6 text-sm text-muted-foreground">Belum ada artikel yang dipublikasikan.</p>
        ) : null}
      </section>
    </PublicLayout>
  );
}
