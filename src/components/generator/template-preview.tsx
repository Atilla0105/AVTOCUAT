"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Clock,
  Music,
  Sparkles,
  MessageSquare,
  Flag,
} from "lucide-react";
import { VideoTemplate } from "@/types/template";
import { SceneCard } from "./scene-card";

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}分${s > 0 ? s + "秒" : ""}`;
}

export function TemplatePreview({
  template,
}: {
  template: VideoTemplate;
}) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">{template.title}</h2>
        <div className="mt-2 flex flex-wrap gap-2">
          <Badge>{template.style}</Badge>
          <Badge variant="outline">
            <Clock className="mr-1 h-3 w-3" />
            {formatDuration(template.totalDuration)}
          </Badge>
        </div>
      </div>

      {/* Narrative Arc */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Sparkles className="h-4 w-4" /> 整体叙事弧线
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {template.overallNarrative}
          </p>
        </CardContent>
      </Card>

      {/* Hook */}
      <Card className="border-primary/30 bg-primary/5">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <MessageSquare className="h-4 w-4" /> 开场策略
            <Badge variant="secondary" className="text-xs">
              {template.hook.type}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {template.hook.duration}秒
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div>
            <p className="text-xs font-medium text-muted-foreground">
              开场脚本
            </p>
            <p className="mt-1 text-sm italic">
              「{template.hook.script}」
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">
              画面描述
            </p>
            <p className="mt-1 text-sm">
              {template.hook.visualDescription}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Timeline */}
      <div>
        <h3 className="mb-1 text-lg font-semibold">场景分解</h3>
        <p className="mb-4 text-sm text-muted-foreground">
          共 {template.scenes.length} 个场景，点击展开查看详细拍摄指南
        </p>

        {/* Visual Timeline Bar */}
        <div className="mb-6 overflow-hidden rounded-full bg-muted">
          <div className="flex h-3">
            {template.scenes.map((scene, idx) => {
              const percentage =
                (scene.duration / template.totalDuration) * 100;
              const colors = [
                "bg-blue-500",
                "bg-green-500",
                "bg-yellow-500",
                "bg-purple-500",
                "bg-pink-500",
                "bg-orange-500",
                "bg-teal-500",
                "bg-indigo-500",
                "bg-red-400",
                "bg-cyan-500",
              ];
              return (
                <div
                  key={scene.id}
                  className={`${colors[idx % colors.length]} transition-all`}
                  style={{ width: `${percentage}%` }}
                  title={`${scene.title} - ${formatDuration(scene.duration)}`}
                />
              );
            })}
          </div>
        </div>

        {/* Scene Cards */}
        <div className="space-y-3">
          {template.scenes.map((scene) => (
            <SceneCard key={scene.id} scene={scene} />
          ))}
        </div>
      </div>

      <Separator />

      {/* Closing */}
      <Card className="border-primary/30 bg-primary/5">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Flag className="h-4 w-4" /> 结尾策略
            <Badge variant="secondary" className="text-xs">
              {template.closing.type}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {template.closing.duration}秒
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm italic">
            「{template.closing.script}」
          </p>
        </CardContent>
      </Card>

      {/* Music Recommendations */}
      {template.musicRecommendations.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Music className="h-4 w-4" /> 配乐建议
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {template.musicRecommendations.map((music, idx) => (
                <div key={idx} className="rounded-lg border p-3">
                  <div className="flex flex-wrap gap-1.5">
                    <Badge variant="outline">{music.section}</Badge>
                    <Badge variant="secondary">{music.mood}</Badge>
                    <Badge variant="secondary">{music.genre}</Badge>
                    {music.bpm && (
                      <Badge variant="outline">{music.bpm}</Badge>
                    )}
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    搜索关键词：
                    <span className="font-medium text-foreground">
                      {music.suggestedSearch}
                    </span>
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
