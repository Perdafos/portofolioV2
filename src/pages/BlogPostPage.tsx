import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, CalendarDays, Clock3 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import PublicLayout from "@/components/Layouts/PublicLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getPublishedBlogPostBySlug } from "@/backend/services/blogService";
import type { BlogPostDetail } from "@/backend/types/blog";
import { useTranslation } from "react-i18next";
import { translateText } from "@/lib/translator";

function formatDate(dateValue: string | null, locale: string, draftText: string): string {
  if (!dateValue) {
    return draftText;
  }

  const date = new Date(dateValue);
  return new Intl.DateTimeFormat(locale === "id" ? "id-ID" : "en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

export default function BlogPostPage() {
  const { slug } = useParams();
  const [post, setPost] = useState<BlogPostDetail | null>(null);
  const [displayPost, setDisplayPost] = useState<BlogPostDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const { t, i18n } = useTranslation();

  useEffect(() => {
    let active = true;

    const loadPost = async () => {
      if (!slug) {
        setErrorMessage(t("blog.errorInvalidSlug"));
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
          setDisplayPost(null);
          setErrorMessage(t("blog.errorNotFoundHeader"));
          return;
        }

        setPost(data);
        setDisplayPost(data);
        setErrorMessage("");
      } catch (error) {
        if (!active) {
          return;
        }

        if (error instanceof Error) {
          setErrorMessage(error.message);
        } else {
          setErrorMessage(t("blog.errorFetchArticle"));
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
  }, [slug, t]);

  useEffect(() => {
    let active = true;
    const translatePost = async () => {
      if (!post) return;
      const targetLang = i18n.language;
      const translatedTitle = await translateText(post.title, targetLang);
      const translatedExcerpt = post.excerpt ? await translateText(post.excerpt, targetLang) : post.excerpt;
      const translatedContent = await translateText(post.content, targetLang);
      if (active) {
        setDisplayPost({
          ...post,
          title: translatedTitle,
          excerpt: translatedExcerpt,
          content: translatedContent,
        });
      }
    };
    translatePost();
    return () => {
      active = false;
    };
  }, [post, i18n.language]);

  return (
    <PublicLayout>
      <section className="w-full max-w-3xl flex flex-col">
        <Button variant="ghost" className="mb-5 w-fit" asChild>
          <Link to="/blog">
            <ArrowLeft className="h-4 w-4" />
            {t("blog.backToArticles")}
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
        ) : displayPost ? (
          <article className="flex flex-col">
            {displayPost.coverImageUrl ? (
              <img
                src={displayPost.coverImageUrl}
                alt={displayPost.title}
                className="h-64 w-full rounded-xl border border-primary/20 object-cover md:h-80"
              />
            ) : null}

            <div className="mt-6 flex flex-wrap gap-2">
              {displayPost.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="border-primary/40 text-[11px] uppercase tracking-wider">
                  {tag}
                </Badge>
              ))}
            </div>

            <h1 className="mt-4 text-3xl font-bold uppercase tracking-[0.08em] text-foreground md:text-5xl">
              {displayPost.title}
            </h1>

            <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-muted-foreground/80 font-medium uppercase tracking-widest">
              <span className="inline-flex items-center gap-1.5 backdrop-blur-sm bg-primary/5 px-3 py-1.5 rounded-full border border-primary/10">
                <CalendarDays className="h-4 w-4" />
                {formatDate(displayPost.publishedAt, i18n.language, t("blog.draft"))}
              </span>
              <span className="inline-flex items-center gap-1.5 backdrop-blur-sm bg-primary/5 px-3 py-1.5 rounded-full border border-primary/10">
                <Clock3 className="h-4 w-4" />
                {displayPost.readingMinutes ?? 1} {t("blog.minRead")}
              </span>
            </div>

            <p className="mt-8 text-xl text-muted-foreground/90 leading-relaxed italic border-l-2 border-primary/20 pl-6">
              {displayPost.excerpt}
            </p>

            <div className="mt-12 prose max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight]}
              >
                {displayPost.content}
              </ReactMarkdown>
            </div>
          </article>
        ) : (
          <p className="text-sm text-destructive">{errorMessage || t("blog.errorNotFoundFallback")}</p>
        )}

        {!isLoading && errorMessage && displayPost ? (
          <p className="mt-4 text-sm text-destructive">{errorMessage}</p>
        ) : null}
      </section>
    </PublicLayout>
  );
}
