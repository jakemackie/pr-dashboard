import { SalesChart } from "@/components/dashboard/sales-chart";
import { Card, CardContent } from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <>
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="space-y-1 p-4">
            <p className="text-xs text-muted-foreground">PRs Reviewed (30d)</p>
            <p className="text-2xl font-semibold">89</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-1 p-4">
            <p className="text-xs text-muted-foreground">Avg Comments / PR</p>
            <p className="text-2xl font-semibold">3.7</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-1 p-4">
            <p className="text-xs text-muted-foreground">Unresolved Threads</p>
            <p className="text-2xl font-semibold">14</p>
          </CardContent>
        </Card>
      </div>

      <SalesChart />
    </>
  );
}
