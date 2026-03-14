import {
  type BlogPostAdminItem,
  type BlogPostDetail,
  type BlogPostPreview,
  type BlogPostUpsertInput,
} from "@/backend/types/blog";
import {
  createSupabaseClientWithAccessToken,
  supabase,
  supabaseConfigError,
} from "@/backend/supabase/client";

interface BlogPostRow {
  id: string | number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  cover_image_url: string | null;
  tags: string[] | null;
  is_published: boolean;
  published_at: string | null;
  reading_minutes: number | null;
  created_at: string;
  updated_at: string;
}

interface BlogPostUpsertRow {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  cover_image_url: string | null;
  tags: string[];
  is_published: boolean;
  published_at: string | null;
  reading_minutes: number;
}

const BLOG_COLUMNS =
  "id, slug, title, excerpt, content, cover_image_url, tags, is_published, published_at, reading_minutes, created_at, updated_at";

function getSupabaseClient(): NonNullable<typeof supabase> {
  if (!supabase) {
    throw new Error(supabaseConfigError ?? "Supabase client is not configured.");
  }

  return supabase;
}

function getSupabaseAdminClient(accessToken: string) {
  if (!accessToken.trim()) {
    throw new Error("Missing Clerk Supabase access token.");
  }

  return createSupabaseClientWithAccessToken(accessToken);
}

function normalizeTags(tags: string[] | null | undefined): string[] {
  return (tags ?? [])
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0)
    .slice(0, 8);
}

function estimateReadingMinutes(content: string): number {
  const words = content
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

  if (words <= 0) {
    return 1;
  }

  return Math.max(1, Math.ceil(words / 200));
}

function mapPreview(row: BlogPostRow): BlogPostPreview {
  return {
    id: String(row.id),
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    coverImageUrl: row.cover_image_url,
    tags: normalizeTags(row.tags),
    publishedAt: row.published_at,
    readingMinutes: row.reading_minutes,
  };
}

function mapDetail(row: BlogPostRow): BlogPostDetail {
  return {
    ...mapPreview(row),
    content: row.content,
  };
}

function mapAdminItem(row: BlogPostRow): BlogPostAdminItem {
  return {
    ...mapDetail(row),
    isPublished: row.is_published,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function buildUpsertPayload(input: BlogPostUpsertInput): BlogPostUpsertRow {
  const normalizedContent = input.content.trim();
  const normalizedTags = normalizeTags(input.tags);
  const normalizedPublishedAt = input.isPublished
    ? input.publishedAt ?? new Date().toISOString()
    : null;

  return {
    slug: input.slug.trim().toLowerCase(),
    title: input.title.trim(),
    excerpt: input.excerpt.trim(),
    content: normalizedContent,
    cover_image_url: input.coverImageUrl?.trim() || null,
    tags: normalizedTags,
    is_published: input.isPublished,
    published_at: normalizedPublishedAt,
    reading_minutes: input.readingMinutes ?? estimateReadingMinutes(normalizedContent),
  };
}

export function createBlogSlug(value: string): string {
  const slug = value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

  return slug || "untitled-post";
}

export async function getPublishedBlogPosts(limit?: number): Promise<BlogPostPreview[]> {
  const client = getSupabaseClient();

  let query = client
    .from("blog_posts")
    .select(BLOG_COLUMNS)
    .eq("is_published", true)
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });

  if (typeof limit === "number") {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  const rows = (data ?? []) as BlogPostRow[];
  return rows.map(mapPreview);
}

export async function getPublishedBlogPostBySlug(slug: string): Promise<BlogPostDetail | null> {
  const client = getSupabaseClient();

  const { data, error } = await client
    .from("blog_posts")
    .select(BLOG_COLUMNS)
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    return null;
  }

  return mapDetail(data as BlogPostRow);
}

export async function getAdminBlogPosts(accessToken: string): Promise<BlogPostAdminItem[]> {
  const client = getSupabaseAdminClient(accessToken);

  const { data, error } = await client
    .from("blog_posts")
    .select(BLOG_COLUMNS)
    .order("updated_at", { ascending: false });

  if (error) {
    throw error;
  }

  const rows = (data ?? []) as BlogPostRow[];
  return rows.map(mapAdminItem);
}

export async function createBlogPost(
  input: BlogPostUpsertInput,
  accessToken: string
): Promise<BlogPostAdminItem> {
  const client = getSupabaseAdminClient(accessToken);

  const payload = buildUpsertPayload(input);

  const { data, error } = await client
    .from("blog_posts")
    .insert(payload)
    .select(BLOG_COLUMNS)
    .single();

  if (error) {
    throw error;
  }

  return mapAdminItem(data as BlogPostRow);
}

export async function updateBlogPost(
  id: string,
  input: BlogPostUpsertInput,
  accessToken: string
): Promise<BlogPostAdminItem> {
  const client = getSupabaseAdminClient(accessToken);

  const payload = buildUpsertPayload(input);

  const { data, error } = await client
    .from("blog_posts")
    .update(payload)
    .eq("id", id)
    .select(BLOG_COLUMNS)
    .single();

  if (error) {
    throw error;
  }

  return mapAdminItem(data as BlogPostRow);
}

export async function deleteBlogPost(id: string, accessToken: string): Promise<void> {
  const client = getSupabaseAdminClient(accessToken);

  const { error } = await client.from("blog_posts").delete().eq("id", id);

  if (error) {
    throw error;
  }
}
