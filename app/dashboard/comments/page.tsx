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
import { Button } from "@/components/ui/button";
import { getServerSession } from "next-auth";
import { Suspense } from "react";

import CommentsLoading from "./loading";

const commentBucketLabels = [
  "No discussion",
  "Light discussion",
  "Active discussion",
  "Heavy discussion",
];

export default function CommentsPage() {
  return (
    <Suspense fallback={<CommentsLoading />}>
      <CommentsContent />
    </Suspense>
  );
}

async function CommentsContent() {
  const session = await getServerSession(authOptions);
  const state = await getDashboardDataState(session?.accessToken);
  const buckets = state.status === "ok" ? state.analytics.commentSummary.buckets : [0, 0, 0, 0];
  const unresolvedThreads =
    state.status === "ok" ? state.analytics.commentSummary.unresolvedThreads : [];

  return (
    <div className="grid gap-4">
      {state.status !== "ok" ? <DataFetchStatus message={state.message} /> : null}

      <div className="grid gap-4 md:grid-cols-3">
        {commentBucketLabels.map((label, index) => (
          <Card key={label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{label}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">{buckets[index] ?? 0}</p>
              <p className="text-xs text-muted-foreground">Open PR comment bucket</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Open Comment Threads</CardTitle>
          <CardDescription>
            Threads still awaiting action from authors or reviewers.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {unresolvedThreads.length === 0 ? (
            <p className="text-sm text-muted-foreground">No active discussion threads found.</p>
          ) : null}

          {unresolvedThreads.map((thread) => (
            <div
              key={`${thread.repo}-${thread.url}`}
              className="flex items-center justify-between rounded-md border p-3"
            >
              <div>
                <p className="text-sm font-medium">{thread.title}</p>
                <p className="text-xs text-muted-foreground">{thread.repo}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Button size="sm" variant="outline" asChild>
                    <a href={thread.url} target="_blank" rel="noopener noreferrer">
                      Open in GitHub
                    </a>
                  </Button>
                </div>
              </div>
              <Badge variant="outline">Open {thread.ageDays}d</Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
