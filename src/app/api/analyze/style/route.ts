import { NextRequest, NextResponse } from "next/server";
import { createAIProvider } from "@/lib/ai/provider";
import { prisma } from "@/lib/prisma";
import { parseVideoURL } from "@/lib/video/url-parser";
import { extractSubtitles } from "@/lib/video/subtitle-extractor";
import { extractFrames } from "@/lib/video/frame-extractor";
import { fetchVideoMetadata } from "@/lib/video/metadata-fetcher";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url, provider } = body as {
      url: string;
      provider: "claude" | "openai";
    };

    if (!url) {
      return NextResponse.json(
        { error: "请提供视频链接" },
        { status: 400 }
      );
    }

    // Parse URL
    const parsed = parseVideoURL(url);
    if (parsed.platform === "unknown") {
      return NextResponse.json(
        { error: "不支持的视频平台，目前支持YouTube和B站" },
        { status: 400 }
      );
    }

    // Get API key
    const settings = await prisma.settings.findUnique({
      where: { id: "default" },
    });
    const apiKey =
      provider === "claude"
        ? settings?.anthropicKey || process.env.ANTHROPIC_API_KEY
        : settings?.openaiKey || process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: `${provider === "claude" ? "Anthropic" : "OpenAI"} API密钥未配置` },
        { status: 400 }
      );
    }

    // Fetch metadata
    const metadata = await fetchVideoMetadata(parsed);

    // Extract subtitles and frames in parallel
    let transcript = "";
    let frames: string[] = [];

    const results = await Promise.allSettled([
      extractSubtitles(url),
      extractFrames(url, 30, 15),
    ]);

    if (results[0].status === "fulfilled") {
      transcript = results[0].value;
    }
    if (results[1].status === "fulfilled") {
      frames = results[1].value;
    }

    if (!transcript && frames.length === 0) {
      return NextResponse.json(
        { error: "无法提取视频字幕和帧画面，请确保yt-dlp和ffmpeg已安装" },
        { status: 500 }
      );
    }

    // Analyze with AI
    const ai = createAIProvider(provider, apiKey);
    const analysis = await ai.analyzeVideo(
      transcript || "(无字幕)",
      frames,
      metadata
    );

    // Save to database
    await prisma.videoAnalysis.create({
      data: {
        videoUrl: url,
        videoTitle: metadata.title,
        videoPlatform: parsed.platform,
        transcript: transcript || null,
        frameCount: frames.length,
        analysisResult: JSON.stringify(analysis),
        aiProvider: provider,
      },
    });

    return NextResponse.json({
      analysis,
      metadata,
      hasTranscript: !!transcript,
      frameCount: frames.length,
    });
  } catch (error) {
    console.error("Video analysis error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "视频分析失败，请重试",
      },
      { status: 500 }
    );
  }
}
