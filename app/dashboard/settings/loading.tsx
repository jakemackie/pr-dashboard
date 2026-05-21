import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function SettingsLoading() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {Array.from({ length: 2 }).map((_, cardIndex) => (
        <Card key={cardIndex}>
          <CardHeader className="space-y-2">
            <Skeleton className="h-6 w-44" />
            <Skeleton className="h-4 w-72" />
          </CardHeader>
          <CardContent className="space-y-3">
            {Array.from({ length: 3 }).map((_, rowIndex) => (
              <div key={rowIndex} className="rounded-md border p-3">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="mt-2 h-3 w-40" />
              </div>
            ))}
            <Skeleton className="h-9 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
