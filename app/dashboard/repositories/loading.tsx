import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function RepositoriesLoading() {
  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader className="space-y-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-80" />
        </CardHeader>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index}>
            <CardHeader className="space-y-2 pb-2">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-28" />
            </CardHeader>
            <CardContent className="space-y-2">
              <Skeleton className="h-4 w-44" />
              <Skeleton className="h-4 w-36" />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="space-y-2">
          <Skeleton className="h-5 w-52" />
          <Skeleton className="h-4 w-72" />
        </CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="rounded-md border p-3">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="mt-2 h-3 w-40" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
