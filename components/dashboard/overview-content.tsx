"use client";

import { useMemo, useState } from "react";

import type { GitHubAnalyticsPayload, RangeKey } from "@/lib/github-analytics";
import { SalesChart } from "@/components/dashboard/sales-chart";
import { Card, CardContent } from "@/components/ui/card";

type OverviewContentProps = {
  analytics: GitHubAnalyticsPayload | null;
};

const rangeLabelMap: Record<RangeKey, string> = {
  week: "Last week",
  month: "Last month",
  quarter: "Last 3 months",
  year: "Last year",
  all: "All time",
};

export function OverviewContent({ analytics }: OverviewContentProps) {
  const [range, setRange] = useState<RangeKey>("month");

  const selected = analytics?.analyticsByRange[range];
  const selectedActivity = analytics?.activityByRange[range];

  const avgCommentsPerPr = useMemo(() => {
    if (!selected) {
      return "-";
    }

    const totalComments = selected.commentThreads.reduce((sum, value) => sum + value, 0);
    const totalPrs = selected.prsReviewed.reduce((sum, value) => sum + value, 0);
    return totalPrs > 0 ? (totalComments / totalPrs).toFixed(1) : "0.0";
  }, [selected]);

  const orgActivity = selectedActivity
    ? `${selectedActivity.organization.prs} PRs / ${selectedActivity.organization.commits} commits`
    : "-";

  const personalActivity = selectedActivity
    ? `${selectedActivity.personal.prs} PRs / ${selectedActivity.personal.commits} commits`
    : "-";

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardContent className="space-y-1 p-4">
            <p className="text-xs text-muted-foreground">Open PRs</p>
            <p className="text-2xl font-semibold">{analytics ? analytics.totalOpenPrs : "-"}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-1 p-4">
            <p className="text-xs text-muted-foreground">Active Repositories</p>
            <p className="text-2xl font-semibold">{analytics ? analytics.activeRepositories : "-"}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-1 p-4">
            <p className="text-xs text-muted-foreground">
              Organization Activity ({rangeLabelMap[range]})
            </p>
            <p className="text-lg font-semibold">{orgActivity}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-1 p-4">
            <p className="text-xs text-muted-foreground">
              Personal Activity ({rangeLabelMap[range]})
            </p>
            <p className="text-lg font-semibold">{personalActivity}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-1 p-4">
            <p className="text-xs text-muted-foreground">
              Avg Comments / PR ({rangeLabelMap[range]})
            </p>
            <p className="text-2xl font-semibold">{avgCommentsPerPr}</p>
          </CardContent>
        </Card>
      </div>

      <SalesChart analytics={analytics} range={range} onRangeChange={setRange} />
    </>
  );
}
