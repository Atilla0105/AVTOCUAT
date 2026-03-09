"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Wand2,
  Search,
  FolderOpen,
  Clock,
  Film,
  ArrowRight,
  Video,
  Plane,
  GraduationCap,
  Star,
  Clapperboard,
  Mic,
  BookOpen,
  Coffee,
  UtensilsCrossed,
} from "lucide-react";
import { Sidebar } from "@/components/layout/sidebar";
import { VIDEO_STYLES } from "@/lib/constants";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Video,
  Plane,
  GraduationCap,
  Star,
  Film,
  Clapperboard,
  Mic,
  BookOpen,
  Coffee,
  UtensilsCrossed,
};

interface RecentTemplate {
  id: string;
  title: string;
  style: string;
  totalDuration: number;
  createdAt: string;
}

export default function HomePage() {
  const [recentTemplates, setRecentTemplates] = useState<RecentTemplate[]>([]);

  useEffect(() => {
    fetch("/api/templates")
      .then((res) => res.json())
      .then((data) => setRecentTemplates(data.slice(0, 5)))
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen">
      <Sidebar />
      <main className="pt-14 md:pt-0 md:ml-60">
        <div className="container mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
          {/* Hero */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold">
              欢迎使用 AVTOCUAT
            </h1>
            <p className="mt-2 text-lg text-muted-foreground">
              出门前就知道视频长什么样——AI帮你规划每一个镜头
            </p>
          </div>

          {/* Quick Actions */}
          <div className="mb-8 grid gap-4 sm:grid-cols-3">
            <Link href="/generator">
              <Card className="cursor-pointer transition-all hover:shadow-md hover:border-primary/50">
                <CardHeader>
                  <Wand2 className="h-8 w-8 text-primary" />
                  <CardTitle className="text-lg">生成模板</CardTitle>
                  <CardDescription>
                    输入主题，生成完整拍摄方案
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
            <Link href="/analyzer">
              <Card className="cursor-pointer transition-all hover:shadow-md hover:border-primary/50">
                <CardHeader>
                  <Search className="h-8 w-8 text-primary" />
                  <CardTitle className="text-lg">分析视频</CardTitle>
                  <CardDescription>
                    粘贴链接，拆解创作者风格
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
            <Link href="/library">
              <Card className="cursor-pointer transition-all hover:shadow-md hover:border-primary/50">
                <CardHeader>
                  <FolderOpen className="h-8 w-8 text-primary" />
                  <CardTitle className="text-lg">模板库</CardTitle>
                  <CardDescription>
                    浏览和管理保存的模板
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          </div>

          {/* Style Quick Select */}
          <div className="mb-8">
            <h2 className="mb-4 text-xl font-semibold">按风格快速开始</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
              {VIDEO_STYLES.map((style) => {
                const Icon = iconMap[style.icon] || Film;
                return (
                  <Link
                    key={style.value}
                    href={`/generator?style=${style.value}`}
                  >
                    <Card className="cursor-pointer transition-all hover:shadow-md hover:border-primary/50">
                      <CardContent className="flex flex-col items-center p-4 text-center">
                        <Icon className="mb-2 h-6 w-6 text-muted-foreground" />
                        <span className="text-sm font-medium">
                          {style.label}
                        </span>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Recent Templates */}
          {recentTemplates.length > 0 && (
            <div>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold">最近生成</h2>
                <Link href="/library">
                  <Button variant="ghost" size="sm">
                    查看全部 <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </div>
              <div className="space-y-2">
                {recentTemplates.map((tmpl) => (
                  <Card key={tmpl.id}>
                    <CardContent className="flex items-center justify-between p-4">
                      <div>
                        <p className="font-medium">{tmpl.title}</p>
                        <div className="mt-1 flex gap-2">
                          <Badge variant="secondary">{tmpl.style}</Badge>
                          <Badge variant="outline">
                            <Clock className="mr-1 h-3 w-3" />
                            {Math.floor(tmpl.totalDuration / 60)}分钟
                          </Badge>
                        </div>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {new Date(tmpl.createdAt).toLocaleDateString("zh-CN")}
                      </span>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
