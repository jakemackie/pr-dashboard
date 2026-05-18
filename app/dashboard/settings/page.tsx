import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>GitHub Integration</CardTitle>
          <CardDescription>
            Account connection and dashboard sync status.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between rounded-md border p-3">
            <span className="text-sm">Authentication</span>
            <Badge>Connected</Badge>
          </div>
          <div className="flex items-center justify-between rounded-md border p-3">
            <span className="text-sm">Repository Sync</span>
            <Badge variant="secondary">Every 15 min</Badge>
          </div>
          <Button variant="outline" className="w-full">
            Re-sync GitHub Data
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Review Rules</CardTitle>
          <CardDescription>
            Mock controls for thresholds and notification behavior.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="rounded-md border p-3">
            <p className="text-sm font-medium">Flag when unresolved threads exceed</p>
            <p className="text-xs text-muted-foreground">Current threshold: 10 threads</p>
          </div>
          <div className="rounded-md border p-3">
            <p className="text-sm font-medium">Escalate high-severity comments after</p>
            <p className="text-xs text-muted-foreground">Current threshold: 24 hours</p>
          </div>
          <Button className="w-full">Save Mock Settings</Button>
        </CardContent>
      </Card>
    </div>
  );
}
