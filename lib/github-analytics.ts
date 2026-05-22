export type RangeKey = "week" | "month" | "quarter" | "year" | "all";

type IssueSearchItem = {
  title: string;
  body: string | null;
  comments: number;
  created_at: string;
  state: "open" | "closed";
  repository_url: string;
  html_url: string;
};

type IssueSearchResponse = {
  items: IssueSearchItem[];
};

type UserResponse = {
  login: string;
};

type OrgResponse = {
  login: string;
};

type CommitSearchItem = {
  commit: {
    committer: {
      date: string;
    };
  };
  repository: {
    owner: {
      login: string;
    };
  };
};

type CommitSearchResponse = {
  items: CommitSearchItem[];
};

export type RangeAnalytics = {
  themes: number[];
  comments: number[];
  trendLabels: string[];
  prsReviewed: number[];
  commentThreads: number[];
  duplicateComments: number;
  aiTestCases: number;
};

type ClickUpTag = {
  name?: string;
};

type ClickUpTask = {
  id: string;
  parent?: string | null;
  date_created?: string;
  tags?: ClickUpTag[];
  name?: string;
};

type ClickUpListTasksResponse = {
  tasks?: ClickUpTask[];
  last_page?: boolean;
};

export type GitHubAnalyticsPayload = {
  source: "github";
  totalOpenPrs: number;
  totalActivePrs90d: number;
  activeRepositories: number;
  syncedClickUpTasks: number;
  clickUpSummary: {
    configured: boolean;
    listId: string | null;
    listUrl: string | null;
    totalTasks: number;
    syncedTasks: number;
    syncedTasksLast30Days: number;
    aiWorkItemsLast30Days: number;
  };
  analyticsByRange: Record<RangeKey, RangeAnalytics>;
  repositories: Array<{
    name: string;
    openPrs: number;
    avgComments: number;
    riskThemeIndex: number;
  }>;
  commentSummary: {
    buckets: number[];
    unresolvedThreads: Array<{
      repo: string;
      title: string;
      url: string;
      ageDays: number;
      comments: number;
    }>;
  };
  activityBreakdown: {
    organization: {
      prs: number;
      commits: number;
    };
    personal: {
      prs: number;
      commits: number;
    };
    byOwner: Array<{
      owner: string;
      isOrganization: boolean;
      prs: number;
      commits: number;
      total: number;
    }>;
  };
  activityByRange: Record<
    RangeKey,
    {
      organization: {
        prs: number;
        commits: number;
      };
      personal: {
        prs: number;
        commits: number;
      };
    }
  >;
};

type GitHubRequestInit = Omit<RequestInit, "headers"> & {
  headers?: Record<string, string>;
};

const THEME_RULES = [
  /fix|bug|regress|hotfix/i,
  /feature|feat|enhance|improve/i,
  /refactor|cleanup|restructure/i,
  /test|coverage|spec|e2e|unit/i,
  /doc|readme|guide|comment/i,
  /ci|build|deps|chore|infra/i,
];

function isoDaysAgo(days: number) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().slice(0, 10);
}

