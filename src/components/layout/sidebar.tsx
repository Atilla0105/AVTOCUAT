"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  Wand2,
  Search,
  FolderOpen,
  Settings,
  Film,
  Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";

const navItems = [
  { href: "/", label: "首页", icon: Home },
  { href: "/generator", label: "生成模板", icon: Wand2 },
  { href: "/analyzer", label: "视频分析", icon: Search },
  { href: "/library", label: "模板库", icon: FolderOpen },
  { href: "/settings", label: "设置", icon: Settings },
];

/** Desktop sidebar content using normal Link navigation */
function DesktopSidebarContent() {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center gap-2 border-b px-6">
        <Film className="h-6 w-6 text-primary" />
        <span className="text-lg font-bold">AVTOCUAT</span>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t p-4">
        <p className="text-xs text-muted-foreground">
          AI驱动的视频模板生成器
        </p>
      </div>
    </div>
  );
}

/** Mobile drawer content using programmatic navigation to avoid Dialog click interception */
function MobileSidebarContent({ onNavigate }: { onNavigate: (href: string) => void }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center gap-2 border-b px-6">
        <Film className="h-6 w-6 text-primary" />
        <span className="text-lg font-bold">AVTOCUAT</span>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <button
              key={item.href}
              onClick={() => onNavigate(item.href)}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors text-left",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </button>
          );
        })}
      </nav>
      <div className="border-t p-4">
        <p className="text-xs text-muted-foreground">
          AI驱动的视频模板生成器
        </p>
      </div>
    </div>
  );
}

export function Sidebar() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleMobileNavigate = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  return (
    <>
      {/* Mobile: hamburger button + Sheet drawer */}
      <div className="fixed left-0 top-0 z-50 flex h-14 w-full items-center border-b bg-background px-4 md:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            render={
              <Button variant="ghost" size="icon" className="mr-2" />
            }
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">打开导航</span>
          </SheetTrigger>
          <SheetContent side="left" showCloseButton={false} className="w-60 p-0">
            <SheetTitle className="sr-only">导航菜单</SheetTitle>
            <MobileSidebarContent onNavigate={handleMobileNavigate} />
          </SheetContent>
        </Sheet>
        <Film className="h-5 w-5 text-primary" />
        <span className="ml-2 font-bold">AVTOCUAT</span>
      </div>

      {/* Desktop: fixed sidebar */}
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-60 border-r bg-card md:block">
        <DesktopSidebarContent />
      </aside>
    </>
  );
}
