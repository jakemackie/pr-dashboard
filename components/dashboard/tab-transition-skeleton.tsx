import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type TabTransitionSkeletonProps = {
  href: string;
};

function OverviewSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
      <Card className="col-span-4">
        <CardHeader className="space-y-2">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-56" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
      <Card className="col-span-3">
        <CardHeader className="space-y-2">
          <Skeleton className="h-6 w-44" />
          <Skeleton className="h-4 w-52" />
        </CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex items-center justify-between rounded-md border p-3">
              <div>
                <Skeleton className="h-4 w-36" />
                <Skeleton className="mt-2 h-3 w-24" />
              </div>
              <Skeleton className="h-5 w-16" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function GridSkeleton() {
  return (
    <div className="grid gap-4">
      <div className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index}>
            <CardHeader className="pb-2">
              <Skeleton className="h-5 w-28" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16" />
              <Skeleton className="mt-2 h-3 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="space-y-2">
          <Skeleton className="h-6 w-52" />
          <Skeleton className="h-4 w-72" />
        </CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="rounded-md border p-3">
              <Skeleton className="h-4 w-52" />
              <Skeleton className="mt-2 h-3 w-32" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

export function TabTransitionSkeleton({ href }: TabTransitionSkeletonProps) {
  if (href === "/dashboard") {
    return <OverviewSkeleton />;
  }

  return <GridSkeleton />;
}