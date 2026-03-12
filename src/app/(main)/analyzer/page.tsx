"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Search,
  Loader2,
  Wand2,
  ArrowRight,
} from "lucide-react";
import { VideoAnalysisResult } from "@/types/ai";
import { toast } from "sonner";
import Link from "next/link";

export default function AnalyzerPage() {
  const [url, setUrl] = useState("");
  const [provider, setProvider] = useState<"claude" | "openai">("claude");
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState("");
  const [analysis, setAnalysis] = useState<VideoAnalysisResult | null>(null);

  const handleAnalyze = async () => {
    if (!url.trim()) return;
    setIsLoading(true);
    setAnalysis(null);
    setProgress("正在分析视频...");

    try {
      const res = await fetch("/api/analyze/style", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim(), provider }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "分析失败");
      }

      const data = await res.json();
      setAnalysis(data.analysis);
      if (!data.hasTranscript && data.frameCount > 0) {
        toast.success(`视频分析完成！（基于${data.frameCount}帧画面分析，字幕不可用）`);
      } else {
        toast.success(`视频分析完成！（${data.frameCount}帧 + ${data.hasTranscript ? "字幕" : "无字幕"}）`);
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "分析失败，请重试"
      );
    } finally {
      setIsLoading(false);
      setProgress("");
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">视频分析</h1>
        <p className="mt-1 text-muted-foreground">
          粘贴视频链接，AI帮你拆解创作者的风格和拍摄手法
        </p>
      </div>

      {/* URL Input */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="space-y-2">
            <Label>视频链接</Label>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Input
                placeholder="粘贴YouTube或B站视频链接..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="flex-1"
              />
              <Select
                value={provider}
                onValueChange={(v) =>
                  v && setProvider(v as "claude" | "openai")
                }
              >
                <SelectTrigger className="w-full sm:w-[160px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="claude">Claude</SelectItem>
                  <SelectItem value="openai">GPT-4o</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button
            onClick={handleAnalyze}
            disabled={!url.trim() || isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {progress}
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                开始分析
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Loading */}
      {isLoading && (
        <div className="space-y-4">
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      )}

      {/* Analysis Result */}
      {analysis && (
        <div className="space-y-6">
          {/* Summary */}
          <Card>
            <CardHeader>
              <CardTitle>风格总结</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed">{analysis.summary}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Badge>{analysis.tone}</Badge>
                <Badge variant="secondary">
                  {analysis.editingStyle}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Narrative Structure */}
          <Card>
            <CardHeader>
              <CardTitle>叙事结构</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {Object.entries(analysis.narrativeStructure).map(
                ([key, value]) => {
                  const labels: Record<string, string> = {
                    opening: "开场",
                    development: "发展",
                    climax: "高潮",
                    conclusion: "结尾",
                  };
                  return (
                    <div key={key}>
                      <span className="text-sm font-medium">
                        {labels[key] || key}：
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {value}
                      </span>
                    </div>
                  );
                }
              )}
            </CardContent>
          </Card>

          {/* Pacing */}
          <Card>
            <CardHeader>
              <CardTitle>节奏分析</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-sm">
                <span className="font-medium">整体节奏：</span>
                {analysis.pacing.overall}
              </div>
              <div className="text-sm">
                <span className="font-medium">场景切换频率：</span>
                约 {analysis.pacing.sceneChangesPerMinute} 次/分钟
              </div>
              <div className="text-sm">
                <span className="font-medium">节奏规律：</span>
                {analysis.pacing.rhythmPattern}
              </div>
            </CardContent>
          </Card>

          {/* Shot Patterns */}
          <Card>
            <CardHeader>
              <CardTitle>镜头偏好</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {analysis.shotPatterns.map((pattern, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 rounded-lg border p-3"
                  >
                    <Badge variant="outline">{pattern.type}</Badge>
                    <Badge variant="secondary">{pattern.frequency}</Badge>
                    <span className="text-sm text-muted-foreground">
                      {pattern.description}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Hook Technique */}
          <Card>
            <CardHeader>
              <CardTitle>开场技巧</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{analysis.hookTechnique}</p>
            </CardContent>
          </Card>

          {/* Unique Elements */}
          <Card>
            <CardHeader>
              <CardTitle>独特风格元素</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {analysis.uniqueElements.map((el, idx) => (
                  <Badge key={idx} variant="secondary">
                    {el}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Generate in Style Button */}
          <Link
            href={`/generator?referenceStyle=${encodeURIComponent(JSON.stringify(analysis))}`}
          >
            <Button size="lg" className="w-full mt-4">
              <Wand2 className="mr-2 h-5 w-5" />
              用此风格生成新模板
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
