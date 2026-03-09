"use client";

import { useEffect, useState } from "react";
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
import { Save, Loader2, Eye, EyeOff } from "lucide-react";
import { VIDEO_STYLES } from "@/lib/constants";
import { toast } from "sonner";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    defaultProvider: "claude",
    defaultStyle: "vlog",
    anthropicKey: "",
    openaiKey: "",
    language: "zh",
  });
  const [showAnthropicKey, setShowAnthropicKey] = useState(false);
  const [showOpenaiKey, setShowOpenaiKey] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        setSettings({
          defaultProvider: data.defaultProvider,
          defaultStyle: data.defaultStyle,
          anthropicKey: data.anthropicKey,
          openaiKey: data.openaiKey,
          language: data.language,
        });
      })
      .catch(() => {});
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        toast.success("设置已保存");
        const data = await res.json();
        setSettings({
          defaultProvider: data.defaultProvider,
          defaultStyle: data.defaultStyle,
          anthropicKey: data.anthropicKey,
          openaiKey: data.openaiKey,
          language: data.language,
        });
      }
    } catch {
      toast.error("保存失败");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">设置</h1>
        <p className="mt-1 text-muted-foreground">
          配置API密钥和默认偏好
        </p>
      </div>

      {/* API Keys */}
      <Card>
        <CardHeader>
          <CardTitle>API 密钥</CardTitle>
          <CardDescription>
            配置AI模型的API密钥，密钥仅存储在本地数据库中
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Anthropic API Key (Claude)</Label>
            <div className="flex gap-2">
              <Input
                type={showAnthropicKey ? "text" : "password"}
                placeholder="sk-ant-..."
                value={settings.anthropicKey}
                onChange={(e) =>
                  setSettings({ ...settings, anthropicKey: e.target.value })
                }
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowAnthropicKey(!showAnthropicKey)}
              >
                {showAnthropicKey ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>OpenAI API Key (GPT-4o)</Label>
            <div className="flex gap-2">
              <Input
                type={showOpenaiKey ? "text" : "password"}
                placeholder="sk-..."
                value={settings.openaiKey}
                onChange={(e) =>
                  setSettings({ ...settings, openaiKey: e.target.value })
                }
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowOpenaiKey(!showOpenaiKey)}
              >
                {showOpenaiKey ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Defaults */}
      <Card>
        <CardHeader>
          <CardTitle>默认偏好</CardTitle>
          <CardDescription>设置默认的AI模型和视频风格</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>默认AI模型</Label>
              <Select
                value={settings.defaultProvider}
                onValueChange={(v) =>
                  v && setSettings({ ...settings, defaultProvider: v })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="claude">Claude (Anthropic)</SelectItem>
                  <SelectItem value="openai">GPT-4o (OpenAI)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>默认视频风格</Label>
              <Select
                value={settings.defaultStyle}
                onValueChange={(v) =>
                  v && setSettings({ ...settings, defaultStyle: v })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {VIDEO_STYLES.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSave} disabled={isSaving} className="w-full">
        {isSaving ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Save className="mr-2 h-4 w-4" />
        )}
        保存设置
      </Button>
    </div>
  );
}
