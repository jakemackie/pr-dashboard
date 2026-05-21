import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function AnalyticsLoading() {
  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader className="space-y-2">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-80" />
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index}>
              <Skeleton className="h-3 w-32" />
              <Skeleton className="mt-2 h-6 w-28" />
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader className="space-y-2 pb-2">
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-4 w-52" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[280px] w-full" />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="space-y-2 pb-2">
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-4 w-44" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[280px] w-full" />
          </CardContent>
        </Card>

        <Card className="lg:col-span-5">
          <CardHeader className="space-y-2 pb-2">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-4 w-40" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[280px] w-full" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
