"use client";

import { useMemo, useState } from "react";

import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
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
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

const themeLabels = [
  "Testing gaps",
  "Type safety",
  "Performance",
  "Docs",
  "Security",
  "UX",
];

const commentLabels = [
  "Style suggestions",
  "Logic concerns",
  "Nit picks",
  "Approval notes",
  "Question threads",
];

type RangeKey = "7d" | "30d" | "90d";

const rangeLabels: Record<RangeKey, string> = {
  "7d": "Last 7 days",
  "30d": "Last 30 days",
  "90d": "Last 90 days",
};

const analyticsByRange: Record<
  RangeKey,
  {
    themes: number[];
    comments: number[];
    trendLabels: string[];
    prsReviewed: number[];
    commentThreads: number[];
  }
> = {
  "7d": {
    themes: [11, 9, 7, 4, 3, 2],
    comments: [9, 6, 5, 4, 2],
    trendLabels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    prsReviewed: [4, 5, 4, 6, 7, 3, 5],
    commentThreads: [9, 11, 10, 14, 16, 8, 12],
  },
  "30d": {
    themes: [46, 38, 29, 24, 19, 13],
    comments: [34, 26, 15, 18, 7],
    trendLabels: ["W1", "W2", "W3", "W4"],
    prsReviewed: [18, 21, 24, 26],
    commentThreads: [45, 50, 54, 60],
  },
  "90d": {
    themes: [121, 98, 86, 64, 49, 37],
    comments: [89, 71, 43, 52, 24],
    trendLabels: ["M1", "M2", "M3"],
    prsReviewed: [78, 86, 95],
    commentThreads: [194, 221, 247],
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

export function SalesChart() {
  const [range, setRange] = useState<RangeKey>("30d");

  const selected = analyticsByRange[range];

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
          <Badge variant="secondary">Mock Data</Badge>
          <p className="text-sm text-muted-foreground">
            Range-adjusted metrics for recurring PR themes and review comment behavior.
          </p>
        </div>
        <ToggleGroup
          type="single"
          value={range}
          onValueChange={(value) => {
            if (value) {
              setRange(value as RangeKey);
            }
          }}
          variant="outline"
          className="rounded-lg border bg-card p-1"
        >
          <ToggleGroupItem value="7d" className="h-8 px-3 text-xs">
            Last 7
          </ToggleGroupItem>
          <ToggleGroupItem value="30d" className="h-8 px-3 text-xs">
            Last 30
          </ToggleGroupItem>
          <ToggleGroupItem value="90d" className="h-8 px-3 text-xs">
            Last 90
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Theme Frequency</CardTitle>
            <CardDescription>Most repeated PR discussion themes</CardDescription>
          </CardHeader>
          <CardContent className="h-[280px]">
            <Bar data={themeData} options={barOptions(range)} />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Comment Mix</CardTitle>
            <CardDescription>Breakdown by review comment category</CardDescription>
          </CardHeader>
          <CardContent className="h-[280px]">
            <Doughnut data={commentTypeData} options={doughnutOptions} />
          </CardContent>
        </Card>

        <Card className="lg:col-span-5">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Trend</CardTitle>
            <CardDescription>PR reviews and thread volume over time</CardDescription>
          </CardHeader>
          <CardContent className="h-[280px]">
            <Line data={reviewVolumeData} options={lineOptions(range)} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
