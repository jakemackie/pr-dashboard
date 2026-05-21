"use client";

import { useMemo, useState } from "react";

import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  LineElement,
  Legend,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  type ChartOptions,
} from "chart.js";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { GitHubAnalyticsPayload, RangeAnalytics, RangeKey } from "@/lib/github-analytics";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Filler,
  Title,
  Tooltip,
  Legend,
);

const themeLabels = [
  "Bug fix",
  "Feature",
  "Refactor",
  "Testing",
  "Documentation",
  "CI / Chore",
];

const commentLabels = [
  "No discussion",
  "Light discussion",
  "Active discussion",
  "Heavy discussion",
];

const rangeLabels: Record<RangeKey, string> = {
  week: "Last week",
  month: "Last month",
  quarter: "Last 3 months",
  year: "Last year",
  all: "All time",
};

const emptyAnalyticsByRange: Record<RangeKey, RangeAnalytics> = {
  week: {
    themes: [0, 0, 0, 0, 0, 0],
    comments: [0, 0, 0, 0],
    trendLabels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    prsReviewed: [0, 0, 0, 0, 0, 0, 0],
    commentThreads: [0, 0, 0, 0, 0, 0, 0],
    aiTestCases: 0,
  },
  month: {
    themes: [0, 0, 0, 0, 0, 0],
    comments: [0, 0, 0, 0],
    trendLabels: ["W1", "W2", "W3", "W4", "W5"],
    prsReviewed: [0, 0, 0, 0, 0],
    commentThreads: [0, 0, 0, 0, 0],
    aiTestCases: 0,
  },
  quarter: {
    themes: [0, 0, 0, 0, 0, 0],
    comments: [0, 0, 0, 0],
    trendLabels: ["M1", "M2", "M3"],
    prsReviewed: [0, 0, 0],
    commentThreads: [0, 0, 0],
    aiTestCases: 0,
  },
  year: {
    themes: [0, 0, 0, 0, 0, 0],
    comments: [0, 0, 0, 0],
    trendLabels: ["Q1", "Q2", "Q3", "Q4"],
    prsReviewed: [0, 0, 0, 0],
    commentThreads: [0, 0, 0, 0],
    aiTestCases: 0,
  },
  all: {
    themes: [0, 0, 0, 0, 0, 0],
    comments: [0, 0, 0, 0],
    trendLabels: ["Y-4", "Y-3", "Y-2", "Y-1", "Y"],
    prsReviewed: [0, 0, 0, 0, 0],
    commentThreads: [0, 0, 0, 0, 0],
    aiTestCases: 0,
  },
};

const sharedTextColor = "#d4d4d8";
const sharedGridColor = "rgba(63, 63, 70, 0.35)";

const barOptions = (range: RangeKey): ChartOptions<"bar"> => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: true,
      text: `Recurring PR Themes (${rangeLabels[range]})`,
      color: "#fafafa",
      align: "start",
      font: {
        size: 16,
      },
    },
    tooltip: {
      backgroundColor: "rgba(15, 15, 17, 0.95)",
      titleColor: "#fafafa",
      bodyColor: "#e4e4e7",
      borderColor: "rgba(63, 63, 70, 0.9)",
      borderWidth: 1,
    },
  },
  scales: {
    x: {
      ticks: {
        color: sharedTextColor,
      },
      grid: {
        color: sharedGridColor,
      },
    },
    y: {
      beginAtZero: true,
      labels: {
        color: sharedTextColor,
      },
      ticks: {
        color: sharedTextColor,
      },
      grid: {
        color: sharedGridColor,
      },
    },
  },
});

const doughnutOptions: ChartOptions<"doughnut"> = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: "62%",
  plugins: {
    legend: {
      position: "bottom",
      labels: {
        color: sharedTextColor,
        boxWidth: 14,
      },
    },
    title: {
      display: true,
      text: "Common Comment Types",
      color: "#fafafa",
      align: "start",
      font: {
        size: 16,
      },
    },
    tooltip: {
      backgroundColor: "rgba(15, 15, 17, 0.95)",
      titleColor: "#fafafa",
      bodyColor: "#e4e4e7",
      borderColor: "rgba(63, 63, 70, 0.9)",
      borderWidth: 1,
    },
  },
};

const lineOptions = (range: RangeKey): ChartOptions<"line"> => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top",
      align: "end",
      labels: {
        color: sharedTextColor,
      },
    },
    title: {
      display: true,
      text: `Review Activity (${rangeLabels[range]})`,
      color: "#fafafa",
      align: "start",
      font: {
        size: 16,
      },
    },
    tooltip: {
      backgroundColor: "rgba(15, 15, 17, 0.95)",
      titleColor: "#fafafa",
      bodyColor: "#e4e4e7",
      borderColor: "rgba(63, 63, 70, 0.9)",
      borderWidth: 1,
    },
  },
  scales: {
    x: {
      ticks: {
        color: sharedTextColor,
      },
      grid: {
        color: sharedGridColor,
      },
    },
    y: {
      beginAtZero: true,
      ticks: {
        color: sharedTextColor,
      },
      grid: {
        color: sharedGridColor,
      },
    },
  },
});

