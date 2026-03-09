import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "缺少模板ID" }, { status: 400 });
  }

  const template = await prisma.template.findUnique({
    where: { id },
  });

  if (!template) {
    return NextResponse.json({ error: "模板不存在" }, { status: 404 });
  }

  return NextResponse.json(template);
}
