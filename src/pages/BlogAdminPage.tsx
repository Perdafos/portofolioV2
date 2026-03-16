import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { useAuth, useClerk, useUser } from "@clerk/react";
import { AlertCircle, Code, LoaderCircle, LogOut, Plus, Save, Trash2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import {
  createBlogPost,
  createBlogSlug,
  deleteBlogPost,
  getAdminBlogPosts,
  updateBlogPost,
} from "@/backend/services/blogService";
import type { BlogPostAdminItem, BlogPostUpsertInput } from "@/backend/types/blog";
import { supabase, supabaseConfigError } from "@/backend/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import ImageUploader from "@/components/admin/ImageUploader";

interface EditorState {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImageUrl: string;
  tags: string;
  isPublished: boolean;
  publishedAt: string;
  readingMinutes: string;
}

function getCurrentDateTimeLocalInputValue(): string {
  const now = new Date();
  const localDate = new Date(now.getTime() - now.getTimezoneOffset() * 60_000);
  return localDate.toISOString().slice(0, 16);
}

function createDefaultEditorState(): EditorState {
  return {
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    coverImageUrl: "",
    tags: "",
    isPublished: true,
    publishedAt: getCurrentDateTimeLocalInputValue(),
    readingMinutes: "",
  };
}

function toEditorState(post: BlogPostAdminItem): EditorState {
  return {
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    content: post.content,
    coverImageUrl: post.coverImageUrl ?? "",
    tags: post.tags.join(", "),
    isPublished: post.isPublished,
    publishedAt: post.publishedAt ? post.publishedAt.slice(0, 16) : "",
    readingMinutes: post.readingMinutes ? String(post.readingMinutes) : "",
  };
}

function fromEditorState(state: EditorState): BlogPostUpsertInput {
  return {
    title: state.title,
    slug: state.slug,
    excerpt: state.excerpt,
    content: state.content,
    coverImageUrl: state.coverImageUrl || null,
    tags: state.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean),
    isPublished: state.isPublished,
    publishedAt: state.publishedAt ? new Date(state.publishedAt).toISOString() : null,
    readingMinutes: state.readingMinutes ? Number(state.readingMinutes) : null,
  };
}

function formatDateTime(dateValue: string): string {
  const date = new Date(dateValue);
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function getReadableErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  if (typeof error === "object" && error !== null) {
    const maybeMessage = (error as { message?: unknown }).message;
    if (typeof maybeMessage === "string" && maybeMessage.trim()) {
      return maybeMessage;
    }
  }

  return fallback;
}