type SalesChartProps = {
  analytics?: GitHubAnalyticsPayload | null;
  range?: RangeKey;
  onRangeChange?: (range: RangeKey) => void;
};

export function SalesChart({ analytics, range, onRangeChange }: SalesChartProps) {
  const [internalRange, setInternalRange] = useState<RangeKey>("month");
  const selectedRange = range ?? internalRange;
  const setRange = (nextRange: RangeKey) => {
    if (onRangeChange) {
      onRangeChange(nextRange);
      return;
    }

    setInternalRange(nextRange);
  };

  const effectiveAnalytics = analytics?.analyticsByRange ?? emptyAnalyticsByRange;
  const selected = effectiveAnalytics[selectedRange];

  const themeData = useMemo(
    () => ({
      labels: themeLabels,
      datasets: [
        {
          label: "Theme mentions",
          data: selected.themes,
          borderRadius: 8,
          backgroundColor: [
            "rgba(251, 191, 36, 0.9)",
            "rgba(59, 130, 246, 0.85)",
            "rgba(34, 197, 94, 0.85)",
            "rgba(168, 85, 247, 0.85)",
            "rgba(244, 63, 94, 0.85)",
            "rgba(20, 184, 166, 0.85)",
          ],
          maxBarThickness: 42,
        },
      ],
    }),
    [selected.themes],
  );

  const commentTypeData = useMemo(
    () => ({
      labels: commentLabels,
      datasets: [
        {
          data: selected.comments,
          backgroundColor: [
            "rgba(251, 191, 36, 0.9)",
            "rgba(59, 130, 246, 0.85)",
            "rgba(161, 161, 170, 0.85)",
            "rgba(34, 197, 94, 0.85)",
            "rgba(244, 63, 94, 0.85)",
          ],
          borderColor: "rgba(24, 24, 27, 0.9)",
          borderWidth: 2,
        },
      ],
    }),
    [selected.comments],
  );

  const reviewVolumeData = useMemo(
    () => ({
      labels: selected.trendLabels,
      datasets: [
        {
          label: "PRs reviewed",
          data: selected.prsReviewed,
          borderColor: "rgba(251, 191, 36, 0.95)",
          backgroundColor: "rgba(251, 191, 36, 0.18)",
          pointBackgroundColor: "rgba(251, 191, 36, 1)",
          pointBorderWidth: 0,
          pointRadius: 3,
          tension: 0.35,
          fill: true,
        },
        {
          label: "Comment threads",
          data: selected.commentThreads,
          borderColor: "rgba(96, 165, 250, 0.9)",
          backgroundColor: "rgba(96, 165, 250, 0.15)",
          pointBackgroundColor: "rgba(96, 165, 250, 0.95)",
          pointBorderWidth: 0,
          pointRadius: 3,
          tension: 0.35,
          fill: true,
        },
      ],
    }),
    [selected.commentThreads, selected.prsReviewed, selected.trendLabels],
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Badge variant="secondary">
            {analytics ? "GitHub Live Data" : "No Live Data"}
          </Badge>
          <p className="text-sm text-muted-foreground">
            {analytics
              ? `Based on ${analytics.totalOpenPrs} open PRs across ${analytics.activeRepositories} repositories.`
              : "Live GitHub data unavailable. Charts are shown with empty values."}
          </p>
        </div>
        <Select
          value={selectedRange}
          onValueChange={(value) => {
            setRange(value as RangeKey);
          }}
        >
          <SelectTrigger className="w-[170px]">
            <SelectValue placeholder="Select range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">Last week</SelectItem>
            <SelectItem value="month">Last month</SelectItem>
            <SelectItem value="quarter">Last 3 months</SelectItem>
            <SelectItem value="year">Last year</SelectItem>
            <SelectItem value="all">All time</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Recurring PR Themes</CardTitle>
            <CardDescription>
              <span>Frequency of review topics (e.g., bug, feature, refactor) &nbsp;
                <span title="Shows which PR themes are most discussed, helping identify technical debt and focus areas." className="cursor-help text-muted-foreground">[?]</span>
              </span>
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[280px]">
            <Bar data={themeData} options={barOptions(selectedRange)} />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Comment Type Breakdown</CardTitle>
            <CardDescription>
              <span>Distribution of review comment types &nbsp;
                <span title="Breaks down comments by discussion depth, surfacing collaboration and QA focus." className="cursor-help text-muted-foreground">[?]</span>
              </span>
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[280px]">
            <Doughnut data={commentTypeData} options={doughnutOptions} />
          </CardContent>
        </Card>

        <Card className="lg:col-span-5">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Review & Integration Trend</CardTitle>
            <CardDescription>
              <span>PR reviews, comment threads, and integration activity over time &nbsp;
                <span title="Tracks review throughput and integration events (e.g., ClickUp sync, AI test cases) for SDLC health." className="cursor-help text-muted-foreground">[?]</span>
              </span>
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[280px]">
            <Line data={reviewVolumeData} options={lineOptions(selectedRange)} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
