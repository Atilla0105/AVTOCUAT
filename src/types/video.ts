export interface ParsedVideoURL {
  platform: "youtube" | "bilibili" | "unknown";
  videoId: string;
  originalUrl: string;
}

export interface SubtitleEntry {
  start: number;
  end: number;
  text: string;
}