async function githubFetch<T>(
  path: string,
  accessToken: string,
  init?: GitHubRequestInit,
): Promise<T> {
  const response = await fetch(`https://api.github.com${path}`, {
    ...init,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${accessToken}`,
      "X-GitHub-Api-Version": "2022-11-28",
      ...init?.headers,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`GitHub API request failed with status ${response.status} for ${path}`);
  }

  return (await response.json()) as T;
}

function classifyTheme(text: string) {
  const index = THEME_RULES.findIndex((rule) => rule.test(text));
  return index === -1 ? THEME_RULES.length - 1 : index;
}

function commentBucketIndex(commentCount: number) {
  if (commentCount === 0) return 0;
  if (commentCount <= 2) return 1;
  if (commentCount <= 5) return 2;
  return 3;
}

function filterByDays(items: IssueSearchItem[], days: number) {
  const now = Date.now();
  const windowMs = days * 24 * 60 * 60 * 1000;
  return items.filter((item) => now - new Date(item.created_at).getTime() <= windowMs);
}

function getYearLabels(items: IssueSearchItem[]) {
  const currentYear = new Date().getFullYear();
  if (items.length === 0) {
    return Array.from({ length: 5 }, (_, idx) => String(currentYear - 4 + idx));
  }

  const uniqueYears = Array.from(
    new Set(items.map((item) => String(new Date(item.created_at).getFullYear()))),
  ).sort();

  return uniqueYears.slice(-5);
}

function getRangeLabels(range: RangeKey, items: IssueSearchItem[]) {
  switch (range) {
    case "week": {
      const now = new Date();
      return Array.from({ length: 7 }, (_, idx) => {
        const date = new Date(now);
        date.setDate(now.getDate() - (6 - idx));
        return date.toLocaleDateString("en-US", { weekday: "short" });
      });
    }
    case "month":
      return ["W1", "W2", "W3", "W4", "W5"];
    case "quarter":
      return ["M1", "M2", "M3"];
    case "year":
      return ["Q1", "Q2", "Q3", "Q4"];
    case "all":
      return getYearLabels(items);
  }
}

function filterByRange(items: IssueSearchItem[], range: RangeKey) {
  switch (range) {
    case "week":
      return filterByDays(items, 7);
    case "month":
      return filterByDays(items, 30);
    case "quarter":
      return filterByDays(items, 90);
    case "year":
      return filterByDays(items, 365);
    case "all":
      return items;
  }
}

function filterCommitsByRange(items: CommitSearchItem[], range: RangeKey) {
  if (range === "all") {
    return items;
  }

  const days =
    range === "week" ? 7 : range === "month" ? 30 : range === "quarter" ? 90 : 365;

  const now = Date.now();
  const windowMs = days * 24 * 60 * 60 * 1000;
  return items.filter(
    (item) => now - new Date(item.commit.committer.date).getTime() <= windowMs,
  );
}

function getTrendBucketIndex(
  createdAt: string,
  range: RangeKey,
  trendLabels: string[],
  allYearLabelIndex: Map<string, number>,
) {
  const now = Date.now();
  const created = new Date(createdAt);
  const ageDays = Math.floor((now - created.getTime()) / (24 * 60 * 60 * 1000));

  switch (range) {
    case "week":
      return Math.min(6, Math.max(0, 6 - ageDays));
    case "month":
      return Math.min(4, Math.max(0, Math.floor((29 - ageDays) / 6)));
    case "quarter":
      return Math.min(2, Math.max(0, Math.floor((89 - ageDays) / 30)));
    case "year":
      return Math.min(3, Math.max(0, Math.floor((364 - ageDays) / 91)));
    case "all": {
      const year = String(created.getFullYear());
      return allYearLabelIndex.get(year) ?? 0;
    }
  }
}

function buildRangeAnalytics(items: IssueSearchItem[], range: RangeKey): RangeAnalytics {
  const filtered = filterByRange(items, range);
  const trendLabels = getRangeLabels(range, filtered);
  const yearLabelIndex = new Map(trendLabels.map((label, index) => [label, index]));

  const themes = [0, 0, 0, 0, 0, 0];
  const comments = [0, 0, 0, 0];
  const prsReviewed = new Array(trendLabels.length).fill(0);
  const commentThreads = new Array(trendLabels.length).fill(0);

  for (const item of filtered) {
    const text = `${item.title} ${item.body ?? ""}`;
    themes[classifyTheme(text)] += 1;
    comments[commentBucketIndex(item.comments)] += 1;

    const bucket = getTrendBucketIndex(item.created_at, range, trendLabels, yearLabelIndex);
    prsReviewed[bucket] += 1;
    commentThreads[bucket] += item.comments;
  }

  return {
    themes,
    comments,
    trendLabels,
    prsReviewed,
    commentThreads,
    duplicateComments: filtered.length,
    aiTestCases: 0,
  };
}

function hasClickUpTag(task: ClickUpTask, tagName: string) {
  return (task.tags ?? []).some((tag) => tag.name?.toLowerCase() === tagName.toLowerCase());
}

function createdWithinDays(task: ClickUpTask, days: number) {
  const createdMs = Number(task.date_created ?? 0);
  if (!createdMs) {
    return false;
  }

  const windowMs = days * 24 * 60 * 60 * 1000;
  return Date.now() - createdMs <= windowMs;
}

async function getClickUpTasks(): Promise<{ listId: string | null; tasks: ClickUpTask[] }> {
  const token = process.env.CLICKUP_API_TOKEN?.trim();
  const listId = process.env.CLICKUP_LIST_ID?.trim() || "901522558612";

  if (!token) {
    return { listId: null, tasks: [] };
  }

  const tasks: ClickUpTask[] = [];
  let page = 0;

  while (page < 10) {
    const response = await fetch(
      `https://api.clickup.com/api/v2/list/${listId}/task?subtasks=true&include_closed=true&page=${page}`,
      {
        headers: {
          Authorization: token,
          Accept: "application/json",
        },
        cache: "no-store",
      },
    );

    if (!response.ok) {
      break;
    }

    const payload = (await response.json()) as ClickUpListTasksResponse;
    const batch = payload.tasks ?? [];
    tasks.push(...batch);

    if (payload.last_page || batch.length === 0) {
      break;
    }

    page += 1;
  }

  return { listId, tasks };
}

