export type VideoPlatform = "tiktok" | "instagram" | "youtube";

export interface WorkVideo {
  id: string;
  title: string;
  videoUrl: string;
  platform: VideoPlatform;
  embedUrl: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface WorkVideoUpsertInput {
  title: string;
  videoUrl: string;
  platform: VideoPlatform;
  embedUrl: string;
  sortOrder?: number;
}