export default function BlogAdminPage() {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const { signOut } = useClerk();
  const { user } = useUser();
  const clerkSupabaseJwtTemplate =
    import.meta.env.VITE_CLERK_SUPABASE_JWT_TEMPLATE ?? "supabase";

  const [posts, setPosts] = useState<BlogPostAdminItem[]>([]);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [editor, setEditor] = useState<EditorState>(createDefaultEditorState);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const selectedPost = useMemo(
    () => posts.find((post) => post.id === selectedPostId) ?? null,
    [posts, selectedPostId]
  );

  const getSupabaseAccessToken = async () => {
    const token = await getToken({ template: clerkSupabaseJwtTemplate });

    if (!token) {
      throw new Error(
        `Token Clerk untuk Supabase tidak ditemukan. Buat JWT template '${clerkSupabaseJwtTemplate}' di Clerk Dashboard.`
      );
    }

    return token;
  };

  const loadPosts = async () => {
    setIsDataLoading(true);
    setErrorMessage("");

    try {
      const accessToken = await getSupabaseAccessToken();
      const data = await getAdminBlogPosts(accessToken);
      setPosts(data);

      if (!selectedPostId) {
        if (data[0]) {
          setSelectedPostId(data[0].id);
          setEditor(toEditorState(data[0]));
        }

        return;
      }

      const current = data.find((item) => item.id === selectedPostId);

      if (current) {
        setEditor(toEditorState(current));
        return;
      }

      setSelectedPostId(null);
      setEditor(createDefaultEditorState());
    } catch (error) {
      setErrorMessage(getReadableErrorMessage(error, "Gagal memuat data blog admin."));
    } finally {
      setIsDataLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoaded || !isSignedIn) {
      setPosts([]);
      setSelectedPostId(null);
      setEditor(createDefaultEditorState());
      return;
    }

    loadPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, isSignedIn]);

  const handleSignOut = async () => {
    await signOut({ redirectUrl: "/" });
  };

  const selectPost = (post: BlogPostAdminItem) => {
    setSelectedPostId(post.id);
    setEditor(toEditorState(post));
    setMessage("");
    setErrorMessage("");
  };

  const newPost = () => {
    setSelectedPostId(null);
    setEditor(createDefaultEditorState());
    setMessage("");
    setErrorMessage("");
  };

  const insertCodeBlock = () => {
    const codeTemplate = "\n```typescript\n// Tulis kode di sini\nconsole.log(\"Hello World\");\n```\n";
    setEditor((current) => ({
      ...current,
      content: current.content + (current.content && !current.content.endsWith("\n") ? "\n" : "") + codeTemplate,
    }));
  };

  const insertStep = () => {
    const stepTemplate = "\n### 1. Judul Langkah\n\nDeskripsi langkah di sini.\n";
    setEditor((current) => ({
      ...current,
      content: current.content + (current.content && !current.content.endsWith("\n") ? "\n" : "") + stepTemplate,
    }));
  };

  const savePost = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!editor.title.trim()) {
      setErrorMessage("Judul wajib diisi.");
      return;
    }

    if (!editor.slug.trim()) {
      setErrorMessage("Slug wajib diisi.");
      return;
    }

    if (!editor.excerpt.trim()) {
      setErrorMessage("Excerpt wajib diisi.");
      return;
    }

    if (!editor.content.trim()) {
      setErrorMessage("Konten wajib diisi.");
      return;
    }

    setIsSaving(true);
    setMessage("");
    setErrorMessage("");

    try {
      const accessToken = await getSupabaseAccessToken();
      const payload = fromEditorState({
        ...editor,
        publishedAt: editor.isPublished ? getCurrentDateTimeLocalInputValue() : "",
      });

      if (selectedPostId) {
        const updated = await updateBlogPost(selectedPostId, payload, accessToken);
        setPosts((current) => current.map((item) => (item.id === updated.id ? updated : item)));
        setEditor(toEditorState(updated));
        setMessage("Artikel berhasil diperbarui.");
      } else {
        const created = await createBlogPost(payload, accessToken);
        setPosts((current) => [created, ...current]);
        setSelectedPostId(created.id);
        setEditor(toEditorState(created));
        setMessage("Artikel baru berhasil dibuat.");
      }
    } catch (error) {
      setErrorMessage(getReadableErrorMessage(error, "Gagal menyimpan artikel."));
    } finally {
      setIsSaving(false);
    }
  };

  const removePost = async () => {
    if (!selectedPostId) {
      return;
    }

    const target = posts.find((item) => item.id === selectedPostId);
    const title = target?.title ?? "artikel ini";

    if (!window.confirm(`Hapus ${title}?`)) {
      return;
    }

    setIsSaving(true);
    setMessage("");
    setErrorMessage("");

    try {
      const accessToken = await getSupabaseAccessToken();
      await deleteBlogPost(selectedPostId, accessToken);

      setPosts((current) => current.filter((item) => item.id !== selectedPostId));
      setSelectedPostId(null);
      setEditor(createDefaultEditorState());
      setMessage("Artikel berhasil dihapus.");
    } catch (error) {
      setErrorMessage(getReadableErrorMessage(error, "Gagal menghapus artikel."));
    } finally {
      setIsSaving(false);
    }
  };

  if (!supabase) {
    return (
      <div className="mx-auto my-14 w-full max-w-3xl px-4">
        <Card className="border-destructive/40 p-6">
          <div className="flex items-start gap-3 text-destructive">
            <AlertCircle className="mt-0.5 h-5 w-5" />
            <div className="space-y-1">
              <p className="font-semibold">Supabase belum siap</p>
              <p className="text-sm">{supabaseConfigError ?? "Periksa konfigurasi environment variables."}</p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 text-muted-foreground">
        <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
        Memeriksa sesi Clerk...
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="mx-auto my-14 w-full max-w-md px-4">
        <Card className="w-full border-primary/20 bg-card/70 p-6">
          <h1 className="text-2xl font-bold text-primary">Blog Admin</h1>
          <p className="mt-2 text-sm text-muted-foreground">Silakan login menggunakan Clerk untuk mengakses area admin.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 md:px-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-primary">Blog Admin Workspace</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Login sebagai {user?.primaryEmailAddress?.emailAddress ?? user?.username ?? "admin"}
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={newPost}>
            <Plus className="h-4 w-4" />
            New Post
          </Button>
          <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>

      {message ? <p className="mb-4 text-sm text-green-600">{message}</p> : null}
      {errorMessage ? <p className="mb-4 text-sm text-destructive">{errorMessage}</p> : null}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[330px_1fr]">
        <Card className="max-h-[72vh] overflow-hidden border-primary/20 bg-card/70">
          <div className="border-b border-border px-4 py-3">
            <h2 className="font-semibold">Daftar Artikel</h2>
          </div>

          <div className="max-h-[calc(72vh-54px)] overflow-y-auto px-2 py-2">
            {isDataLoading ? (
              <p className="px-2 py-3 text-sm text-muted-foreground">Memuat daftar artikel...</p>
            ) : posts.length === 0 ? (
              <p className="px-2 py-3 text-sm text-muted-foreground">Belum ada artikel.</p>
            ) : (
              posts.map((post) => {
                const isActive = post.id === selectedPostId;

                return (
                  <button
                    key={post.id}
                    type="button"
                    onClick={() => selectPost(post)}
                    className={`mb-2 w-full rounded-md border px-3 py-2 text-left transition ${
                      isActive
                        ? "border-primary bg-primary/10"
                        : "border-border bg-background/70 hover:border-primary/40"
                    }`}
                  >
                    <p className="line-clamp-1 font-semibold">{post.title}</p>
                    <p className="line-clamp-1 text-xs text-muted-foreground">/{post.slug}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Updated {formatDateTime(post.updatedAt)}
                    </p>
                  </button>
                );
              })
            )}
          </div>
        </Card>

        <Card className="border-primary/20 bg-card/70 px-4 py-5 md:px-6">
          <form className="flex flex-col gap-4" onSubmit={savePost}>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <label className="flex flex-col gap-1.5 text-sm">
                Judul
                <input
                  required
                  value={editor.title}
                  onChange={(event) => {
                    const nextTitle = event.target.value;

                    setEditor((current) => {
                      const shouldGenerateSlug =
                        !current.slug || current.slug === createBlogSlug(current.title);

                      return {
                        ...current,
                        title: nextTitle,
                        slug: shouldGenerateSlug ? createBlogSlug(nextTitle) : current.slug,
                      };
                    });
                  }}
                  className="h-10 rounded-md border border-border bg-background px-3"
                  placeholder="Judul artikel"
                />
              </label>

              <label className="flex flex-col gap-1.5 text-sm">
                Slug
                <div className="flex gap-2">
                  <input
                    required
                    value={editor.slug}
                    onChange={(event) =>
                      setEditor((current) => ({ ...current, slug: createBlogSlug(event.target.value) }))
                    }
                    className="h-10 w-full rounded-md border border-border bg-background px-3"
                    placeholder="slug-artikel"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      setEditor((current) => ({
                        ...current,
                        slug: createBlogSlug(current.title || current.slug),
                      }))
                    }
                  >
                    Auto
                  </Button>
                </div>
              </label>
            </div>

            <label className="flex flex-col gap-1.5 text-sm">
              Excerpt
              <textarea
                required
                rows={3}
                value={editor.excerpt}
                onChange={(event) => setEditor((current) => ({ ...current, excerpt: event.target.value }))}
                className="rounded-md border border-border bg-background px-3 py-2"
                placeholder="Ringkasan singkat artikel"
              />
            </label>

              <div className="flex flex-col gap-1.5 text-sm">
                <div className="flex items-center justify-between">
                  Konten
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="xs"
                      onClick={insertCodeBlock}
                      title="Insert Code Block"
                    >
                      <Code className="h-3 w-3" />
                      Code
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="xs"
                      onClick={insertStep}
                      title="Insert Step/Heading"
                    >
                      <Plus className="h-3 w-3" />
                      Step
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <textarea
                    required
                    rows={20}
                    value={editor.content}
                    onChange={(event) => setEditor((current) => ({ ...current, content: event.target.value }))}
                    className="rounded-md border border-border bg-background px-3 py-4 font-mono text-sm leading-relaxed focus:outline-none focus:ring-1 focus:ring-primary/30 min-h-[500px]"
                    placeholder="Tulis artikel di sini..."
                  />
                  
                  <div className="rounded-md border border-border bg-card/30 px-6 py-4 prose max-w-none overflow-y-auto antialiased min-h-[500px] max-h-[700px]">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      rehypePlugins={[rehypeHighlight]}
                    >
                      {editor.content || "*Preview kosong*"}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>

            <div className="flex flex-col gap-1.5 text-sm w-full mt-4">
              <span>Cover Image</span>
              <ImageUploader
                value={editor.coverImageUrl}
                onChange={(url) => setEditor((current) => ({ ...current, coverImageUrl: url }))}
                getSupabaseAccessToken={getSupabaseAccessToken}
                bucketName="blog-images" 
                folderPath="covers"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 mt-4">
              <label className="flex flex-col gap-1.5 text-sm md:col-span-2">
                Tags
                <input
                  value={editor.tags}
                  onChange={(event) => setEditor((current) => ({ ...current, tags: event.target.value }))}
                  className="h-10 rounded-md border border-border bg-background px-3"
                  placeholder="react, typescript, backend"
                />
              </label>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <label className="flex flex-col gap-1.5 text-sm">
                Published At
                <input
                  type="datetime-local"
                  value={editor.publishedAt}
                  readOnly
                  className="h-10 rounded-md border border-border bg-background px-3"
                />
              </label>

              <label className="flex flex-col gap-1.5 text-sm">
                Reading Minutes
                <input
                  type="number"
                  min={1}
                  value={editor.readingMinutes}
                  onChange={(event) =>
                    setEditor((current) => ({ ...current, readingMinutes: event.target.value }))
                  }
                  className="h-10 rounded-md border border-border bg-background px-3"
                  placeholder="Auto"
                />
              </label>

              <label className="flex h-10 items-center gap-2 self-end text-sm">
                <input
                  type="checkbox"
                  checked={editor.isPublished}
                  onChange={(event) => {
                    const isPublished = event.target.checked;

                    setEditor((current) => ({
                      ...current,
                      isPublished,
                      publishedAt: isPublished ? getCurrentDateTimeLocalInputValue() : "",
                    }));
                  }}
                  className="h-4 w-4"
                />
                Publish sekarang
              </label>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              <Button disabled={isSaving} type="submit">
                {isSaving ? (
                  <>
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    {selectedPost ? "Update Post" : "Create Post"}
                  </>
                )}
              </Button>

              <Button type="button" variant="outline" disabled={isSaving} onClick={newPost}>
                <Plus className="h-4 w-4" />
                Reset Form
              </Button>

              <Button
                type="button"
                variant="destructive"
                disabled={!selectedPost || isSaving}
                onClick={removePost}
              >
                <Trash2 className="h-4 w-4" />
                Delete Post
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
