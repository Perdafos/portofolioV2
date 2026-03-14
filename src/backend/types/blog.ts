export interface BlogPostPreview {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  coverImageUrl: string | null;
  tags: string[];
  publishedAt: string | null;
  readingMinutes: number | null;
}

export interface BlogPostDetail extends BlogPostPreview {
  content: string;
}

export interface BlogPostAdminItem extends BlogPostDetail {
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BlogPostUpsertInput {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImageUrl: string | null;
  tags: string[];
  isPublished: boolean;
  publishedAt: string | null;
  readingMinutes: number | null;
}
