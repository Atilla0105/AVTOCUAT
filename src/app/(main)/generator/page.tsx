"use client";

import { useState } from "react";
import { TopicInput } from "@/components/generator/topic-input";
import { TemplatePreview } from "@/components/generator/template-preview";
import { Skeleton } from "@/components/ui/skeleton";
import { VideoTemplate, VideoStyle } from "@/types/template";
import { toast } from "sonner";

export default function GeneratorPage() {
  const [template, setTemplate] = useState<VideoTemplate | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async (data: {
    topic: string;
    style: VideoStyle;
    provider: "claude" | "openai";
    options: { duration: number; tone: string };
  }) => {
    setIsLoading(true);
    setTemplate(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "生成失败");
      }

      const result = await res.json();
      setTemplate(result.template);
      toast.success("模板生成成功！");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "生成失败，请重试"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">生成拍摄模板</h1>
        <p className="mt-1 text-muted-foreground">
          输入主题，AI帮你规划整个视频的拍摄方案
        </p>
      </div>

      <TopicInput onGenerate={handleGenerate} isLoading={isLoading} />

      {isLoading && (
        <div className="space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      )}

      {template && <TemplatePreview template={template} />}
    </div>
  );
}
