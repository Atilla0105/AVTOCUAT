import { execFile } from "child_process";
import { promisify } from "util";
import { VideoMetadata } from "@/types/ai";
import { ParsedVideoURL } from "@/types/video";

const execFileAsync = promisify(execFile);

export async function fetchVideoMetadata(
  parsed: ParsedVideoURL
): Promise<VideoMetadata> {
  try {
    const { stdout } = await execFileAsync(
      "yt-dlp",
      [
        "--js-runtimes",
        "node",
        "--dump-json",
        "--no-download",
        parsed.originalUrl,
      ],
      { timeout: 30000 }
    );

    const info = JSON.parse(stdout);
    return {
      title: info.title || "Unknown",
      description: info.description || "",
      duration: info.duration || undefined,
      platform: parsed.platform,
    };
  } catch {
    return {
      title: "Unknown Video",
      platform: parsed.platform,
    };
  }
}
