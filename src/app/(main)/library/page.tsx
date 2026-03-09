"use client";

import { useEffect, useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Star, Trash2, Clock } from "lucide-react";
import { VIDEO_STYLES } from "@/lib/constants";
import { TemplatePreview } from "@/components/generator/template-preview";
import { VideoTemplate } from "@/types/template";
import { toast } from "sonner";

interface TemplateSummary {
  id: string;
  title: string;
  topic: string;
  style: string;
  totalDuration: number;
  aiProvider: string;
  isFavorite: boolean;
  tags: string;
  createdAt: string;
}

export default function LibraryPage() {
  const [templates, setTemplates] = useState<TemplateSummary[]>([]);
  const [search, setSearch] = useState("");
  const [styleFilter, setStyleFilter] = useState("all");
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [selectedTemplate, setSelectedTemplate] =
    useState<VideoTemplate | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const fetchTemplates = useCallback(async () => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (styleFilter !== "all") params.set("style", styleFilter);
    if (favoritesOnly) params.set("favorites", "true");

    const res = await fetch(`/api/templates?${params}`);
    const data = await res.json();
    setTemplates(data);
  }, [search, styleFilter, favoritesOnly]);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  const toggleFavorite = async (id: string, current: boolean) => {
    await fetch("/api/templates", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, isFavorite: !current }),
    });
    fetchTemplates();
  };

  const deleteTemplate = async (id: string) => {
    await fetch(`/api/templates?id=${id}`, { method: "DELETE" });
    toast.success("模板已删除");
    fetchTemplates();
  };

  const viewTemplate = async (id: string) => {
    const res = await fetch(`/api/templates?search=`);
    const all = await res.json();
    // We need the full content, so fetch individually
    // For now, find from list - we'll need a detail endpoint
    // Quick workaround: store content in the list
    const tmpl = templates.find((t) => t.id === id);
    if (!tmpl) return;

    // Fetch full template from a dedicated query
    const detailRes = await fetch(`/api/templates/detail?id=${id}`);
    if (detailRes.ok) {
      const data = await detailRes.json();
      setSelectedTemplate(JSON.parse(data.content));
      setDialogOpen(true);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">模板库</h1>
        <p className="mt-1 text-muted-foreground">
          浏览和管理你保存的所有视频模板
        </p>
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="搜索模板..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={styleFilter} onValueChange={(v) => setStyleFilter(v ?? "all")}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="全部风格" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部风格</SelectItem>
            {VIDEO_STYLES.map((s) => (
              <SelectItem key={s.value} value={s.value}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          variant={favoritesOnly ? "default" : "outline"}
          size="icon"
          onClick={() => setFavoritesOnly(!favoritesOnly)}
        >
          <Star className="h-4 w-4" />
        </Button>
      </div>

      {/* Template Grid */}
      {templates.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-lg font-medium text-muted-foreground">
            还没有保存的模板
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            去生成器页面创建你的第一个模板吧
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {templates.map((tmpl) => (
            <Card
              key={tmpl.id}
              className="cursor-pointer transition-shadow hover:shadow-md"
              onClick={() => viewTemplate(tmpl.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base">{tmpl.title}</CardTitle>
                    <CardDescription className="mt-1">
                      {tmpl.topic}
                    </CardDescription>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(tmpl.id, tmpl.isFavorite);
                      }}
                    >
                      <Star
                        className={`h-4 w-4 ${tmpl.isFavorite ? "fill-yellow-400 text-yellow-400" : ""}`}
                      />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteTemplate(tmpl.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex flex-wrap gap-1.5">
                  <Badge variant="secondary">{tmpl.style}</Badge>
                  <Badge variant="outline">
                    <Clock className="mr-1 h-3 w-3" />
                    {Math.floor(tmpl.totalDuration / 60)}分钟
                  </Badge>
                  <Badge variant="outline">{tmpl.aiProvider}</Badge>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  {new Date(tmpl.createdAt).toLocaleDateString("zh-CN")}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Detail Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[85vh]">
          <DialogHeader>
            <DialogTitle>模板详情</DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[70vh] pr-4">
            {selectedTemplate && (
              <TemplatePreview template={selectedTemplate} />
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}
