import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const repositories = [
  {
    name: "web-client",
    pullRequests: 24,
    avgReviewTime: "6.4h",
    riskTheme: "Type safety",
  },
  {
    name: "api-gateway",
    pullRequests: 19,
    avgReviewTime: "8.1h",
    riskTheme: "Security",
  },
  {
    name: "jobs-worker",
    pullRequests: 13,
    avgReviewTime: "5.2h",
    riskTheme: "Performance",
  },
  {
    name: "design-system",
    pullRequests: 16,
    avgReviewTime: "4.7h",
    riskTheme: "Testing gaps",
  },
];

export default function RepositoriesPage() {
  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Repository Health</CardTitle>
          <CardDescription>
            Pull request activity and dominant review risk by repository.
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {repositories.map((repo) => (
          <Card key={repo.name}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{repo.name}</CardTitle>
              <CardDescription>{repo.pullRequests} PRs in last 30 days</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>Average review time: {repo.avgReviewTime}</p>
              <div className="flex items-center gap-2">
                <span>Top risk theme:</span>
                <Badge variant="secondary">{repo.riskTheme}</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
