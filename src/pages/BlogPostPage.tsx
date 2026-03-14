import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, CalendarDays, Clock3 } from "lucide-react";
import PublicLayout from "@/components/PublicLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getPublishedBlogPostBySlug } from "@/backend/services/blogService";
import type { BlogPostDetail } from "@/backend/types/blog";

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

export default function BlogPostPage() {
  const { slug } = useParams();
  const [post, setPost] = useState<BlogPostDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let active = true;

    const loadPost = async () => {
      if (!slug) {
        setErrorMessage("Slug artikel tidak valid.");
        setIsLoading(false);
        return;
      }

      try {
        const data = await getPublishedBlogPostBySlug(slug);

        if (!active) {
          return;
        }

        if (!data) {
          setPost(null);
          setErrorMessage("Artikel tidak ditemukan atau belum dipublikasikan.");
          return;
        }

        setPost(data);
        setErrorMessage("");
      } catch (error) {
        if (!active) {
          return;
        }

        if (error instanceof Error) {
          setErrorMessage(error.message);
        } else {
          setErrorMessage("Gagal memuat artikel.");
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    loadPost();

    return () => {
      active = false;
    };
  }, [slug]);

  const paragraphs = useMemo(
    () =>
      (post?.content ?? "")
        .split(/\n{2,}/)
        .map((segment) => segment.trim())
        .filter((segment) => segment.length > 0),
    [post?.content]
  );

  return (
    <PublicLayout>
      <section className="w-full max-w-3xl flex flex-col">
        <Button variant="ghost" className="mb-5 w-fit" asChild>
          <Link to="/blog">
            <ArrowLeft className="h-4 w-4" />
            Back to Articles
          </Link>
        </Button>

        {isLoading ? (
          <Card className="overflow-hidden border-primary/15 bg-card/65">
            <div className="h-64 animate-pulse bg-primary/10" />
            <div className="space-y-4 px-6 py-6">
              <div className="h-6 w-3/4 animate-pulse rounded bg-primary/10" />
              <div className="h-4 w-full animate-pulse rounded bg-primary/10" />
              <div className="h-4 w-5/6 animate-pulse rounded bg-primary/10" />
            </div>
          </Card>
        ) : post ? (
          <article className="flex flex-col">
            {post.coverImageUrl ? (
              <img
                src={post.coverImageUrl}
                alt={post.title}
                className="h-64 w-full rounded-xl border border-primary/20 object-cover md:h-80"
              />
            ) : null}

            <div className="mt-6 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="border-primary/40 text-[11px] uppercase tracking-wider">
                  {tag}
                </Badge>
              ))}
            </div>

            <h1 className="mt-4 text-3xl font-bold uppercase tracking-[0.08em] text-primary md:text-4xl">
              {post.title}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="h-4 w-4" />
                {formatDate(post.publishedAt)}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock3 className="h-4 w-4" />
                {post.readingMinutes ?? 1} min read
              </span>
            </div>

            <p className="mt-5 text-lg text-muted-foreground">{post.excerpt}</p>

            <div className="mt-10 space-y-6 text-base leading-8 text-foreground/95">
              {paragraphs.map((paragraph, index) => (
                <p key={index} className="whitespace-pre-wrap">
                  {paragraph}
                </p>
              ))}
            </div>
          </article>
        ) : (
          <p className="text-sm text-destructive">{errorMessage || "Artikel tidak ditemukan."}</p>
        )}

        {!isLoading && errorMessage && post ? (
          <p className="mt-4 text-sm text-destructive">{errorMessage}</p>
        ) : null}
      </section>
    </PublicLayout>
  );
}
