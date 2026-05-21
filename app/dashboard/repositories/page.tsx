
import { authOptions } from "@/auth";
import { getDashboardDataState } from "@/lib/dashboard-data";
import { getServerSession } from "next-auth";
import { Suspense } from "react";
import RepositoriesContentClient from "./RepositoriesContentClient";

import RepositoriesLoading from "./loading";



export default async function RepositoriesPage() {
  const session = await getServerSession(authOptions);
  const state = await getDashboardDataState(session?.accessToken);
  const repositories = state.status === "ok" ? state.analytics.repositories : [];
  const activityBreakdown = state.status === "ok" ? state.analytics.activityBreakdown : null;
  const clickUpSummary = state.status === "ok" ? state.analytics.clickUpSummary : null;

  return (
    <Suspense fallback={<RepositoriesLoading />}>
      <RepositoriesContentClient
        repositories={repositories}
        activityBreakdown={activityBreakdown}
        clickUpSummary={clickUpSummary}
        dataStatus={state.status}
        dataMessage={state.message}
      />
    </Suspense>
  );
}
