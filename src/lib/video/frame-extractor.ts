import { execFile } from "child_process";
import { promisify } from "util";
import { readFile, mkdtemp, rm, readdir } from "fs/promises";
import { tmpdir } from "os";
import { join } from "path";

const execFileAsync = promisify(execFile);

export async function extractFrames(
  videoUrl: string,
  intervalSeconds: number = 30,
  maxFrames: number = 20
): Promise<string[]> {
  const tempDir = await mkdtemp(join(tmpdir(), "avtocuat-frames-"));
  const videoPath = join(tempDir, "video.mp4");

  try {
    // Download video at low quality
    await execFileAsync(
      "yt-dlp",
      [
        "--js-runtimes",
        "node",
        "--impersonate",
        "chrome",
        "-f",
        "worst[ext=mp4][filesize<200M]/worst[ext=mp4]/worst",
        "--max-filesize",
        "200M",
        "-o",
        videoPath,
        videoUrl,
      ],
      { timeout: 180000 }
    );

    // Extract frames using ffmpeg
    const framePattern = join(tempDir, "frame_%03d.jpg");
    await execFileAsync(
      "ffmpeg",
      [
        "-i",
        videoPath,
        "-vf",
        `fps=1/${intervalSeconds},scale=1024:-1`,
        "-frames:v",
        String(maxFrames),
        "-q:v",
        "5",
        framePattern,
      ],
      { timeout: 60000 }
    );

    // Read frames as base64
    const files = await readdir(tempDir);
    const frameFiles = files
      .filter((f) => f.startsWith("frame_") && f.endsWith(".jpg"))
      .sort();

    const frames: string[] = [];
    for (const file of frameFiles) {
      const buffer = await readFile(join(tempDir, file));
      frames.push(buffer.toString("base64"));
    }

    return frames;
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
}
