import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="grid flex-1 gap-4 p-4">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <Card key={index}>
            <CardContent className="space-y-2 p-4">
              <Skeleton className="h-3 w-32" />
              <Skeleton className="h-8 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader className="space-y-2 pb-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-56" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[280px] w-full" />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="space-y-2 pb-2">
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-4 w-48" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[280px] w-full" />
          </CardContent>
        </Card>

        <Card className="lg:col-span-5">
          <CardHeader className="space-y-2 pb-2">
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-4 w-52" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[280px] w-full" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
