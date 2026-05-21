import { authOptions } from "@/auth";
import { DataFetchStatus } from "@/components/dashboard/data-fetch-status";
import { SalesChart } from "@/components/dashboard/sales-chart";
import { getDashboardDataState } from "@/lib/dashboard-data";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getServerSession } from "next-auth";
import { Suspense } from "react";

import AnalyticsLoading from "./loading";

export default function AnalyticsPage() {
  return (
    <Suspense fallback={<AnalyticsLoading />}>
      <AnalyticsContent />
    </Suspense>
  );
}

async function AnalyticsContent() {
  const session = await getServerSession(authOptions);
  const state = await getDashboardDataState(session?.accessToken);
  const analytics = state.status === "ok" ? state.analytics : null;
  const themes = analytics?.analyticsByRange.month.themes ?? [];
  const comments = analytics?.analyticsByRange.month.comments ?? [];
  const prs = analytics?.analyticsByRange.month.prsReviewed ?? [];
  const aiTestCases = analytics?.analyticsByRange.month.aiTestCases ?? 0;
  const clickUpSyncs = analytics?.syncedClickUpTasks ?? 0;

  const topThemeIndex = themes.length > 0 ? themes.indexOf(Math.max(...themes)) : -1;
  const topCommentIndex = comments.length > 0 ? comments.indexOf(Math.max(...comments)) : -1;
  const peakThroughput = prs.length > 0 ? prs.indexOf(Math.max(...prs)) + 1 : 0;

  const themeLabels = [
    "Bug fix",
    "Feature",
    "Refactor",
    "Testing",
    "Documentation",
    "CI / Chore",
  ];

  const commentLabels = [
    "No discussion",
    "Light discussion",
    "Active discussion",
    "Heavy discussion",
  ];

  return (
    <div className="grid gap-4">
      {state.status !== "ok" ? <DataFetchStatus message={state.message} /> : null}

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Top PR Theme</CardTitle>
            <CardDescription>Most frequent review topic this month</CardDescription>
          </CardHeader>
          <CardContent>
            <span className="text-lg font-semibold">
              {topThemeIndex >= 0 ? themeLabels[topThemeIndex] : "No data"}
            </span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Top Comment Type</CardTitle>
            <CardDescription>Most common review comment style</CardDescription>
          </CardHeader>
          <CardContent>
            <span className="text-lg font-semibold">
              {topCommentIndex >= 0 ? commentLabels[topCommentIndex] : "No data"}
            </span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Integration Activity</CardTitle>
            <CardDescription>ClickUp syncs & AI test cases (month)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-1">
              <span className="text-base font-semibold">{clickUpSyncs} ClickUp Tasks</span>
              <span className="text-base font-semibold">{aiTestCases} AI Test Cases</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <SalesChart analytics={analytics} />
    </div>
  );
}