export async function getGitHubAnalytics(accessToken: string): Promise<GitHubAnalyticsPayload> {
  const [user, orgs, openPrsResult, historyPrsResult, clickUpResult] = await Promise.all([
    githubFetch<UserResponse>("/user", accessToken),
    githubFetch<OrgResponse[]>("/user/orgs", accessToken),
    githubFetch<IssueSearchResponse>(
      "/search/issues?q=is:pr+is:open+author:@me&per_page=100",
      accessToken,
    ),
    githubFetch<IssueSearchResponse>(
      "/search/issues?q=is:pr+author:@me&per_page=100&sort=updated&order=desc",
      accessToken,
    ),
    getClickUpTasks(),
  ]);

  let commitItems: CommitSearchItem[] = [];
  try {
    const commitSearch = await githubFetch<CommitSearchResponse>(
      `/search/commits?q=author:${user.login}+committer-date:>=${isoDaysAgo(90)}&per_page=100&sort=committer-date&order=desc`,
      accessToken,
      {
        headers: {
          Accept: "application/vnd.github.cloak-preview+json",
        },
      },
    );
    commitItems = commitSearch.items;
  } catch {
    commitItems = [];
  }

  const orgLogins = new Set(orgs.map((org) => org.login.toLowerCase()));
  const userLogin = user.login.toLowerCase();

  const openItems = openPrsResult.items;
  const historyItems = historyPrsResult.items;
  const items90d = filterByDays(historyItems, 90);

  const repoMap = new Map<
    string,
    { openPrs: number; totalComments: number; themeCounts: number[] }
  >();

  const ownerActivityMap = new Map<
    string,
    { isOrganization: boolean; prs: number; commits: number }
  >();

  const buckets = [0, 0, 0, 0];

  const unresolvedThreads = openItems
    .filter((item) => item.comments > 0)
    .map((item) => {
      const repoName = item.repository_url.split("/").slice(-2).join("/");
      return {
        repo: repoName,
        title: item.title,
        url: item.html_url,
        ageDays: Math.max(
          0,
          Math.floor((Date.now() - new Date(item.created_at).getTime()) / (24 * 60 * 60 * 1000)),
        ),
        comments: item.comments,
      };
    })
    .sort((a, b) => b.comments - a.comments || b.ageDays - a.ageDays)
    .slice(0, 6);

  for (const item of openItems) {
    const [owner, repo] = item.repository_url.split("/").slice(-2);
    const repoName = `${owner}/${repo}`;
    const text = `${item.title} ${item.body ?? ""}`;
    const themeIndex = classifyTheme(text);

    buckets[commentBucketIndex(item.comments)] += 1;

    const existing = repoMap.get(repoName) ?? {
      openPrs: 0,
      totalComments: 0,
      themeCounts: [0, 0, 0, 0, 0, 0],
    };

    existing.openPrs += 1;
    existing.totalComments += item.comments;
    existing.themeCounts[themeIndex] += 1;
    repoMap.set(repoName, existing);
  }

  for (const item of items90d) {
    const owner = item.repository_url.split("/").slice(-2)[0];
    const ownerKey = owner.toLowerCase();
    const isOrganization = ownerKey !== userLogin && orgLogins.has(ownerKey);

    const existing = ownerActivityMap.get(owner) ?? {
      isOrganization,
      prs: 0,
      commits: 0,
    };

    existing.prs += 1;
    ownerActivityMap.set(owner, existing);
  }

  for (const item of commitItems) {
    const owner = item.repository.owner.login;
    const ownerKey = owner.toLowerCase();
    const isOrganization = ownerKey !== userLogin && orgLogins.has(ownerKey);

    const existing = ownerActivityMap.get(owner) ?? {
      isOrganization,
      prs: 0,
      commits: 0,
    };

    existing.commits += 1;
    ownerActivityMap.set(owner, existing);
  }

  const repositories = Array.from(repoMap.entries())
    .map(([name, value]) => {
      const maxTheme = Math.max(...value.themeCounts);
      const riskThemeIndex = maxTheme > 0 ? value.themeCounts.indexOf(maxTheme) : 0;

      return {
        name,
        openPrs: value.openPrs,
        avgComments: value.openPrs > 0 ? value.totalComments / value.openPrs : 0,
        riskThemeIndex,
      };
    })
    .sort((a, b) => b.openPrs - a.openPrs)
    .slice(0, 8);

  const byOwner = Array.from(ownerActivityMap.entries())
    .map(([owner, value]) => ({
      owner,
      isOrganization: value.isOrganization,
      prs: value.prs,
      commits: value.commits,
      total: value.prs + value.commits,
    }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 10);

  const organization = byOwner
    .filter((item) => item.isOrganization)
    .reduce(
      (acc, item) => {
        acc.prs += item.prs;
        acc.commits += item.commits;
        return acc;
      },
      { prs: 0, commits: 0 },
    );

  const ranges: RangeKey[] = ["week", "month", "quarter", "year", "all"];
  const activityByRange = ranges.reduce(
    (acc, range) => {
      const rangePrs = filterByRange(historyItems, range);
      const rangeCommits = filterCommitsByRange(commitItems, range);

      const organization = { prs: 0, commits: 0 };
      const personal = { prs: 0, commits: 0 };

      for (const item of rangePrs) {
        const owner = item.repository_url.split("/").slice(-2)[0].toLowerCase();
        const isOrganization = owner !== userLogin && orgLogins.has(owner);

        if (isOrganization) {
          organization.prs += 1;
        } else {
          personal.prs += 1;
        }
      }

      for (const item of rangeCommits) {
        const owner = item.repository.owner.login.toLowerCase();
        const isOrganization = owner !== userLogin && orgLogins.has(owner);

        if (isOrganization) {
          organization.commits += 1;
        } else {
          personal.commits += 1;
        }
      }

      acc[range] = {
        organization,
        personal,
      };

      return acc;
    },
    {} as GitHubAnalyticsPayload["activityByRange"],
  );

  const personal = byOwner
    .filter((item) => !item.isOrganization)
    .reduce(
      (acc, item) => {
        acc.prs += item.prs;
        acc.commits += item.commits;
        return acc;
      },
      { prs: 0, commits: 0 },
    );

  const clickUpTasks = clickUpResult.tasks;
  const syncedPrTasks = clickUpTasks.filter(
    (task) => !task.parent && hasClickUpTag(task, "github-pr"),
  );
  const aiGroupedSubtasks = clickUpTasks.filter(
    (task) => Boolean(task.parent) && hasClickUpTag(task, "ai-grouped-subtask"),
  );

  const aiCountsByRange: Record<RangeKey, number> = {
    week: aiGroupedSubtasks.filter((task) => createdWithinDays(task, 7)).length,
    month: aiGroupedSubtasks.filter((task) => createdWithinDays(task, 30)).length,
    quarter: aiGroupedSubtasks.filter((task) => createdWithinDays(task, 90)).length,
    year: aiGroupedSubtasks.filter((task) => createdWithinDays(task, 365)).length,
    all: aiGroupedSubtasks.length,
  };

  const listUrl = clickUpResult.listId
    ? process.env.CLICKUP_LIST_URL?.trim() ||
      `https://app.clickup.com/9015216951/v/l/li/${clickUpResult.listId}`
    : null;

  return {
    source: "github",
    totalOpenPrs: openItems.length,
    totalActivePrs90d: items90d.length,
    activeRepositories: repoMap.size,
    syncedClickUpTasks: syncedPrTasks.length,
    clickUpSummary: {
      configured: Boolean(clickUpResult.listId),
      listId: clickUpResult.listId,
      listUrl,
      totalTasks: clickUpTasks.length,
      syncedTasks: syncedPrTasks.length,
      syncedTasksLast30Days: syncedPrTasks.filter((task) => createdWithinDays(task, 30)).length,
      aiWorkItemsLast30Days: aiCountsByRange.month,
    },
    analyticsByRange: {
      week: {
        ...buildRangeAnalytics(historyItems, "week"),
        aiTestCases: aiCountsByRange.week,
      },
      month: {
        ...buildRangeAnalytics(historyItems, "month"),
        aiTestCases: aiCountsByRange.month,
      },
      quarter: {
        ...buildRangeAnalytics(historyItems, "quarter"),
        aiTestCases: aiCountsByRange.quarter,
      },
      year: {
        ...buildRangeAnalytics(historyItems, "year"),
        aiTestCases: aiCountsByRange.year,
      },
      all: {
        ...buildRangeAnalytics(historyItems, "all"),
        aiTestCases: aiCountsByRange.all,
      },
    },
    repositories,
    commentSummary: {
      buckets,
      unresolvedThreads,
    },
    activityBreakdown: {
      organization,
      personal,
      byOwner,
    },
    activityByRange,
  };
}
