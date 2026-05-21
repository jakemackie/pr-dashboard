import { authOptions } from "@/auth";
import { DataFetchStatus } from "@/components/dashboard/data-fetch-status";
import { getDashboardDataState } from "@/lib/dashboard-data";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getServerSession } from "next-auth";
import { Suspense } from "react";

import RepositoriesLoading from "./loading";

const themeLabels = [
  "Bug fix",
  "Feature",
  "Refactor",
  "Testing",
  "Documentation",
  "CI / Chore",
];

export default function RepositoriesPage() {
  return (
    <Suspense fallback={<RepositoriesLoading />}>
      <RepositoriesContent />
    </Suspense>
  );
}

async function RepositoriesContent() {
  const session = await getServerSession(authOptions);
  const state = await getDashboardDataState(session?.accessToken);
  const repositories = state.status === "ok" ? state.analytics.repositories : [];
  const activityBreakdown = state.status === "ok" ? state.analytics.activityBreakdown : null;

  return (
    <div className="grid gap-4">
      {state.status !== "ok" ? <DataFetchStatus message={state.message} /> : null}

      {activityBreakdown ? (
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Organization Activity (90d)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm text-muted-foreground">
              <p>
                PRs: <span className="font-medium text-foreground">{activityBreakdown.organization.prs}</span>
              </p>
              <p>
                Commits: <span className="font-medium text-foreground">{activityBreakdown.organization.commits}</span>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Personal Activity (90d)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm text-muted-foreground">
              <p>
                PRs: <span className="font-medium text-foreground">{activityBreakdown.personal.prs}</span>
              </p>
              <p>
                Commits: <span className="font-medium text-foreground">{activityBreakdown.personal.commits}</span>
              </p>
            </CardContent>
          </Card>
        </div>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Repository Health</CardTitle>
          <CardDescription>
            Pull request activity and dominant review risk by repository.
          </CardDescription>
        </CardHeader>
      </Card>

      {repositories.length === 0 ? (
        <Card>
          <CardContent className="p-4 text-sm text-muted-foreground">
            No open pull requests were found for your GitHub account.
          </CardContent>
        </Card>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        {repositories.map((repo) => (
          <Card key={repo.name}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{repo.name}</CardTitle>
              <CardDescription>{repo.openPrs} open PRs</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>Average comments / PR: {repo.avgComments.toFixed(1)}</p>
              <div className="flex items-center gap-2">
                <span>Top risk theme:</span>
                <Badge variant="secondary">{themeLabels[repo.riskThemeIndex]}</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top Owners by Activity</CardTitle>
          <CardDescription>
            Sorted by PR + commit activity in the last 90 days.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {activityBreakdown?.byOwner.length ? (
            activityBreakdown.byOwner.map((owner) => (
              <div
                key={owner.owner}
                className="flex items-center justify-between rounded-md border p-3"
              >
                <div>
                  <p className="text-sm font-medium">{owner.owner}</p>
                  <p className="text-xs text-muted-foreground">
                    {owner.prs} PRs, {owner.commits} commits
                  </p>
                </div>
                <Badge variant={owner.isOrganization ? "default" : "secondary"}>
                  {owner.isOrganization ? "Organization" : "Personal"}
                </Badge>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No owner activity available.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
