import { ParsedVideoURL } from "@/types/video";

export function parseVideoURL(url: string): ParsedVideoURL {
  // YouTube formats
  const ytPatterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
  ];
  for (const pattern of ytPatterns) {
    const match = url.match(pattern);
    if (match) {
      return { platform: "youtube", videoId: match[1], originalUrl: url };
    }
  }

  // Bilibili formats
  const biliPatterns = [
    /bilibili\.com\/video\/(BV[a-zA-Z0-9]+)/,
    /b23\.tv\/([a-zA-Z0-9]+)/,
  ];
  for (const pattern of biliPatterns) {
    const match = url.match(pattern);
    if (match) {
      return { platform: "bilibili", videoId: match[1], originalUrl: url };
    }
  }

  return { platform: "unknown", videoId: "", originalUrl: url };
}
