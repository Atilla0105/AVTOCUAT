"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ChevronDown,
  ChevronUp,
  Camera,
  Clock,
  Music,
  Type,
  Film,
} from "lucide-react";
import { Scene } from "@/types/template";

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m > 0 ? `${m}分${s > 0 ? s + "秒" : ""}` : `${s}秒`;
}

export function SceneCard({ scene }: { scene: Scene }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card
      className="cursor-pointer transition-shadow hover:shadow-md"
      onClick={() => setExpanded(!expanded)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                场景 {scene.order}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                <Clock className="mr-1 h-3 w-3" />
                {formatDuration(scene.duration)}
              </Badge>
            </div>
            <CardTitle className="mt-2 text-base">{scene.title}</CardTitle>
            <CardDescription className="mt-1">
              {scene.description}
            </CardDescription>
          </div>
          <div className="ml-2 pt-1">
            {expanded ? (
              <ChevronUp className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
        </div>
      </CardHeader>

      {expanded && (
        <CardContent className="space-y-4 pt-0">
          {/* Shots */}
          <div>
            <h4 className="mb-2 flex items-center gap-1.5 text-sm font-medium">
              <Camera className="h-4 w-4" /> 镜头列表
            </h4>
            <div className="space-y-2">
              {scene.shots.map((shot, idx) => (
                <div
                  key={idx}
                  className="rounded-lg border bg-muted/50 p-3 text-sm"
                >
                  <div className="flex flex-wrap gap-1.5">
                    <Badge variant="outline" className="text-xs">
                      {shot.type}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {shot.angle}
                    </Badge>
                    {shot.movement && (
                      <Badge variant="outline" className="text-xs">
                        {shot.movement}
                      </Badge>
                    )}
                    <Badge variant="secondary" className="text-xs">
                      {shot.duration}秒
                    </Badge>
                  </div>
                  <p className="mt-1.5 text-muted-foreground">
                    {shot.description}
                  </p>
                  {shot.tips && (
                    <p className="mt-1 text-xs text-primary">
                      💡 {shot.tips}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* B-Roll */}
          {scene.bRollSuggestions.length > 0 && (
            <div>
              <h4 className="mb-2 flex items-center gap-1.5 text-sm font-medium">
                <Film className="h-4 w-4" /> B-Roll 素材建议
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {scene.bRollSuggestions.map((br, idx) => (
                  <Badge key={idx} variant="secondary">
                    {br}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Text Overlays */}
          {scene.textOverlays.length > 0 && (
            <div>
              <h4 className="mb-2 flex items-center gap-1.5 text-sm font-medium">
                <Type className="h-4 w-4" /> 文字覆盖
              </h4>
              <div className="space-y-1">
                {scene.textOverlays.map((overlay, idx) => (
                  <div key={idx} className="text-sm">
                    <span className="font-medium">「{overlay.text}」</span>
                    <span className="ml-2 text-xs text-muted-foreground">
                      {overlay.timing} · {overlay.style}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Music Mood */}
          <div className="flex items-center gap-2 text-sm">
            <Music className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">配乐氛围：</span>
            <span>{scene.musicMood}</span>
          </div>

          {/* Narration Script */}
          {scene.narrationScript && (
            <div className="rounded-lg border-l-2 border-primary bg-muted/30 p-3">
              <p className="text-xs font-medium text-muted-foreground mb-1">
                旁白脚本
              </p>
              <p className="text-sm italic">{scene.narrationScript}</p>
            </div>
          )}

          {/* Transitions */}
          <div className="flex gap-4 text-xs text-muted-foreground">
            <span>入场转场: {scene.transitionIn}</span>
            <span>出场转场: {scene.transitionOut}</span>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
