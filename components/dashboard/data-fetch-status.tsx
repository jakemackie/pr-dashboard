import { AlertTriangle } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

type DataFetchStatusProps = {
  message: string;
};

export function DataFetchStatus({ message }: DataFetchStatusProps) {
  return (
    <Card className="border-amber-500/50 bg-amber-500/5">
      <CardContent className="flex items-start gap-3 p-4">
        <AlertTriangle className="mt-0.5 size-4 text-amber-400" />
        <div>
          <p className="text-sm font-medium text-amber-200">Failed to fetch data</p>
          <p className="text-xs text-amber-100/80">{message}</p>
        </div>
      </CardContent>
    </Card>
  );
}
