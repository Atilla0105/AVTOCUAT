import { execFile } from "child_process";
import { promisify } from "util";
import { readFile, mkdtemp, rm } from "fs/promises";
import { tmpdir } from "os";
import { join } from "path";

const execFileAsync = promisify(execFile);

export async function extractSubtitles(
  videoUrl: string,
  language: string = "zh"
): Promise<string> {
  const tempDir = await mkdtemp(join(tmpdir(), "avtocuat-sub-"));

  try {
    // Try yt-dlp to get subtitles
    const outputTemplate = join(tempDir, "sub");

    await execFileAsync("yt-dlp", [
      "--js-runtimes",
      "node",
      "--write-auto-subs",
      "--write-subs",
      "--sub-lang",
      `${language},en`,
      "--sub-format",
      "srt/vtt/best",
      "--skip-download",
      "-o",
      outputTemplate,
      videoUrl,
    ], { timeout: 60000 });

    // Find and read the subtitle file
    const { stdout: files } = await execFileAsync("ls", [tempDir]);
    const subFile = files
      .split("\n")
      .find((f) => f.endsWith(".srt") || f.endsWith(".vtt"));

    if (!subFile) {
      throw new Error("未找到字幕文件");
    }

    const content = await readFile(join(tempDir, subFile), "utf-8");
    return parseSubtitleToText(content);
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
}

function parseSubtitleToText(content: string): string {
  // Remove SRT formatting (timestamps, sequence numbers)
  return content
    .replace(/^\d+\s*$/gm, "") // sequence numbers
    .replace(/\d{2}:\d{2}:\d{2}[.,]\d{3}\s*-->\s*\d{2}:\d{2}:\d{2}[.,]\d{3}/g, "") // timestamps
    .replace(/WEBVTT.*$/gm, "") // VTT header
    .replace(/<[^>]+>/g, "") // HTML tags
    .replace(/\n{3,}/g, "\n") // multiple blank lines
    .trim();
}
