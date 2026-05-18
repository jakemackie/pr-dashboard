import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const commentBuckets = [
  { type: "Action required", count: 27, trend: "+4 this week" },
  { type: "Clarification requested", count: 19, trend: "+2 this week" },
  { type: "Approval notes", count: 31, trend: "-3 this week" },
];

const unresolvedThreads = [
  {
    repo: "api-gateway",
    pr: "#418 Improve token verification flow",
    age: "2d",
  },
  {
    repo: "web-client",
    pr: "#772 Refactor pagination state",
    age: "1d",
  },
  {
    repo: "jobs-worker",
    pr: "#203 Batch processing retry tuning",
    age: "3d",
  },
];

export default function CommentsPage() {
  return (
    <div className="grid gap-4">
      <div className="grid gap-4 md:grid-cols-3">
        {commentBuckets.map((bucket) => (
          <Card key={bucket.type}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{bucket.type}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">{bucket.count}</p>
              <p className="text-xs text-muted-foreground">{bucket.trend}</p>
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
          {unresolvedThreads.map((thread) => (
            <div
              key={thread.pr}
              className="flex items-center justify-between rounded-md border p-3"
            >
              <div>
                <p className="text-sm font-medium">{thread.pr}</p>
                <p className="text-xs text-muted-foreground">{thread.repo}</p>
              </div>
              <Badge variant="outline">Open {thread.age}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
