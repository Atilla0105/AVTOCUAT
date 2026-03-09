import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  let settings = await prisma.settings.findUnique({
    where: { id: "default" },
  });

  if (!settings) {
    settings = await prisma.settings.create({
      data: { id: "default" },
    });
  }

  // Mask API keys for security
  return NextResponse.json({
    ...settings,
    anthropicKey: settings.anthropicKey ? "••••" + settings.anthropicKey.slice(-4) : "",
    openaiKey: settings.openaiKey ? "••••" + settings.openaiKey.slice(-4) : "",
    hasAnthropicKey: !!settings.anthropicKey,
    hasOpenaiKey: !!settings.openaiKey,
  });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { defaultProvider, defaultStyle, anthropicKey, openaiKey, language } = body;

  const data: Record<string, string> = {};
  if (defaultProvider) data.defaultProvider = defaultProvider;
  if (defaultStyle) data.defaultStyle = defaultStyle;
  if (language) data.language = language;
  if (anthropicKey !== undefined && anthropicKey !== "••••") {
    data.anthropicKey = anthropicKey;
  }
  if (openaiKey !== undefined && openaiKey !== "••••") {
    data.openaiKey = openaiKey;
  }

  const settings = await prisma.settings.upsert({
    where: { id: "default" },
    update: data,
    create: { id: "default", ...data },
  });

  return NextResponse.json({
    ...settings,
    anthropicKey: settings.anthropicKey ? "••••" + settings.anthropicKey.slice(-4) : "",
    openaiKey: settings.openaiKey ? "••••" + settings.openaiKey.slice(-4) : "",
    hasAnthropicKey: !!settings.anthropicKey,
    hasOpenaiKey: !!settings.openaiKey,
  });
}
