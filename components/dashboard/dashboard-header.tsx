"use client";

import { usePathname } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

const sectionMeta: Record<string, { title: string; description: string }> = {
  "/dashboard": {
    title: "DevOps Intelligence Layer",
    description:
      "Integrated SDLC automation: PR analysis, AI test generation, and ClickUp sync.",
  },
  "/dashboard/analytics": {
    title: "PR Themes",
    description:
      "Visualize recurring pull request themes and review patterns for technical debt management.",
  },
  "/dashboard/comments": {
    title: "AI Test Cases",
    description:
      "AI-generated test scenarios and comment quality insights for QA and developers.",
  },
  "/dashboard/repositories": {
    title: "ClickUp Sync",
    description:
      "Track real-time task and comment sync between GitHub and ClickUp for project managers.",
  },
  "/dashboard/settings": {
    title: "Settings",
    description: "Dashboard preferences and integration controls.",
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
