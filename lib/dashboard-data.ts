import { getGitHubAnalytics, type GitHubAnalyticsPayload } from "@/lib/github-analytics";

export type DashboardDataState =
  | {
      status: "ok";
      analytics: GitHubAnalyticsPayload;
      message: null;
    }
  | {
      status: "needs-reauth" | "failed";
      analytics: null;
      message: string;
    };

export async function getDashboardDataState(
  accessToken?: string,
): Promise<DashboardDataState> {
  if (!accessToken) {
    return {
      status: "needs-reauth",
      analytics: null,
      message:
        "GitHub data unavailable. Please sign out and sign back in to grant repository access.",
    };
  }

  try {
    const analytics = await getGitHubAnalytics(accessToken);
    return {
      status: "ok",
      analytics,
      message: null,
    };
  } catch {
    return {
      status: "failed",
      analytics: null,
      message: "Failed to fetch GitHub pull request data. Please try again shortly.",
    };
  }
}
