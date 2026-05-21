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
      <div className="mb-4 grid gap-4 xl:grid-cols-5">
        <div className="rounded-lg border bg-card p-4 shadow xl:col-span-2">
          <h2 className="mb-1 text-lg font-semibold">DevOps Intelligence Suite</h2>
          <p className="text-sm text-muted-foreground">
            This dashboard integrates GitHub and ClickUp to automate code quality feedback, AI test case generation, and real-time task sync.<br />
            <span className="font-medium">Stakeholders:</span> Developers (automated PR feedback), Lead Developers (technical debt insights), Project Managers (ClickUp sync), QA (AI-generated tests).
          </p>
        </div>
        <div className="rounded-lg border bg-card p-4 shadow flex flex-col justify-between">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Developers</p>
            <p className="text-base font-semibold">{analytics ? analytics.totalOpenPrs : "-"} Automated PR Feedback</p>
          </div>
          <span className="text-xs text-muted-foreground">Lint, review, and AI suggestions</span>
        </div>
        <div className="rounded-lg border bg-card p-4 shadow flex flex-col justify-between">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Lead Developers</p>
            <p className="text-base font-semibold">{analytics ? analytics.analyticsByRange?.month?.duplicateComments ?? "-" : "-"} PRs Summarized</p>
          </div>
          <span className="text-xs text-muted-foreground">Technical debt & duplicate comments</span>
        </div>
        <div className="rounded-lg border bg-card p-4 shadow flex flex-col justify-between">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Project Managers</p>
            <p className="text-base font-semibold">{analytics ? analytics.syncedClickUpTasks ?? "-" : "-"} ClickUp Tasks Synced</p>
          </div>
          <span className="text-xs text-muted-foreground">Real-time GitHub–ClickUp sync</span>
        </div>
        <div className="rounded-lg border bg-card p-4 shadow flex flex-col justify-between">
          <div>
            <p className="text-xs text-muted-foreground mb-1">QA</p>
            <p className="text-base font-semibold">{analytics ? analytics.analyticsByRange?.month?.aiTestCases ?? "-" : "-"} AI Test Cases</p>
          </div>
          <span className="text-xs text-muted-foreground">Generated for new PRs</span>
        </div>
      </div>
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
