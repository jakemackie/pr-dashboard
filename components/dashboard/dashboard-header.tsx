"use client";

import { usePathname } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

const sectionMeta: Record<string, { title: string; description: string }> = {
  "/dashboard": {
    title: "Overview",
    description: "PR review patterns, themes, and comment behavior.",
  },
  "/dashboard/repositories": {
    title: "Repositories",
    description: "Risk and review hotspots across active code repositories.",
  },
  "/dashboard/analytics": {
    title: "Analytics",
    description: "Cross-team trends on recurring PR themes and review throughput.",
  },
  "/dashboard/comments": {
    title: "Review Comments",
    description: "Comment quality and unresolved thread tracking.",
  },
  "/dashboard/settings": {
    title: "Settings",
    description: "Dashboard preferences and GitHub integration controls.",
  },
};

export function DashboardHeader() {
  const pathname = usePathname();
  const meta = sectionMeta[pathname] ?? sectionMeta["/dashboard"];

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <div className="flex flex-1 items-center justify-between gap-4">
        <div>
          <h1 className="text-base font-semibold">{meta.title}</h1>
          <p className="text-sm text-muted-foreground">{meta.description}</p>
        </div>
        <Badge variant="secondary">GitHub Connected</Badge>
      </div>
    </header>
  );
}
