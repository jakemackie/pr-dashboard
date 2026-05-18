import { SalesChart } from "@/components/dashboard/sales-chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function AnalyticsPage() {
  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Deep Analytics</CardTitle>
          <CardDescription>
            Theme recurrence, comment composition, and review throughput trends.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <div>
            <p className="text-xs text-muted-foreground">Most common theme</p>
            <p className="text-lg font-semibold">Testing gaps</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Most common comment type</p>
            <p className="text-lg font-semibold">Style suggestions</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Peak throughput period</p>
            <p className="text-lg font-semibold">Week 4</p>
          </div>
        </CardContent>
      </Card>

      <SalesChart />
    </div>
  );
}
