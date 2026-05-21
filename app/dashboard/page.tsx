import { authOptions } from "@/auth";
import { DataFetchStatus } from "@/components/dashboard/data-fetch-status";
import { OverviewContent } from "@/components/dashboard/overview-content";
import { getDashboardDataState } from "@/lib/dashboard-data";
import { getServerSession } from "next-auth";
import { Suspense } from "react";

import DashboardLoading from "./loading";

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardLoading />}>
      <DashboardOverviewContent />
    </Suspense>
  );
}

async function DashboardOverviewContent() {
  const session = await getServerSession(authOptions);
  const state = await getDashboardDataState(session?.accessToken);
  const analytics = state.status === "ok" ? state.analytics : null;

  return (
    <>
      {state.status !== "ok" ? <DataFetchStatus message={state.message} /> : null}
      <OverviewContent analytics={analytics} />
    </>
  );
}
