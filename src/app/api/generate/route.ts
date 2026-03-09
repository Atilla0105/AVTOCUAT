import { NextRequest, NextResponse } from "next/server";
import { createAIProvider } from "@/lib/ai/provider";
import { prisma } from "@/lib/prisma";
import { VideoStyle } from "@/types/template";
import { GenerateOptions } from "@/types/ai";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { topic, style, provider, options } = body as {
      topic: string;
      style: VideoStyle;
      provider: "claude" | "openai";
      options?: GenerateOptions;
    };

    if (!topic || !style) {
      return NextResponse.json(
        { error: "缺少必要参数：topic 和 style" },
        { status: 400 }
      );
    }

    // Get API key from settings or env
    const settings = await prisma.settings.findUnique({
      where: { id: "default" },
    });
    const apiKey =
      provider === "claude"
        ? settings?.anthropicKey || process.env.ANTHROPIC_API_KEY
        : settings?.openaiKey || process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          error: `${provider === "claude" ? "Anthropic" : "OpenAI"} API密钥未配置，请在设置页面填写`,
        },
        { status: 400 }
      );
    }

    const ai = createAIProvider(provider, apiKey);
    const template = await ai.generateTemplate(topic, style, {
      ...options,
      language: settings?.language ?? "zh",
    });

    // Save to database
    const saved = await prisma.template.create({
      data: {
        title: template.title,
        topic,
        style,
        totalDuration: template.totalDuration,
        content: JSON.stringify(template),
        aiProvider: provider,
      },
    });

    return NextResponse.json({ template, id: saved.id });
  } catch (error) {
    console.error("Template generation error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "模板生成失败，请重试",
      },
      { status: 500 }
    );
  }
}
