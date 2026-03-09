import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const style = searchParams.get("style");
  const search = searchParams.get("search");
  const favorites = searchParams.get("favorites") === "true";

  const where: Record<string, unknown> = {};
  if (style) where.style = style;
  if (favorites) where.isFavorite = true;
  if (search) {
    where.OR = [
      { title: { contains: search } },
      { topic: { contains: search } },
      { tags: { contains: search } },
    ];
  }

  const templates = await prisma.template.findMany({
    where,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      topic: true,
      style: true,
      totalDuration: true,
      aiProvider: true,
      isFavorite: true,
      tags: true,
      createdAt: true,
    },
  });

  return NextResponse.json(templates);
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const { id, ...data } = body;

  if (!id) {
    return NextResponse.json({ error: "缺少模板ID" }, { status: 400 });
  }

  const updated = await prisma.template.update({
    where: { id },
    data,
  });

  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "缺少模板ID" }, { status: 400 });
  }

  await prisma.template.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
