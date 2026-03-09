"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Wand2, Loader2 } from "lucide-react";
import { VIDEO_STYLES } from "@/lib/constants";
import { VideoStyle } from "@/types/template";

interface TopicInputProps {
  onGenerate: (data: {
    topic: string;
    style: VideoStyle;
    provider: "claude" | "openai";
    options: { duration: number; tone: string };
  }) => void;
  isLoading: boolean;
}

const TONES = [
  { value: "", label: "自动" },
  { value: "humorous", label: "轻松幽默" },
  { value: "serious", label: "严肃专业" },
  { value: "emotional", label: "感性走心" },
  { value: "energetic", label: "充满活力" },
  { value: "calm", label: "平和舒缓" },
];

export function TopicInput({ onGenerate, isLoading }: TopicInputProps) {
  const [topic, setTopic] = useState("");
  const [style, setStyle] = useState<VideoStyle>("vlog");
  const [provider, setProvider] = useState<"claude" | "openai">("claude");
  const [duration, setDuration] = useState([600]);
  const [tone, setTone] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;
    onGenerate({
      topic: topic.trim(),
      style,
      provider,
      options: { duration: duration[0], tone },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Topic Input */}
      <div className="space-y-2">
        <Label htmlFor="topic" className="text-base font-medium">
          视频主题
        </Label>
        <Textarea
          id="topic"
          placeholder="输入你想拍的视频主题，比如：&#10;• 周末去杭州西湖骑行一日游&#10;• 在家做一道正宗的重庆小面&#10;• 测评最新的 iPhone 16 Pro"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="min-h-[100px] text-base"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Style Selection */}
        <div className="space-y-2">
          <Label className="text-sm">视频风格</Label>
          <Select
            value={style}
            onValueChange={(v) => v && setStyle(v as VideoStyle)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {VIDEO_STYLES.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  <span className="font-medium">{s.label}</span>
                  <span className="ml-2 text-xs text-muted-foreground">
                    {s.description}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Tone Selection */}
        <div className="space-y-2">
          <Label className="text-sm">情绪基调</Label>
          <Select value={tone} onValueChange={(v) => setTone(v ?? "")}>
            <SelectTrigger>
              <SelectValue placeholder="自动" />
            </SelectTrigger>
            <SelectContent>
              {TONES.map((t) => (
                <SelectItem key={t.value} value={t.value}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Duration Slider */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm">视频时长</Label>
          <span className="text-sm font-medium text-muted-foreground">
            {Math.floor(duration[0] / 60)} 分 {duration[0] % 60} 秒
          </span>
        </div>
        <Slider
          value={duration}
          onValueChange={(v) => setDuration(Array.isArray(v) ? [...v] : [v])}
          min={180}
          max={1200}
          step={30}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>3分钟</span>
          <span>10分钟</span>
          <span>20分钟</span>
        </div>
      </div>

      {/* AI Provider */}
      <div className="space-y-2">
        <Label className="text-sm">AI模型</Label>
        <Select
          value={provider}
          onValueChange={(v) => v && setProvider(v as "claude" | "openai")}
        >
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="claude">Claude (Anthropic)</SelectItem>
            <SelectItem value="openai">GPT-4o (OpenAI)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Submit */}
      <Button
        type="submit"
        size="lg"
        className="w-full text-base"
        disabled={!topic.trim() || isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            正在生成模板...
          </>
        ) : (
          <>
            <Wand2 className="mr-2 h-5 w-5" />
            生成拍摄模板
          </>
        )}
      </Button>
    </form>
  );
}
