import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/auth";
import { createClickUpTask, addClickUpComment } from "@/lib/clickup";

type GitHubIssueSearchItem = {
  number: number;
  title: string;
  body: string | null;
  html_url: string;
  repository_url: string;
};

type GitHubIssueSearchResponse = {
  items: GitHubIssueSearchItem[];
};

async function githubFetch<T>(path: string, accessToken: string): Promise<T> {
  const response = await fetch(`https://api.github.com${path}`, {
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${accessToken}`,
      "X-GitHub-Api-Version": "2022-11-28",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`GitHub API error ${response.status}: ${errorBody}`);
  }

  return (await response.json()) as T;
}

async function buildLatestPrPayload(accessToken: string) {
  const search = await githubFetch<GitHubIssueSearchResponse>(
    "/search/issues?q=is%3Apr+is%3Aopen+author%3A%40me&sort=updated&order=desc&per_page=1",
    accessToken,
  );

  const latest = search.items[0];
  if (!latest) {
    throw new Error("No open pull requests found for the signed-in GitHub account.");
  }

  return {
    prTitle: `[PR #${latest.number}] ${latest.title}`,
    prDescription:
      `${latest.body?.trim() || "No PR description provided."}\n\nSource: ${latest.html_url}`,
    prUrl: latest.html_url,
  };
}

// POST /api/clickup/sync
// Body: { listId: string, prTitle: string, prDescription: string, comments: string[] }
export async function POST(req: NextRequest) {
  try {
    const { listId, prTitle, prDescription, prUrl } = await req.json();

    if (!listId) {
      return NextResponse.json(
        {
          ok: false,
          error: "Missing required field: listId is required.",
        },
        { status: 400 },
      );
    }

    let finalTitle = typeof prTitle === "string" && prTitle.trim().length > 0 ? prTitle : "";
    let finalDescription =
      typeof prDescription === "string" ? prDescription : "Automated task from dashboard sync.";
    let finalPrUrl = typeof prUrl === "string" ? prUrl.trim() : "";

    if (!finalTitle) {
      const session = await getServerSession(authOptions);
      const accessToken = session?.accessToken;

      if (!accessToken) {
        return NextResponse.json(
          {
            ok: false,
            error: "GitHub session missing. Sign in again to sync real PR data.",
          },
          { status: 401 },
        );
      }

      const latestPr = await buildLatestPrPayload(accessToken);
      finalTitle = latestPr.prTitle;
      finalDescription = latestPr.prDescription;
      finalPrUrl = latestPr.prUrl;
    }

    const task = await createClickUpTask(listId, finalTitle, finalDescription);
    const taskId = task.id;
    const taskUrl = `https://app.clickup.com/t/${taskId}`;
    const listUrl =
      process.env.CLICKUP_LIST_URL?.trim() ||
      `https://app.clickup.com/9015216951/v/l/li/${listId}`;

    if (finalPrUrl) {
      await addClickUpComment(taskId, finalPrUrl);
    }

    return NextResponse.json({ ok: true, taskId, taskUrl, listUrl });
  } catch (e: unknown) {
    return NextResponse.json(
      {
        ok: false,
        error: e instanceof Error ? e.message : "Unknown ClickUp sync error",
      },
      { status: 500 },
    );
  }
}
