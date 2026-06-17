import type { WorkVideo, WorkVideoUpsertInput, VideoPlatform } from "@/backend/types/video";
import {
  createSupabaseClientWithAccessToken,
  supabase,
  supabaseConfigError,
} from "@/backend/supabase/client";

interface WorkVideoRow {
  id: string;
  title: string;
  video_url: string;
  platform: string;
  embed_url: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

const VIDEO_COLUMNS = "id, title, video_url, platform, embed_url, sort_order, created_at, updated_at";

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

function mapRow(row: WorkVideoRow): WorkVideo {
  return {
    id: row.id,
    title: row.title,
    videoUrl: row.video_url,
    platform: row.platform as VideoPlatform,
    embedUrl: row.embed_url,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// Public: Get all work videos ordered by sort_order and created_at
export async function getWorkVideos(): Promise<WorkVideo[]> {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from("work_videos")
    .select(VIDEO_COLUMNS)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  const rows = (data ?? []) as WorkVideoRow[];
  return rows.map(mapRow);
}

// Admin: Get all work videos (same query, but using admin credentials if necessary, or same client)
export async function getAdminWorkVideos(accessToken: string): Promise<WorkVideo[]> {
  const client = getSupabaseAdminClient(accessToken);
  const { data, error } = await client
    .from("work_videos")
    .select(VIDEO_COLUMNS)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  const rows = (data ?? []) as WorkVideoRow[];
  return rows.map(mapRow);
}

// Admin: Create work video
export async function createWorkVideo(
  input: WorkVideoUpsertInput,
  accessToken: string
): Promise<WorkVideo> {
  const client = getSupabaseAdminClient(accessToken);
  const payload = {
    title: input.title,
    video_url: input.videoUrl,
    platform: input.platform,
    embed_url: input.embedUrl,
    sort_order: input.sortOrder ?? 0,
  };

  const { data, error } = await client
    .from("work_videos")
    .insert(payload)
    .select(VIDEO_COLUMNS)
    .single();

  if (error) {
    throw error;
  }

  return mapRow(data as WorkVideoRow);
}

// Admin: Update work video
export async function updateWorkVideo(
  id: string,
  input: WorkVideoUpsertInput,
  accessToken: string
): Promise<WorkVideo> {
  const client = getSupabaseAdminClient(accessToken);
  const payload = {
    title: input.title,
    video_url: input.videoUrl,
    platform: input.platform,
    embed_url: input.embedUrl,
    sort_order: input.sortOrder ?? 0,
  };

  const { data, error } = await client
    .from("work_videos")
    .update(payload)
    .eq("id", id)
    .select(VIDEO_COLUMNS)
    .single();

  if (error) {
    throw error;
  }

  return mapRow(data as WorkVideoRow);
}

// Admin: Delete work video
export async function deleteWorkVideo(id: string, accessToken: string): Promise<void> {
  const client = getSupabaseAdminClient(accessToken);
  const { error } = await client.from("work_videos").delete().eq("id", id);
  if (error) {
    throw error;
  }
}

// Helper: Decode HTML entities
function decodeHtmlEntities(str: string): string {
  if (!str) return "";
  return str
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&middot;/g, "·")
    .replace(/\\u0026/g, "&");
}

// Helper: Extract YouTube ID
export function extractYouTubeId(url: string): string | null {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/)([^#\&\?]*).*/;
  const match = url.trim().match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

// Helper: Extract Instagram shortcode
export function extractInstagramCode(url: string): string | null {
  const match = url.trim().match(/(?:instagram\.com)\/(?:p|reel|tv)\/([a-zA-Z0-9_-]+)/);
  return match ? match[1] : null;
}

// Helper: Extract TikTok ID
export function extractTikTokId(url: string): string | null {
  const match = url.trim().match(/\/video\/(\d+)/);
  return match ? match[1] : null;
}

export interface VideoMetadata {
  title: string;
  embedUrl: string;
  platform: VideoPlatform;
}

// Fetch video metadata from URL (CORS safe where possible)
export async function fetchVideoMetadata(url: string): Promise<VideoMetadata> {
  const trimmedUrl = url.trim();

  // YouTube
  const youtubeId = extractYouTubeId(trimmedUrl);
  if (youtubeId) {
    let title = `YouTube Video (${youtubeId})`;
    try {
      const oembedUrl = `https://noembed.com/embed?url=${encodeURIComponent(trimmedUrl)}`;
      const res = await fetch(oembedUrl);
      if (res.ok) {
        const json = await res.json();
        if (json.title) {
          title = json.title;
        }
      }
    } catch (e) {
      console.error("Gagal mengambil info YouTube oEmbed", e);
    }
    return {
      title,
      embedUrl: `https://www.youtube.com/embed/${youtubeId}`,
      platform: "youtube",
    };
  }

  // Instagram
  const instagramCode = extractInstagramCode(trimmedUrl);
  if (instagramCode) {
    let title = `Instagram Reel (${instagramCode})`;
    try {
      // Instagram blocks standard fetching, so we proxy via allorigins.win
      const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(trimmedUrl)}`;
      const res = await fetch(proxyUrl);
      if (res.ok) {
        const json = await res.json();
        const html = json.contents || "";

        // Attempt to parse og:description or og:title
        const descMatch =
          html.match(/<meta[^>]*property="og:description"[^>]*content="([^"]+)"/i) ||
          html.match(/<meta[^>]*name="description"[^>]*content="([^"]+)"/i) ||
          html.match(/<meta[^>]*content="([^"]+)"[^>]*property="og:description"/i);

        let parsedTitle = "";
        if (descMatch) {
          parsedTitle = descMatch[1];
        } else {
          const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
          if (titleMatch) {
            parsedTitle = titleMatch[1];
          }
        }

        if (parsedTitle) {
          let clean = decodeHtmlEntities(parsedTitle);
          // Clean Instagram wrapper: "User on Instagram: 'Caption...'"
          const instaPattern = /^[^:]+on Instagram:\s*“([\s\S]*)”$/;
          const instaPatternSingleQuote = /^[^:]+on Instagram:\s*’([\s\S]*)’$/;
          const instaPatternNormalQuote = /^[^:]+on Instagram:\s*"([\s\S]*)"$/;

          const m =
            clean.match(instaPattern) ||
            clean.match(instaPatternSingleQuote) ||
            clean.match(instaPatternNormalQuote);

          if (m) {
            clean = m[1];
          }
          title = clean.trim();
        }
      }
    } catch (e) {
      console.error("Gagal mengambil info Instagram via proxy", e);
    }
    return {
      title,
      embedUrl: `https://www.instagram.com/reel/${instagramCode}/embed/`,
      platform: "instagram",
    };
  }

  // TikTok
  const isTikTok = trimmedUrl.includes("tiktok.com");
  if (isTikTok) {
    let title = "TikTok Video";
    let embedUrl = "";

    try {
      // Use TikTok public oembed endpoint
      const oembedUrl = `https://www.tiktok.com/oembed?url=${encodeURIComponent(trimmedUrl)}`;
      const res = await fetch(oembedUrl);
      if (res.ok) {
        const json = await res.json();
        if (json.title) {
          title = json.title;
        }

        // Parse video ID from HTML
        const html = json.html || "";
        const idMatch = html.match(/data-video-id="(\d+)"/) || html.match(/\/video\/(\d+)/);
        if (idMatch) {
          embedUrl = `https://www.tiktok.com/embed/v2/${idMatch[1]}`;
        }
      }
    } catch (e) {
      console.error("Gagal mengambil info TikTok oEmbed", e);
    }

    // Fallback if oembed didn't give embedUrl
    if (!embedUrl) {
      const parsedId = extractTikTokId(trimmedUrl);
      if (parsedId) {
        embedUrl = `https://www.tiktok.com/embed/v2/${parsedId}`;
      } else {
        // Short URL redirect resolution via allorigins
        try {
          const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(trimmedUrl)}`;
          const res = await fetch(proxyUrl);
          if (res.ok) {
            const json = await res.json();
            const html = json.contents || "";
            const idMatch = html.match(/\/video\/(\d+)/) || html.match(/data-video-id="(\d+)"/);
            if (idMatch) {
              embedUrl = `https://www.tiktok.com/embed/v2/${idMatch[1]}`;
            }
          }
        } catch (e) {
          console.error("Gagal menyelesaikan redirect TikTok via proxy", e);
        }
      }
    }

    if (!embedUrl) {
      throw new Error("Gagal mengekstrak Video ID dari link TikTok. Pastikan format link benar.");
    }

    return {
      title,
      embedUrl,
      platform: "tiktok",
    };
  }

  throw new Error("URL tidak dikenali. Gunakan link YouTube, Instagram (Reel/Post), atau TikTok.");
}
