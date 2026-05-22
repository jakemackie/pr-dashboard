"use client";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DataFetchStatus } from "@/components/dashboard/data-fetch-status";
import type { GitHubAnalyticsPayload } from "@/lib/github-analytics";

const themeLabels = [
  "Bug fix",
  "Feature",
  "Refactor",
  "Testing",
  "Documentation",
  "CI / Chore",
];

export default function RepositoriesContentClient({ repositories, activityBreakdown, clickUpSummary, dataStatus, dataMessage }: {
  repositories: GitHubAnalyticsPayload["repositories"];
  activityBreakdown: GitHubAnalyticsPayload["activityBreakdown"] | null;
  clickUpSummary: GitHubAnalyticsPayload["clickUpSummary"] | null;
  dataStatus: string;
  dataMessage: string | null;
}) {
  const [syncStatus, setSyncStatus] = useState<string | null>(null);
  const [lastTaskId, setLastTaskId] = useState<string | null>(null);
  const [lastTaskUrl, setLastTaskUrl] = useState<string | null>(null);
  const [lastListUrl, setLastListUrl] = useState<string | null>(clickUpSummary?.listUrl ?? null);
  const [isPending, startTransition] = useTransition();

  async function handleSync() {
    setSyncStatus(null);
    setLastTaskId(null);
    setLastTaskUrl(null);
    setLastListUrl(null);
    startTransition(async () => {
      setSyncStatus("Syncing...");
      try {
        const res = await fetch("/api/clickup/sync", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            listId: "901522558612",
          }),
        });
        const data = await res.json();
        if (data.ok) {
          setSyncStatus(`Success! Task ID: ${data.taskId}`);
          setLastTaskId(data.taskId ?? null);
          setLastTaskUrl(data.taskUrl ?? null);
          setLastListUrl(data.listUrl ?? null);
        } else {
          setSyncStatus(`Error: ${data.error}`);
        }
      } catch (e: unknown) {
        setSyncStatus(`Error: ${e instanceof Error ? e.message : "Unknown sync error"}`);
      }
    });
  }

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <Button onClick={handleSync} disabled={isPending} variant="secondary">
          {isPending ? "Syncing..." : "Sync to ClickUp"}
        </Button>
        {lastListUrl ? (
          <Button variant="outline" asChild>
            <a href={lastListUrl} target="_blank" rel="noopener noreferrer">
              Open ClickUp List
            </a>
          </Button>
        ) : null}
        {lastTaskUrl && lastTaskId ? (
          <Button variant="outline" asChild>
            <a
              href={lastTaskUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open Synced Task
            </a>
          </Button>
        ) : null}
        {syncStatus && <span className="text-sm text-muted-foreground">{syncStatus}</span>}
      </div>

      {clickUpSummary ? (
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Sync Coverage</CardTitle>
              <CardDescription>Shared GitHub and ClickUp integration state</CardDescription>
            </CardHeader>
            <CardContent className="space-y-1 text-sm text-muted-foreground">
              <p>
                ClickUp configured: <span className="font-medium text-foreground">{clickUpSummary.configured ? "Yes" : "No"}</span>
              </p>
              <p>
                Synced PR tasks: <span className="font-medium text-foreground">{clickUpSummary.syncedTasks}</span>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Last 30 Days</CardTitle>
              <CardDescription>Recent integration throughput</CardDescription>
            </CardHeader>
            <CardContent className="space-y-1 text-sm text-muted-foreground">
              <p>
                ClickUp synced tasks: <span className="font-medium text-foreground">{clickUpSummary.syncedTasksLast30Days}</span>
              </p>
              <p>
                AI work items: <span className="font-medium text-foreground">{clickUpSummary.aiWorkItemsLast30Days}</span>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">ClickUp List</CardTitle>
              <CardDescription>Connected sync destination</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>
                List ID: <span className="font-medium text-foreground">{clickUpSummary.listId ?? "N/A"}</span>
              </p>
              {clickUpSummary.listUrl ? (
                <Button variant="outline" size="sm" asChild>
                  <a href={clickUpSummary.listUrl} target="_blank" rel="noopener noreferrer">
                    Open in ClickUp
                  </a>
                </Button>
              ) : null}
            </CardContent>
          </Card>
        </div>
      ) : null}

      {dataStatus !== "ok" ? (
        <DataFetchStatus message={dataMessage ?? "Unable to fetch dashboard data."} />
      ) : null}

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
          <CardTitle>GitHub Repository Health</CardTitle>
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
              <Button variant="outline" size="sm" asChild>
                <a
                  href={`https://github.com/${repo.name}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open in GitHub
                </a>
              </Button>
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