"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { TabTransitionSkeleton } from "@/components/dashboard/tab-transition-skeleton";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

type DashboardShellProps = {
  displayName: string;
  avatarUrl?: string;
  initials: string;
  children: React.ReactNode;
};

export function DashboardShell({
  displayName,
  avatarUrl,
  initials,
  children,
}: DashboardShellProps) {
  const pathname = usePathname();
  const [pendingHref, setPendingHref] = useState<string | null>(null);

  useEffect(() => {
    if (!pendingHref || pathname !== pendingHref) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setPendingHref(null);
    }, 150);

    return () => window.clearTimeout(timeout);
  }, [pathname, pendingHref]);

  return (
    <SidebarProvider>
      <AppSidebar
        displayName={displayName}
        avatarUrl={avatarUrl}
        initials={initials}
        activeHref={pendingHref}
        onNavigateStart={setPendingHref}
      />
      <SidebarInset>
        <DashboardHeader />
        <div className="flex flex-1 flex-col gap-4 p-4">
          {pendingHref ? <TabTransitionSkeleton href={pendingHref} /> : children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}