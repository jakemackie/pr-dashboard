import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function CommentsLoading() {
  return (
    <div className="grid gap-4">
      <div className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index}>
            <CardHeader className="pb-2">
              <Skeleton className="h-5 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16" />
              <Skeleton className="mt-2 h-3 w-28" />
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
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="flex items-center justify-between rounded-md border p-3">
              <div>
                <Skeleton className="h-4 w-52" />
                <Skeleton className="mt-2 h-3 w-28" />
              </div>
              <Skeleton className="h-6 w-14" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
